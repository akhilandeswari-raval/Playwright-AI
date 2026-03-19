"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runPlanner = runPlanner;
const tslib_1 = require("tslib");
// ../agents/planner.ts
// Tell TS this is a JS module:
const { callLLM } = require('../../src/llmClient.js');
const fs = tslib_1.__importStar(require("fs/promises"));
const path = tslib_1.__importStar(require("path"));
async function runPlanner(intent, env = 'dev') {
    const prompt = `You are a test planner for a SaaS web app.

Environment: ${env}

User intent: "${intent}"

Create a concise markdown test plan with the following sections:
- Title
- Preconditions
- Test Data
- Steps (numbered)
- Assertions (bullet list)

Be specific but do not include implementation details like CSS selectors.
`;
    // 1) Get the plan text from the local LLM
    const planText = await callLLM(prompt);
    // 2) Decide on a file name like "checkout-flow-for-logged-in-user.md"
    const fileName = intent
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9\-]/g, '');
    // 3) Build an absolute path to the /plans folder in your project root
    const projectRoot = path.resolve(__dirname, '..', '..'); // dist/agents -> dist -> project root
    const plansDir = path.join(projectRoot, 'plans');
    const filePath = path.join(plansDir, `${fileName}.md`);
    // 4) Ensure the /plans directory exists
    await fs.mkdir(plansDir, { recursive: true });
    // 5) Write the markdown plan to disk
    await fs.writeFile(filePath, planText, 'utf8');
    // 6) Return the file path
    return filePath;
}
//# sourceMappingURL=planner.js.map