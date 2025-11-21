import React, { useState, useEffect } from 'react';
import { X, Link2, Check, ExternalLink } from 'lucide-react';

interface ProblemModalProps {
  isOpen: boolean;
  onClose: () => void;
  problemNumber: number;
  currentLink?: string;
  onSave: (link: string) => void;
  theme: string;
}

export default function ProblemModal({
  isOpen,
  onClose,
  problemNumber,
  currentLink = '',
  onSave,
  theme
}: ProblemModalProps) {
  const [link, setLink] = useState(currentLink);

  useEffect(() => {
    setLink(currentLink);
  }, [currentLink, isOpen]);

  const handleSave = () => {
    onSave(link);
    onClose();
  };

  const handleChange = (value: string) => {
    setLink(value);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={onClose}>
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm pointer-events-none"
      />
      
      <div 
        className="relative z-[10000] w-full max-w-lg rounded-3xl border-2 border-purple-500/50 bg-gradient-to-br from-gray-900 via-purple-950/50 to-gray-900 p-8 shadow-[0_0_60px_rgba(168,85,247,0.4)] animate-in zoom-in-95 duration-200 pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 blur-xl -z-10" />
        
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full border-2 border-gray-700 bg-gray-800/50 p-2 text-gray-400 transition-all hover:border-purple-500 hover:bg-purple-950/50 hover:text-purple-300 hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="relative mb-6">
          <div className="mb-2 flex items-center gap-3">
            <div className="flex items-center justify-center rounded-full border-2 border-cyan-500/50 bg-cyan-950/50 p-2 shadow-[0_0_20px_rgba(34,211,238,0.3)]">
              <Link2 className="h-5 w-5 text-cyan-400" />
            </div>
            <h2 className="text-2xl font-black uppercase tracking-wider text-white">
              Problema {problemNumber}
            </h2>
          </div>
          
          <div className="mt-3 rounded-lg border border-purple-500/30 bg-purple-950/20 px-3 py-2">
            <p className="text-xs font-medium uppercase tracking-wider text-purple-300">
              {theme}
            </p>
          </div>
        </div>

        <div className="relative mb-6">
          <label className="mb-2 block text-sm font-bold uppercase tracking-wider text-gray-300">
            Link del problema
          </label>
          
          <div className="relative">
            <input
              type="url"
              value={link}
              onChange={(e) => handleChange(e.target.value)}
              placeholder="https://leetcode.com/problems/..."
              className="w-full rounded-xl border-2 border-purple-500/50 bg-gray-900/60 px-4 py-3 pr-12 font-mono text-sm text-white placeholder:text-gray-600 backdrop-blur-sm transition-all focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_20px_rgba(34,211,238,0.3)]"
              autoFocus
            />
            
            {link && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Check className="h-5 w-5 text-lime-400" />
              </div>
            )}
          </div>
          
          <p className="mt-2 text-xs text-gray-500">
            Opcional: Agrega el link para referencia futura
          </p>
        </div>

        {currentLink && (
          <div className="mb-6 rounded-xl border border-cyan-500/30 bg-cyan-950/20 p-3">
            <div className="mb-1 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-400">
              <ExternalLink className="h-3 w-3" />
              Link actual
            </div>
            <a
              href={currentLink}
              target="_blank"
              rel="noopener noreferrer"
              className="block truncate font-mono text-xs text-cyan-300 hover:text-cyan-200 hover:underline"
            >
              {currentLink}
            </a>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border-2 border-gray-700 bg-gray-800/50 px-6 py-3 font-bold uppercase tracking-wider text-gray-300 transition-all hover:border-gray-600 hover:bg-gray-800 hover:text-white"
          >
            Cancelar
          </button>
          
          <button
            onClick={handleSave}
            className="flex-1 rounded-xl border-2 border-purple-500/50 bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 font-bold uppercase tracking-wider text-white shadow-[0_0_30px_rgba(168,85,247,0.4)] transition-all hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(168,85,247,0.6)]"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}