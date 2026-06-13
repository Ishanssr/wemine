'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import Link from 'next/link';
import { Star } from 'lucide-react';

export default function DesignsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['designs'],
    queryFn: async () => {
      const res = await api.get('/designs');
      return (res.data.designs || []);
    },
  });

  return (
    <div className="pt-28 pb-24">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <p className="font-heading text-xs font-medium text-gray-400 tracking-[0.2em] uppercase mb-2">
            Community Designs
          </p>
          <h1 className="font-heading text-3xl md:text-4xl font-medium text-gray-900 tracking-tight">
            Browse & Rate Designs
          </h1>
          <p className="font-body text-sm text-gray-400 mt-3 max-w-lg">
            Explore upcoming designs and share your feedback. Each design is rated by the community out of 10.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-black/5 animate-pulse" />
            ))}
          </div>
        ) : !data?.length ? (
          <div className="text-center py-20">
            <p className="font-body text-gray-400">No designs yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {data.map((design: any, i: number) => (
              <motion.div
                key={design.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link href={`/designs/${design.id}`} className="group block">
                  <div className="aspect-[3/4] overflow-hidden bg-black/5 relative">
                    <img
                      src={design.imageUrl}
                      alt={design.title}
                      className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                    />
                    {design.avgRating !== null && (
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2.5 py-1 flex items-center gap-1">
                        <Star className="w-3 h-3 text-gray-900" />
                        <span className="font-heading text-xs font-medium">{design.avgRating}</span>
                      </div>
                    )}
                  </div>
                  <div className="mt-3">
                    <h3 className="font-heading text-sm font-medium text-gray-900 group-hover:text-gray-500 transition-colors">
                      {design.title}
                    </h3>
                    <p className="font-body text-xs text-gray-400 mt-0.5">
                      {design.ratingCount || 0} rating{design.ratingCount !== 1 ? 's' : ''}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
