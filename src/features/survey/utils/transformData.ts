import type { RawSurveyResponse } from './parseCSV';

export interface TransformedSurveyResponse {
  id: string;
  status: 'Completed' | 'Incomplete';
  experience: string;
  role: string;
  organizationType: string;
  industry: string;
  compliance: 'yes' | 'no' | 'not_sure';
  regulatoryInfluence: number | null;
  aiExperience: string;
  sdlcSelfAssessment: string;

  // Tool adoption
  tools: {
    githubCopilot: boolean;
    cursor: boolean;
    codex: boolean;
    claudeCode: boolean;
    windsurf: boolean;
    gemini: boolean;
    devin: boolean;
    lovable: boolean;
    amazonQ: boolean;
  };

  // SDLC ratings
  sdlcPhases: {
    phase1: number | null;
    phase2: number | null;
    phase3: number | null;
    phase4: number | null;
    phase5: number | null;
    phase6: number | null;
  };

  challenges: string[];
  interactionPattern: string;
  correctionFrequency: string;

  // Quality strategies
  qualityStrategies: {
    manualReview: boolean;
    automatedTests: boolean;
    staticAnalysis: boolean;
    optimizePrompts: boolean;
    architectureSpecs: boolean;
    pairProgramming: boolean;
    crossCheck: boolean;
  };

  transformationBelief: number | null;
  productivityChange: number | null;
}

function parseBool(value: string): boolean {
  return value === '1' || value.toLowerCase() === 'yes' || value.toLowerCase() === 'true';
}

function parseNumber(value: string): number | null {
  if (!value || value === '—' || value === '-' || value.trim() === '') {
    return null;
  }
  const num = parseFloat(value);
  return isNaN(num) ? null : num;
}

function parseCompliance(value: string): 'yes' | 'no' | 'not_sure' {
  const lower = (value || '').toLowerCase().trim();
  if (lower === 'yes' || lower === '1') return 'yes';
  if (lower === 'not sure') return 'not_sure';
  return 'no';
}

function parseChallenges(value: string): string[] {
  if (!value || value.trim() === '' || value === '—') {
    return [];
  }
  // Challenges are separated by "), " since each has parenthetical details with commas inside
  // e.g. "Context limitations (codebase awareness, memory issues), Code quality & correctness (logic errors, hallucinations)"
  // Split on "), " and re-add the closing parenthesis
  const parts = value.split('), ');
  return parts.map((s, i) => {
    let trimmed = s.trim();
    // Re-add closing parenthesis if it was removed by the split (all except the last part which already has it)
    if (i < parts.length - 1 && !trimmed.endsWith(')')) {
      trimmed += ')';
    }
    return trimmed;
  }).filter(s => s.length > 0);
}

export function transformSurveyData(raw: RawSurveyResponse[]): TransformedSurveyResponse[] {
  return raw.map(row => ({
    id: row['#'],
    status: row['Status'] as 'Completed' | 'Incomplete',
    experience: row['How many years of professional experience do you have in software development or a technically related field?'],
    role: row['Which role best describes your current position?'],
    organizationType: row['What type of organization do you work for?'],
    industry: row['What industry do you primarily work in?'],
    compliance: parseCompliance(row['Do you work in an environment with industry-specific compliance or regulatory requirements?']),
    regulatoryInfluence: parseNumber(row['How strongly do regulatory requirements influence your willingness to use Agentic AI in software development?']),
    aiExperience: row['How would you describe your experience with AI-assisted software development?'],
    sdlcSelfAssessment: row['How would you rate your ability to assess the potential of AI tools across SDLC phases?'] || '',

    tools: {
      githubCopilot: parseBool(row['Which AI-powered development tools have you already tried? (multiple select) - GitHub Copilot']),
      cursor: parseBool(row['Which AI-powered development tools have you already tried? (multiple select) - Cursor']),
      codex: parseBool(row['Which AI-powered development tools have you already tried? (multiple select) - OpenAI Codex']),
      claudeCode: parseBool(row['Which AI-powered development tools have you already tried? (multiple select) - Claude Code']),
      windsurf: parseBool(row['Which AI-powered development tools have you already tried? (multiple select) - Windsurf']),
      gemini: parseBool(row['Which AI-powered development tools have you already tried? (multiple select) - Google Gemini CLI / Antigravity']),
      devin: parseBool(row['Which AI-powered development tools have you already tried? (multiple select) - Devin']),
      lovable: parseBool(row['Which AI-powered development tools have you already tried? (multiple select) - Lovable']),
      amazonQ: parseBool(row['Which AI-powered development tools have you already tried? (multiple select) - Amazon Q Developer']),
    },

    sdlcPhases: {
      phase1: parseNumber(row['Phase 1: Requirements Analysis & Planning']),
      phase2: parseNumber(row['Phase 2: System Design / Architecture']),
      phase3: parseNumber(row['Phase 3: Coding  / Implementation)']),
      phase4: parseNumber(row['Phase 4: Testing & Quality Assurance']),
      phase5: parseNumber(row['Phase 5: Deployment & Integration']),
      phase6: parseNumber(row['Phase 6: Maintenance & Operations']),
    },

    challenges: parseChallenges(row['What do you see as the biggest challenges when using Agentic AI in software development?']),
    interactionPattern: row['How would you describe your typical interaction with AI development tools?'],
    correctionFrequency: row['How often do you need to correct or rework AI-generated results?'],

    qualityStrategies: {
      manualReview: parseBool(row['What strategies do you use to ensure the quality of AI-generated code? - Manual code reviews']),
      automatedTests: parseBool(row['What strategies do you use to ensure the quality of AI-generated code? - Automated tests (unit, integration, E2E)']),
      staticAnalysis: parseBool(row['What strategies do you use to ensure the quality of AI-generated code? - Static code analysis / linting']),
      optimizePrompts: parseBool(row['What strategies do you use to ensure the quality of AI-generated code? - Optimizing prompts through iteration and examples']),
      architectureSpecs: parseBool(row['What strategies do you use to ensure the quality of AI-generated code? - Providing architecture specs / context files to the AI']),
      pairProgramming: parseBool(row['What strategies do you use to ensure the quality of AI-generated code? - Pair-programming mode with AI']),
      crossCheck: parseBool(row['What strategies do you use to ensure the quality of AI-generated code? - Cross-checking results with a second AI tool']),
    },

    transformationBelief: parseNumber(row['To what extent do you agree with the following statement: "Agentic AI will fundamentally change how software is developed within the next 3 years."']),
    productivityChange: parseNumber(row['Thinking about your own work: How has the use of AI tools changed your productivity?']),
  }));
}
