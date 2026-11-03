-- ============================================================================
-- Dinner-only bookings
--
-- Once dog entries close the catalogue is fixed, but people still want seats
-- at the presentation dinner. create_entry() refuses everything after
-- entries_close_at, catering-only entries included, so bookings get their own
-- door: book_dinner(), gated by a switch the organisers flip (no close date
-- has been set, same as the nominations).
--
-- A booking is an ordinary submission with no dogs and no catalogues, so it
-- takes the next DOTY26-NNNN reference, appears in the admin list, and is
-- reconciled the same way as every other bank transfer.
-- ============================================================================

alter table public.shows
  add column dinner_bookings_open boolean not null default false;

create or replace function public.book_dinner(
  p_booker   jsonb,
  p_tickets  integer,
  p_dietary  text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_show         public.shows%rowtype;
  v_entry_number integer;
  v_reference    text;
  v_total        numeric(10,2);
begin
  select * into v_show from public.shows where is_active for update;

  if not found then
    raise exception 'No show is currently running' using errcode = 'P0002';
  end if;

  if not v_show.dinner_bookings_open then
    raise exception 'Dinner bookings are not open at the moment.' using errcode = 'P0001';
  end if;

  if coalesce(trim(p_booker->>'first_name'), '') = ''
     or coalesce(trim(p_booker->>'surname'), '') = ''
     or coalesce(trim(p_booker->>'email'), '') = ''
     or coalesce(trim(p_booker->>'phone'), '') = '' then
    raise exception 'Name, email and phone are all required.' using errcode = 'P0001';
  end if;

  if p_tickets is null or p_tickets < 1 then
    raise exception 'Book at least one seat.' using errcode = 'P0001';
  end if;

  if p_tickets > 20 then
    raise exception 'For more than 20 seats, contact the organisers.' using errcode = 'P0001';
  end if;

  v_entry_number := v_show.next_entry_number;
  update public.shows
     set next_entry_number = next_entry_number + 1
   where id = v_show.id;

  v_reference := 'DOTY' || right(v_show.year::text, 2)
                 || '-' || lpad(v_entry_number::text, 4, '0');
  v_total := p_tickets * v_show.dinner_ticket_fee;

  insert into public.submissions (
    show_id, entry_number, reference,
    exhibitor_first_name, exhibitor_surname, exhibitor_email, exhibitor_phone,
    dinner_tickets, extra_catalogues, dietary_requirements,
    total_amount
  ) values (
    v_show.id, v_entry_number, v_reference,
    trim(p_booker->>'first_name'), trim(p_booker->>'surname'),
    lower(trim(p_booker->>'email')), trim(p_booker->>'phone'),
    p_tickets, 0, nullif(trim(coalesce(p_dietary, '')), ''),
    v_total
  );

  return jsonb_build_object('reference', v_reference, 'total_amount', v_total);
end;
$$;

revoke all on function public.book_dinner(jsonb, integer, text) from public;
grant execute on function public.book_dinner(jsonb, integer, text) to anon, authenticated;
