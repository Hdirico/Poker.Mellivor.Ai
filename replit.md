# Mellipoker.AI

## Overview

Mellipoker.AI is a modern, minimalist poker web application built with a software-first design philosophy. The project emphasizes a clean, tech-forward aesthetic inspired by premium productivity apps like Linear, Notion, and Arc browser, deliberately avoiding casino-style elements. It features a React frontend with a polished poker table interface and an Express backend that integrates with an external MCP (Model Context Protocol) poker server.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript, using Vite as the build tool
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack React Query for server state and data fetching
- **Styling**: Tailwind CSS v4 with shadcn/ui component library (New York style variant)
- **Animations**: Framer Motion for card dealing and UI animations
- **Typography**: Inter for UI text, JetBrains Mono for numbers and statistics (chip counts, bets, pot amounts)
- **Theme System**: Light/dark mode with persistent state, using CSS custom properties

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Build System**: esbuild for server bundling, Vite for client bundling
- **API Pattern**: REST endpoints that proxy to an external MCP poker server
- **Development**: Hot module replacement via Vite middleware in development mode

### Data Storage
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Location**: `shared/schema.ts` for shared type definitions
- **Current Storage**: In-memory storage implementation (`MemStorage`) with interface for future database migration
- **User Schema**: Basic users table with id, username, and password fields

### Key Design Patterns
- **Shared Types**: The `shared/` directory contains schema definitions used by both frontend and backend
- **Component Organization**: Poker-specific components in `client/src/components/poker/`, reusable UI components in `client/src/components/ui/`
- **Path Aliases**: `@/` maps to client source, `@shared/` to shared directory, `@assets/` to attached assets

## External Dependencies

### External Services
- **MCP Poker Server**: `https://portal-poker.azurewebsites.net/mcp` - External poker game logic server accessed via REST API proxy endpoints

### Database
- **PostgreSQL**: Required for production (DATABASE_URL environment variable), uses Drizzle ORM for schema management and queries

### Key Frontend Libraries
- **Radix UI**: Comprehensive accessible component primitives (dialogs, dropdowns, tooltips, etc.)
- **Framer Motion**: Animation library for card dealing effects
- **Embla Carousel**: Carousel component support

### Key Backend Libraries
- **Express Session**: Session management with connect-pg-simple for PostgreSQL session storage
- **Drizzle Kit**: Database migration and schema push tooling