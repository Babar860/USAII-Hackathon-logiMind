# LogiMind AI Demo Checklist

1. Seed MongoDB Atlas:

   ```bash
   npm run seed:mongodb
   ```

2. Start the Next.js frontend:

   ```bash
   npm run dev
   ```

3. Start the standalone Express backend when demonstrating the Cloud Run API surface:

   ```bash
   npm run backend:dev
   ```

4. Ask in Agent Chat:

   ```txt
   Which shipments may miss SLA today?
   ```

5. Show:

   - risk scores
   - SLA breach probability
   - confidence
   - scenario comparisons
   - human approval
   - decision logs

6. Use MongoDB MCP to inspect:

   - `shipments`
   - `carriers`
   - `alerts`
   - `agent_logs`
   - `human_decisions`
