'use client';

export default function AuthError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center hero-gradient">
      <div className="text-center max-w-md mx-auto px-6">
        <p className="font-body text-gray-400 mb-4">Something went wrong. Please try again.</p>
        <button onClick={reset} className="btn-primary">Try Again</button>
      </div>
    </div>
  );
}
