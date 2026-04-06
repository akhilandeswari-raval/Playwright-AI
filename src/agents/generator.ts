import { promises as fs } from 'fs';
import path from 'path';
const { callLLM } = require('../../src/llmClient.js');

// Add this function inside generator.ts, above runGenerator()

function cleanLLMOutput(raw: string): string {
  let cleaned = raw.trim();

  // Remove opening markdown fence variations: ```typescript, ```ts, ```js, ```
  cleaned = cleaned.replace(/^```[a-zA-Z]*\n?/, '');

  // Remove closing markdown fence
  cleaned = cleaned.replace(/```\s*$/, '');

  // Remove any leading prose lines before the import statement
  // e.g. "Here is your test file:" or "Sure! Here's the code:"
  const importIndex = cleaned.indexOf('import ');
  if (importIndex > 0) {
    cleaned = cleaned.slice(importIndex);
  }

  // Remove any trailing text after the last closing brace
  const lastBrace = cleaned.lastIndexOf('}');
  if (lastBrace !== -1) {
    cleaned = cleaned.slice(0, lastBrace + 1);
  }

  return cleaned.trim();
}

export async function runGenerator(planPath: string) {
  const plan = await fs.readFile(planPath, 'utf8'); // Read the markdown test plan from disk

  const seedTest = `
import test, { expect } from '@playwright/test';

test('example login flow', async ({ page, env }) => {
  // use helpers like loginAsAdmin(page, env)
});

test('example login flow', async ({ page }) => {
        const login = new LoginPage(page);
        const email = 'standard_user';
        const password = 'secret_sauce';

        await login.login(email, password); // Use the login method from your page object to perform the login action with the provided email and password


        expect((page).locator('.shopping_cart_link')).toBeEnabled();
        await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
        await expect(page.locator('.shopping_cart_link')).toBeVisible();
    });
`;// This seed test is included in the prompt to show the LLM the expected style and structure of the generated test file.

const prompt = `
You are a senior Playwright test engineer. Your only job is to output TypeScript code.

STRICT RULES — you MUST follow all of these:
1. Return ONLY raw TypeScript code. Nothing else.
2. Do NOT wrap the code in markdown fences (\`\`\`typescript or \`\`\`).
3. Do NOT write any explanation, comments outside the code, or intro sentences.
4. Do NOT write things like "Here is the test file:" or "Sure, here's the code".
5. The very first character of your response must be the letter 'i' (from the import statement).
6. The very last character must be '}' (closing brace of the last test).

Convert this markdown test plan into a TypeScript Playwright test file:

--- PLAN ---
${plan}
--- END PLAN ---

Requirements:
- First line must be exactly: import { test, expect } from '../src/test-support/fixtures';
- Use stable locators: getByRole, getByTestId, getByLabel, getByText — in that priority order.
- Each test must have a descriptive name matching the plan step.
- Use page object methods when the seed test shows them (e.g. loginPage.login()).
- Follow this exact code style — no deviations:

${seedTest}

Remember: output ONLY the TypeScript file. Start with 'import'. End with '}'.
`;// The prompt gives the LLM the test plan, a seed test to show the expected style, and clear instructions on what to return.

  const tsContent: string = await callLLM(prompt); // Call the LLM to generate the test file content based on the plan and instructions.

  const testCode = cleanLLMOutput(tsContent);

  console.log('runGenerator: cleaned output preview:\n', testCode.slice(0, 300));

  const baseName = path.basename(planPath, path.extname(planPath)); // Derive the output test file name from the plan file name (e.g., login-flow.md -> login-flow.spec.ts)
  const outDir = path.join('tests', 'ai'); // Output directory for generated tests
  await fs.mkdir(outDir, { recursive: true }); // Ensure the output directory exists
  const outPath = path.join(outDir, `${baseName}.spec.ts`); // Full path for the generated test file
  await fs.writeFile(outPath, testCode, 'utf8'); // Write the generated test content to disk
  return outPath;
}
