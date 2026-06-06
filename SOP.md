# Site Update SOP

Use this standard process every time the London Birthday Trip site changes.

## Update Flow

1. Run the Drive preflight before editing when returning to the project:
   - `npm run drive:preflight`
2. Make the requested site or documentation edits.
3. Run the relevant local checks.
   - `npm run check` for JavaScript syntax.
   - Use browser or Playwright checks when layout or interaction changes.
4. Run the Drive preflight again before committing:
   - `npm run drive:preflight`
5. Commit the finished change.
6. Push to `main`.
7. Confirm the GitHub Pages deployment succeeds.
8. Print the live site URL for review:

https://mbediner.github.io/london-birthday-trip/

## Non-Negotiable

Every time a commit is pushed, the final response must include the live site URL.

## Google Drive Drift Rules

- Treat Google Drive as a sync layer, not as a dependency workspace.
- Do not install `node_modules`, virtual environments, build caches, or package locks into this folder.
- Use repo scripts and global tools for checks.
- Check for Drive conflict files before committing.
- Fetch from `origin` before editing and before pushing so remote drift is visible.
- Keep line endings stable through `.gitattributes`.

## Confirmation Screenshots

- Confirmation screenshots may be committed when the site owner explicitly approves making them public.
- Copy approved screenshots into `assets/` with clear names.
- Link the screenshot from the relevant itinerary section so it is easy to open on a phone.
- If exact confirmation numbers or PINs are not clearly legible, add fill-in fields instead of guessing.
