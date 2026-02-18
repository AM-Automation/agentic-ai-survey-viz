import { useQuery } from '@tanstack/react-query';
import { parseSurveyCSV } from '../utils/parseCSV';
import { transformSurveyData, type TransformedSurveyResponse } from '../utils/transformData';

export function useSurveyData() {
  return useQuery({
    queryKey: ['surveyData'],
    queryFn: async (): Promise<TransformedSurveyResponse[]> => {
      const response = await fetch('/data/Umfrage.csv');
      if (!response.ok) {
        throw new Error('Failed to load survey data');
      }
      const csvText = await response.text();
      const rawData = await parseSurveyCSV(csvText);
      return transformSurveyData(rawData);
    },
    staleTime: Infinity,
    gcTime: Infinity,
  });
}
