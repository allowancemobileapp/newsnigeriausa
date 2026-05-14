import { motion } from 'motion/react';
import { X, Calendar } from 'lucide-react';
import { NewsItem } from '../data/news';

interface ArticleModalProps {
  article: NewsItem | null;
  onClose: () => void;
}

export const ArticleModal = ({ article, onClose }: ArticleModalProps) => {
  if (!article) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 md:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="bg-white rounded-xl shadow-2xl max-w-3xl w-full relative my-8 overflow-hidden flex flex-col"
      >
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black/20 text-white hover:bg-black/40 transition-colors backdrop-blur-sm"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-full h-64 md:h-80 relative shrink-0">
          <img 
            src={article.image} 
            alt={article.title} 
            className="w-full h-full object-cover" 
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex gap-2 mb-3">
              <span className="bg-brand-emerald text-white text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded">
                {article.category}
              </span>
              <span className="bg-white/20 backdrop-blur-md text-white text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded border border-white/10">
                {article.subCategory}
              </span>
            </div>
            <h2 className="text-2xl md:text-4xl font-serif font-bold text-white leading-tight">
              {article.title}
            </h2>
          </div>
        </div>

        <div className="p-6 md:p-10 overflow-y-auto bg-zinc-50 flex-1">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-widest mb-8 pb-6 border-b border-zinc-200">
            <Calendar className="w-4 h-4" />
            {article.date}
          </div>
          
          <div className="prose prose-slate max-w-none">
            <p className="text-lg md:text-xl font-serif text-slate-700 leading-relaxed font-medium mb-8">
              {article.excerpt}
            </p>
            
            {article.content ? (
              <div className="text-slate-600 font-serif leading-relaxed whitespace-pre-wrap space-y-4">
                {article.content}
              </div>
            ) : (
              <div className="text-slate-400 font-serif italic py-8 border-t border-dashed border-slate-200 mt-8">
                No full story content provided for this article.
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
