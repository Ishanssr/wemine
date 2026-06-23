'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Bookmark, X, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '@/lib/api';

export default function PrebooksPage() {
  const queryClient = useQueryClient();

  const { data: prebooks, isLoading } = useQuery({
    queryKey: ['user-prebooks'],
    queryFn: async () => {
      const res = await api.get('/users/prebooks');
      return (res.data || []) as any[];
    },
  });

  const unprebookMutation = useMutation({
    mutationFn: async (designId: string) => {
      await api.delete(`/designs/${designId}/prebook`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-prebooks'] });
      toast.success('Prebook cancelled');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to cancel prebook');
    },
  });

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <h2 className="font-heading font-semibold text-lg text-gray-900 mb-6">Prebooks</h2>
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <div key={i} className="aspect-[4/5] rounded-2xl bg-white/30 animate-pulse" />)}
        </div>
      ) : !prebooks?.length ? (
        <div className="glass-surface rounded-2xl p-10 text-center">
          <Bookmark className="w-10 h-10 text-gray-200 mx-auto mb-4" />
          <p className="font-body text-gray-400 mb-4">No prebooked designs yet</p>
          <Link href="/products" className="inline-flex items-center gap-1.5 text-sm font-body text-gray-600 hover:text-gray-900 transition-colors">
            Browse designs <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {prebooks.map((pb: any) => (
            <div key={pb.id} className="group relative">
              <Link href={`/designs/${pb.design.id}`} className="block">
                <div className="aspect-[4/5] relative overflow-hidden bg-gray-100 mb-3">
                  <Image
                    src={pb.design.imageUrl}
                    alt={pb.design.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                  <span className="absolute bottom-3 left-3 px-3 py-1 bg-black text-white text-[10px] font-heading font-medium tracking-[0.08em] uppercase rounded-full">
                    Prebooked
                  </span>
                </div>
                <h3 className="font-heading text-[11px] font-medium text-gray-900 tracking-[0.05em] uppercase line-clamp-1">
                  {pb.design.title}
                </h3>
                <p className="font-body text-[11px] text-gray-500 tracking-[0.05em] uppercase">
                  ₹{pb.design.prebookPrice}
                </p>
              </Link>
              <button
                onClick={() => unprebookMutation.mutate(pb.design.id)}
                className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-white"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
