# Portfolio Website Agent Guide

## Context order

1. Read the route or component being changed and its tests.
2. Read `docs/PROJECT.md` for commands and invariants.
3. Read `docs/TASK.md` for the current redesign scope and checkpoint.
4. Inspect the current branch, working tree, and relevant pull request.
5. Use prior chat history only as supporting context.

Code is the primary source of truth. Keep durable decisions and project-specific guidance in the repository; do not copy full conversations into it.

For workflow conflicts, authority descends from this `AGENTS.md`, to the authoritative board or fallback task record for current status and scope, to recorded decision rationale, then to research notes as non-normative history. Code and tests remain the source of truth for current behavior.

## Task ownership

Use one task, branch, and worktree. The original redesign is released; subsequent work uses the branch recorded in `docs/TASK.md` within the assigned worktree. Do not edit the separate dirty `main` checkout.

Before starting another task, inspect active worktrees, task records, and open pull requests for behavioral or shared-resource overlap. A worktree does not isolate port 5173, browser sessions, package caches, credentials, or deployments.

When no board or issue provider is active, `docs/TASK.md` is a single-active-task fallback for the whole repository. Do not create a task index or database. Concurrent claims require a real authoritative provider.

## Lifecycle

The project owner makes work Ready and resolves scope. The assigned agent claims and implements it, keeps the task and pull request current, and responds to review. Reviewers record dispositions. A human retains merge and deploy authority.

- **Inbox:** a proposal is recorded but not authorized for implementation. Exit when the project owner rejects it or supplies the objective, acceptance criteria, non-goals, dependencies, and risk needed for Ready.
- **Ready:** the task is actionable and unclaimed. Exit when an agent completes overlap checks and durably records its owner, branch, and worktree as Claimed.
- **Claimed:** ownership is reserved but implementation has not started. Exit to In Progress when work begins.
- **In Progress:** the agent implements, tests, and keeps status, checkpoints, commits, evidence, and pull-request links current. Exit to Review when required evidence is posted, or to Blocked when progress cannot continue.
- **Review:** reviewers assess the change; the agent may respond, push fixes, and retest. Record each request as resolved, accepted for follow-up, or declined with rationale. Exit to Done only after acceptance criteria are met and a human accepts or merges the result. Deployment remains a separate human approval.
- **Done:** record the final revision or accepted no-merge outcome, evidence, and remaining follow-ups. Further work requires a new task.
- **Blocked:** may interrupt Claimed, In Progress, or Review. Record the blocker, decision owner, and next action; return to the prior active state when resolved.

Write every state transition to the authoritative board or, in fallback mode, `docs/TASK.md`.

## Change boundary

Inside this task and worktree, agents may inspect, edit, test, commit, push the task branch, open or update pull requests, respond to review, and collect proportional evidence without extra approval. Approval is required before merge, deployment, production access, destructive operations, security-boundary changes, secret access or exposure, paid services, dependency changes that materially alter the stack, or expansion beyond the approved redesign.

Preserve unrelated user changes.

## Verification

Run the relevant focused tests, then the required commands in `docs/PROJECT.md`. UI evidence should cover the concrete acceptance criteria. A recording is useful only when motion cannot be judged from representative still states and automated checks.

Any failed required check blocks completion unless the user explicitly accepts it.

## Handoff

Before pausing or transferring ownership, update the checkpoint in `docs/TASK.md` with the last useful commit, working-tree state, areas changed, checks and results, blocker or decision, and exact next action.
