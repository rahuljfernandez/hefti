/**
 * Suggested prompt pills displayed on the Researcher pre-chat screen (HeftiResearch.jsx).
 * Clicking a pill fires the prompt directly into the chat.
 * Keep owner and facility sets separate — context type is derived from the URL.
 */
export const OWNER_PROMPTS = [
  'Show star rating distribution across this owner\'s facilities',
  'Which facilities in this portfolio have the most deficiencies?',
  'Compare this owner\'s average metrics to the national average',
  'Show staffing turnover rates across this owner\'s facilities',
  'Which states does this owner operate in and how many facilities per state?',
];

export const FACILITY_PROMPTS = [
  'How does this facility\'s star rating compare to the state average?',
  'What are the most recent deficiencies at this facility?',
  'How does staffing here compare to national benchmarks?',
  'Show the clinical quality measures for this facility',
  'Who owns this facility and what other facilities do they operate?',
];
