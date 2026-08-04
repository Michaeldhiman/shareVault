import React, { useMemo } from 'react';
import { evaluatePasswordStrength } from '../utils/passwordStrength';
import { ShieldCheck, ShieldAlert, Clock, Info } from 'lucide-react';

/**
 * Reusable Password Strength Component
 * Accepts `password` prop and displays zxcvbn evaluation UI.
 */
export default function PasswordStrength({ password }) {
  const strength = useMemo(() => evaluatePasswordStrength(password), [password]);

  if (!password) return null;

  const totalSegments = [0, 1, 2, 3, 4];

  return (
    <div className="mt-3 p-3.5 bg-slate-950/80 border border-slate-800/80 rounded-xl space-y-2.5 shadow-inner">
      {/* Strength Label and Crack Time */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 font-bold">
          {strength.score >= 3 ? (
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          ) : (
            <ShieldAlert className={`w-4 h-4 ${strength.textColor}`} />
          )}
          <span className={strength.textColor}>{strength.label}</span>
        </div>

        <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
          <Clock className="w-3 h-3 text-slate-500" />
          <span>Crack time: {strength.crackTime}</span>
        </div>
      </div>

      {/* 5-segment Strength Bar */}
      <div className="grid grid-cols-5 gap-1.5 h-1.5">
        {totalSegments.map((index) => (
          <div
            key={index}
            className={`h-full rounded-full transition-all duration-300 ${
              index <= strength.score ? strength.barColor : 'bg-slate-800'
            }`}
          />
        ))}
      </div>

      {/* Suggestions / Feedback */}
      <div className="pt-1 text-[11px]">
        {strength.feedback.length > 0 ? (
          <ul className="space-y-1">
            {strength.feedback.map((item, idx) => (
              <li key={idx} className="flex items-start gap-1.5 text-amber-400/90 leading-tight">
                <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-400" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-emerald-400/90 flex items-center gap-1.5 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
            <span>Great! This password is strong.</span>
          </p>
        )}
      </div>
    </div>
  );
}
