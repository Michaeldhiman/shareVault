import React, { useState, useEffect, useCallback } from 'react';
import { X, Copy, Check, RefreshCw, Sparkles } from 'lucide-react';
import PasswordStrength from './PasswordStrength';

export default function PasswordGeneratorModal({ onClose, onUsePassword }) {
  const [length, setLength] = useState(16);
  const [includeUpper, setIncludeUpper] = useState(true);
  const [includeLower, setIncludeLower] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);

  const generatePassword = useCallback(() => {
    let chars = '';
    if (includeUpper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeLower) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (includeNumbers) chars += '0123456789';
    if (includeSymbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';

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
  }, [length, includeUpper, includeLower, includeNumbers, includeSymbols]);

  useEffect(() => {
    generatePassword();
  }, [generatePassword]);

  const handleCopy = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 max-w-md w-full rounded-2xl p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-500 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-purple-600/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Password Generator</h3>
            <p className="text-xs text-slate-400">
              Cryptographically secure uniform random generator
            </p>
          </div>
        </div>

        {/* Generated Password Result */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex items-center justify-between mb-3">
          <span className="font-mono text-base font-semibold text-white tracking-wider truncate pr-2">
            {password || 'Select options'}
          </span>
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={generatePassword}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              title="Regenerate"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={handleCopy}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              title="Copy"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Strength Indicator */}
        <div className="mb-4">
          <PasswordStrength password={password} />
        </div>

        {/* Controls */}
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center text-xs font-semibold uppercase text-slate-400 mb-2">
              <span>Length</span>
              <span className="font-mono text-blue-400 text-sm">{length}</span>
            </div>
            <input
              type="range"
              min="8"
              max="64"
              value={length}
              onChange={(e) => setLength(parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <label className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={includeUpper}
                onChange={(e) => setIncludeUpper(e.target.checked)}
                className="rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-0"
              />
              <span className="text-slate-300">Uppercase (A-Z)</span>
            </label>

            <label className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={includeLower}
                onChange={(e) => setIncludeLower(e.target.checked)}
                className="rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-0"
              />
              <span className="text-slate-300">Lowercase (a-z)</span>
            </label>

            <label className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={includeNumbers}
                onChange={(e) => setIncludeNumbers(e.target.checked)}
                className="rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-0"
              />
              <span className="text-slate-300">Numbers (0-9)</span>
            </label>

            <label className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={includeSymbols}
                onChange={(e) => setIncludeSymbols(e.target.checked)}
                className="rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-0"
              />
              <span className="text-slate-300">Symbols (!@#$)</span>
            </label>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:bg-slate-800 transition-colors"
          >
            Close
          </button>
          {onUsePassword && (
            <button
              type="button"
              onClick={() => {
                onUsePassword(password);
                onClose();
              }}
              className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-medium transition-colors shadow-lg shadow-purple-600/20"
            >
              Use This Password
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
