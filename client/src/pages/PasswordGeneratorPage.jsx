import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '../layouts/DashboardLayout';
import Button from '../components/ui/Button';
import Toast from '../components/ui/Toast';
import Card from '../components/ui/Card';
import { Sparkles, Copy, RefreshCw, KeyRound, Check, History, ShieldCheck } from 'lucide-react';

export default function PasswordGeneratorPage() {
  const [length, setLength] = useState(18);
  const [includeUpper, setIncludeUpper] = useState(true);
  const [includeLower, setIncludeLower] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);

  const [password, setPassword] = useState('');
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [history, setHistory] = useState([]);
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
      const updated = [result, ...prev].slice(0, 10);
      return updated;
    });
  }, [length, includeUpper, includeLower, includeNumbers, includeSymbols]);

  useEffect(() => {
    generatePassword();
  }, [generatePassword]);

  const handleCopy = (val, keyIdx = 'main') => {
    if (!val) return;
    navigator.clipboard.writeText(val);
    setCopiedIndex(keyIdx);
    triggerToast('Password copied to clipboard');
    setTimeout(() => setCopiedIndex(null), 2000);
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

  const getEntropyRating = (bits) => {
    if (bits < 40) return { label: 'Very Weak', color: 'text-rose-400', barColor: 'bg-rose-500' };
    if (bits < 60) return { label: 'Weak', color: 'text-amber-400', barColor: 'bg-amber-500' };
    if (bits < 80) return { label: 'Moderate', color: 'text-[var(--sv-info)]', barColor: 'bg-[var(--sv-info)]' };
    return { label: 'High Entropy / Secure', color: 'text-[var(--sv-accent)]', barColor: 'bg-[var(--sv-accent)]' };
  };

  const rating = getEntropyRating(entropyBits);

  return (
    <DashboardLayout>
      <div className="space-y-6 pb-12 font-sans">
        {/* Title Header */}
        <div className="border-b border-[var(--sv-border)] pb-5">
          <span className="text-[10px] font-bold text-[var(--sv-text-secondary)] uppercase tracking-widest font-mono">
            Cryptographic Seed Engine
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[var(--sv-text-primary)] tracking-tight mt-1 font-sans">
            Password Generator
          </h1>
          <p className="text-xs text-[var(--sv-text-muted)] mt-0.5">
            Generate cryptographically secure, high-entropy passwords directly in client browser memory.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Settings & Controls (Left 2-Columns) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Generated Password Box */}
            <Card className="p-5 flex flex-col justify-between backdrop-blur-md">
              <div 
                className="bg-[var(--sv-bg)] border border-[var(--sv-border)] rounded-xl p-4 flex items-center justify-between shadow-inner"
                aria-live="polite"
              >
                <span className="font-mono text-base sm:text-lg font-bold text-[var(--sv-text-primary)] tracking-wider truncate pr-4 select-all">
                  {password || 'Select parameters'}
                </span>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={generatePassword}
                    className="p-2 text-[var(--sv-text-secondary)] hover:text-[var(--sv-text-primary)] rounded-lg hover:bg-[var(--sv-border-hover)] border border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sv-accent)]/40"
                    title="Regenerate"
                    aria-label="Regenerate Password"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>

                  <Button
                    size="sm"
                    variant="primary"
                    icon={copiedIndex === 'main' ? Check : Copy}
                    onClick={() => handleCopy(password, 'main')}
                    className="text-xs py-2 px-3 shadow-md"
                  >
                    {copiedIndex === 'main' ? 'Copied' : 'Copy'}
                  </Button>
                </div>
              </div>

              {/* Entropy and Strength indicators */}
              <div className="mt-4 grid grid-cols-2 gap-4 border-t border-[var(--sv-border)] pt-4">
                <div>
                  <div className="text-[9px] uppercase tracking-wider text-[var(--sv-text-secondary)] font-mono font-bold mb-1">
                    Strength Level
                  </div>
                  <span className={`text-xs font-bold ${rating.color}`}>
                    {rating.label}
                  </span>
                </div>

                <div>
                  <div className="text-[9px] uppercase tracking-wider text-[var(--sv-text-secondary)] font-mono font-bold mb-1">
                    Entropy Score
                  </div>
                  <span className="text-xs font-bold text-[var(--sv-text-primary)] font-mono">
                    {entropyBits} bits
                  </span>
                </div>
              </div>

              {/* Strength indicator progress scale bar */}
              <div 
                className="w-full bg-[var(--sv-bg)] h-1.5 rounded-full overflow-hidden mt-3 border border-[var(--sv-border)]"
                role="meter"
                aria-valuenow={entropyBits}
                aria-valuemin="0"
                aria-valuemax="128"
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (entropyBits / 128) * 100)}%` }}
                  transition={{ duration: 0.3 }}
                  className={`h-full ${rating.barColor}`}
                />
              </div>
            </Card>

            {/* Parameter Options */}
            <Card className="p-5 space-y-5 backdrop-blur-md">
              <h3 className="text-xs font-bold text-[var(--sv-text-secondary)] uppercase tracking-wider font-sans">
                Configuration Parameters
              </h3>

              {/* Length Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <label htmlFor="password-length" className="text-[var(--sv-text-secondary)] font-semibold">Password Length</label>
                  <span className="font-mono text-[var(--sv-accent)] font-bold bg-[var(--sv-accent-soft)] border border-[var(--sv-accent)]/20 px-2.5 py-0.5 rounded-md">
                    {length} characters
                  </span>
                </div>
                <input
                  id="password-length"
                  type="range"
                  min="8"
                  max="64"
                  value={length}
                  onChange={(e) => setLength(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-[var(--sv-bg)] rounded-lg appearance-none cursor-pointer accent-[var(--sv-accent)] border border-[var(--sv-border)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sv-accent)]/40"
                />
              </div>

              {/* Option Toggles grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <label htmlFor="include-upper" className="flex items-center gap-3 bg-[var(--sv-bg)] p-3 rounded-xl border border-[var(--sv-border)] cursor-pointer hover:border-[var(--sv-border-hover)] transition-colors focus-within:ring-2 focus-within:ring-[var(--sv-accent)]/40">
                  <input
                    id="include-upper"
                    type="checkbox"
                    checked={includeUpper}
                    onChange={(e) => setIncludeUpper(e.target.checked)}
                    className="rounded bg-[var(--sv-surface)] border-[var(--sv-border)] text-[var(--sv-accent)] focus:ring-0 w-4 h-4 cursor-pointer"
                  />
                  <div>
                    <p className="font-bold text-[var(--sv-text-primary)]">Uppercase</p>
                    <p className="text-[10px] text-[var(--sv-text-muted)] font-mono">A-Z characters</p>
                  </div>
                </label>

                <label htmlFor="include-lower" className="flex items-center gap-3 bg-[var(--sv-bg)] p-3 rounded-xl border border-[var(--sv-border)] cursor-pointer hover:border-[var(--sv-border-hover)] transition-colors focus-within:ring-2 focus-within:ring-[var(--sv-accent)]/40">
                  <input
                    id="include-lower"
                    type="checkbox"
                    checked={includeLower}
                    onChange={(e) => setIncludeLower(e.target.checked)}
                    className="rounded bg-[var(--sv-surface)] border-[var(--sv-border)] text-[var(--sv-accent)] focus:ring-0 w-4 h-4 cursor-pointer"
                  />
                  <div>
                    <p className="font-bold text-[var(--sv-text-primary)]">Lowercase</p>
                    <p className="text-[10px] text-[var(--sv-text-muted)] font-mono">a-z characters</p>
                  </div>
                </label>

                <label htmlFor="include-numbers" className="flex items-center gap-3 bg-[var(--sv-bg)] p-3 rounded-xl border border-[var(--sv-border)] cursor-pointer hover:border-[var(--sv-border-hover)] transition-colors focus-within:ring-2 focus-within:ring-[var(--sv-accent)]/40">
                  <input
                    id="include-numbers"
                    type="checkbox"
                    checked={includeNumbers}
                    onChange={(e) => setIncludeNumbers(e.target.checked)}
                    className="rounded bg-[var(--sv-surface)] border-[var(--sv-border)] text-[var(--sv-accent)] focus:ring-0 w-4 h-4 cursor-pointer"
                  />
                  <div>
                    <p className="font-bold text-[var(--sv-text-primary)]">Numbers</p>
                    <p className="text-[10px] text-[var(--sv-text-muted)] font-mono">0-9 integers</p>
                  </div>
                </label>

                <label htmlFor="include-symbols" className="flex items-center gap-3 bg-[var(--sv-bg)] p-3 rounded-xl border border-[var(--sv-border)] cursor-pointer hover:border-[var(--sv-border-hover)] transition-colors focus-within:ring-2 focus-within:ring-[var(--sv-accent)]/40">
                  <input
                    id="include-symbols"
                    type="checkbox"
                    checked={includeSymbols}
                    onChange={(e) => setIncludeSymbols(e.target.checked)}
                    className="rounded bg-[var(--sv-surface)] border-[var(--sv-border)] text-[var(--sv-accent)] focus:ring-0 w-4 h-4 cursor-pointer"
                  />
                  <div>
                    <p className="font-bold text-[var(--sv-text-primary)]">Symbols</p>
                    <p className="text-[10px] text-[var(--sv-text-muted)] font-mono">!@#$ specials</p>
                  </div>
                </label>
              </div>
            </Card>
          </div>

          {/* Session History Log (Right Column) */}
          <div className="lg:col-span-1 space-y-4">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-[var(--sv-text-secondary)]" />
              <h3 className="text-xs font-bold text-[var(--sv-text-secondary)] uppercase tracking-wider font-sans">
                Session Log
              </h3>
            </div>

            <Card className="p-4.5 backdrop-blur-md space-y-3">
              <p className="text-[10px] text-[var(--sv-text-muted)] leading-normal">
                History is stored in volatile browser memory during active session only.
              </p>

              <ul className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                {history.length > 1 ? (
                  history.slice(1).map((val, idx) => (
                    <li
                      key={idx}
                      className="flex items-center justify-between bg-[var(--sv-bg)] border border-[var(--sv-border)] rounded-xl p-2.5 text-xs"
                    >
                      <span className="font-mono text-[var(--sv-text-primary)] truncate pr-2 select-all">
                        {val}
                      </span>
                      <button
                        onClick={() => handleCopy(val, idx)}
                        className="text-[var(--sv-text-secondary)] hover:text-[var(--sv-text-primary)] p-1 hover:bg-[var(--sv-border-hover)] rounded-md transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sv-accent)]/40"
                        title="Copy password"
                      >
                        {copiedIndex === idx ? (
                          <Check className="w-3.5 h-3.5 text-[var(--sv-accent)]" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </li>
                  ))
                ) : (
                  <p className="text-xs text-[var(--sv-text-muted)] py-4 text-center">No prior passwords generated.</p>
                )}
              </ul>
            </Card>
          </div>
        </div>
      </div>

      <Toast isVisible={!!toastMessage} message={toastMessage} type="success" />
    </DashboardLayout>
  );
}
