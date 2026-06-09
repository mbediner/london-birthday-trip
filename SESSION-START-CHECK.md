# Session Start Check

Use this prompt at the beginning of a fresh Codex task for this project.

## Purpose

This is a safe verification run. It confirms that Codex can see the project, read the SOP, inspect Git state, and safely report whether the repo is ready for work.

## Paste Into Codex

```text
Please read the project SOP and do a startup verification only.

Do not change any code.
Do not commit.
Do not push.
Do not edit files.

1. Confirm whether this folder is a Git repository.
2. Read and follow the project SOP before doing anything else.
3. Show the current branch.
4. Show whether the working tree is clean or dirty.
5. Show the configured remote.
6. If the working tree is clean, fetch from origin and report whether anything new exists.
7. If the working tree is dirty, do not pull. Instead, explain what looks changed and whether it seems safe or risky.
8. Explain the result in plain English.
9. End with exactly one line:
STATUS: PASS
or
STATUS: FAIL
```

## What A Good Result Looks Like

- Codex confirms the folder is a Git repo.
- Codex identifies the branch.
- Codex reports whether the repo is clean or dirty.
- Codex shows the remote.
- Codex safely fetches only if the working tree is clean.
- Codex ends with `STATUS: PASS` or `STATUS: FAIL`.

## Important Rule

If Codex finds local changes, merge conflicts, missing Git access, or authentication problems, it should stop and explain the blocker instead of guessing.
