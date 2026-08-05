import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '../layouts/DashboardLayout';
import PasswordStrength from '../components/PasswordStrength';
import Button from '../components/ui/Button';
import Toast from '../components/ui/Toast';
import { Sparkles, Copy, RefreshCw, KeyRound, Check, HelpCircle, History } from 'lucide-react';

export default function PasswordGeneratorPage() {
  const [length, setLength] = useState(18);
  const [includeUpper, setIncludeUpper] = useState(true);
  const [includeLower, setIncludeLower] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  
  const [password, setPassword] = useState('');
  const [history, setHistory] = useState([]); // In-memory session history log
  const [toastMessage, setToastMessage] = useState(null);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Generate cryptographically secure uniform random values
  const generatePassword = useCallback(() => {
    let chars = '';
    let poolSize = 0;
    if (includeUpper) { chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'; poolSize += 26; }
    if (includeLower) { chars += 'abcdefghijklmnopqrstuvwxyz'; poolSize += 26; }
    if (includeNumbers) { chars += '0123456789'; poolSize += 10; }
    if (includeSymbols) { chars += '!@#$%^&*()_+-=[]{}|;:,.<>?'; poolSize += 26; }

    if (!chars) {
      setPassword('');
      return;
    }

    const randomValues = new Uint32Array(length);
    window.crypto.getRandomValues(randomValues);

    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars[randomValues[i] % chars.length];
    }

    setPassword(result);

    // Save to local in-memory session history
    setHistory((prev) => {
      const updated = [result, ...prev].slice(0, 10); // Keep last 10 generated items
      return updated;
    });
  }, [length, includeUpper, includeLower, includeNumbers, includeSymbols]);

  useEffect(() => {
    generatePassword();
  }, [generatePassword]);

  const handleCopy = (val) => {
    if (!val) return;
    navigator.clipboard.writeText(val);
    triggerToast('Password copied to clipboard');
  };

  // Calculate bits of entropy: E = L * log2(R)
  const calculateEntropy = () => {
    let poolSize = 0;
    if (includeUpper) poolSize += 26;
    if (includeLower) poolSize += 26;
    if (includeNumbers) poolSize += 10;
    if (includeSymbols) poolSize += 26;

    if (poolSize === 0 || length === 0) return 0;
    const entropy = length * Math.log2(poolSize);
    return Math.round(entropy);
  };

  const entropyBits = calculateEntropy();

  // Get qualitative rating for entropy
  const getEntropyRating = (bits) => {
    if (bits < 40) return { label: 'Very Weak', color: 'text-rose-400', barColor: 'bg-rose-500' };
    if (bits < 60) return { label: 'Weak', color: 'text-amber-400', barColor: 'bg-amber-500' };
    if (bits < 80) return { label: 'Moderate', color: 'text-blue-400', barColor: 'bg-blue-500' };
    return { label: 'Strong / High Entropy', color: 'text-emerald-400', barColor: 'bg-emerald-500' };
  };

  const rating = getEntropyRating(entropyBits);

  return (
    <DashboardLayout>
      <div className="space-y-8 pb-12">
        {/* Title Header */}
        <div className="border-b border-[#242433] pb-5">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">
            Cryptographic Key Engine
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mt-1 font-heading">
            Password Generator
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Create strong keys locally using uniform random cryptographical seed generators.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Settings & Controls (Left 2-Columns) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Generated Password Box */}
            <div className="bg-[#151521]/60 border border-[#242433] rounded-2xl p-5 shadow-lg flex flex-col justify-between backdrop-blur-md">
              <div className="bg-slate-950 border border-slate-900 rounded-xl p-4.5 flex items-center justify-between shadow-inner">
                <span className="font-mono text-base sm:text-lg font-bold text-white tracking-wider truncate pr-4 select-all">
                  {password || 'Select parameters'}
                </span>
                
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={generatePassword}
                    className="p-2.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-colors"
                    title="Regenerate"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                  
                  <Button
                    size="sm"
                    variant="primary"
                    icon={Copy}
                    onClick={() => handleCopy(password)}
                    className="text-xs py-2 px-3 shadow-md"
                  >
                    Copy
                  </Button>
                </div>
              </div>

              {/* Entropy and Strength indicators */}
              <div className="mt-4 grid grid-cols-2 gap-4 border-t border-slate-900 pt-4">
                <div>
                  <div className="text-[9px] uppercase tracking-wider text-slate-500 font-mono font-bold mb-1">
                    Strength Level
                  </div>
                  <span className={`text-xs font-bold ${rating.color}`}>
                    {rating.label}
                  </span>
                </div>
                
                <div>
                  <div className="text-[9px] uppercase tracking-wider text-slate-500 font-mono font-bold mb-1">
                    Entropy Score
                  </div>
                  <span className="text-xs font-bold text-white font-mono">
                    {entropyBits} bits
                  </span>
                </div>
              </div>

              {/* Strength indicator progress scale bar */}
              <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden mt-3 border border-[#242433]">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (entropyBits / 128) * 100)}%` }}
                  transition={{ duration: 0.3 }}
                  className={`h-full ${rating.barColor}`}
                />
              </div>
            </div>

            {/* Parameter Options */}
            <div className="bg-[#151521]/60 border border-[#242433] rounded-2xl p-5 shadow-lg space-y-5 backdrop-blur-md">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-heading">
                Configuration Parameters
              </h3>

              {/* Length Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-semibold">Password Length</span>
                  <span className="font-mono text-blue-400 font-bold bg-blue-500/10 border border-blue-500/20 px-2.5 py-0.5 rounded-md">
                    {length} characters
                  </span>
                </div>
                <input
                  type="range"
                  min="8"
                  max="64"
                  value={length}
                  onChange={(e) => setLength(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-blue-500 border border-[#242433]"
                />
              </div>

              {/* Option Toggles grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <label className="flex items-center gap-3 bg-slate-950/40 p-3 rounded-xl border border-[#242433] cursor-pointer hover:border-slate-800 transition-colors">
                  <input
                    type="checkbox"
                    checked={includeUpper}
                    onChange={(e) => setIncludeUpper(e.target.checked)}
                    className="rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-0 w-4 h-4"
                  />
                  <div>
                    <p className="font-bold text-slate-200">Uppercase</p>
                    <p className="text-[9px] text-slate-500 font-mono">A-Z characters</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 bg-slate-950/40 p-3 rounded-xl border border-[#242433] cursor-pointer hover:border-slate-800 transition-colors">
                  <input
                    type="checkbox"
                    checked={includeLower}
                    onChange={(e) => setIncludeLower(e.target.checked)}
                    className="rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-0 w-4 h-4"
                  />
                  <div>
                    <p className="font-bold text-slate-200">Lowercase</p>
                    <p className="text-[9px] text-slate-500 font-mono">a-z characters</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 bg-slate-950/40 p-3 rounded-xl border border-[#242433] cursor-pointer hover:border-slate-800 transition-colors">
                  <input
                    type="checkbox"
                    checked={includeNumbers}
                    onChange={(e) => setIncludeNumbers(e.target.checked)}
                    className="rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-0 w-4 h-4"
                  />
                  <div>
                    <p className="font-bold text-slate-200">Numbers</p>
                    <p className="text-[9px] text-slate-500 font-mono">0-9 integers</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 bg-slate-950/40 p-3 rounded-xl border border-[#242433] cursor-pointer hover:border-slate-800 transition-colors">
                  <input
                    type="checkbox"
                    checked={includeSymbols}
                    onChange={(e) => setIncludeSymbols(e.target.checked)}
                    className="rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-0 w-4 h-4"
                  />
                  <div>
                    <p className="font-bold text-slate-200">Symbols</p>
                    <p className="text-[9px] text-slate-500 font-mono">!@#$ specials</p>
                  </div>
                </label>
              </div>
            </div>

          </div>

          {/* Session History Log (Right Column) */}
          <div className="lg:col-span-1 space-y-4">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-slate-500" />
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-heading">
                Session History
              </h3>
            </div>

            <div className="bg-[#151521]/60 border border-[#242433] rounded-2xl p-4.5 shadow-lg backdrop-blur-md space-y-3">
              <p className="text-[9px] text-slate-500 leading-normal">
                History is preserved in-memory for the current browser session. It is purged automatically when the tab is closed or locked.
              </p>
              
              <ul className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                {history.length > 1 ? (
                  history.slice(1).map((val, idx) => (
                    <li
                      key={idx}
                      className="flex items-center justify-between bg-slate-950/40 border border-slate-900 rounded-lg p-2 text-xs"
                    >
                      <span className="font-mono text-slate-300 truncate pr-2 select-all">
                        {val}
                      </span>
                      <button
                        onClick={() => handleCopy(val)}
                        className="text-slate-400 hover:text-white p-1 hover:bg-slate-900 rounded-md transition-colors shrink-0"
                        title="Copy password"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </li>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 py-4 text-center">No prior passwords generated.</p>
                )}
              </ul>
            </div>
          </div>

        </div>
      </div>

      <Toast isVisible={!!toastMessage} message={toastMessage} type="success" />
    </DashboardLayout>
  );
}
