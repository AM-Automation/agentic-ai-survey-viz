import { z } from 'zod';

/**
 * Zod validation schemas for survey data
 *
 * These schemas ensure type safety and data validation for the 43 fields
 * from the Umfrage.csv file.
 */

// Define the enum values based on the actual CSV data
export const ExperienceLevel = z.enum(['< 2 years', '2–5 years', '6–10 years', '> 10 years']);

export const CompletionStatus = z.enum(['Completed', 'Incomplete']);

export const AIExperienceLevel = z.enum([
  'I actively use AI for coding (generating, debugging, refactoring code)',
  'I use AI for technical tasks, but not for coding (architecture, documentation, code reviews)',
  'I tried AI, but I don't use it regularly',
  'I have no hands-on experience with AI in development',
]);

export const InteractionPattern = z.enum([
  'Ad-hoc (isolated tasks)',
  'Iterative (back-and-forth loops)',
  'Delegative (autonomous work)',
  'Multi-agent (multiple tools in parallel)',
]);

export const CorrectionFrequency = z.enum([
  'Almost never (< 10%)',
  'Rarely (10–30%)',
  'About half the time (30–60%)',
  'Frequently (60–80%)',
  'Almost always (> 80%)',
]);

// Main survey response schema
export const SurveyResponseSchema = z.object({
  // Metadata fields
  id: z.string(),
  startDate: z.string(),
  startTime: z.string(),
  completionDate: z.string().optional(),
  completionTime: z.string().optional(),
  duration: z.string(),
  status: CompletionStatus,

  // Demographics
  experience: ExperienceLevel,
  role: z.string(),
  organizationType: z.string(),
  industry: z.string(),
  hasCompliance: z.boolean().nullable(),

  // AI Experience & Adoption
  regulatoryInfluence: z.number().min(1).max(5).nullable(),
  aiExperienceLevel: z.string(),
  assessmentAbility: z.string().nullable(),

  // Tool adoption (binary checkboxes)
  toolGitHubCopilot: z.boolean(),
  toolClaudeCode: z.boolean(),
  toolCursor: z.boolean(),
  toolWindsurf: z.boolean(),
  toolCodex: z.boolean(),
  toolClaude: z.boolean(),
  toolGemini: z.boolean(),
  toolTabnine: z.boolean(),
  toolOther: z.boolean(),

  // SDLC Phase Ratings (1-5 scale)
  sdlcPhase1: z.number().min(1).max(5).nullable(),
  sdlcPhase2: z.number().min(1).max(5).nullable(),
  sdlcPhase3: z.number().min(1).max(5).nullable(),
  sdlcPhase4: z.number().min(1).max(5).nullable(),
  sdlcPhase5: z.number().min(1).max(5).nullable(),
  sdlcPhase6: z.number().min(1).max(5).nullable(),

  // Usage patterns & quality
  biggestChallenges: z.array(z.string()),
  interactionPattern: z.string().nullable(),
  correctionFrequency: z.string().nullable(),

  // Quality strategies (binary checkboxes)
  qualityManualReview: z.boolean(),
  qualityAutomatedTests: z.boolean(),
  qualityStaticAnalysis: z.boolean(),
  qualityOptimizePrompts: z.boolean(),
  qualityArchitectureSpecs: z.boolean(),
  qualityPeerReview: z.boolean(),
  qualityOther: z.boolean(),

  // Future outlook (1-10 scale)
  transformationBelief: z.number().min(1).max(10).nullable(),
  productivityChange: z.number().min(1).max(10).nullable(),
});

export type SurveyResponse = z.infer<typeof SurveyResponseSchema>;

// Raw response type (before validation and transformation)
export interface RawSurveyResponse {
  '#': string;
  'Start Date': string;
  'Start Time': string;
  'Completion Date': string;
  'Completion Time': string;
  Duration: string;
  Status: string;
  [key: string]: string | undefined;
}
