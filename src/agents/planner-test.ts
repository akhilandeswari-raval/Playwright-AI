// src/agents/planner-test.ts
import { runPlanner } from './planner';

(async () => {
  try {
  const intent = 'Checkout flow for logged-in user';
  console.log('Running planner for intent:', intent);

  const planPath = await runPlanner(intent, 'dev');

  console.log('Planner wrote plan to:', planPath);
  } catch (err) {
    console.error('Planner error:', err);
  }

})();
