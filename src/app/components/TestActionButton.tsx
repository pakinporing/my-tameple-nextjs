'use client';

import { useState } from 'react';
import { getMeAction } from '@/libs/api/actions/testAction';

type ActionResult = Awaited<ReturnType<typeof getMeAction>> | null;

export default function TestActionButton() {
  const [loading, setLoading] = useState(false);
  const [, setResult] = useState<ActionResult>(null);

  const handleClick = async () => {
    setLoading(true);
    try {
      const res = await getMeAction();
      setResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={loading}
        className="
    px-6 py-3 rounded-xl 
    font-semibold text-white
    bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
    shadow-lg
    hover:shadow-xl hover:-translate-y-1
    active:scale-95
    transition-all duration-200
    disabled:opacity-50 disabled:cursor-not-allowed
  "
      >
        {loading ? '⏳ Loading...' : '🚀 ยิงผ่าน Action'}
      </button>
    </div>
  );
}
