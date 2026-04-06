// src/agents/generator-test.ts

import * as path from 'path';
import * as fs from 'fs/promises';
import { runGenerator } from './generator';

(async () => {
  try {
    console.log('Generator-test: starting');

    // First I will define the filename which I want to read as input for the generator. This should be a markdown file with a test plan in it. The generator will read this file, 
    // call the LLM to convert it into a TypeScript Playwright test, and then write that test to disk.
    const intentSlug = 'checkout-flow-for-logged-in-user';
    const projectRoot = path.resolve(__dirname, '..', '..'); // dist/agents -> dist -> root // I want to read the plan from the "plans" directory at the root of the project
    const planPath = path.join(projectRoot, 'plans', `${intentSlug}.md`); // This should resolve to something like: /path/to/project/plans/checkout-flow-for-logged-in-user.md

    console.log('Generator-test: expecting plan at:', planPath);

    // Check that the plan file exists before calling the LLM
    try {
      await fs.access(planPath); // This will throw if the file does not exist or is not readable
      console.log('Generator-test: plan file exists');
    } catch {
      console.error('Generator-test: plan file NOT found at this path');
      return;
    }

    const outPath = await runGenerator(planPath); // This will read the plan, call the LLM to generate the test, and write it to disk. It returns the path to the generated test file.

    console.log('Generator-test: generator completed');
    console.log('Generator-test: test written to:', outPath);
    console.log('You can run it with: npx playwright test', outPath);
  } catch (err) {
    console.error('Generator-test: error:', err);
  }
})(); // I wrapped everything in an async IIFE so that I can use await at the top level. This script will read a test plan from a markdown file, generate a Playwright test using the LLM, and write the test to disk. It also includes error handling to check for the existence of the plan file and to catch any errors that occur during generation.
