import Link from 'next/link';
import TestButton from '../components/TestActionButton';
import TestStripeButton from '../components/TestStripeButton';

export default function Home() {
  return (
    <div style={{ padding: 20 }}>
      <h1>Home Page</h1>

      <TestButton />
      <TestStripeButton />
    </div>
  );
}
