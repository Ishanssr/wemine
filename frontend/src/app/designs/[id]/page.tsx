'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth-store';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import DesignsGate from '@/components/DesignsGate';
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
    <DesignsGate>
    <div className="pt-28 pb-24">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 font-body text-xs text-gray-400 hover:text-gray-900 transition-colors mb-6"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back
          </button>

          {isLoading ? (
            <div className="flex gap-8">
              <div className="w-1/2 aspect-[3/4] bg-black/5 animate-pulse" />
              <div className="w-1/2 space-y-4">
                <div className="h-8 bg-black/5 animate-pulse w-3/4" />
                <div className="h-4 bg-black/5 animate-pulse w-full" />
                <div className="h-4 bg-black/5 animate-pulse w-2/3" />
              </div>
            </div>
          ) : design ? (
            <div className="flex flex-col md:flex-row gap-8 md:gap-12">
              {/* Image Gallery */}
              <div className="w-full md:w-1/2">
                <div className="aspect-[3/4] bg-black/5 relative overflow-hidden">
                  <img
                    src={views[viewIdx]}
                    alt={`${design.title} - ${viewLabels[viewIdx]}`}
                    className="w-full h-full object-cover image-sharp"
                  />
                </div>
                {/* Thumbnail nav */}
                {views.length > 1 && (
                  <div className="flex gap-2 mt-3">
                    {views.map((v: string, i: number) => (
                      <button
                        key={i}
                        onClick={() => setViewIdx(i)}
                        className={`w-16 h-20 overflow-hidden border transition-colors ${i === viewIdx ? 'border-gray-900' : 'border-gray-200 hover:border-gray-400'}`}
                      >
                        <img src={v} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="w-full md:w-1/2">
                <p className="font-heading text-xs font-medium text-gray-400 tracking-[0.2em] uppercase mb-2">
                  {design.category || 'Design'}
                </p>
                <h1 className="font-heading text-3xl font-medium text-gray-900 tracking-tight mb-4">
                  {design.title}
                </h1>
                {design.description && (
                  <p className="font-body text-sm text-gray-500 leading-relaxed mb-6">
                    {design.description}
                  </p>
                )}

                {/* Rating Overview */}
                <div className="flex items-center gap-3 mb-8">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 text-gray-900" />
                    <span className="font-heading text-lg font-medium">{avgScore}</span>
                  </div>
                  <span className="font-body text-xs text-gray-400">
                    ({ratings.length} rating{ratings.length !== 1 ? 's' : ''})
                  </span>
                </div>

                {/* Rating Form */}
                <div className="border border-gray-200 p-6 mb-8">
                  <h3 className="font-heading text-sm font-medium text-gray-900 mb-4 tracking-tight">
                    {isAuthenticated ? 'Rate this Design' : 'Sign in to rate'}
                  </h3>
                  {isAuthenticated ? (
                    <>
                      <div className="flex items-center gap-1 mb-4">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                          <button
                            key={n}
                            onClick={() => setScore(n)}
                            onMouseEnter={() => setHovered(n)}
                            onMouseLeave={() => setHovered(0)}
                            className={`w-8 h-8 flex items-center justify-center font-heading text-xs border transition-colors ${
                              (hovered || score) >= n
                                ? 'bg-gray-900 text-cream-50 border-gray-900'
                                : 'bg-transparent text-gray-400 border-gray-200 hover:border-gray-400'
                            }`}
                          >
                            {n}
                          </button>
                        ))}
                      </div>
                      <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Leave a comment (optional)"
                        className="w-full border border-gray-200 px-4 py-3 font-body text-sm bg-transparent outline-none focus:border-gray-900 transition-colors mb-3 resize-none h-20"
                      />
                      <button
                        onClick={handleRate}
                        disabled={!score || ratingMutation.isPending}
                        className="w-full bg-gray-900 text-cream-50 font-heading text-xs font-medium tracking-[0.15em] uppercase py-3 hover:bg-gray-800 transition-colors disabled:opacity-40"
                      >
                        {ratingMutation.isPending ? 'Submitting…' : 'Submit Rating'}
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => router.push('/auth/login')}
                      className="w-full bg-gray-900 text-cream-50 font-heading text-xs font-medium tracking-[0.15em] uppercase py-3 hover:bg-gray-800 transition-colors"
                    >
                      Sign in to Rate
                    </button>
                  )}
                </div>

                {/* Ratings List */}
                {ratings.length > 0 && (
                  <div>
                    <h3 className="font-heading text-sm font-medium text-gray-900 mb-4 tracking-tight">
                      All Ratings
                    </h3>
                    <div className="space-y-4">
                      {ratings.map((r: any) => (
                        <div key={r.id} className="border-b border-gray-100 pb-4">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="flex items-center gap-0.5">
                              {Array.from({ length: r.score }, (_, i) => (
                                <Star key={i} className="w-3 h-3 text-gray-900 fill-gray-900" />
                              ))}
                            </div>
                            <span className="font-heading text-xs font-medium text-gray-900 ml-1">{r.score}/10</span>
                            <span className="font-body text-xs text-gray-400 ml-auto">
                              {r.user?.firstName || 'Anonymous'}
                            </span>
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
          ) : (
            <div className="text-center py-20">
              <p className="font-body text-gray-400">Design not found.</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
    </DesignsGate>
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
