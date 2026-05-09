# AI Coding Rules

## Template UI - Ask Before API Changes

When working on frontend/template UI:
- Before creating, modifying, or redesigning any API endpoint, ASK the user:
  "Do you have access to the backend? Should I suggest API changes or work with the existing API as-is?"
- If user confirms backend access: propose API improvements (naming, structure, response format)
- If no backend access: work only with the existing API contract, do not assume or suggest changes
- Never silently change API calls or data structures without asking first

## Project Structure

- Keep files under 600 lines. Maximum 900 lines. If exceeded, split into smaller modules
- Group related files together (component + styles + tests in same folder)
- Use index.ts re-exports for clean imports
- One concern per file, do not mix unrelated logic
- Delete unused files, do not comment them out

## Coding Standards

- TypeScript: strict mode, no `any` type
- Use const over let, prefer readonly
- Naming: camelCase for variables/functions, PascalCase for classes/types/interfaces, kebab-case for file names
  - Import order: external packages first, then internal modules, then relative imports
- Error handling: always catch, never swallow errors silently
- No console.log in production code, use proper logging
- Use early returns to reduce nesting

## Fix Issues Properly

- Fix the root cause, do not add @ts-ignore or workaround hacks
- If a fix requires changing multiple files, do it properly across all files
- Clean up deprecated code when encountered
- Report issues you cannot fix rather than leaving them broken silently
