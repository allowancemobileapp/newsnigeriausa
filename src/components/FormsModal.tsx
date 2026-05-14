import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Building2, User, Mail, MessageSquare } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface GenericFormModalProps {
  type: 'partner' | 'engagement';
  onClose: () => void;
}

export const GenericFormModal = ({ type, onClose }: GenericFormModalProps) => {
  const isPartner = type === 'partner';
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    message: '',
    engagement_type: 'Summit Participation'
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    
    try {
      if (isPartner) {
        const { error } = await supabase.from('partners').insert({
          name: formData.name,
          email: formData.email,
          company: formData.organization,
          message: formData.message
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.from('engagements').insert({
          name: formData.name,
          email: formData.email,
          organization: formData.organization,
          engagement_type: formData.engagement_type,
          message: formData.message
        });
        if (error) throw error;
      }
      setSuccess(true);
      setTimeout(() => onClose(), 2500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit form.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-8 relative my-8"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors">
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold text-brand-navy mb-2 font-serif text-center">
          {isPartner ? 'Become a Partner' : 'Request Engagement'}
        </h2>
        <p className="text-xs text-slate-500 mb-8 uppercase tracking-widest font-bold text-center">
          {isPartner ? 'Join our global strategic network' : 'Connect with GDIR'}
        </p>

        {success ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-brand-emerald/10 text-brand-emerald rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">✓</span>
            </div>
            <h3 className="text-lg font-bold text-brand-navy mb-2">Request Received</h3>
            <p className="text-sm text-slate-500">We will get back to you shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {errorMsg && <p className="text-red-500 text-xs font-bold text-center">{errorMsg}</p>}
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text" required
                    value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full border border-slate-300 rounded pl-10 pr-3 py-3 text-sm focus:border-brand-emerald outline-none"
                    placeholder="John Doe"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email" required
                    value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                    className="w-full border border-slate-300 rounded pl-10 pr-3 py-3 text-sm focus:border-brand-emerald outline-none"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Agency / Organization / Company</label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text" required
                  value={formData.organization} onChange={e => setFormData({...formData, organization: e.target.value})}
                  className="w-full border border-slate-300 rounded pl-10 pr-3 py-3 text-sm focus:border-brand-emerald outline-none"
                  placeholder="ACME Corp"
                />
              </div>
            </div>

            {!isPartner && (
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Engagement Type</label>
                <select
                  value={formData.engagement_type} onChange={e => setFormData({...formData, engagement_type: e.target.value})}
                  className="w-full border border-slate-300 rounded px-3 py-3 text-sm focus:border-brand-emerald outline-none bg-white"
                >
                  <option>Policy Dialogue</option>
                  <option>Summit Participation</option>
                  <option>Media & Diplomacy Support</option>
                  <option>Other Institutional Matters</option>
                </select>
              </div>
            )}

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Message / Proposal</label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <textarea
                  required rows={4}
                  value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})}
                  className="w-full border border-slate-300 rounded pl-10 pr-3 py-3 text-sm focus:border-brand-emerald outline-none resize-none"
                  placeholder="How can we collaborate..."
                ></textarea>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-emerald text-white px-8 py-3 rounded font-bold uppercase tracking-widest text-xs hover:bg-emerald-600 transition-colors disabled:opacity-50 mt-2"
            >
              {loading ? 'Submitting...' : 'Submit Request'}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
};
