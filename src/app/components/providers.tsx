'use client';

import type { Session } from 'next-auth';
import { SessionProvider, signOut, useSession } from 'next-auth/react';
import { useEffect } from 'react';

function SessionGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status !== 'authenticated') return;
    if (!session?.refreshError) return;

    void signOut({ callbackUrl: '/login' });
  }, [session?.refreshError, status]);

  return <>{children}</>;
}

export default function Providers({
  children,
  session
}: {
  children: React.ReactNode;
  session: Session | null;
}) {
  return (
    <SessionProvider
      session={session}
      refetchInterval={0}
      refetchOnWindowFocus={false}
    >
      <SessionGuard>{children}</SessionGuard>
    </SessionProvider>
  );
}
