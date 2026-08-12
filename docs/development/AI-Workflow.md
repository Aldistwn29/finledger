# AI Coding Workflow

## Request Format

Give the agent the goal, affected user flow, acceptance criteria, constraints, and expected validation commands. Ask it to inspect existing code before editing.

## Agent Contract

The agent must:

- inspect relevant source and documentation;
- explain assumptions that affect security or data integrity;
- make minimal, focused edits;
- add regression tests for behavior changes;
- never invent credentials or bypass authorization;
- run the project checks before reporting completion.

## Review Checklist

- Does the change preserve tenant isolation?
- Is authorization enforced server-side?
- Are external inputs validated?
- Are financial calculations authoritative and exact?
- Are writes atomic and duplicate-safe?
- Are secrets excluded from logs and client bundles?
- Are loading, error, empty, and responsive UI states covered?
- Do lint, typecheck, tests, and build pass?
