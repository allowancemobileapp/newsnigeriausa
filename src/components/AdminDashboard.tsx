import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, Edit2, LogOut, Image, X, ArrowLeft, Sun, Moon, Newspaper, Briefcase, Mail, Users } from 'lucide-react';
import { NewsItem } from '../data/news';
import { supabase } from '../lib/supabase';

interface AdminDashboardProps {
  newsData: NewsItem[];
  setNewsData: React.Dispatch<React.SetStateAction<NewsItem[]>>;
  onLogout: () => void;
}

export const AdminDashboard = ({ newsData, setNewsData, onLogout }: AdminDashboardProps) => {
  const [activeTab, setActiveTab] = useState<'news' | 'partners' | 'engagements' | 'subscribers'>('news');
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState<NewsItem | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Custom Data States
  const [partners, setPartners] = useState<any[]>([]);
  const [engagements, setEngagements] = useState<any[]>([]);
  const [subscribers, setSubscribers] = useState<any[]>([]);

  const categories = ['Nigeria News', 'USA News', 'Global African Diaspora News'];
  const subCategories = ['Politics', 'Business', 'Culture', 'Technology', 'Social Impact'];

  useEffect(() => {
    // Fetch external lists
    if (activeTab === 'partners') supabase.from('partners').select('*').order('created_at', { ascending: false }).then(({data}) => data && setPartners(data));
    if (activeTab === 'engagements') supabase.from('engagements').select('*').order('created_at', { ascending: false }).then(({data}) => data && setEngagements(data));
    if (activeTab === 'subscribers') supabase.from('subscribers').select('*').order('created_at', { ascending: false }).then(({data}) => data && setSubscribers(data));
  }, [activeTab]);

  const handleDelete = async (id: number) => {
    try {
      const { error } = await supabase.from('news').delete().eq('id', id);
      if (error) {
        console.error('Error deleting', error);
        alert('Could not delete from Supabase: ' + error.message);
      } else {
        setNewsData(newsData.filter(item => item.id !== id));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setConfirmDeleteId(null);
    }
  };

  const handleDeleteOther = async (table: string, id: number) => {
    if (!window.confirm("Delete this record permanently?")) return;
    try {
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (!error) {
        if (table === 'partners') setPartners(partners.filter(p => p.id !== id));
        if (table === 'engagements') setEngagements(engagements.filter(e => e.id !== id));
        if (table === 'subscribers') setSubscribers(subscribers.filter(s => s.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleEdit = (item: NewsItem) => {
    setEditingItem(item);
    setIsEditing(true);
    setErrorMsg('');
  };

  const handleCreateNew = () => {
    setEditingItem({
      id: Date.now(), // Fallback ID if Supabase doesn't assign one
      category: categories[0],
      subCategory: subCategories[0],
      title: '',
      excerpt: '',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      image: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&q=80'
    });
    setIsEditing(true);
    setErrorMsg('');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    setIsSaving(true);
    setErrorMsg('');

    try {
      const isExisting = newsData.some(item => item.id === editingItem.id);
      
      let savedItem = editingItem;
      const { data, error } = await supabase
        .from('news')
        .upsert(editingItem)
        .select()
        .single();
        
      if (error) {
        console.error('Error saving', error);
        setErrorMsg(error.message);
        setIsSaving(false);
        return; // Stop here if there is a db error
      } else if (data) {
        savedItem = data as NewsItem;
      }

      if (isExisting) {
        setNewsData(newsData.map(item => item.id === editingItem.id ? savedItem : item));
      } else {
        setNewsData([savedItem, ...newsData]);
      }
      setIsEditing(false);
      setEditingItem(null);
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to save to Supabase.');
    } finally {
      setIsSaving(false);
    }
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
    <div className={`min-h-screen flex flex-col md:flex-row ${theme.bg} ${theme.textMain} transition-colors duration-300`}>
      {/* Sidebar / Top Nav on Mobile */}
      <div className={`md:w-64 border-b md:border-b-0 md:border-r ${theme.border} ${theme.card} flex flex-col shrink-0`}>
        <div className="p-4 md:p-6 border-b border-inherit">
          <h2 className="font-bold tracking-widest uppercase text-xs text-center md:text-left">Project Management</h2>
        </div>
        <div className="flex-1 py-2 md:py-4 flex flex-row md:flex-col gap-2 px-3 overflow-x-auto whitespace-nowrap" style={{ scrollbarWidth: 'none' }}>
          <button onClick={() => setActiveTab('news')} className={`flex items-center shrink-0 gap-3 px-4 py-3 rounded text-sm font-bold uppercase tracking-widest ${activeTab === 'news' ? theme.primaryBtnBg + ' ' + theme.primaryBtnText : theme.textMuted + ' ' + theme.secondaryBtnHover}`}>
            <Newspaper className="w-4 h-4" /> News
          </button>
          <button onClick={() => setActiveTab('partners')} className={`flex items-center shrink-0 gap-3 px-4 py-3 rounded text-sm font-bold uppercase tracking-widest ${activeTab === 'partners' ? theme.primaryBtnBg + ' ' + theme.primaryBtnText : theme.textMuted + ' ' + theme.secondaryBtnHover}`}>
            <Briefcase className="w-4 h-4" /> Partners
          </button>
          <button onClick={() => setActiveTab('engagements')} className={`flex items-center shrink-0 gap-3 px-4 py-3 rounded text-sm font-bold uppercase tracking-widest ${activeTab === 'engagements' ? theme.primaryBtnBg + ' ' + theme.primaryBtnText : theme.textMuted + ' ' + theme.secondaryBtnHover}`}>
            <Users className="w-4 h-4" /> Engagements
          </button>
          <button onClick={() => setActiveTab('subscribers')} className={`flex items-center shrink-0 gap-3 px-4 py-3 rounded text-sm font-bold uppercase tracking-widest ${activeTab === 'subscribers' ? theme.primaryBtnBg + ' ' + theme.primaryBtnText : theme.textMuted + ' ' + theme.secondaryBtnHover}`}>
            <Mail className="w-4 h-4" /> Subscribers
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto pt-6 md:pt-12 pb-12 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
            <div>
              <h1 className={`text-3xl md:text-4xl font-bold ${theme.textMain} mb-2 tracking-tight transition-colors capitalize`}>{activeTab} Management</h1>
              <p className={`${theme.textMuted} transition-colors`}>View and control system modules.</p>
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
              {activeTab === 'news' && (
                <button
                  onClick={handleCreateNew}
                  className={`flex items-center gap-2 ${theme.primaryBtnBg} ${theme.primaryBtnText} px-5 py-2.5 rounded-full font-medium text-sm ${theme.primaryBtnHover} transition-colors shadow-md`}
                >
                  <Plus className="w-4 h-4" /> Add Article
                </button>
              )}
            </div>
          </div>

          {activeTab === 'news' && (
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
          )}

          {activeTab === 'subscribers' && (
            <div className={`w-full border ${theme.border} ${theme.card} rounded-xl overflow-hidden`}>
              <table className="w-full text-left text-sm">
                <thead className={`border-b ${theme.border} uppercase font-bold text-[10px] tracking-widest ${theme.textMuted}`}>
                  <tr>
                    <th className="px-6 py-4">ID / Email</th>
                    <th className="px-6 py-4">Subscribed At</th>
                    <th className="px-6 py-4 text-right">Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {subscribers.map((s, i) => (
                    <tr key={i} className={`border-b ${theme.border} hover:bg-white/5`}>
                      <td className="px-6 py-4 font-mono">{s.email}</td>
                      <td className="px-6 py-4">{new Date(s.created_at).toLocaleString()}</td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => handleDeleteOther('subscribers', s.id)} className="text-red-500 hover:text-red-700">Delete</button>
                      </td>
                    </tr>
                  ))}
                  {subscribers.length === 0 && (
                    <tr><td colSpan={3} className="px-6 py-8 text-center">No subscribers found in database.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'partners' && (
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-6`}>
              {partners.map(p => (
                <div key={p.id} className={`${theme.card} border ${theme.border} rounded-xl p-6`}>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-lg">{p.name}</h3>
                      <p className={`text-xs ${theme.textMuted}`}>{p.company}</p>
                      <p className={`text-xs ${theme.textMuted} font-mono mt-1 w-full truncate`}>{p.email}</p>
                    </div>
                    <button onClick={() => handleDeleteOther('partners', p.id)} className="text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className={`text-sm ${theme.textMuted} italic bg-black/5 p-4 rounded-md`}>"{p.message}"</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'engagements' && (
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-6`}>
              {engagements.map(e => (
                <div key={e.id} className={`${theme.card} border ${theme.border} border-t-4 border-t-brand-emerald rounded-xl p-6`}>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-lg">{e.name}</h3>
                      <p className={`text-xs ${theme.textMuted}`}>{e.organization} · <span className="text-brand-emerald font-bold">{e.engagement_type}</span></p>
                      <p className={`text-xs ${theme.textMuted} font-mono mt-1 w-full truncate`}>{e.email}</p>
                    </div>
                    <button onClick={() => handleDeleteOther('engagements', e.id)} className="text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className={`text-sm ${theme.textMuted} italic bg-black/5 p-4 rounded-md`}>"{e.message}"</p>
                </div>
              ))}
            </div>
          )}

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
                      rows={2}
                      value={editingItem.excerpt}
                      onChange={e => setEditingItem({ ...editingItem, excerpt: e.target.value })}
                      className={`w-full ${theme.inputBg} ${theme.textMain} border ${theme.border} rounded-xl p-3.5 resize-none focus:border-brand-emerald outline-none transition-colors`}
                    ></textarea>
                  </div>

                  <div>
                    <label className={`block text-[10px] font-bold uppercase tracking-widest ${theme.textLabel} mb-2 transition-colors`}>Full Story</label>
                    <textarea
                      rows={8}
                      value={editingItem.content || ''}
                      onChange={e => setEditingItem({ ...editingItem, content: e.target.value })}
                      className={`w-full ${theme.inputBg} ${theme.textMain} border ${theme.border} rounded-xl p-3.5 resize-none focus:border-brand-emerald outline-none transition-colors`}
                      placeholder="Enter the full article content here..."
                    ></textarea>
                    <p className="text-xs text-slate-500 mt-2">Make sure to add the content column in your Supabase 'news' table: <code className="bg-slate-200 text-slate-800 px-1 py-0.5 rounded">ALTER TABLE public.news ADD COLUMN content TEXT;</code></p>
                  </div>

                  {errorMsg && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl text-sm mb-6 flex flex-col gap-1">
                      <span className="font-bold">Error saving to Supabase:</span>
                      <span>{errorMsg}</span>
                      <span className="text-xs text-red-400 mt-1">Make sure you have created the "news" table with the correct columns.</span>
                    </div>
                  )}

                  <div className={`pt-6 border-t ${theme.border} flex justify-end gap-4 mt-8 transition-colors`}>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      disabled={isSaving}
                      className={`px-6 py-3 font-medium text-sm ${theme.textMuted} ${theme.textMainHover} transition-colors disabled:opacity-50`}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSaving}
                      className={`${theme.primaryBtnBg} ${theme.primaryBtnText} px-8 py-3 rounded-full font-medium text-sm ${theme.primaryBtnHover} transition-colors shadow-sm disabled:opacity-75 disabled:cursor-wait flex items-center gap-2`}
                    >
                      {isSaving ? (
                        <>
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                          Saving...
                        </>
                      ) : (
                        'Save Changes'
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
