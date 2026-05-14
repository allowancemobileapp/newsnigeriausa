import { useState } from 'react';
import { motion } from 'motion/react';
import { X, Lock } from 'lucide-react';

interface PasscodeModalProps {
  onSuccess: () => void;
  onClose: () => void;
}

export const PasscodeModal = ({ onSuccess, onClose }: PasscodeModalProps) => {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === '247619') {
      onSuccess();
    } else {
      setError(true);
      setPasscode('');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-8 relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-brand-emerald/10 text-brand-emerald rounded-full flex items-center justify-center mb-4">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-brand-navy mb-2 font-serif">Admin Access</h2>
          <p className="text-xs text-slate-500 mb-6 uppercase tracking-widest font-bold">Enter 6-digit Passcode</p>

          <form onSubmit={handleSubmit} className="w-full">
            <input
              type="password"
              maxLength={6}
              value={passcode}
              onChange={(e) => {
                setPasscode(e.target.value);
                if (error) setError(false);
              }}
              placeholder="••••••"
              className={`w-full text-center text-2xl tracking-[0.5em] font-mono border ${error ? 'border-red-500 focus:border-red-500' : 'border-slate-300 focus:border-brand-emerald'} rounded p-3 mb-4 outline-none transition-colors`}
              autoFocus
            />
            {error && (
              <p className="text-red-500 text-xs font-bold uppercase tracking-widest mb-4">
                Invalid Passcode
              </p>
            )}
            <button
              type="submit"
              className="w-full bg-brand-navy text-white font-bold uppercase tracking-widest text-xs py-4 rounded hover:bg-slate-800 transition-colors"
            >
              Verify & Enter
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};
