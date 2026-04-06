"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runGenerator = runGenerator;
const tslib_1 = require("tslib");
const fs_1 = require("fs");
const path_1 = tslib_1.__importDefault(require("path"));
const { callLLM } = require('../../src/llmClient.js');
async function runGenerator(planPath) {
    const plan = await fs_1.promises.readFile(planPath, 'utf8'); // Read the markdown test plan from disk
    const seedTest = `
import { test, expect } from '../src/test-support/fixtures';

test('example login flow', async ({ page, env }) => {
  // use helpers like loginAsAdmin(page, env)
});
`; // This seed test is included in the prompt to show the LLM the expected style and structure of the generated test file.
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

Return ONLY the TypeScript test file contents.`; // The prompt gives the LLM the test plan, a seed test to show the expected style, and clear instructions on what to return.
    const tsContent = await callLLM(prompt); // Call the LLM to generate the test file content based on the plan and instructions.
    const baseName = path_1.default.basename(planPath, path_1.default.extname(planPath)); // Derive the output test file name from the plan file name (e.g., login-flow.md -> login-flow.spec.ts)
    const outDir = path_1.default.join('tests', 'ai'); // Output directory for generated tests
    await fs_1.promises.mkdir(outDir, { recursive: true }); // Ensure the output directory exists
    const outPath = path_1.default.join(outDir, `${baseName}.spec.ts`); // Full path for the generated test file
    await fs_1.promises.writeFile(outPath, tsContent, 'utf8'); // Write the generated test content to disk
    return outPath;
}
//# sourceMappingURL=generator.js.map