"use strict";
// src/agents/generator-test.ts
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const path = tslib_1.__importStar(require("path"));
const fs = tslib_1.__importStar(require("fs/promises"));
const generator_1 = require("./generator");
async function runForAllPlans() {
    const projectRoot = path.resolve(__dirname, '..', '..'); // dist/agents -> dist -> root
    const plansDir = path.join(projectRoot, 'plans'); // This should resolve to something like: /path/to/project/plans
    console.log('Generator-test: scanning plans dir:', plansDir); //  Debug log to verify the path is correct
    let entries; // This will hold the list of files in the plans directory
    try {
        entries = await fs.readdir(plansDir); // Read the contents of the plans directory. This will throw if the directory does not exist or is not readable
    }
    catch {
        console.error('Generator-test: plans directory not found:', plansDir);
        return;
    }
    const planFiles = entries.filter((name) => name.toLowerCase().endsWith('.md')); // Filter the entries to only include .md files, which are our test plans. This is a simple way to ignore any non-markdown files that might be in the directory
    if (planFiles.length === 0) { // If there are no .md files, log a message and exit
        console.log('Generator-test: no .md plan files found.');
        return;
    }
    for (const file of planFiles) { // Loop through each markdown file and run the generator on it
        const planPath = path.join(plansDir, file); // Construct the full path to the plan file. This will be passed to the generator, which will read the plan from this location
        console.log('\nGenerator-test: generating test for plan:', planPath);
        try {
            const outPath = await (0, generator_1.runGenerator)(planPath); // This will read the plan, call the LLM to generate the test, and write it to disk. It returns the path to the generated test file.
            console.log('Generator-test: test written to:', outPath);
        }
        catch (err) {
            console.error('Generator-test: error for plan', planPath, err);
        }
    }
    console.log('\nGenerator-test: done processing all plans.');
}
(async () => {
    await runForAllPlans(); // Run the generator for all markdown plans in the plans directory
})();
//# sourceMappingURL=generator-test-multiple.js.map