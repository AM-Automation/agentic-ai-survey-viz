import Papa from 'papaparse';

export interface RawSurveyResponse {
  '#': string;
  'Start date': string;
  'Start time': string;
  'Completion date': string;
  'Completion time': string;
  'Duration': string;
  'Status': string;
  'How many years of professional experience do you have in software development or a technically related field?': string;
  'Which role best describes your current position?': string;
  'What type of organization do you work for?': string;
  'What industry do you primarily work in?': string;
  'Do you work in an environment with industry-specific compliance or regulatory requirements?': string;
  'How strongly do regulatory requirements influence your willingness to use Agentic AI in software development?': string;
  'How would you describe your experience with AI-assisted software development?': string;
  'Which AI-powered development tools have you already tried? (multiple select) - GitHub Copilot': string;
  'Which AI-powered development tools have you already tried? (multiple select) - Cursor': string;
  'Which AI-powered development tools have you already tried? (multiple select) - OpenAI Codex': string;
  'Which AI-powered development tools have you already tried? (multiple select) - Claude Code': string;
  'Which AI-powered development tools have you already tried? (multiple select) - Windsurf': string;
  'Which AI-powered development tools have you already tried? (multiple select) - Google Gemini CLI / Antigravity': string;
  'Which AI-powered development tools have you already tried? (multiple select) - Devin': string;
  'Which AI-powered development tools have you already tried? (multiple select) - Lovable': string;
  'Which AI-powered development tools have you already tried? (multiple select) - Amazon Q Developer': string;
  'How would you rate your ability to assess the potential of AI tools across SDLC phases?': string;
  'Content block': string;
  'Phase 1: Requirements Analysis & Planning': string;
  'Phase 2: System Design / Architecture': string;
  'Phase 3: Coding  / Implementation)': string;
  'Phase 4: Testing & Quality Assurance': string;
  'Phase 5: Deployment & Integration': string;
  'Phase 6: Maintenance & Operations': string;
  'What do you see as the biggest challenges when using Agentic AI in software development?': string;
  'How would you describe your typical interaction with AI development tools?': string;
  'How often do you need to correct or rework AI-generated results?': string;
  'What strategies do you use to ensure the quality of AI-generated code? - Manual code reviews': string;
  'What strategies do you use to ensure the quality of AI-generated code? - Automated tests (unit, integration, E2E)': string;
  'What strategies do you use to ensure the quality of AI-generated code? - Static code analysis / linting': string;
  'What strategies do you use to ensure the quality of AI-generated code? - Optimizing prompts through iteration and examples': string;
  'What strategies do you use to ensure the quality of AI-generated code? - Providing architecture specs / context files to the AI': string;
  'What strategies do you use to ensure the quality of AI-generated code? - Pair-programming mode with AI': string;
  'What strategies do you use to ensure the quality of AI-generated code? - Cross-checking results with a second AI tool': string;
  'To what extent do you agree with the following statement: "Agentic AI will fundamentally change how software is developed within the next 3 years."': string;
  'Thinking about your own work: How has the use of AI tools changed your productivity?': string;
}

export async function parseSurveyCSV(csvText: string): Promise<RawSurveyResponse[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      delimiter: ';',
      transformHeader: (header: string) => {
        // Remove BOM if present and normalize non-breaking spaces (U+00A0) to regular spaces
        return header.replace(/^\uFEFF/, '').replace(/\u00A0/g, ' ');
      },
      complete: (results) => {
        if (results.errors.length > 0) {
          console.warn('CSV parsing warnings:', results.errors);
        }
        resolve(results.data as RawSurveyResponse[]);
      },
      error: (error) => {
        reject(error);
      },
    });
  });
}
