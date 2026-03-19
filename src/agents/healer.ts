import { promises as fs } from 'fs';
import path from 'path';
const { callLLM } = require('../../src/llmClient.js');

type Failure = {
  testFile: string;
  errorMessage: string;
  locatorSnippet?: string;
  domSnapshot?: string;
};

export async function runHealer(reportPath: string) {
  const report = JSON.parse(await fs.readFile(reportPath, 'utf8'));
  const failures: Failure[] = extractFailures(report);

  for (const failure of failures) {
    const absPath = path.resolve(failure.testFile);
    const src = await fs.readFile(absPath, 'utf8');

    const prompt = `
You are a Playwright test healer.

Test file:
${src}

Failure:
${failure.errorMessage}

DOM snapshot (if any):
${failure.domSnapshot ?? ''}

Task:
- Identify the broken locator or assertion.
- Propose the minimal TypeScript change to fix it.
- Keep the structure of the test intact.

Return ONLY the fixed file contents.`;

    const fixed = await callLLM(prompt);
    await fs.writeFile(absPath, fixed, 'utf8');
  }
}

function extractFailures(report: any): Failure[] {
  // TODO: parse Playwright JSON format; start with a very simple mapping.
  return [];
}
