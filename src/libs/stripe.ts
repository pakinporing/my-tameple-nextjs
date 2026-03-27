import { loadStripe } from '@stripe/stripe-js';

export const stripePromise = loadStripe(
  //   process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
  'pk_test_51RsEudF0jN7bj9Y6Z3r8TkrXxO7B7zkdjAo9EEm38UrOYCtR0nyvTlK3BolI0oAGmny3v46I2zKfU8kyJYUTDqPp00EiFttpFh'
);
