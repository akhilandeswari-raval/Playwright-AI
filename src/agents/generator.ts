import { promises as fs } from 'fs';
import path from 'path';
const { callLLM } = require('../../src/llmClient.js');

export async function runGenerator(planPath: string) {
  const plan = await fs.readFile(planPath, 'utf8');

  const seedTest = `
import { test, expect } from '../src/test-support/fixtures';

test('example login flow', async ({ page, env }) => {
  // use helpers like loginAsAdmin(page, env)
});
`;

  const prompt = `
You are a senior Playwright test engineer.

Convert this markdown test plan into a TypeScript Playwright test file:

--- PLAN ---
${plan}
--- END PLAN ---

Requirements:
- Use this import: \`import { test, expect } from '../src/test-support/fixtures';\`
- Use stable locators (getByRole, getByTestId) when possible.
- Follow the style of this seed test:
${seedTest}

Return ONLY the TypeScript test file contents.`;

  const tsContent = await callLLM(prompt);

  const baseName = path.basename(planPath, path.extname(planPath));
  const outDir = path.join('tests', 'ai');
  await fs.mkdir(outDir, { recursive: true });
  const outPath = path.join(outDir, `${baseName}.spec.ts`);
  await fs.writeFile(outPath, tsContent, 'utf8');
  return outPath;
}
