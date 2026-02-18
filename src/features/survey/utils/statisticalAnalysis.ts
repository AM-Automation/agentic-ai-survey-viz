import type { TransformedSurveyResponse } from './transformData';

// ===== Helper Functions =====

export function calculateMean(values: (number | null)[]): number {
  const validValues = values.filter((v): v is number => v !== null);
  if (validValues.length === 0) return 0;
  return validValues.reduce((sum, v) => sum + v, 0) / validValues.length;
}

export function calculateMedian(values: (number | null)[]): number {
  const sorted = values.filter((v): v is number => v !== null).sort((a, b) => a - b);
  if (sorted.length === 0) return 0;
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

export function calculateStdDev(values: (number | null)[]): number {
  const valid = values.filter((v): v is number => v !== null);
  if (valid.length === 0) return 0;
  const mean = valid.reduce((s, v) => s + v, 0) / valid.length;
  const variance = valid.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / valid.length;
  return Math.sqrt(variance);
}

export function calculatePercentage(count: number, total: number): number {
  if (total === 0) return 0;
  return (count / total) * 100;
}

export function countBy<T>(
  array: T[],
  key: keyof T
): Record<string, number> {
  return array.reduce((acc, item) => {
    const value = String(item[key]);
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
}

// ===== Inference & Advanced Statistics =====

/**
 * Calculates the p-value for a Pearson correlation r and sample size n.
 * Uses a normal distribution approximation for the t-statistic.
 */
export function calculatePValue(r: number, n: number): number {
  if (n <= 2) return 1;
  const absR = Math.abs(r);
  if (absR >= 1) return 0;

  // t-statistic
  const t = absR * Math.sqrt((n - 2) / (1 - absR * absR));

  // Normal approximation of the t-distribution for CDF
  // (Using a standard approximation for the Error Function)
  const erf = (x: number) => {
    const a1 = 0.254829592;
    const a2 = -0.284496736;
    const a3 = 1.421413741;
    const a4 = -1.453152027;
    const a5 = 1.061405429;
    const p = 0.3275911;
    const sign = x < 0 ? -1 : 1;
    const absX = Math.abs(x);
    const tVal = 1.0 / (1.0 + p * absX);
    const y = 1.0 - (((((a5 * tVal + a4) * tVal) + a3) * tVal + a2) * tVal + a1) * tVal * Math.exp(-absX * absX);
    return sign * y;
  };

  const z = t; // For n > 30, t is very close to z
  return 1 - erf(z / Math.sqrt(2));
}

/**
 * Calculates a 95% confidence interval for a mean.
 * Returns [lower, upper]
 */
export function calculateConfidenceInterval(values: (number | null)[], level = 0.95): [number, number] {
  const valid = values.filter((v): v is number => v !== null);
  if (valid.length === 0) return [0, 0];

  const mean = calculateMean(valid);
  const stdDev = calculateStdDev(valid);
  const n = valid.length;

  // z-score for 95% is 1.96
  const z = level === 0.99 ? 2.576 : 1.96;
  const marginOfError = z * (stdDev / Math.sqrt(n));

  return [mean - marginOfError, mean + marginOfError];
}

/**
 * Calculates boxplot statistics including quartiles and outliers.
 */
export function getBoxplotStats(values: (number | null)[]) {
  const sorted = values.filter((v): v is number => v !== null).sort((a, b) => a - b);
  if (sorted.length === 0) return null;

  const n = sorted.length;
  const min = sorted[0];
  const max = sorted[n - 1];

  const getPercentile = (p: number) => {
    const idx = (n - 1) * p;
    const base = Math.floor(idx);
    const rest = idx - base;
    if (sorted[base + 1] !== undefined) {
      return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
    } else {
      return sorted[base];
    }
  };

  const q1 = getPercentile(0.25);
  const median = getPercentile(0.5);
  const q3 = getPercentile(0.75);

  const iqr = q3 - q1;
  const lowerFence = q1 - 1.5 * iqr;
  const upperFence = q3 + 1.5 * iqr;

  const outliers = sorted.filter(v => v < lowerFence || v > upperFence);

  return {
    min,
    max,
    q1,
    median,
    q3,
    iqr,
    lowerFence,
    upperFence,
    outliers,
    n
  };
}

// ===== Primary Analysis Functions =====

export function getToolAdoptionStats(data: TransformedSurveyResponse[]) {
  const completed = data.filter(r => r.status === 'Completed');
  const total = completed.length;

  const tools: Record<string, { label: string; count: number; percentage: number }> = {
    githubCopilot: { label: 'GitHub Copilot', count: 0, percentage: 0 },
    claudeCode: { label: 'Claude Code', count: 0, percentage: 0 },
    cursor: { label: 'Cursor', count: 0, percentage: 0 },
    windsurf: { label: 'Windsurf', count: 0, percentage: 0 },
    codex: { label: 'OpenAI Codex', count: 0, percentage: 0 },
    gemini: { label: 'Gemini / Antigravity', count: 0, percentage: 0 },
    devin: { label: 'Devin', count: 0, percentage: 0 },
    lovable: { label: 'Lovable', count: 0, percentage: 0 },
    amazonQ: { label: 'Amazon Q', count: 0, percentage: 0 },
  };

  for (const key of Object.keys(tools)) {
    const count = completed.filter(r => r.tools[key as keyof typeof r.tools]).length;
    tools[key].count = count;
    tools[key].percentage = calculatePercentage(count, total);
  }

  return tools;
}

export function getExperienceDistribution(data: TransformedSurveyResponse[]) {
  const completed = data.filter(r => r.status === 'Completed');
  const counts = countBy(completed, 'experience');
  const total = completed.length;

  return Object.entries(counts).map(([experience, count]) => ({
    experience,
    count,
    percentage: calculatePercentage(count, total),
  })).sort((a, b) => b.count - a.count);
}

export function getRoleDistribution(data: TransformedSurveyResponse[]) {
  const completed = data.filter(r => r.status === 'Completed');
  const counts = countBy(completed, 'role');
  const total = completed.length;

  return Object.entries(counts)
    .map(([role, count]) => ({
      role,
      count,
      percentage: calculatePercentage(count, total),
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
}

export function getIndustryDistribution(data: TransformedSurveyResponse[]) {
  const completed = data.filter(r => r.status === 'Completed');
  const counts = countBy(completed, 'industry');
  const total = completed.length;

  return Object.entries(counts)
    .map(([industry, count]) => ({
      industry,
      count,
      percentage: calculatePercentage(count, total),
    }))
    .sort((a, b) => b.count - a.count);
}

export function getSDLCPhaseAverages(data: TransformedSurveyResponse[]) {
  const completed = data.filter(r => r.status === 'Completed');

  const phases = [
    { phase: 'Requirements & Planning', values: completed.map(r => r.sdlcPhases.phase1) },
    { phase: 'System Design', values: completed.map(r => r.sdlcPhases.phase2) },
    { phase: 'Coding & Implementation', values: completed.map(r => r.sdlcPhases.phase3) },
    { phase: 'Testing & QA', values: completed.map(r => r.sdlcPhases.phase4) },
    { phase: 'Deployment', values: completed.map(r => r.sdlcPhases.phase5) },
    { phase: 'Maintenance', values: completed.map(r => r.sdlcPhases.phase6) },
  ];

  return phases.map(p => ({
    phase: p.phase,
    value: calculateMean(p.values),
    median: calculateMedian(p.values),
    stdDev: calculateStdDev(p.values),
    n: p.values.filter(v => v !== null).length,
  }));
}

export function getAIExperienceLevels(data: TransformedSurveyResponse[]) {
  const completed = data.filter(r => r.status === 'Completed');
  const counts = countBy(completed, 'aiExperience');
  const total = completed.length;

  return Object.entries(counts).map(([level, count]) => ({
    level,
    count,
    percentage: calculatePercentage(count, total),
  })).sort((a, b) => b.count - a.count);
}

/**
 * Gets boxplot data for all 6 SDLC phases.
 */
export function getBoxplotDataForSDLC(data: TransformedSurveyResponse[]) {
  const completed = data.filter(r => r.status === 'Completed');
  const phases = [
    { key: 'phase1', label: 'Requirements' },
    { key: 'phase2', label: 'Design' },
    { key: 'phase3', label: 'Coding' },
    { key: 'phase4', label: 'Testing' },
    { key: 'phase5', label: 'Deployment' },
    { key: 'phase6', label: 'Maintenance' },
  ] as const;

  return phases.map(p => {
    const values = completed.map(r => r.sdlcPhases[p.key]).filter((v): v is number => v !== null);
    const stats = getBoxplotStats(values);
    if (!stats) return null;
    return {
      label: p.label,
      ...stats
    };
  }).filter((d): d is NonNullable<typeof d> => d !== null);
}

export function getKeyMetrics(data: TransformedSurveyResponse[]) {
  const completed = data.filter(r => r.status === 'Completed');
  const total = data.length;

  // Active AI Users: includes both "actively use for coding" AND "for technical tasks"
  const activeForCoding = completed.filter(r =>
    r.aiExperience.includes('actively use')
  ).length;
  const activeForTechTasks = completed.filter(r =>
    r.aiExperience.includes('technical tasks')
  ).length;
  const totalActiveUsers = activeForCoding + activeForTechTasks;

  const avgTransformationBelief = calculateMean(
    completed.map(r => r.transformationBelief)
  );

  const avgProductivityChange = calculateMean(
    completed.map(r => r.productivityChange)
  );

  const complianceYes = completed.filter(r => r.compliance === 'yes').length;

  return {
    totalResponses: total,
    completedResponses: completed.length,
    completionRate: calculatePercentage(completed.length, total),
    activeAIUsers: {
      codingOnly: activeForCoding,
      techTasks: activeForTechTasks,
      total: totalActiveUsers,
      percentage: calculatePercentage(totalActiveUsers, completed.length),
    },
    avgTransformationBelief: {
      value: avgTransformationBelief,
      median: calculateMedian(completed.map(r => r.transformationBelief)),
      stdDev: calculateStdDev(completed.map(r => r.transformationBelief)),
      outOf: 10,
    },
    avgProductivityChange: {
      value: avgProductivityChange,
      median: calculateMedian(completed.map(r => r.productivityChange)),
      stdDev: calculateStdDev(completed.map(r => r.productivityChange)),
      outOf: 10,
    },
    complianceEnvironment: {
      count: complianceYes,
      percentage: calculatePercentage(complianceYes, completed.length),
    },
    enterpriseUsers: {
      count: completed.filter(r =>
        r.organizationType.includes('Large enterprise')
      ).length,
      percentage: calculatePercentage(
        completed.filter(r => r.organizationType.includes('Large enterprise')).length,
        completed.length
      ),
    },
  };
}

// ===== Section Analysis Functions =====

export function getQualityStrategyStats(data: TransformedSurveyResponse[]) {
  const completed = data.filter(r => r.status === 'Completed');
  const total = completed.length;

  const strategies = [
    { key: 'manualReview', label: 'Manual Code Reviews' },
    { key: 'automatedTests', label: 'Automated Tests' },
    { key: 'staticAnalysis', label: 'Static Analysis / Linting' },
    { key: 'optimizePrompts', label: 'Prompt Optimization' },
    { key: 'architectureSpecs', label: 'Architecture Specs' },
    { key: 'pairProgramming', label: 'Pair Programming with AI' },
    { key: 'crossCheck', label: 'Cross-Check with 2nd AI' },
  ];

  return strategies.map(s => {
    const count = completed.filter(r => r.qualityStrategies[s.key as keyof typeof r.qualityStrategies]).length;
    return {
      id: s.key,
      label: s.label,
      count,
      percentage: calculatePercentage(count, total),
    };
  }).sort((a, b) => b.percentage - a.percentage);
}

export function getChallengeDistribution(data: TransformedSurveyResponse[]) {
  const completed = data.filter(r => r.status === 'Completed');
  // Challenges are ranked: position in the array = rank (index 0 = most important)
  // We compute a weighted score (rank 1 = 5pts, rank 2 = 4pts, ..., rank 5 = 1pt)
  // and the percentage of respondents who placed each challenge in their top 2
  const challengeScores: Record<string, { totalScore: number; top2Count: number; totalCount: number }> = {};

  for (const r of completed) {
    if (r.challenges.length === 0) continue;
    const totalRanks = r.challenges.length;
    r.challenges.forEach((challenge, index) => {
      const trimmed = challenge.trim();
      if (!trimmed) return;
      if (!challengeScores[trimmed]) {
        challengeScores[trimmed] = { totalScore: 0, top2Count: 0, totalCount: 0 };
      }
      // Weight: rank 1 (index 0) gets highest score
      challengeScores[trimmed].totalScore += (totalRanks - index);
      challengeScores[trimmed].totalCount += 1;
      if (index < 2) {
        challengeScores[trimmed].top2Count += 1;
      }
    });
  }

  const respondentsWithChallenges = completed.filter(r => r.challenges.length > 0).length;

  return Object.entries(challengeScores)
    .map(([challenge, stats]) => ({
      id: challenge,
      label: challenge.length > 50 ? challenge.substring(0, 47) + '...' : challenge,
      fullLabel: challenge,
      count: stats.top2Count,
      // percentage = Top-2 rate: how many respondents ranked this in their top 2
      percentage: calculatePercentage(stats.top2Count, respondentsWithChallenges),
      avgScore: stats.totalScore / stats.totalCount,
      weightedScore: stats.totalScore,
    }))
    .sort((a, b) => b.weightedScore - a.weightedScore);
}

export function getInteractionPatternStats(data: TransformedSurveyResponse[]) {
  const completed = data.filter(r => r.status === 'Completed');
  const counts = countBy(completed, 'interactionPattern');
  const total = completed.length;

  return Object.entries(counts)
    .map(([pattern, count]) => ({
      id: pattern,
      label: pattern.includes('–') ? pattern.split('–')[0].trim() : pattern,
      fullLabel: pattern,
      count,
      percentage: calculatePercentage(count, total),
    }))
    .sort((a, b) => b.count - a.count);
}

export function getCorrectionFrequencyStats(data: TransformedSurveyResponse[]) {
  const completed = data.filter(r => r.status === 'Completed');
  const counts = countBy(completed, 'correctionFrequency');
  const total = completed.length;

  return Object.entries(counts)
    .map(([freq, count]) => ({
      id: freq,
      label: freq,
      count,
      percentage: calculatePercentage(count, total),
    }))
    .sort((a, b) => b.count - a.count);
}

export function getComplianceStats(data: TransformedSurveyResponse[]) {
  const completed = data.filter(r => r.status === 'Completed');
  const total = completed.length;
  const yes = completed.filter(r => r.compliance === 'yes').length;
  const no = completed.filter(r => r.compliance === 'no').length;
  const notSure = completed.filter(r => r.compliance === 'not_sure').length;

  return {
    compliance: {
      yes: { count: yes, percentage: calculatePercentage(yes, total) },
      no: { count: no, percentage: calculatePercentage(no, total) },
      notSure: { count: notSure, percentage: calculatePercentage(notSure, total) },
    },
    regulatoryInfluence: (() => {
      const values = completed.map(r => r.regulatoryInfluence).filter((v): v is number => v !== null);
      const distribution: Record<number, number> = {};
      for (const v of values) {
        distribution[v] = (distribution[v] || 0) + 1;
      }
      return Object.entries(distribution)
        .map(([score, count]) => ({
          score: Number(score),
          count,
          percentage: calculatePercentage(count, values.length),
        }))
        .sort((a, b) => a.score - b.score);
    })(),
    avgRegulatoryInfluence: calculateMean(completed.map(r => r.regulatoryInfluence)),
  };
}

export function getProductivityDistribution(data: TransformedSurveyResponse[]) {
  const completed = data.filter(r => r.status === 'Completed');
  const values = completed.map(r => r.productivityChange).filter((v): v is number => v !== null);
  const distribution: Record<number, number> = {};
  for (const v of values) {
    distribution[v] = (distribution[v] || 0) + 1;
  }
  return Object.entries(distribution)
    .map(([score, count]) => ({
      score: Number(score),
      count,
      percentage: calculatePercentage(count, values.length),
    }))
    .sort((a, b) => a.score - b.score);
}

export function getTransformationDistribution(data: TransformedSurveyResponse[]) {
  const completed = data.filter(r => r.status === 'Completed');
  const values = completed.map(r => r.transformationBelief).filter((v): v is number => v !== null);
  const distribution: Record<number, number> = {};
  for (const v of values) {
    distribution[v] = (distribution[v] || 0) + 1;
  }
  return Object.entries(distribution)
    .map(([score, count]) => ({
      score: Number(score),
      count,
      percentage: calculatePercentage(count, values.length),
    }))
    .sort((a, b) => a.score - b.score);
}

export function getOrganizationTypeStats(data: TransformedSurveyResponse[]) {
  const completed = data.filter(r => r.status === 'Completed');
  const counts = countBy(completed, 'organizationType');
  const total = completed.length;

  return Object.entries(counts)
    .map(([type, count]) => ({
      id: type,
      label: type,
      count,
      percentage: calculatePercentage(count, total),
    }))
    .sort((a, b) => b.count - a.count);
}
