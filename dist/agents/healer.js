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
    const fixedTest = await callLLM(prompt); // Note: we expect the LLM to return the complete fixed .spec.ts file content as a string
    console.log('runHealer: LLM returned fix, length:', fixedTest?.length ?? 0); // For debugging: you can log the first 500 chars of the fixed test to verify it's received correctly 
    // 4) Write the fixed test back to the same file
    await fs.writeFile(specPath, fixedTest, 'utf8');
    console.log('runHealer: fixed test written to:', specPath);
    return specPath;
}
//# sourceMappingURL=healer.js.map