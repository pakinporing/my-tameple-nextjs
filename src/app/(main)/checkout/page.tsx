'use client';

import { useEffect, useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { stripePromise } from '../../../libs/stripe';
import CheckoutForm from './CheckoutForm';

export default function CheckoutPage() {
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    fetch(`${process.env.BACKEND_URL}/checkout`, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer YOUR_TOKEN' // 🔥 ใส่จริง
      }
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, []);

  if (!clientSecret) return <p>Loading...</p>;

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm />
    </Elements>
  );
}
