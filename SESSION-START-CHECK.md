# Session Start Check

Use this prompt at the beginning of a fresh Codex task for this project.

## Paste Into Codex

```text
Please read the project SOP and do a safe startup verification only.

Do not change code.
Do not commit.
Do not push.
Do not edit files.

1. Confirm whether this folder is a Git repository.
2. Read and follow `SOP.md`.
3. Show the current branch.
4. Show whether the working tree is clean or dirty.
5. Show the configured remote.
6. If the working tree is clean, fetch from origin and report whether anything new exists.
7. If the working tree is dirty, do not pull. Explain what changed and whether it seems safe or risky.
8. Explain the result in plain English.
9. End with exactly one line:
STATUS: PASS
or
STATUS: FAIL
```
