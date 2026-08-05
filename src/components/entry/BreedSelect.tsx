import { useState } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { DOG_BREEDS } from '@/data/breeds';
import { cn } from '@/lib/utils';

/**
 * 246 breeds cannot go in a plain dropdown, least of all on a phone, and least
 * of all as one of the first things an exhibitor has to do. Searchable, so
 * typing "wheaten" finds Soft Coated Wheaten Terrier without scrolling to S.
 */
export function BreedSelect({
  value,
  onChange,
  id,
}: {
  value: string;
  onChange: (breed: string) => void;
  id?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          id={id}
          type="button"
          role="combobox"
          aria-expanded={open}
          className={cn(
            'flex h-11 w-full items-center justify-between border border-show-rule bg-white px-3 text-left text-sm',
            !value && 'text-show-charcoal',
          )}
        >
          {value || 'Search breeds'}
          <ChevronsUpDown className="h-4 w-4 shrink-0 text-show-charcoal" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <Command>
          <CommandInput placeholder="Type a breed" />
          <CommandList className="max-h-64">
            <CommandEmpty className="py-6 text-center text-sm text-show-charcoal">
              No breed matches that.
            </CommandEmpty>
            {DOG_BREEDS.map((breed) => (
              <CommandItem
                key={breed}
                value={breed}
                onSelect={() => {
                  onChange(breed);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    'mr-2 h-4 w-4',
                    value === breed ? 'opacity-100' : 'opacity-0',
                  )}
                />
                {breed}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
