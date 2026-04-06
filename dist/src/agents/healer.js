"use strict";
// src/agents/healer.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.runHealer = runHealer;
const tslib_1 = require("tslib");
const { callLLM } = require('../../src/llmClient.js');
const fs = tslib_1.__importStar(require("fs/promises"));
async function runHealer(input) {
    const { specPath, errorMessage } = input; // absolute path to the broken test file
    console.log('runHealer: reading broken test from:', specPath);
    // 1) Read the current (broken) test file
    const brokenTest = await fs.readFile(specPath, 'utf8'); // Note: the broken test file is expected to be a complete .spec.ts file, not just a snippet
    console.log('runHealer: broken test length:', brokenTest.length); // For debugging: you can log the first 500 chars of the broken test to verify it's read correctly
    // 2) Build a prompt that gives the LLM both the broken code and the error
    const prompt = `
  You are a senior QA engineer and Playwright expert.

  A Playwright test is failing. Your job is to fix it.

Rules:
- Keep the same test intent and structure.
- Only change what is necessary to fix the error.
- Use stable Playwright locators: getByRole, getByTestId, getByLabel, getByText.
- Do NOT add new test cases.
- Return ONLY the fixed TypeScript code. No explanation, no markdown fences.

--- BROKEN TEST ---
${brokenTest}
--- END BROKEN TEST ---

--- ERROR MESSAGE ---
${errorMessage}
--- END ERROR MESSAGE ---

Return the complete fixed .spec.ts file contents:
`;
    // 3) Call LLM to get a fixed version
    console.log('runHealer: calling LLM to fix test...');
    const fixedTest = await callLLM(prompt); // Note: we expect the LLM to return the complete fixed .spec.ts file content as a string
    console.log('runHealer: LLM returned fix, length:', fixedTest?.length ?? 0); // For debugging: you can log the first 500 chars of the fixed test to verify it's received correctly 
    // 4) Write the fixed test back to the same file
    await fs.writeFile(specPath, fixedTest, 'utf8');
    console.log('runHealer: fixed test written to:', specPath);
    return specPath;
}
//# sourceMappingURL=healer.js.map