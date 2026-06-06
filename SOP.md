# Site Update SOP

Use this standard process every time the London Birthday Trip site changes.

## Update Flow

1. Make the requested site or documentation edits.
2. Run the relevant local checks.
   - `npm run check` for JavaScript syntax.
   - Use browser or Playwright checks when layout or interaction changes.
3. Commit the finished change.
4. Push to `main`.
5. Confirm the GitHub Pages deployment succeeds.
6. Print the live site URL for review:

https://mbediner.github.io/london-birthday-trip/

## Non-Negotiable

Every time a commit is pushed, the final response must include the live site URL.
