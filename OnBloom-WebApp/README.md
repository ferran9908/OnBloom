# OnBloom (Powered by Qloo)

A modern HR onboarding platform built with Next.js 15, React Flow, and AI-powered automation (powered by Qloo).

## Features

- **Interactive Onboarding Canvas**: Visual flow-based onboarding experience using React Flow
- **AI-Powered Generation**: Intelligent onboarding plan generation with structured data
- **Four Key Categories**:
  - **People**: Connect new hires with relevant team members
  - **Processes**: Access to documentation, wikis, and procedures
  - **Training**: Curated video resources and learning materials
  - **Access**: System access management with priority levels
- **Beautiful Design**: Custom Onbloom design system with brand colors and typography

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 with CSS variables
- **UI Components**: shadcn/ui with Radix UI primitives
- **Visualization**: React Flow for interactive canvas
- **Package Manager**: Bun
- **Fonts**: Nunito Sans & Inter from Google Fonts

## Getting Started

### Prerequisites

- Node.js 18+
- Bun package manager

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/onbloom.git
cd onbloom

# Install dependencies
bun install
```

### Development

```bash
# Start development server with Turbopack
bun run dev
```

The application will be available at `http://localhost:3000`

### Build & Production

```bash
# Build for production
bun run build

# Start production server
bun start
```

### Linting

```bash
# Run ESLint
bun run lint
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── hr/                # HR-specific pages
│   │   └── initiate-onboarding/  # Onboarding canvas
│   └── api/               # API routes
│       └── onboarding/    # Onboarding endpoints
├── components/            # React components
│   ├── ui/               # Reusable UI components (shadcn/ui)
│   └── onboarding-flow/  # React Flow node components
└── lib/                  # Utilities and helpers
    └── onboarding-flow-layout.ts  # Flow layout algorithm
```

## Key Features

### Onboarding Canvas (`/hr/initiate-onboarding`)

Interactive visualization for creating and managing employee onboarding plans:

- **Employee Node**: Central node with employee details
- **Category Hubs**: Four main categories positioned at cardinal directions
- **Entity Nodes**: Specialized nodes for each category type
- **Flower Layout**: Aesthetically pleasing arrangement of entities

### API Endpoints

- `POST /api/onboarding/generate` - Generate structured onboarding data
- `GET /api/onboarding/stream` - Stream AI reasoning during generation

### Model Selection

We made sure to optimize model usage in a way that makes the most sense without compromising on quality. This led to us using a mixture of models to maximize the quality of output we got when combining insights from Qloo along with LLMs. More on this in [models.md](./models.md)

## Design System

### Brand Colors

- Primary: `#63264B` (deep purple)
- Secondary: `#FDBBBF` (soft pink)
- Accent Pink: `#EF8096`
- Accent Blue: `#7FAAC8`
- Accent Green: `#65CEA2`

### Typography

- **Title Font**: Nunito Sans (`.font-title`)
- **Body Font**: Inter (`.font-secondary`)
