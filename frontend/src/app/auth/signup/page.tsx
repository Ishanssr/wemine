'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Logo } from '@/components/ui/Logo';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/auth-store';

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuthStore();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', password: '', phone: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signup(form);
      setEmail(form.email);
      setStep(2);
      toast.success('Check your email for the verification code');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center hero-gradient py-28">
      <div className="absolute inset-0 bg-grid opacity-30" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md mx-auto px-6"
      >
        <div className="glass-darker rounded-3xl p-8 md:p-10">
          <Link href="/" className="flex items-center justify-center gap-1.5 mb-8">
            <Logo className="w-6 h-6" />
            <span className="font-heading font-semibold text-xl">WEMINE</span>
          </Link>

          {step === 1 ? (
            <>
              <h1 className="font-heading text-2xl font-semibold text-gray-900 text-center mb-2">
                Create your account
              </h1>
              <p className="font-body text-sm text-gray-500 text-center mb-8">
                Join the WEMINE community
              </p>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/40" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white/60 px-3 font-body text-xs text-gray-400">or sign up with</span>
                </div>
              </div>

              <a
                href={`${API_URL}/auth/google`}
                className="btn-secondary justify-center py-3 w-full"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                Google
              </a>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/40" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white/60 px-3 font-body text-xs text-gray-400">or continue with email</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-body text-xs font-medium text-gray-600 mb-1.5 block">First Name</label>
                    <input type="text" required value={form.firstName}
                      onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                      className="input-field" placeholder="John" />
                  </div>
                  <div>
                    <label className="font-body text-xs font-medium text-gray-600 mb-1.5 block">Last Name</label>
                    <input type="text" required value={form.lastName}
                      onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                      className="input-field" placeholder="Doe" />
                  </div>
                </div>
                <div>
                  <label className="font-body text-xs font-medium text-gray-600 mb-1.5 block">Email</label>
                  <input type="email" required value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="input-field" placeholder="you@example.com" />
                </div>
                <div>
                  <label className="font-body text-xs font-medium text-gray-600 mb-1.5 block">Phone (optional)</label>
                  <input type="tel" value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="input-field" placeholder="+91 98765 43210" />
                </div>
                <div>
                  <label className="font-body text-xs font-medium text-gray-600 mb-1.5 block">Password</label>
                  <input type="password" required minLength={8} value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="input-field" placeholder="Min. 8 characters" />
                </div>
                <button type="submit" disabled={isLoading} className="btn-primary w-full text-base py-4">
                  {isLoading ? 'Creating account...' : 'Create Account'}
                </button>
              </form>

              <p className="font-body text-xs text-gray-400 text-center mt-6">
                Already have an account?{' '}
                <Link href="/auth/login" className="text-gray-900 font-semibold hover:underline">
                  Sign in
                </Link>
              </p>
            </>
          ) : (
            <VerifyOTP email={email} onVerified={() => router.push('/')} />
          )}
        </div>
      </motion.div>
    </div>
  );
}

function VerifyOTP({ email, onVerified }: { email: string; onVerified: () => void }) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (i: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    if (val && i < 5) inputs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) {
      inputs.current[i - 1]?.focus();
    }
  };

  const handleSubmit = async () => {
    const code = otp.join('');
    if (code.length !== 6) return;
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/verify-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: code }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Invalid code');
      }
      toast.success('Email verified!');
      onVerified();
    } catch (err: any) {
      toast.error(err.message || 'Invalid verification code');
    } finally {
      setIsLoading(false);
    }
  };

  const resend = async () => {
    try {
      await fetch(`${API_URL}/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      toast.success('Code resent!');
    } catch {
      toast.error('Failed to resend code');
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 className="font-heading text-2xl font-semibold text-gray-900 text-center mb-2">
        Verify your email
      </h1>
      <p className="font-body text-sm text-gray-500 text-center mb-8">
        We sent a code to <span className="text-gray-900 font-medium">{email}</span>
      </p>

      <div className="flex justify-center gap-2 mb-8">
        {otp.map((d, i) => (
          <input
            key={i}
            ref={(el) => { inputs.current[i] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={d}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            className="w-11 h-12 text-center font-heading text-lg border border-gray-200 rounded-xl focus:border-gray-900 focus:outline-none transition-colors"
          />
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={isLoading || otp.join('').length !== 6}
        className="btn-primary w-full text-base py-4"
      >
        {isLoading ? 'Verifying...' : 'Verify Email'}
      </button>

      <p className="font-body text-xs text-gray-400 text-center mt-6">
        Didn&apos;t receive the code?{' '}
        <button onClick={resend} className="text-gray-900 font-semibold hover:underline">
          Resend
        </button>
      </p>
    </motion.div>
  );
}
