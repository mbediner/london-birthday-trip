# AGENTS.md

## Purpose

This project uses GitHub as the source of truth.

Read `SOP.md` before making changes and follow it as the primary operating procedure for this repo.

## Required Session Start Behavior

Before editing:

1. Confirm the folder is a Git repository.
2. Read `SOP.md`.
3. Inspect repo state:
   - `git status --short --branch`
   - `git remote -v`
   - `git branch --show-current`
4. If the working tree is clean:
   - `git fetch origin`
   - pull the current branch from `origin`
5. If the working tree is dirty:
   - do not blindly pull
   - inspect the changed files
   - explain the risk in plain English before taking action

## Required Working Style

1. Keep explanations simple and calm.
2. Do the Git work automatically when it is safe.
3. Do not ask the user to use GitHub Desktop.
4. Do not ask the user to manage Git manually unless there is a real blocker.
5. When changing behavior, run the relevant checks from `package.json`.
6. Keep documentation in sync with the actual workflow.

## Required End Of Session Behavior

When work is complete and safe to publish:

1. Review changed files.
2. Run the relevant QA checks.
3. Commit with a clear message.
4. Push to the active branch.
5. If production changed, verify deployment when practical.
6. Include the live site URL in the final response:
   - `https://mbediner.github.io/london-birthday-trip/`

## Safety Rules

1. Never manually edit `.git/`.
2. Never use destructive Git commands unless explicitly approved.
3. If Git state is unclear, pause and explain the blocker in plain English.
