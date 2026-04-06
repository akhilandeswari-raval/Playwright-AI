import { runPlanner } from "./planner";

(async () => {
    try{
        const intention = "Login flow for new user";
        console.log("Running planner for intention:", intention);
        const plannerPath = await runPlanner(intention, "dev");
        console.log("Planner wrote plan to:", plannerPath);

    } catch (err) {
        console.error('Planner error:', err);
    }
})();