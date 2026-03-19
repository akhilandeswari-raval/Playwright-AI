"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/agents/planner-test.ts
const planner_1 = require("./planner");
(async () => {
    try {
        const intent = 'Checkout flow for logged-in user';
        console.log('Running planner for intent:', intent);
        const planPath = await (0, planner_1.runPlanner)(intent, 'dev');
        console.log('Planner wrote plan to:', planPath);
    }
    catch (err) {
        console.error('Planner error:', err);
    }
})();
//# sourceMappingURL=planner-test.js.map