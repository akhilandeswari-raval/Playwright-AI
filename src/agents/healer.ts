// src/agents/healer.ts

import * as path from 'path';
const { callLLM } = require('../../src/llmClient.js');
import * as fs from 'fs/promises';
import { chromium } from '@playwright/test';


export interface HealerInput {
  specPath: string;    // absolute path to the broken .spec.ts file
  errorMessage: string; // the Playwright error output (copy from terminal)
}

// ─── Output cleaner ───────────────────────────────────────────────────────────

function cleanLLMOutput(raw: string): string {
  let cleaned = raw.trim();
  cleaned = cleaned.replace(/^```[a-zA-Z]*\n?/, '');
  cleaned = cleaned.replace(/```\s*$/, '');
  const importIndex = cleaned.indexOf('import ');
  if (importIndex > 0) cleaned = cleaned.slice(importIndex);
  const lastBrace = cleaned.lastIndexOf('}');
  if (lastBrace !== -1) cleaned = cleaned.slice(0, lastBrace + 1);
  return cleaned.trim();
}

// ─── Extract the URL the test navigates to ───────────────────────────────────

function extractURLFromTest(testCode: string): string | null {
  // Looks for page.goto('...') or page.goto("...") in the test file
  const match = testCode.match(/page\.goto\(['"`]([^'"`]+)['"`]\)/);
  return match ? match[1] : null;
}

// ─── Extract the broken locator from the error message ───────────────────────

function extractBrokenLocatorFromError(errorMessage: string): string | null {
  // Looks for a locator pattern in the error message
  const match = errorMessage.match(/locator\(['"`]([^'"`]+)['"`]\)/);
  if (match) return match[1];

  // Also catch things like: getByRole('button', { name: 'Login' })
  const roleMatch = errorMessage.match(/getByRole\([^)]+\)/);
  if (roleMatch) return roleMatch[0];

  return null;
}

// ─── Live DOM snapshot: visit the page and collect interactive elements ───────

async function getLiveDOMSnapshot(url: string): Promise<string> {
  console.log('runHealer: launching browser to inspect live DOM at:', url);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
 
  const page = await context.newPage();

   try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

    // Wait a moment for dynamic content to settle
    await page.waitForTimeout(2000);

    // Collect all interactive elements with their attributes
    const snapshot = await page.evaluate(() => {
      const elements: string[] = [];

      // Query all interactive elements on the page
      const selectors = [
        'input', 'button', 'a', 'select', 'textarea',
        '[role="button"]', '[role="link"]', '[role="textbox"]',
        '[data-testid]', '[id]', '[name]'
      ];

      const seen = new Set<Element>();

      selectors.forEach((sel) => {
        document.querySelectorAll(sel).forEach((el) => {
          if (seen.has(el)) return;
          seen.add(el);

          const tag = el.tagName.toLowerCase();
          const id = el.id ? `id="${el.id}"` : '';
          const name = el.getAttribute('name') ? `name="${el.getAttribute('name')}"` : '';
          const type = el.getAttribute('type') ? `type="${el.getAttribute('type')}"` : '';
          const placeholder = el.getAttribute('placeholder') ? `placeholder="${el.getAttribute('placeholder')}"` : '';
          const testId = el.getAttribute('data-testid') ? `data-testid="${el.getAttribute('data-testid')}"` : '';
          const role = el.getAttribute('role') ? `role="${el.getAttribute('role')}"` : '';
          const text = el.textContent?.trim().slice(0, 50) ?? '';
          const className = el.className ? `class="${el.className}"` : '';

          const attrs = [id, name, type, placeholder, testId, role, className]
            .filter(Boolean)
            .join(' ');

          elements.push(`<${tag} ${attrs}>${text ? `text="${text}"` : ''}</${tag}>`);
        });
      });

      return elements.join('\n');
    });

    console.log(`runHealer: DOM snapshot captured — ${snapshot.split('\n').length} elements found`);
    return snapshot;

  } catch (err) {
    console.warn('runHealer: could not capture DOM snapshot:', err);
    return 'DOM snapshot unavailable';
  } finally {
    await browser.close();
  }
}



export async function runHealer(input: HealerInput): Promise<string> { // returns the path to the fixed test file 
  const { specPath, errorMessage } = input; // absolute path to the broken test file

  console.log('runHealer: reading broken test from:', specPath);

  // 1) Read the current (broken) test file
  const brokenTest = await fs.readFile(specPath, 'utf8'); // Note: the broken test file is expected to be a complete .spec.ts file, not just a snippet
  console.log('runHealer: broken test length:', brokenTest.length); // For debugging: you can log the first 500 chars of the broken test to verify it's read correctly

  // 2) Build a prompt that gives the LLM both the broken code and the error
  const prompt = `
  You are a senior QA engineer and Playwright expert.

  A Playwright test is failing. Your job is to fix it. You can try running the errored script locally to reproduce the error and understand it better. The error message is included below.

STRICT RULES:
1. Return ONLY the fixed TypeScript code. Nothing else.
2. Do NOT wrap output in markdown fences (\`\`\`typescript or \`\`\`).
3. Do NOT add explanations, comments, or prose outside the code.
4. Do NOT rewrite the whole file — change ONLY the lines needed to fix the error.
5. Do NOT add new tests or remove existing tests.
6. Do NOT add commented-out code blocks.
7. Keep every line that is not related to the error exactly as it was.
8. The first character of your response must be 'i' (from the import statement).
9. The last character must be '}' (closing brace of the last test).


--- BROKEN TEST ---
${brokenTest}
--- END BROKEN TEST ---

--- ERROR MESSAGE ---
${errorMessage}
--- END ERROR MESSAGE ---

Instructions:
- Read the error message carefully.
- Identify the SINGLE line or locator that caused the error.
- Fix only that line.
- Return the complete file with ONLY that minimal change applied.
`;

  // 3) Call LLM to get a fixed version
  console.log('runHealer: calling LLM to fix test...');
  const fixedTest: string = await callLLM(prompt); // Note: we expect the LLM to return the complete fixed .spec.ts file content as a string
  console.log('runHealer: LLM returned fix, length:', fixedTest?.length ?? 0); // For debugging: you can log the first 500 chars of the fixed test to verify it's received correctly 

  // 4) Write the fixed test back to the same file
  await fs.writeFile(specPath, fixedTest, 'utf8');
  console.log('runHealer: fixed test written to:', specPath);

  return specPath;
}
