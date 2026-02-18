import type { TransformedSurveyResponse } from './transformData';
import { calculateMean, calculateMedian, calculatePercentage, calculatePValue } from './statisticalAnalysis';

// ===== Composite Index Calculations =====

/** Adoption Index: number of tools adopted (0-9) */
function getAdoptionIndex(r: TransformedSurveyResponse): number {
    return Object.values(r.tools).filter(Boolean).length;
}

/** Quality Strategy Coverage: number of strategies used (0-7) */
function getQualityCoverage(r: TransformedSurveyResponse): number {
    return Object.values(r.qualityStrategies).filter(Boolean).length;
}

/** SDLC Maturity Score: average of all 6 SDLC phase ratings */
function getSDLCMaturity(r: TransformedSurveyResponse): number | null {
    const vals = Object.values(r.sdlcPhases).filter((v): v is number => v !== null);
    if (vals.length === 0) return null;
    return vals.reduce((s, v) => s + v, 0) / vals.length;
}

/** Transformation Readiness Index: weighted composite */
function getTransformationReadiness(r: TransformedSurveyResponse): number | null {
    const belief = r.transformationBelief;
    const productivity = r.productivityChange;
    if (belief === null || productivity === null) return null;
    const complianceScore = r.compliance === 'yes' ? 1 : r.compliance === 'not_sure' ? 0.5 : 0;
    // Weighted: 40% belief + 40% productivity + 20% compliance confidence
    return (belief * 0.4) + (productivity * 0.4) + (complianceScore * 10 * 0.2);
}

// ===== Cross-Analysis Functions =====

/** Experience × Productivity: How does productivity change vary by experience level? */
export function getExperienceVsProductivity(data: TransformedSurveyResponse[]) {
    const completed = data.filter(r => r.status === 'Completed');
    const groups: Record<string, number[]> = {};

    for (const r of completed) {
        if (r.productivityChange === null) continue;
        const exp = r.experience || 'Unknown';
        if (!groups[exp]) groups[exp] = [];
        groups[exp].push(r.productivityChange);
    }

    return Object.entries(groups).map(([experience, values]) => ({
        experience,
        avgProductivity: calculateMean(values),
        medianProductivity: calculateMedian(values),
        count: values.length,
    })).sort((a, b) => {
        const order = ['< 2 years', '2–5 years', '6–10 years', '> 10 years'];
        return order.indexOf(a.experience) - order.indexOf(b.experience);
    });
}

/** Interaction Pattern × Correction Frequency: Which interaction style needs the fewest corrections? */
export function getInteractionVsCorrection(data: TransformedSurveyResponse[]) {
    const completed = data.filter(r => r.status === 'Completed' && r.interactionPattern && r.correctionFrequency);

    const matrix: Record<string, Record<string, number>> = {};

    for (const r of completed) {
        const pattern = r.interactionPattern.includes('–')
            ? r.interactionPattern.split('–')[0].trim()
            : r.interactionPattern;
        const freq = r.correctionFrequency;
        if (!matrix[pattern]) matrix[pattern] = {};
        matrix[pattern][freq] = (matrix[pattern][freq] || 0) + 1;
    }

    return Object.entries(matrix).map(([pattern, freqs]) => {
        const total = Object.values(freqs).reduce((s, c) => s + c, 0);
        return {
            pattern,
            frequencies: Object.entries(freqs).map(([freq, count]) => ({
                frequency: freq,
                count,
                percentage: calculatePercentage(count, total),
            })),
            total,
        };
    }).sort((a, b) => b.total - a.total);
}

/** Compliance × Productivity: Does regulatory compliance impact productivity gains? */
export function getComplianceVsProductivity(data: TransformedSurveyResponse[]) {
    const completed = data.filter(r => r.status === 'Completed' && r.productivityChange !== null);

    const groups = {
        yes: completed.filter(r => r.compliance === 'yes'),
        no: completed.filter(r => r.compliance === 'no'),
        not_sure: completed.filter(r => r.compliance === 'not_sure'),
    };

    return Object.entries(groups).map(([compliance, respondents]) => ({
        compliance: compliance === 'yes' ? 'Regulated' : compliance === 'no' ? 'Not Regulated' : 'Unsure',
        avgProductivity: calculateMean(respondents.map(r => r.productivityChange)),
        medianProductivity: calculateMedian(respondents.map(r => r.productivityChange)),
        avgTransformation: calculateMean(respondents.map(r => r.transformationBelief)),
        count: respondents.length,
    }));
}

/** Tool Overlap Matrix: Which tools are used together? (9×9 co-occurrence) */
export function getToolOverlapMatrix(data: TransformedSurveyResponse[]) {
    const completed = data.filter(r => r.status === 'Completed');
    const toolKeys = Object.keys(completed[0]?.tools || {}) as Array<keyof TransformedSurveyResponse['tools']>;

    const toolLabels: Record<string, string> = {
        githubCopilot: 'Copilot',
        cursor: 'Cursor',
        codex: 'Codex',
        claudeCode: 'Claude',
        windsurf: 'Windsurf',
        gemini: 'Gemini',
        devin: 'Devin',
        lovable: 'Lovable',
        amazonQ: 'Amazon Q',
    };

    const matrix: Array<{ tool1: string; tool2: string; count: number; percentage: number }> = [];

    for (let i = 0; i < toolKeys.length; i++) {
        for (let j = 0; j < toolKeys.length; j++) {
            const count = completed.filter(r =>
                r.tools[toolKeys[i]] && r.tools[toolKeys[j]]
            ).length;
            matrix.push({
                tool1: toolLabels[toolKeys[i]] || toolKeys[i],
                tool2: toolLabels[toolKeys[j]] || toolKeys[j],
                count,
                percentage: calculatePercentage(count, completed.length),
            });
        }
    }

    return { matrix, labels: toolKeys.map(k => toolLabels[k] || k) };
}

/** Tool Count × Productivity: More tools = more productive? */
export function getToolCountVsProductivity(data: TransformedSurveyResponse[]) {
    const completed = data.filter(r => r.status === 'Completed' && r.productivityChange !== null);

    const groups: Record<number, number[]> = {};
    for (const r of completed) {
        const count = getAdoptionIndex(r);
        if (!groups[count]) groups[count] = [];
        groups[count].push(r.productivityChange!);
    }

    return Object.entries(groups)
        .map(([toolCount, values]) => ({
            toolCount: Number(toolCount),
            avgProductivity: calculateMean(values),
            medianProductivity: calculateMedian(values),
            respondents: values.length,
        }))
        .sort((a, b) => a.toolCount - b.toolCount);
}

/** Composite Indices: Calculate all four composite scores and their distributions */
export function getCompositeIndices(data: TransformedSurveyResponse[]) {
    const completed = data.filter(r => r.status === 'Completed');

    const adoptionValues = completed.map(getAdoptionIndex);
    const qualityValues = completed.map(getQualityCoverage);
    const sdlcValues = completed.map(getSDLCMaturity).filter((v): v is number => v !== null);
    const readinessValues = completed.map(getTransformationReadiness).filter((v): v is number => v !== null);

    const buildDistribution = (values: number[], maxBucket?: number) => {
        const dist: Record<number, number> = {};
        for (const v of values) {
            const bucket = maxBucket ? Math.round(v) : v;
            dist[bucket] = (dist[bucket] || 0) + 1;
        }
        return Object.entries(dist)
            .map(([score, count]) => ({
                score: Number(score),
                count,
                percentage: calculatePercentage(count, values.length),
            }))
            .sort((a, b) => a.score - b.score);
    };

    return {
        adoptionIndex: {
            mean: calculateMean(adoptionValues),
            median: calculateMedian(adoptionValues),
            distribution: buildDistribution(adoptionValues),
        },
        qualityCoverage: {
            mean: calculateMean(qualityValues),
            median: calculateMedian(qualityValues),
            distribution: buildDistribution(qualityValues),
        },
        sdlcMaturity: {
            mean: calculateMean(sdlcValues),
            median: calculateMedian(sdlcValues),
            distribution: buildDistribution(sdlcValues, 10),
        },
        transformationReadiness: {
            mean: calculateMean(readinessValues),
            median: calculateMedian(readinessValues),
            distribution: buildDistribution(readinessValues, 10),
        },
    };
}

/** Correlation Matrix: Pearson correlation between all numeric variables */
export function getCorrelationMatrix(data: TransformedSurveyResponse[]) {
    const completed = data.filter(r => r.status === 'Completed');

    const variables: { key: string; label: string; values: (number | null)[] }[] = [
        { key: 'productivity', label: 'Productivity', values: completed.map(r => r.productivityChange) },
        { key: 'transformation', label: 'Transformation', values: completed.map(r => r.transformationBelief) },
        { key: 'regulatory', label: 'Regulatory Impact', values: completed.map(r => r.regulatoryInfluence) },
        { key: 'toolCount', label: 'Tool Count', values: completed.map(r => getAdoptionIndex(r)) },
        { key: 'sdlcMaturity', label: 'SDLC Maturity', values: completed.map(r => getSDLCMaturity(r)) },
        { key: 'qualityCoverage', label: 'Quality Strategies', values: completed.map(r => getQualityCoverage(r)) },
    ];

    function pearsonCorrelation(x: number[], y: number[]): number {
        const n = x.length;
        if (n === 0) return 0;
        const meanX = x.reduce((s, v) => s + v, 0) / n;
        const meanY = y.reduce((s, v) => s + v, 0) / n;
        let num = 0, denX = 0, denY = 0;
        for (let i = 0; i < n; i++) {
            const dx = x[i] - meanX;
            const dy = y[i] - meanY;
            num += dx * dy;
            denX += dx * dx;
            denY += dy * dy;
        }
        const den = Math.sqrt(denX * denY);
        return den === 0 ? 0 : num / den;
    }

    const matrix: Array<{ var1: string; var2: string; correlation: number; pValue: number; isSignificant: boolean }> = [];

    for (const v1 of variables) {
        for (const v2 of variables) {
            // Get pairs where both values are non-null
            const pairs: { x: number; y: number }[] = [];
            for (let i = 0; i < v1.values.length; i++) {
                if (v1.values[i] !== null && v2.values[i] !== null) {
                    pairs.push({ x: v1.values[i]!, y: v2.values[i]! });
                }
            }
            const n = pairs.length;
            const corr = pearsonCorrelation(pairs.map(p => p.x), pairs.map(p => p.y));
            const pValue = calculatePValue(corr, n);

            matrix.push({
                var1: v1.label,
                var2: v2.label,
                correlation: Math.round(corr * 100) / 100,
                pValue: Number(pValue.toFixed(4)),
                isSignificant: pValue < 0.05,
            });
        }
    }

    return {
        matrix,
        labels: variables.map(v => v.label),
    };
}

/** AI Experience × SDLC Ratings: Do experienced users rate SDLC phases differently? */
export function getAIExperienceVsSDLC(data: TransformedSurveyResponse[]) {
    const completed = data.filter(r => r.status === 'Completed');

    const experienceLevels = [
        { key: 'actively use', label: 'Active AI Users' },
        { key: 'technical tasks', label: 'Technical Task Users' },
        { key: 'tried', label: 'Tried AI' },
        { key: 'no hands', label: 'No AI Experience' },
    ];

    const phases = ['phase1', 'phase2', 'phase3', 'phase4', 'phase5', 'phase6'] as const;
    const phaseLabels = ['Requirements', 'Design', 'Coding', 'Testing', 'Deployment', 'Maintenance'];

    return experienceLevels.map(level => {
        const group = completed.filter(r => r.aiExperience.toLowerCase().includes(level.key));
        return {
            level: level.label,
            count: group.length,
            phases: phases.map((p, i) => ({
                phase: phaseLabels[i],
                value: calculateMean(group.map(r => r.sdlcPhases[p])),
            })),
        };
    }).filter(g => g.count > 0);
}

/** Quality Strategy Count × Correction Frequency: More strategies = fewer corrections? */
export function getQualityVsCorrection(data: TransformedSurveyResponse[]) {
    const completed = data.filter(r => r.status === 'Completed' && r.correctionFrequency);

    const groups: Record<number, Record<string, number>> = {};
    for (const r of completed) {
        const count = getQualityCoverage(r);
        if (!groups[count]) groups[count] = {};
        groups[count][r.correctionFrequency] = (groups[count][r.correctionFrequency] || 0) + 1;
    }

    return Object.entries(groups)
        .map(([strategyCount, freqs]) => ({
            strategyCount: Number(strategyCount),
            total: Object.values(freqs).reduce((s, c) => s + c, 0),
            frequencies: freqs,
        }))
        .sort((a, b) => a.strategyCount - b.strategyCount);
}

/** Variable Importance: What are the main drivers of productivity? (Correlation-based) */
export function getVariableImportance(data: TransformedSurveyResponse[]) {
    const completed = data.filter(r => r.status === 'Completed' && r.productivityChange !== null);
    if (completed.length === 0) return [];

    const target = completed.map(r => r.productivityChange!);

    const factors = [
        { label: 'Tool Adoption Count', values: completed.map(r => getAdoptionIndex(r)) },
        { label: 'Transformation Belief', values: completed.map(r => r.transformationBelief || 0) },
        { label: 'Quality Coverage', values: completed.map(r => getQualityCoverage(r)) },
        { label: 'SDLC Maturity', values: completed.map(r => getSDLCMaturity(r) || 0) },
        { label: 'Use of Copilot', values: completed.map(r => r.tools.githubCopilot ? 1 : 0) },
        { label: 'Use of Cursor', values: completed.map(r => r.tools.cursor ? 1 : 0) },
        {
            label: 'Experience Level', values: completed.map(r => {
                if (r.experience === '> 10 years') return 4;
                if (r.experience === '5-10 years') return 3;
                if (r.experience === '2-5 years') return 2;
                return 1;
            })
        },
    ];

    function calculateCorrelation(x: number[], y: number[]) {
        const n = x.length;
        const meanX = x.reduce((a, b) => a + b, 0) / n;
        const meanY = y.reduce((a, b) => a + b, 0) / n;
        const num = x.reduce((sum, xi, i) => sum + (xi - meanX) * (y[i] - meanY), 0);
        const den = Math.sqrt(
            x.reduce((sum, xi) => sum + Math.pow(xi - meanX, 2), 0) *
            y.reduce((sum, yi) => sum + Math.pow(yi - meanY, 2), 0)
        );
        return den === 0 ? 0 : Math.abs(num / den);
    }

    const importance = factors.map(f => {
        const corr = calculateCorrelation(f.values, target);
        const pValue = calculatePValue(corr, completed.length);
        return {
            id: f.label,
            label: f.label,
            value: corr,
            pValue: Number(pValue.toFixed(4)),
            isSignificant: pValue < 0.05,
        };
    });

    // Normalize to 0-100 range for visualization
    const maxVal = Math.max(...importance.map(i => i.value));
    return importance.map(i => ({
        ...i,
        percentage: maxVal === 0 ? 0 : (i.value / maxVal) * 100
    })).sort((a, b) => b.percentage - a.percentage);
}

