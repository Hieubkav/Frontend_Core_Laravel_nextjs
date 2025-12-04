'use client';

import React from 'react';
import { X } from 'lucide-react';
import MediaLibraryView from './MediaLibraryView';
import { MediaItem } from '../media/types';

interface MediaModalProps {
  open: boolean;
  onClose: () => void;
  onSelect?: (item: MediaItem) => void;
}

export default function MediaModal({ open, onClose, onSelect }: MediaModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-6xl w-[94vw] max-h-[90vh] overflow-hidden border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-semibold">Thư viện Media</h3>
            <p className="text-xs text-slate-500">Upload, quản lý và copy link nhanh</p>
          </div>
          <button
            onClick={onClose}
            className="h-9 w-9 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5 overflow-y-auto max-h-[80vh]">
          <MediaLibraryView
            onSelect={onSelect}
            dense
            autoClose={onClose}
          />
        </div>
      </div>
    </div>
  );
}
