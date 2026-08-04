import zxcvbn from 'zxcvbn';

/**
 * Visual configuration lookup for zxcvbn scores (0 to 4).
 */
const SCORE_CONFIG = {
  0: { label: 'Very Weak', barColor: 'bg-rose-500', textColor: 'text-rose-400' },
  1: { label: 'Weak', barColor: 'bg-amber-500', textColor: 'text-amber-400' },
  2: { label: 'Fair', barColor: 'bg-yellow-500', textColor: 'text-yellow-400' },
  3: { label: 'Good', barColor: 'bg-blue-500', textColor: 'text-blue-400' },
  4: { label: 'Strong', barColor: 'bg-emerald-500', textColor: 'text-emerald-400' },
};

/**
 * Evaluates password strength using industry-standard zxcvbn algorithm.
 *
 * @param {string} password - The password string to test
 * @returns {object} { score, label, barColor, textColor, feedback, crackTime }
 */
export const evaluatePasswordStrength = (password) => {
  if (!password) {
    return {
      score: 0,
      label: 'Very Weak',
      barColor: 'bg-slate-800',
      textColor: 'text-slate-500',
      feedback: [],
      crackTime: 'Instant',
    };
  }

  // Run zxcvbn estimation
  const result = zxcvbn(password);
  const score = result.score;
  const config = SCORE_CONFIG[score] || SCORE_CONFIG[0];

  // Combine zxcvbn warning and suggestions into a feedback array
  const suggestions = result.feedback.suggestions || [];
  const warning = result.feedback.warning;
  const feedback = warning ? [warning, ...suggestions] : suggestions;

  // Extract human-readable offline crack time
  const crackTime = result.crack_times_display?.offline_slow_hashing_1e4_per_second || 'Instant';

  return {
    score,
    label: config.label,
    barColor: config.barColor,
    textColor: config.textColor,
    feedback,
    crackTime,
  };
};
