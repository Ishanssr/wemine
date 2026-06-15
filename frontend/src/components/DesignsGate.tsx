'use client';

import { useState, useEffect, type ReactNode } from 'react';
import { motion } from 'framer-motion';

const DESIGNS_PW_KEY = 'designs_access';
const PASSWORD = 'ssr@0210';

export default function DesignsGate({ children }: { children: ReactNode }) {
  const [authed, setAuthed] = useState(false);
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (localStorage.getItem(DESIGNS_PW_KEY) === '1') setAuthed(true);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value === PASSWORD) {
      localStorage.setItem(DESIGNS_PW_KEY, '1');
      setAuthed(true);
    } else {
      setError('Wrong password');
    }
  };

  if (authed) return <>{children}</>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream-50 px-6">
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="w-full max-w-sm"
      >
        <p className="font-heading text-xs font-medium text-gray-400 tracking-[0.2em] uppercase mb-2">
          Restricted
        </p>
        <h1 className="font-heading text-3xl font-medium text-gray-900 tracking-tight mb-2">
          Designs
        </h1>
        <p className="font-body text-sm text-gray-400 mb-8">
          Enter the password to access the designs section.
        </p>
        <input
          type="password"
          value={value}
          onChange={(e) => { setValue(e.target.value); setError(''); }}
          placeholder="Password"
          className="w-full border border-gray-300 px-4 py-3 font-body text-sm bg-transparent outline-none focus:border-gray-900 transition-colors mb-3"
          autoFocus
        />
        {error && (
          <p className="font-body text-xs text-red-500 mb-3">{error}</p>
        )}
        <button
          type="submit"
          className="w-full bg-gray-900 text-cream-50 font-heading text-xs font-medium tracking-[0.15em] uppercase py-3 hover:bg-gray-800 transition-colors"
        >
          Enter
        </button>
      </motion.form>
    </div>
  );
}
