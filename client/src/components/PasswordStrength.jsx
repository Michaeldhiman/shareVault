import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { evaluatePasswordStrength } from '../utils/passwordStrength';
import { ShieldCheck, ShieldAlert, Clock, Info, Check } from 'lucide-react';

const COMMON_PATTERNS = /^(?:password|passw0rd|qwerty|letmein|welcome|admin|iloveyou|123456|123123|111111)/i;
const REPEAT_RUN = /(.)\1{3,}/;

export default function PasswordStrength({ password }) {
  const strength = useMemo(() => evaluatePasswordStrength(password), [password]);

  const rules = useMemo(() => {
    const val = password || '';
    return [
      { id: 'length', label: '12 characters or more', met: val.length >= 12 },
      { id: 'case', label: 'Uppercase & lowercase letters', met: /[a-z]/.test(val) && /[A-Z]/.test(val) },
      { id: 'digit', label: 'At least one number (0-9)', met: /\d/.test(val) },
      { id: 'symbol', label: 'At least one symbol (!@#$...)', met: /[!-/:-@[-`{-~]/.test(val) },
    ];
  }, [password]);

  const isGuessable = useMemo(() => {
    if (!password) return false;
    return COMMON_PATTERNS.test(password) || REPEAT_RUN.test(password);
  }, [password]);

  if (!password) return null;

  const totalSegments = [0, 1, 2, 3, 4];

  return (
    <div className="mt-3 p-3.5 bg-[#0B0C10] border border-white/[0.08] rounded-xl space-y-3 shadow-inner font-sans">
      {/* Strength Label and Crack Time */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 font-bold">
          {strength.score >= 3 ? (
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          ) : (
            <ShieldAlert className={`w-4 h-4 ${strength.textColor}`} />
          )}
          <span className={strength.textColor}>{strength.label}</span>
          {isGuessable && (
            <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
              Common Pattern
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>Crack time: {strength.crackTime}</span>
        </div>
      </div>

      {/* 5-segment Strength Bar with Framer Motion spring scaling */}
      <div className="grid grid-cols-5 gap-1.5 h-1.5">
        {totalSegments.map((index) => (
          <div
            key={index}
            className="h-full rounded-full bg-white/10 overflow-hidden relative"
          >
            <motion.div
              initial={false}
              animate={{ scaleX: index <= strength.score ? 1 : 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className={`absolute inset-0 origin-left rounded-full ${
                index <= strength.score ? strength.barColor : 'bg-transparent'
              }`}
            />
          </div>
        ))}
      </div>

      {/* Live Requirement Rules Checklist */}
      <div className="pt-1">
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px]">
          {rules.map((rule) => (
            <li key={rule.id} className="flex items-center gap-1.5">
              <span
                className={`w-3.5 h-3.5 rounded flex items-center justify-center border transition-colors ${
                  rule.met
                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                    : 'bg-white/[0.04] border-white/10 text-slate-500'
                }`}
              >
                {rule.met ? <Check className="w-2.5 h-2.5" /> : <div className="w-1 h-1 rounded-full bg-slate-500" />}
              </span>
              <span className={rule.met ? 'text-slate-200 font-medium' : 'text-slate-400'}>
                {rule.label}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Suggestions / Feedback */}
      {strength.feedback.length > 0 && (
        <div className="pt-1.5 border-t border-white/[0.06] text-[11px]">
          <ul className="space-y-1">
            {strength.feedback.map((item, idx) => (
              <li key={idx} className="flex items-start gap-1.5 text-amber-400/90 leading-tight">
                <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-400" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
