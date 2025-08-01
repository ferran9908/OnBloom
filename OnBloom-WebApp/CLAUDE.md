# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Development**: `bun run dev` (uses Turbopack for faster builds)
- **Build**: `bun run build` 
- **Production**: `bun start`
- **Lint**: `bun run lint`
- **Package Manager**: Use `bun` for all package management (install, add, remove)

## Architecture

This is a Next.js 15 application using the App Router with the following structure:

- **UI Framework**: Next.js 15 with React 19, TypeScript, and Tailwind CSS v4
- **Component System**: shadcn/ui components with Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming, "New York" style
- **Icons**: Lucide React
- **Fonts**: Nunito Sans (Futura alternative) and Inter (Okomito alternative) from Google Fonts

### Key Directories

- `src/app/`: Next.js App Router pages and layouts
- `src/components/ui/`: Reusable UI components (shadcn/ui style)
- `src/lib/`: Utilities (includes `cn` function for className merging)

### Component Patterns

- Uses shadcn/ui component architecture with `components.json` configuration
- Components use class-variance-authority (cva) for variant styling
- `cn` utility function combines clsx and tailwind-merge for className handling
- Path aliases configured: `@/components`, `@/lib`, `@/hooks`, `@/ui`

### Styling Approach

- Tailwind CSS v4 with CSS variables for theming
- Uses Onbloom brand design system with custom color palette
- Component variants defined with cva for consistent styling patterns

## Onbloom Design System

### Brand Colors
- **Primary**: #63264B (deep purple)
- **Secondary**: #FDBBBF (soft pink)
- **Accent Pink**: #EF8096
- **Accent Blue**: #7FAAC8
- **Accent Green**: #65CEA2
- **Neutral**: #FDDEDD (background)
- **Success**: #00A672
- **Error**: #DF6785
- **Info**: #B2DCFA
- **Warning**: #BC9462
- **Dark Purple**: #40265C
- **Dark Brown**: #572834

### Typography
- **Title Font**: Nunito Sans (Futura alternative) - geometric sans-serif
- **Secondary Font**: Inter (Okomito alternative) - clean, readable
- Font classes: `.font-title` and `.font-secondary`

### Custom Utilities
- Brand color classes: `.text-onbloom-*`, `.bg-onbloom-*`, `.border-onbloom-*`
- All Onbloom brand colors are available as CSS custom properties and Tailwind utilities
- Dark mode uses darker variants of the Onbloom palette

## React Flow Onboarding Canvas

The onboarding feature (`/hr/initiate-onboarding`) uses React Flow to create an interactive visualization:

### Architecture
- **Canvas Component**: `src/app/hr/initiate-onboarding/page.tsx` - Main page with React Flow canvas
- **Node Components**: `src/components/onboarding-flow/` - Custom node types for each entity
- **Layout Algorithm**: `src/lib/onboarding-flow-layout.ts` - Flower-like positioning logic
- **API Endpoints**: 
  - `/api/onboarding/generate` - Generates structured onboarding data using AI
  - `/api/onboarding/stream` - Streams AI reasoning during generation

### Node Types
1. **Employee Node** (center): Gradient card with employee details
2. **Category Nodes**: 4 main hubs (People, Processes, Training, Access)
3. **Entity Nodes**: Specialized designs for each category type

### Data Structure
- **People**: Direct/indirect connections with reasoning for relevance
- **Processes**: Documentation, wikis, and procedures (notion/web/internal)
- **Training**: Video resources with duration and source
- **Access**: System access checklist with priority levels

### Layout Pattern
- Employee at center (0,0)
- Categories at cardinal directions (People-right, Access-top, Training-left, Processes-bottom)
- Entities spread around their category nodes in a flower pattern