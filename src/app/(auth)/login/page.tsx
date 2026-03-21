'use client';

// import { login } from '@/libs/action';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';

import { useForm } from 'react-hook-form';
import z from 'zod';
import { signIn } from 'next-auth/react';
import { redirect } from 'next/navigation';

export const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required')
});

export type LoginInput = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting }
  } = useForm<LoginInput>({
    defaultValues: { email: '', password: '' },
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: LoginInput) => {
    const res = await signIn('credentials', { ...data, redirect: false });

    if (res?.error) {
      setError('password', { message: 'Invalid credentials (from setError)' });
      return;
    }
    console.log('onSubmit');
    redirect('/');
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#dcfce7_0%,_#dbeafe_40%,_#fee2e2_100%)] px-4 py-10">
      <div className="mx-auto max-w-md rounded-3xl border border-white/70 bg-white/85 p-8 shadow-[0_20px_80px_rgba(15,23,42,0.18)] backdrop-blur">
        <p className="mb-2 inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-800">
          Welcome Back
        </p>
        <h1 className="text-3xl font-black tracking-tight text-slate-900">
          Sign in to your account
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Continue to your dashboard and secure features.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-7 space-y-5">
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              {...register('email')}
              className={`w-full rounded-xl border bg-white px-4 py-3 text-slate-900 outline-none transition ${
                errors.email
                  ? 'border-rose-400 focus:ring-2 focus:ring-rose-300'
                  : 'border-slate-200 focus:ring-2 focus:ring-indigo-300'
              }`}
            />
            {errors.email ? (
              <p className="mt-1 text-sm text-rose-600">
                {errors.email.message}
              </p>
            ) : null}
          </div>

          <div>
            <div className="mb-1 flex items-center justify-between">
              <label className="block text-sm font-semibold text-slate-700">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-xs font-semibold text-indigo-700 hover:text-indigo-500"
              >
                Forgot password?
              </Link>
            </div>
            <input
              type="password"
              placeholder="••••••••"
              {...register('password')}
              className={`w-full rounded-xl border bg-white px-4 py-3 text-slate-900 outline-none transition ${
                errors.password
                  ? 'border-rose-400 focus:ring-2 focus:ring-rose-300'
                  : 'border-slate-200 focus:ring-2 focus:ring-indigo-300'
              }`}
            />
            {errors.password ? (
              <p className="mt-1 text-sm text-rose-600">
                {errors.password.message}
              </p>
            ) : null}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-700 disabled:opacity-60"
          >
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-600">
          <Link href="/register" className="font-semibold text-indigo-700">
            Create a new account
          </Link>
        </div>
      </div>
    </main>
  );
}
