import type { TransformedSurveyResponse } from './transformData';

export interface ClusterProfile {
    id: string;
    name: string;
    description: string;
    color: string;
    size: number;
    percentage: number;
}

/**
 * Performs a simplified k-means clustering/profiling on the survey data.
 * Instead of complex iterative k-means, we use a scoring-based profiling 
 * to ensure interpretable groups (as suggested in the Data Science PDF).
 */
export function getRespondentClusters(data: TransformedSurveyResponse[]) {
    const completed = data.filter(r => r.status === 'Completed');
    if (completed.length === 0) return [];

    const profiles: Record<string, TransformedSurveyResponse[]> = {
        innovators: [],
        pragmatists: [],
        cautious: []
    };

    completed.forEach(r => {
        // 1. Scoring for AI Affinity (Tool count + Productivity + Belief)
        const toolCount = Object.values(r.tools).filter(t => t).length;
        const productivityWeight = (r.productivityChange || 5) / 10;
        const beliefWeight = (r.transformationBelief || 5) / 10;

        const affinityScore = (toolCount / 9) * 0.4 + productivityWeight * 0.3 + beliefWeight * 0.3;

        // 2. Scoring for Experience & Risk (Seniority vs Correction Frequency)
        const isSenior = r.experience.includes('> 10') || r.experience.includes('5-10');
        const isCautious = r.correctionFrequency.includes('Half') || r.correctionFrequency.includes('Most');

        // Rule-based assignment (simplified clustering)
        if (affinityScore > 0.7 && !isCautious) {
            profiles.innovators.push(r);
        } else if (isSenior || affinityScore > 0.4) {
            profiles.pragmatists.push(r);
        } else {
            profiles.cautious.push(r);
        }
    });

    const total = completed.length;

    return [
        {
            id: 'innovators',
            name: 'AI Champions',
            description: 'Hohe Adoption & hohe Produktivitäts-Ziele',
            color: '#A100FF',
            size: profiles.innovators.length,
            percentage: (profiles.innovators.length / total) * 100
        },
        {
            id: 'pragmatists',
            name: 'Experienced Pragmatists',
            description: 'Zweckorientierte Nutzung mit Fokus auf Qualität',
            color: '#6366F1',
            size: profiles.pragmatists.length,
            percentage: (profiles.pragmatists.length / total) * 100
        },
        {
            id: 'cautious',
            name: 'Cautious Observers',
            description: 'Skeptisch oder am Anfang der Adoption',
            color: '#06B6D4',
            size: profiles.cautious.length,
            percentage: (profiles.cautious.length / total) * 100
        }
    ].sort((a, b) => b.size - a.size);
}
