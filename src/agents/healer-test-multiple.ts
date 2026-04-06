// src/agents/healer-test.ts

import * as path from 'path';
import * as fs from 'fs/promises';
import { runHealer, HealerInput } from './healer';

// Shape of one test result entry in Playwright's JSON report
interface PlaywrightResult {
  status: 'passed' | 'failed' | 'timedOut' | 'skipped';
  errors: Array<{ message: string }>;
}

interface PlaywrightSuite {
  title: string;
  file?: string;             // absolute path to the .spec.ts file
  specs: Array<{
    title: string;
    tests: PlaywrightResult[];
  }>;
  suites?: PlaywrightSuite[]; // Playwright nests suites
}

interface PlaywrightReport {
  suites: PlaywrightSuite[];
}

// Recursively walk nested suites to find all failures
function collectFailures(
  suites: PlaywrightSuite[],
  failures: HealerInput[]
): void {
  for (const suite of suites) {
    // If this suite has a file, check its specs for failures
    if (suite.file) {
      for (const spec of suite.specs || []) {
        for (const test of spec.tests || []) {
          if (test.status === 'failed' || test.status === 'timedOut') {
            const errorMessage = test.errors
              .map((e) => e.message)
              .join('\n');

            failures.push({
              specPath: suite.file,   // absolute path Playwright gives us
              errorMessage,
            });
          }
        }
      }
    }

    // Recurse into nested suites
    if (suite.suites && suite.suites.length > 0) {
      collectFailures(suite.suites, failures);
    }
  }
}

async function healAllFailures() {
  const projectRoot = path.resolve(__dirname, '..', '..');
  const reportPath = path.join(projectRoot, 'test-results.json');

  // 1) Check the report file exists
  try {
    await fs.access(reportPath);
  } catch {
    console.error('healer-test: test-results.json not found.');
    console.error('Run: npx playwright test tests/ai first.');
    return;
  }

  // 2) Read and parse the Playwright JSON report
  const raw = await fs.readFile(reportPath, 'utf8');
  const report: PlaywrightReport = JSON.parse(raw);

  // 3) Walk all suites and collect every failure into one flat list
  const failures: HealerInput[] = [];
  collectFailures(report.suites, failures);

  if (failures.length === 0) {
    console.log('healer-test: No failures found in test-results.json. Nothing to heal!');
    return;
  }

  console.log(`healer-test: Found ${failures.length} failure(s). Starting healer...\n`);

  // 4) Deduplicate — if the same file has multiple failing tests,
  //    only heal it once (the file itself gets fully rewritten)
  const seen = new Set<string>();
  const uniqueFailures = failures.filter((f) => {
    if (seen.has(f.specPath)) return false;
    seen.add(f.specPath);
    return true;
  });

  console.log(`healer-test: ${uniqueFailures.length} unique file(s) to heal.\n`);

  // 5) Heal each failing file one by one
  for (const failure of uniqueFailures) {
    console.log('healer-test: Healing:', failure.specPath);
    console.log('healer-test: Error snippet:', failure.errorMessage.slice(0, 200));

    try {
      const fixedPath = await runHealer(failure);
      console.log('healer-test: Fixed:', fixedPath, '\n');
    } catch (err) {
      console.error('healer-test: Failed to heal', failure.specPath, err, '\n');
    }
  }

  console.log('healer-test: Done healing all failures.');
  console.log('Re-run: npx playwright test tests/ai');
}

(async () => {
  await healAllFailures();
})();