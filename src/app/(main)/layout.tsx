import { auth } from '@/libs/auth/auth';
import Providers from '../components/providers';
import Headers from '../components/layout/header';

export default async function MainLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <div className="min-h-screen">
      <Providers session={session}>
        <Headers />
        <div className="pt-14">{children}</div>
      </Providers>
    </div>
  );
}
