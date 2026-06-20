'use client';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="text-center py-10">
      <p className="font-body text-gray-400 mb-4">Something went wrong loading this page.</p>
      <button onClick={reset} className="btn-primary text-sm">Try Again</button>
    </div>
  );
}
