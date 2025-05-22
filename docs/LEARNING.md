# Next.js Project Learning Notes

## Project Structure Overview

### 1. Project Type
- Next.js project with TypeScript
- Uses modern App Router (Next.js 13+)

### 2. Key Configuration Files
- `tsconfig.json`: TypeScript configuration
- `next.config.ts`: Next.js configuration
- `package.json`: Project dependencies and scripts
- `postcss.config.mjs`: PostCSS configuration for styling
- `eslint.config.mjs`: ESLint configuration for code linting

### 3. Source Code Structure (`src/`)
The project uses the modern Next.js App Router with the following structure:
```
src/
└── app/
    ├── layout.tsx    # Root layout component
    ├── page.tsx      # Main page component (homepage)
    ├── globals.css   # Global styles
    └── favicon.ico   # Website favicon
```

### 4. Important Directories
- `public/`: Static assets (images, fonts, etc.)
- `.next/`: Build output and cache
- `node_modules/`: Project dependencies

### 5. TypeScript Configuration
- Strict TypeScript settings enabled
- Path aliases configured (`@/*` maps to `./src/*`)
- Supports modern JavaScript features (ES2017)
- Includes DOM and ESNext libraries

## Next.js App Router Concepts

### File-System Based Routing
- Pages are defined by `page.tsx` files
- Layouts are defined by `layout.tsx` files
- Routing is based on the file system structure

### Component Types
- Server Components (default)
- Client Components (when needed)

## Learning Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [React Documentation](https://react.dev/)

## Notes
- This document will be updated as we learn more about the project
- Add your own notes and learnings below

---

## Personal Notes
Add your personal learnings and notes here: 