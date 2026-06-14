'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth-store';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DesignDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useAuthStore();
  const [score, setScore] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState('');
  const [viewIdx, setViewIdx] = useState(0);

  const { data: design, isLoading } = useQuery({
    queryKey: ['design', id],
    queryFn: async () => {
      const res = await api.get(`/designs/${id}`);
      return res.data;
    },
  });

  const rateMutation = useMutation({
    mutationFn: async () => {
      await api.post(`/designs/${id}/rate`, { score, comment });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['design', id] });
      toast.success('Rating submitted!');
      setScore(0);
      setComment('');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to submit rating');
    },
  });

  if (isLoading) {
    return (
      <div className="pt-28 pb-24 max-w-4xl mx-auto px-6 md:px-12">
        <div className="aspect-[4/3] bg-black/5 animate-pulse mb-8" />
        <div className="h-6 w-48 bg-black/5 animate-pulse mb-4" />
        <div className="h-4 w-96 bg-black/5 animate-pulse" />
      </div>
    );
  }

  if (!design) {
    return (
      <div className="pt-28 pb-24 text-center">
        <p className="font-body text-gray-400">Design not found</p>
      </div>
    );
  }

  const views = [
    { url: design.imageUrl, label: 'Male Front' },
    { url: design.imageBack, label: 'Male Back' },
    { url: design.imageFemaleFront, label: 'Female Front' },
    { url: design.imageFemaleBack, label: 'Female Back' },
  ].filter((v) => v.url);

  const avg =
    design.ratings?.length
      ? (design.ratings.reduce((s: number, r: any) => s + r.score, 0) / design.ratings.length).toFixed(1)
      : null;

  return (
    <div className="pt-28 pb-24">
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        <button onClick={() => router.push('/designs')} className="flex items-center gap-1.5 font-body text-xs text-gray-400 hover:text-gray-900 transition-colors mb-8">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Designs
        </button>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div className="grid md:grid-cols-5 gap-10">
            <div className="md:col-span-3">
              {/* Image viewer with navigation */}
              <div className="aspect-[4/5] overflow-hidden bg-black/5 relative group">
                <img
                  src={views[viewIdx]?.url}
                  alt={`${design.title} - ${views[viewIdx]?.label}`}
                  className="w-full h-full object-cover"
                />
                {views.length > 1 && (
                  <>
                    <button
                      onClick={() => setViewIdx((viewIdx - 1 + views.length) % views.length)}
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewIdx((viewIdx + 1) % views.length)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnail selector */}
              {views.length > 1 && (
                <div className="flex gap-2 mt-3">
                  {views.map((v, i) => (
                    <button
                      key={i}
                      onClick={() => setViewIdx(i)}
                      className={`w-16 h-20 overflow-hidden border-2 transition-all ${
                        i === viewIdx ? 'border-black' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={v.url} alt={v.label} loading="lazy" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="md:col-span-2">
              <p className="font-heading text-[10px] font-medium text-gray-400 tracking-[0.15em] uppercase mb-2">
                {design.category || 'Design'}
              </p>
              <h1 className="font-heading text-2xl font-medium text-gray-900 mb-3">{design.title}</h1>
              {design.description && (
                <p className="font-body text-sm text-gray-500 mb-6">{design.description}</p>
              )}

              {/* Average Rating */}
              <div className="border border-black/10 p-4 mb-6">
                <p className="font-heading text-xs tracking-[0.05em] uppercase text-gray-400 mb-1">Community Rating</p>
                <div className="flex items-baseline gap-2">
                  <span className="font-heading text-3xl font-medium text-gray-900">{avg || '—'}</span>
                  <span className="font-body text-xs text-gray-400">/ 10</span>
                </div>
                <p className="font-body text-xs text-gray-400 mt-1">
                  {design.ratings?.length || 0} rating{design.ratings?.length !== 1 ? 's' : ''}
                </p>
              </div>

              {/* Rate this design */}
              {isAuthenticated && (
                <div className="border border-black/10 p-4 mb-6">
                  <p className="font-heading text-xs tracking-[0.05em] uppercase text-gray-400 mb-3">Rate this design</p>
                  <div className="flex items-center gap-1 mb-3">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                      <button
                        key={n}
                        onClick={() => setScore(n)}
                        onMouseEnter={() => setHovered(n)}
                        onMouseLeave={() => setHovered(0)}
                        className={`w-8 h-8 flex items-center justify-center text-xs font-heading font-medium transition-all border ${
                          (hovered || score) >= n
                            ? 'bg-black text-white border-black'
                            : 'border-black/10 text-gray-400 hover:border-black/30'
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                  {score > 0 && (
                    <>
                      <input
                        placeholder="Add a comment (optional)"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="input-field text-sm mb-2"
                      />
                      <button
                        onClick={() => rateMutation.mutate()}
                        disabled={rateMutation.isPending}
                        className="btn-primary w-full text-sm"
                      >
                        {rateMutation.isPending ? 'Submitting...' : `Submit ${score}/10`}
                      </button>
                    </>
                  )}
                </div>
              )}

              {!isAuthenticated && (
                <p className="font-body text-xs text-gray-400 mb-6">
                  <a href="/auth/login" className="underline">Sign in</a> to rate this design
                </p>
              )}

              {/* Detailed ratings */}
              {design.ratings?.length > 0 && (
                <div>
                  <p className="font-heading text-xs tracking-[0.05em] uppercase text-gray-400 mb-3">All Ratings</p>
                  <div className="space-y-2">
                    {design.ratings.map((r: any) => (
                      <div key={r.id} className="border border-black/5 p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-heading text-xs font-medium text-gray-900">
                            {r.user.firstName} {r.user.lastName}
                          </span>
                          <span className="font-heading text-xs font-medium">{r.score}/10</span>
                        </div>
                        {r.comment && (
                          <p className="font-body text-xs text-gray-500">{r.comment}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
