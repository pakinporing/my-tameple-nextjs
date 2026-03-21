// components/Header.tsx
'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useTransition } from 'react';

export default function Header() {
  const { data: session } = useSession();
  const [isPending, startTransition] = useTransition();

  return (
    <header className="w-full bg-gray-900 text-white shadow">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="font-bold text-lg">
          pakinporing
        </Link>

        {/* Nav */}
        <nav className="flex gap-6">
          <div>
            {session ? (
              <button
                className="bg-red-600 text-white px-3 py-1 rounded"
                onClick={() => {
                  startTransition(async () => {
                    await signOut({ callbackUrl: '/' });
                  });
                }}
                disabled={isPending}
              >
                {isPending ? 'Logging out...' : 'Logout'}
              </button>
            ) : null}
          </div>
        </nav>
      </div>
    </header>
  );
}
