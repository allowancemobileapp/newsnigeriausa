import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, Edit2, LogOut, Image, X, ArrowLeft, Sun, Moon } from 'lucide-react';
import { NewsItem } from '../data/news';

interface AdminDashboardProps {
  newsData: NewsItem[];
  setNewsData: React.Dispatch<React.SetStateAction<NewsItem[]>>;
  onLogout: () => void;
}

export const AdminDashboard = ({ newsData, setNewsData, onLogout }: AdminDashboardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState<NewsItem | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const categories = ['Nigeria News', 'USA News', 'Global African Diaspora News'];
  const subCategories = ['Politics', 'Business', 'Culture', 'Technology', 'Social Impact'];

  const handleDelete = (id: number) => {
    setNewsData(newsData.filter(item => item.id !== id));
    setConfirmDeleteId(null);
  };

  const handleEdit = (item: NewsItem) => {
    setEditingItem(item);
    setIsEditing(true);
  };

  const handleCreateNew = () => {
    setEditingItem({
      id: Date.now(),
      category: categories[0],
      subCategory: subCategories[0],
      title: '',
      excerpt: '',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      image: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&q=80'
    });
    setIsEditing(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    if (newsData.some(item => item.id === editingItem.id)) {
      setNewsData(newsData.map(item => item.id === editingItem.id ? editingItem : item));
    } else {
      setNewsData([editingItem, ...newsData]);
    }
    setIsEditing(false);
    setEditingItem(null);
  };

  const theme = {
    bg: isDarkMode ? 'bg-[#0A0A0A]' : 'bg-slate-50',
    card: isDarkMode ? 'bg-[#111111]' : 'bg-white',
    textMain: isDarkMode ? 'text-white' : 'text-slate-900',
    textMainHover: isDarkMode ? 'hover:text-white' : 'hover:text-slate-900',
    textMuted: isDarkMode ? 'text-zinc-400' : 'text-slate-500',
    textLabel: isDarkMode ? 'text-zinc-500' : 'text-slate-400',
    border: isDarkMode ? 'border-zinc-800' : 'border-slate-200',
    inputBg: isDarkMode ? 'bg-[#0A0A0A]' : 'bg-slate-50',
    primaryBtnBg: isDarkMode ? 'bg-white' : 'bg-slate-900',
    primaryBtnText: isDarkMode ? 'text-black' : 'text-white',
    primaryBtnHover: isDarkMode ? 'hover:bg-zinc-200' : 'hover:bg-slate-800',
    secondaryBtnBg: isDarkMode ? 'bg-[#111111]' : 'bg-white',
    secondaryBtnHover: isDarkMode ? 'hover:bg-zinc-900' : 'hover:bg-slate-50',
    iconHover: isDarkMode ? 'hover:text-white hover:bg-zinc-800' : 'hover:text-slate-900 hover:bg-slate-100',
    modalOverlay: isDarkMode ? 'bg-black/80' : 'bg-slate-900/40',
  };

  return (
    <div className={`min-h-screen ${theme.bg} ${theme.textMain} pt-12 pb-12 transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className={`text-3xl md:text-4xl font-bold ${theme.textMain} mb-2 tracking-tight transition-colors`}>News Management</h1>
            <p className={`${theme.textMuted} transition-colors`}>Control your articles, press releases, and visibility.</p>
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`w-10 h-10 flex items-center justify-center rounded-full ${theme.card} ${theme.border} border ${theme.textMuted} ${theme.iconHover} transition-colors shadow-sm`}
              title="Toggle Theme"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={onLogout}
              className={`flex items-center gap-2 ${theme.card} border ${theme.border} text-red-500 px-5 py-2.5 rounded-full font-medium text-sm hover:bg-red-50 hover:border-red-100 transition-colors shadow-sm`}
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
            <button
              onClick={handleCreateNew}
              className={`flex items-center gap-2 ${theme.primaryBtnBg} ${theme.primaryBtnText} px-5 py-2.5 rounded-full font-medium text-sm ${theme.primaryBtnHover} transition-colors shadow-md`}
            >
              <Plus className="w-4 h-4" /> Add New Article
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newsData.map((item) => (
            <motion.div 
              key={item.id} 
              layout
              className={`${theme.card} border ${theme.border} rounded-2xl overflow-hidden flex flex-col group shadow-sm transition-colors duration-300`}
            >
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                />
                <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
                  <span className="bg-black/60 backdrop-blur-md text-white text-[10px] uppercase font-bold tracking-wider px-3 py-1.5 rounded-full border border-white/10">
                    {item.category}
                  </span>
                  <span className="bg-[#fb923c] text-black text-[10px] uppercase font-bold tracking-wider px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-black rounded-full mb-0.5"></span> {item.subCategory}
                  </span>
                </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <h3 className={`text-xl font-bold ${theme.textMain} mb-2 line-clamp-2 leading-tight transition-colors`}>
                  {item.title}
                </h3>
                <p className="text-brand-emerald font-bold mb-3 font-mono text-sm">{item.date}</p>
                <p className={`${theme.textMuted} text-sm line-clamp-2 mb-6 flex-1 transition-colors`}>
                  {item.excerpt}
                </p>
                
                <div className={`pt-5 border-t ${theme.border} flex items-center justify-between mt-auto transition-colors`}>
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${theme.textLabel} transition-colors`}>Actions</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleEdit(item)}
                      className={`w-9 h-9 flex items-center justify-center rounded-full ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-slate-100 border-slate-200'} border ${theme.textMuted} ${theme.iconHover} transition-colors`}
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    {confirmDeleteId === item.id ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setConfirmDeleteId(null)}
                          className={`px-3 py-1.5 rounded-full ${isDarkMode ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'} text-xs font-medium transition-colors`}
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="px-3 py-1.5 rounded-full bg-red-500/10 text-red-500 border border-red-500/20 text-xs font-medium hover:bg-red-500 hover:text-white transition-colors"
                        >
                          Confirm
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmDeleteId(item.id)}
                        className="w-9 h-9 flex items-center justify-center rounded-full bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
          {newsData.length === 0 && (
            <div className={`col-span-1 md:col-span-2 lg:col-span-3 p-12 text-center border border-dashed rounded-2xl ${theme.textMuted} ${theme.border} transition-colors`}>
              No news items found. Create one to get started.
            </div>
          )}
        </div>
      </div>

      {/* Editor Modal */}
      <AnimatePresence>
        {isEditing && editingItem && (
          <div className={`fixed inset-0 z-[110] overflow-y-auto ${theme.modalOverlay} backdrop-blur-sm transition-colors`}>
            <div className="flex min-h-full p-4 py-12">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className={`${theme.card} border ${theme.border} rounded-2xl shadow-2xl max-w-2xl w-full m-auto p-8 relative transition-colors duration-300`}
              >
                <button
                  onClick={() => setIsEditing(false)}
                  className={`flex items-center gap-2 ${theme.textMuted} ${theme.textMainHover} transition-colors mb-6 group`}
                >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm font-medium">Back to Project Management</span>
              </button>

              <h2 className={`text-2xl font-bold ${theme.textMain} mb-8 tracking-tight transition-colors`}>
                {newsData.some(item => item.id === editingItem.id) ? 'Edit Article' : 'Add New Article'}
              </h2>

              <form onSubmit={handleSave} className="space-y-6">
                <div>
                  <label className={`block text-[10px] font-bold uppercase tracking-widest ${theme.textLabel} mb-2 transition-colors`}>Title</label>
                  <input
                    type="text"
                    required
                    value={editingItem.title}
                    onChange={e => setEditingItem({ ...editingItem, title: e.target.value })}
                    className={`w-full ${theme.inputBg} ${theme.textMain} border ${theme.border} rounded-xl p-3.5 focus:border-brand-emerald outline-none transition-colors`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className={`block text-[10px] font-bold uppercase tracking-widest ${theme.textLabel} mb-2 transition-colors`}>Category</label>
                    <select
                      value={editingItem.category}
                      onChange={e => setEditingItem({ ...editingItem, category: e.target.value })}
                      className={`w-full ${theme.inputBg} ${theme.textMain} border ${theme.border} rounded-xl p-3.5 focus:border-brand-emerald outline-none transition-colors appearance-none`}
                    >
                      {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={`block text-[10px] font-bold uppercase tracking-widest ${theme.textLabel} mb-2 transition-colors`}>Sub Category</label>
                    <select
                      value={editingItem.subCategory}
                      onChange={e => setEditingItem({ ...editingItem, subCategory: e.target.value })}
                      className={`w-full ${theme.inputBg} ${theme.textMain} border ${theme.border} rounded-xl p-3.5 focus:border-brand-emerald outline-none transition-colors appearance-none`}
                    >
                      {subCategories.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className={`block text-[10px] font-bold uppercase tracking-widest ${theme.textLabel} mb-2 transition-colors`}>Date</label>
                  <input
                    type="text"
                    required
                    value={editingItem.date}
                    onChange={e => setEditingItem({ ...editingItem, date: e.target.value })}
                    className={`w-full ${theme.inputBg} ${theme.textMain} border ${theme.border} rounded-xl p-3.5 font-mono text-sm focus:border-brand-emerald outline-none transition-colors`}
                  />
                </div>

                <div>
                  <label className={`block text-[10px] font-bold uppercase tracking-widest ${theme.textLabel} mb-2 transition-colors`}>Image URL</label>
                  <div className="flex gap-4">
                    <input
                      type="url"
                      required
                      value={editingItem.image}
                      onChange={e => setEditingItem({ ...editingItem, image: e.target.value })}
                      className={`flex-1 ${theme.inputBg} ${theme.textMain} border ${theme.border} rounded-xl p-3.5 font-mono text-sm focus:border-brand-emerald outline-none transition-colors`}
                    />
                    <div className={`w-14 h-14 rounded-xl border ${theme.border} overflow-hidden shrink-0 flex items-center justify-center ${theme.inputBg} transition-colors`}>
                      {editingItem.image ? (
                        <img src={editingItem.image} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <Image className={`w-5 h-5 ${theme.textLabel}`} />
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className={`block text-[10px] font-bold uppercase tracking-widest ${theme.textLabel} mb-2 transition-colors`}>Excerpt</label>
                  <textarea
                    required
                    rows={4}
                    value={editingItem.excerpt}
                    onChange={e => setEditingItem({ ...editingItem, excerpt: e.target.value })}
                    className={`w-full ${theme.inputBg} ${theme.textMain} border ${theme.border} rounded-xl p-3.5 resize-none focus:border-brand-emerald outline-none transition-colors`}
                  ></textarea>
                </div>

                <div className={`pt-6 border-t ${theme.border} flex justify-end gap-4 mt-8 transition-colors`}>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className={`px-6 py-3 font-medium text-sm ${theme.textMuted} ${theme.textMainHover} transition-colors`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`${theme.primaryBtnBg} ${theme.primaryBtnText} px-8 py-3 rounded-full font-medium text-sm ${theme.primaryBtnHover} transition-colors shadow-sm`}
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
