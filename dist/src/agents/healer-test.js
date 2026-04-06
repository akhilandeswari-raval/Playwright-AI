"use strict";
// src/agents/healer-test.ts
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const path = tslib_1.__importStar(require("path"));
const healer_1 = require("./healer");
(async () => {
    try {
        const projectRoot = path.resolve(__dirname, '..', '..');
        // 1) Point to whichever spec file is failing
        const specPath = path.join(projectRoot, 'tests', 'ai', 'checkout-flow-for-logged-in-user.spec.ts');
        // 2) Paste the Playwright error output here (copy from your terminal)
        const errorMessage = `
      Error: expect(locator).toHaveText(expected) failed
    Locator: locator('.error-message')
    Expected: "Epic sadface: Sorry, this user has been locked out."
    Timeout: 5000ms
    Error: element(s) not found

Call log:
  - Expect "toHaveText" with timeout 5000ms
  - waiting for locator('.error-message')

    at tests\ai\checkout-flow-for-logged-in-user.spec.ts:35:54
    `;
        console.log('Running healer for:', specPath);
        const fixedPath = await (0, healer_1.runHealer)({ specPath, errorMessage });
        console.log('Healer fixed test at:', fixedPath);
        console.log('Now re-run: npx playwright test', fixedPath);
    }
    catch (err) {
        console.error('Healer error:', err);
    }
})();
//# sourceMappingURL=healer-test.js.map