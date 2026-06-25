'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function AdminBannersPage() {
  const [showForm, setShowForm] = useState(false);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-end justify-between mb-8 border-b border-black pb-4">
        <h1 className="font-heading text-4xl font-medium text-black tracking-tight uppercase">Banners</h1>
        <button onClick={() => setShowForm(!showForm)} className="font-heading text-[10px] font-medium tracking-[0.1em] uppercase text-black hover:opacity-50 transition-opacity">
          + New Banner
        </button>
      </div>

      <div className="border border-black p-8 text-center mb-8 bg-black text-white">
        <h2 className="font-heading text-xl uppercase tracking-widest mb-2">Banners API Not Connected</h2>
        <p className="font-body text-xs text-gray-400">The Banners frontend UI is built, but the NestJS backend API for Banners has not been implemented yet. Contact your developer to wire this up.</p>
      </div>

      {showForm && (
        <div className="border border-black/10 p-6 mb-8 bg-white opacity-50 pointer-events-none">
          <h3 className="font-heading text-sm tracking-[0.05em] uppercase mb-4">Upload Banner</h3>
          <div className="flex flex-col gap-4 mb-4">
            <input className="px-4 py-3 border border-black/10 font-body text-xs focus:outline-none" placeholder="Banner Title" />
            <input className="px-4 py-3 border border-black/10 font-body text-xs focus:outline-none" placeholder="Link URL (e.g. /products?collection=summer)" />
            <div className="border-2 border-dashed border-black/10 p-8 flex flex-col items-center justify-center">
               <span className="font-heading text-xs tracking-wider uppercase text-gray-400">Upload Image (Desktop)</span>
            </div>
          </div>
          <div className="flex gap-4">
            <button className="px-6 py-3 font-heading text-xs tracking-wider uppercase text-gray-500 border border-transparent">Cancel</button>
            <button className="px-6 py-3 bg-black text-white font-heading text-xs tracking-wider uppercase">Upload</button>
          </div>
        </div>
      )}

      <div className="bg-white border border-black/10 opacity-50 pointer-events-none">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="font-body text-[10px] tracking-[0.1em] uppercase text-gray-400 pb-4 px-6 pt-6 font-normal">Banner</th>
                <th className="font-body text-[10px] tracking-[0.1em] uppercase text-gray-400 pb-4 px-6 pt-6 font-normal">Link</th>
                <th className="font-body text-[10px] tracking-[0.1em] uppercase text-gray-400 pb-4 px-6 pt-6 font-normal">Status</th>
                <th className="font-body text-[10px] tracking-[0.1em] uppercase text-gray-400 pb-4 px-6 pt-6 font-normal">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={4} className="py-8 text-center font-body text-xs text-gray-400 uppercase tracking-widest">No banners found</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
