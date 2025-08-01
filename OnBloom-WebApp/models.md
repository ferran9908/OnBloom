# Onbloom Models Documentation

## Overview

This document provides a comprehensive overview of all data models, types, and schemas used in the Onbloom application. The codebase follows a type-first development approach with extensive use of TypeScript interfaces and Zod validation schemas.

## Table of Contents

1. [Core Employee Models](#core-employee-models)
2. [Onboarding Flow Models](#onboarding-flow-models)
3. [Relationship Analysis Models](#relationship-analysis-models)
4. [Gift Management Models](#gift-management-models)
5. [External API Integration Models](#external-api-integration-models)
6. [API Route Models](#api-route-models)
7. [Component Props Models](#component-props-models)
8. [Authentication Models](#authentication-models)

## Core Employee Models

### EmployeeCulturalProfile

**Location**: `src/service/notion.ts:9`

Primary employee entity model integrated with Notion database.

```typescript
interface EmployeeCulturalProfile {
  id: string
  name: string
  email: string
  employeeId: string
  department: string
  role: string
  startDate: string
  location: string
  timeZone: string
  ageRange: string
  genderIdentity: string
  culturalHeritage: string
  tags: string[]
}
```

### Employee CRUD Operations

**Location**: `src/trpc/routers/employee.ts`

Zod validation schemas for employee operations:
- `createEmployeeSchema`: Employee creation validation
- `updateEmployeeSchema`: Employee update validation with optional fields

## Onboarding Flow Models

### Core Entity Interfaces

**Location**: `src/types/onboarding-flow.ts`

#### PersonEntity
```typescript
interface PersonEntity {
  id: string
  name: string
  role: string
  department: string
  connectionType: string[]
  relevance: number
  reasoning: string
}
```

#### ProcessEntity
```typescript
interface ProcessEntity {
  id: string
  title: string
  type: 'article' | 'wiki' | 'policy' | 'procedure'
  category: string
  priority: 'high' | 'medium' | 'low'
  estimatedTime: string
  source: 'notion' | 'web' | 'internal'
  url?: string
}
```

#### TrainingEntity
```typescript
interface TrainingEntity {
  id: string
  title: string
  type: 'video' | 'course' | 'workshop'
  duration: string
  instructor?: string
  platform: string
  mandatory: boolean
  dueDate?: string
}
```

#### AccessEntity
```typescript
interface AccessEntity {
  id: string
  system: string
  type: 'application' | 'platform' | 'tool'
  priority: 'immediate' | 'week1' | 'month1'
  requiresApproval: boolean
  approver?: string
  notes?: string
}
```

### OnboardingData Structure

**Location**: `src/types/onboarding-flow.ts:57`

Main container for all onboarding entities:
```typescript
interface OnboardingData {
  employee: EmployeeCulturalProfile
  people: PersonEntity[]
  processes: ProcessEntity[]
  training: TrainingEntity[]
  access: AccessEntity[]
}
```

## Relationship Analysis Models

### Connection Types

**Location**: `src/service/relationship-analysis.ts:5`

```typescript
type ConnectionType = 
  | 'same_team' 
  | 'cultural_heritage' 
  | 'potential_mentor'
  | 'social_buddy' 
  | 'cross_functional_partner'
  | 'knowledge_expert'
  | 'onboarding_buddy'
  | 'leadership'
  | 'shared_interests'
  | 'location_based'
  | 'time_zone_aligned'
  | 'diversity_connection'
  | 'skill_complement'
  | 'collaboration_history'
```

### EmployeeRelationship

**Location**: `src/service/relationship-analysis.ts:21`

```typescript
interface EmployeeRelationship {
  employee: EmployeeCulturalProfile
  connectionTypes: ConnectionType[]
  relevanceScore: number
  reasoning: string
}
```

## Gift Management Models

### StoredGift

**Location**: `src/lib/redis-gift.ts:5`

Complete gift record with tracking:
```typescript
interface StoredGift {
  id: string
  recipientId: string
  recipientName: string
  recipientEmail: string
  senderId: string
  senderName: string
  senderEmail: string
  qloo: QlooEntity
  sentDate: string
  status: 'TBD' | 'Accepted' | 'Denied' | 'purchased' | 'delivered'
  category?: string
  notes?: string
  tags?: string[]
}
```

## External API Integration Models

### Qloo API Models

**Location**: `src/lib/qloo.ts`

#### QlooEntity
```typescript
interface QlooEntity {
  id: string
  name: string
  category: string
  description?: string
  image?: string
  price?: number
  url?: string
  geo?: {
    address?: string
    latitude?: number
    longitude?: number
  }
  popularity?: number
  metadata?: Record<string, any>
}
```

#### InsightsParams
Demographics and preference-based filtering:
```typescript
interface InsightsParams {
  category: string
  location?: string
  ageGroups?: string[]
  gender?: 'male' | 'female' | 'non-binary'
  interests?: string[]
  limit?: number
}
```

### Notion API Integration

**Location**: `src/service/notion.ts`

Uses the official Notion SDK with custom property mappings for employee data synchronization.

## API Route Models

### Gift API Schemas

**Location**: `src/app/api/gifts/`

- `SelectGiftRequest`: Gift selection with recipient metadata
- `RecommendationsRequest`: Parameters for AI-powered recommendations
- `QlooEntitySchema`: Zod validation for external API responses

### Onboarding API Schemas

**Location**: `src/app/api/onboarding/`

Comprehensive Zod schemas for streaming AI-generated onboarding content:
- `OnboardingPersonSchema`
- `OnboardingProcessSchema`
- `OnboardingTrainingSchema`
- `OnboardingAccessSchema`

## Component Props Models

### React Flow Node Props

**Location**: `src/components/onboarding-flow/`

- `EmployeeNodeProps`: Center node display properties
- `CategoryNodeProps`: Hub node configuration
- `EntityNodeProps`: Individual entity node properties

### UI Component Props

Various component interfaces for type-safe prop passing:
- `GiftCardProps`: Gift display card properties
- `RelationshipCardProps`: Employee connection display
- `OnboardEmployeeModalProps`: Modal form properties

## Authentication Models

### Global Type Definitions

**Location**: `src/types/global.d.ts`

```typescript
type Roles = 'hr' | 'employee'

interface CustomJwtSessionClaims {
  email?: string
  roles?: Roles
}
```

## Architecture Patterns

1. **Type-First Development**: All data structures are strongly typed with TypeScript
2. **Runtime Validation**: Zod schemas provide runtime type checking for API boundaries
3. **Separation of Concerns**: Clear distinction between data models, API contracts, and UI props
4. **AI Integration**: Structured schemas for validating AI-generated content
5. **External API Abstraction**: Clean interfaces for third-party service integration

## Best Practices

1. Always define TypeScript interfaces for data structures
2. Use Zod schemas for API input/output validation
3. Keep model definitions close to their usage (co-location)
4. Maintain separate types for different concerns (API vs UI)
5. Document complex business logic in model definitions
6. Use discriminated unions for variant types
7. Leverage TypeScript's type inference where possible