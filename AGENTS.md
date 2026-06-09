# AGENTS — London Birthday Trip

Read this before doing anything. It is the single source of truth for AI agent behavior on this project.

---

## Session Start (every session, no exceptions)

1. Confirm this is a Git repo: `git status --short --branch`
2. Check remote: `git remote -v`
3. If working tree is clean: `git fetch origin && git pull`
4. If working tree is dirty: inspect changes, explain the situation, do not blindly pull
5. Read `HANDOFF.md` — it has the last known state, cache token, and pending items
6. Then proceed with the requested task

---

## Non-Negotiable Rules

- **Git is the source of truth.** Commit and push after every meaningful change. Do not ask for permission.
- **Never send release emails.** That requirement is permanently dead.
- **Always run `npm run release:prepare`** before pushing to production — it busts cache, checks syntax, runs unit tests and QA.
- **Always `gh run watch`** after pushing — confirm CI is green before presenting the live URL.
- **Never present the live URL** until the new deploy is confirmed green.
- **Never use `--no-verify`, `--force`, or destructive git commands** without explicit approval.
- GitHub remote: `https://github.com/mbediner/london-birthday-trip.git` (HTTPS, auth via gh CLI + osxkeychain)

---

## Release Workflow

```bash
npm run release:prepare       # mandatory before every production push
git add <changed files>
git commit -m "clear message"
git push
gh run watch                  # wait for green
# then present: https://mbediner.github.io/london-birthday-trip/
```

---

## What to Update When

| What changed | File to update |
|---|---|
| Architecture, panels, design system, data shape, UX gotchas | `README.md` |
| Every commit/push | `HANDOFF.md` — current state, cache token, pending items |
| These agent rules | `AGENTS.md` |

---

## UAT Before Every Push

Always visually verify at **375×812 mobile viewport** before pushing. Use the Claude Preview MCP (`preview_start("london-trip")`) or `npx serve -p 4321`. Do not rely on static analysis alone — run the app.

---

## Working Style

- Keep explanations short. Do the work, report the result.
- Run the relevant checks automatically — do not ask the user to run them.
- Do not ask the user to manage Git unless there is a real, specific blocker.
- When something looks off during UAT, fix it in the same commit — do not ship known issues.

---

## End of Session

1. Run `npm run release:prepare`
2. Commit all changed files
3. Push
4. `gh run watch` — confirm green
5. Update `HANDOFF.md` with current state
6. Present the live URL: **https://mbediner.github.io/london-birthday-trip/**

---

## Google Drive Note

This repo lives inside Google Drive (sync layer only — not the source of truth). Before committing, check for Drive conflict files: `find . -name "* (*'s conflicted copy*" -not -path "./.git/*"`. If found, resolve before committing.
