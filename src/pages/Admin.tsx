import { useAdminSession } from '@/hooks/useAdminSession';
import { AdminLogin } from '@/components/admin/AdminLogin';
import { AdminDashboard } from '@/components/admin/AdminDashboard';

export default function Admin() {
  const { session, isAdmin, loading, signOut } = useAdminSession();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-wash text-sm text-show-charcoal">
        Checking your access…
      </div>
    );
  }

  if (!session) return <AdminLogin />;

  // Signed in, but not an organiser. This state exists because being
  // authenticated is not the same as being allowed: the database gates on
  // membership of public.admins, and this screen just says so out loud rather
  // than showing an empty dashboard that looks broken.
  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-wash px-5">
        <div className="max-w-sm border border-show-rule bg-white p-8 text-center">
          <h1 className="display text-xl text-show-ink">Not an organiser account</h1>
          <p className="mt-3 text-sm text-show-charcoal">
            You are signed in, but this account has not been given access to
            entries.
          </p>
          <button
            type="button"
            onClick={signOut}
            className="mt-6 border border-show-ink px-5 py-2.5 text-sm font-medium text-show-ink transition-colors hover:bg-show-ink hover:text-white"
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  return <AdminDashboard onSignOut={signOut} />;
}
