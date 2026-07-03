# AGENTS — London Birthday Trip

Read this file first, every session, no exceptions.
It is the single source of truth for all AI agent behavior on this project.

---

## 1. Session Start Checklist (run before doing anything else)

```bash
git status --short --branch    # confirm repo state
git remote -v                  # confirm remote
```

- If working tree is **clean**: `git fetch origin && git pull`
- If working tree is **dirty**: inspect what changed, explain it, do not blindly pull over local work
- **Read `HANDOFF.md`** — catch up on last commit, cache token, and what the previous agent did
- Briefly confirm to the user: "On main, pulled latest. Last session: [one line from HANDOFF.md session log]."

---

## 2. Non-Negotiable Rules

- **Git is the source of truth.** Always commit and push. Never ask permission.
- **Never send release emails.** Dead requirement.
- **`npm run release:prepare` before every push** — busts cache, syntax check, unit tests, QA. No exceptions.
- **`gh run watch` after every push** — sit on it, wait for green. Do not present the URL until CI passes.
- **Never present the live URL** until CI is confirmed green.
- **Never use `--no-verify`, `--force`, or destructive git commands** without explicit user approval.
- **Update `HANDOFF.md` at the end of every session** — current state + session log entry.

---

## 3. The Full Release Workflow (every change, every agent)

This applies whether the change is big or small. Marianna does not know git — the agent handles all of it automatically.

```bash
# 1. Make the changes
# 2. Visual UAT at 375x812 mobile — use preview_start("london-trip") or npm run preview
# 3. Check for Drive conflict files
find . -name "*'s conflicted copy*" -not -path "./.git/*"

# 4. Run full QA pipeline
npm run release:prepare

# 5. Commit
git add <changed files>
git commit -m "descriptive message

Co-Authored-By: Claude <noreply@anthropic.com>"

# 6. Push
git push

# 7. Watch CI — do not proceed until green
gh run watch $(gh run list --limit 1 --json databaseId --jq '.[0].databaseId')

# 8. Update HANDOFF.md with new commit hash, cache token, and session log entry
# 9. Commit and push HANDOFF.md update
git add HANDOFF.md && git commit -m "Update HANDOFF.md" && git push

# 10. Present the cache-busted live URL
https://mbediner.github.io/london-birthday-trip/?v=<new-cache-token>
```

---

## 4. What to Update When

| What changed | File to update |
|---|---|
| Architecture, panels, design system, data locations, UX gotchas | `README.md` |
| Agent rules or SOP | `AGENTS.md` |
| **Every session end** | `HANDOFF.md` — update current state block + append session log entry |

---

## 5. UAT (required before every push)

- Always test at **375×812 mobile viewport**
- Use `preview_start("london-trip")` (Claude Preview MCP, port 4321) or `npm run preview` (port 4173)
- Navigate to every panel touched by the change
- Do not ship known visual issues — fix them in the same commit

---

## 6. HANDOFF.md — How to Update It

At end of every session, update the two sections in `HANDOFF.md`:

**Current State block** (top of file) — replace with:
- Last commit hash and message
- Current cache token (from index.html `?v=`)
- Live URL

**Session Log** (bottom of file) — prepend a new entry:
```
### Session — [Date] ([Agent name, e.g. Claude / Codex])
- [What was done, bullet by bullet]
- [Keep it terse — one line per meaningful change]
```

Then commit: `git add HANDOFF.md && git commit -m "Update HANDOFF.md" && git push`

---

## 7. Working Style

- Do the work, report the result. Keep explanations short.
- Run checks automatically — never ask the user to run them.
- Do not ask the user to manage git. Ever. Handle it.
- If something looks off during UAT, fix it before pushing — not after.
- Marianna is not technical. She will say "add X" or "change Y". Translate that into code, commit, push, hand her the URL.

---

## 8. Google Drive Note

This repo syncs via Google Drive (transport only — git is the source of truth). Before committing:
```bash
find . -name "*'s conflicted copy*" -not -path "./.git/*"
```
If conflict files exist, resolve them before staging.

---

## 9. Auth

- Remote: `https://github.com/mbediner/london-birthday-trip.git`
- Auth: `gh` CLI + osxkeychain
- If push fails auth: `gh auth login` via browser
## Google Drive drift (ALL agents & tools — read this)

This repo is checked out inside **Google Drive** and synced across multiple machines. Google Drive creates conflict-copies of files (names ending in ` 2`, ` 3`, …) — **including inside `.git/objects` and `.git/refs`** — which corrupt the repository. This has caused real breakage.

**Before starting work, and before committing, clean the drift:**

```
scripts/clean-drive-drift.sh --fix      # remove conflict-copies + verify with git fsck
scripts/clean-drive-drift.sh --check    # report only (exit 1 if any found)
```

- Runs automatically via git hooks (`pre-commit`, `post-merge`, `post-checkout`). If they are not active, run `git config core.hooksPath .githooks`.
- Dependency-free (bash + git) — works for Codex, Claude, Cursor, or a human. Claude also runs it at session start via `.claude/settings.json`.
- **Never commit a file whose name ends in ` 2`/` 3` — it is Drive junk, not a real file.**
