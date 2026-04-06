"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const planner_1 = require("./planner");
(async () => {
    try {
        const intention = "Login flow for new user";
        console.log("Running planner for intention:", intention);
        const plannerPath = await (0, planner_1.runPlanner)(intention, "dev");
        console.log("Planner wrote plan to:", plannerPath);
    }
    catch (err) {
        console.error('Planner error:', err);
    }
})();
//# sourceMappingURL=planner_practice.js.map