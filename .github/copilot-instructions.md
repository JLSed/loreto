# Loreto Project - AI Coding Instructions

## Project Overview

**Loreto** is a comprehensive business management platform built with Next.js 14 (App Router) that combines:

- **Custom 2D Box Designer**: Visual box customization with drag-and-drop interface and real-time rendering
- **Apartment Rental Management**: Tenant management, inquiries, and automated email notifications
- **Vehicle Booking System**: Fleet management with booking workflows and status tracking
- **Multi-role Dashboard**: Admin/staff/customer role-based access control

## Architecture & Key Technologies

### Tech Stack

- **Framework**: Next.js 14 with App Router
- **Database**: PostgreSQL with Prisma ORM
- **Auth**: NextAuth.js (Google OAuth + credentials)
- **UI**: Radix UI + Tailwind CSS + shadcn/ui
- **State**: TanStack Query for server state
- **Email**: Nodemailer for automated notifications
- **File Upload**: Cloudinary integration
- **Testing**: Jest + Testing Library

### Project Structure

```
src/
├── app/(main)/           # Main app routes with shared layout
│   ├── dashboard/        # Admin/staff management interface
│   ├── apartments/       # Public apartment listings
│   ├── vehicles/         # Vehicle booking system
│   └── box/              # 2D box designer tool
├── common/
│   ├── configs/          # Prisma, auth, cloud configs
│   ├── enums/           # Database enums (status codes, roles)
│   └── services/        # Email service
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── shared/          # Reusable business components
│   └── moveable/        # Box designer components
└── lib/                 # Utilities and server-only functions
```

## Development Patterns

### Server Actions Pattern

All database operations use Next.js Server Actions in `*-actions.ts` files:

```typescript
'use server'
import { prisma } from '@/common/configs/prisma'

export async function getCustomerBoxes() {
  return prisma.box.findMany({
    include: { markings: true, imageMarkings: true },
  })
}
```

### Database Operations

- **Always use Prisma transactions** for multi-table operations
- **Include audit logging** for critical operations (see `AuditLog` model)
- **Status management**: Use numeric enums from `src/common/enums/enums.db.ts`

### Authentication & Authorization

- Session management via NextAuth.js in `src/common/configs/auth.ts`
- Role-based access: Admin (1), Staff (2), Customer (3)
- Server-side session validation: `getServerSession(authOptions)`

### Status Management System

The app uses numeric status codes extensively:

- **Users**: 1=Active, 2=Inactive, 3=Banned, 4=Deleted
- **Bookings**: 0=Cancelled, 1=Pending, 2=Confirmed, 3=OnTheRoad, 4=Completed, 5=Declined
- **Apartments**: 0=Available, 1=Occupied
- **Vehicles**: 1=Available, 2=Booked, 3=Rented, 4=OnTheRoad, 5=UnderMaintenance

## Key Business Logic

### Email Notifications

- **Tenant Due Date Reminders**: Automated cron job at `/api/notify-tenants`
- **Booking Status Updates**: Triggered on status changes
- **Apartment Inquiries**: Confirmation emails to prospects

### Box Designer System

- **2D Canvas**: Uses `react-moveable` for drag-and-drop interface
- **Transform Storage**: CSS transforms stored as strings in database
- **Quality Levels**: Different pricing tiers for box materials
- **Order Workflow**: Cart → Place Order → Payment Confirmation → Processing

### Vehicle Booking Flow

1. Customer selects vehicle and travel type (one-way/round-trip/hourly)
2. Creates booking with pickup/destination details
3. Payment transaction created alongside booking
4. Admin manages booking status through dashboard
5. Email notifications sent at each status change

## Development Workflows

### Database Changes

```bash
# Generate Prisma client after schema changes
npx prisma generate

# Create migration
npx prisma migrate dev --name description

# Seed database
npm run db:seed
```

### Development Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production (includes Prisma generate)
npm run test         # Run Jest tests
npm run lint         # ESLint check
```

### Environment Setup

Required environment variables:

- `DATABASE_URL`: PostgreSQL connection
- `NEXTAUTH_SECRET`: Auth secret
- `GOOGLE_CLIENT_ID/SECRET`: OAuth credentials
- `CLOUDINARY_*`: Image upload service
- Email service credentials for notifications

## Component Conventions

### Form Handling

- Use `react-hook-form` with Zod validation
- Server Actions for form submission
- Status labels from `src/components/shared/*StatusLabel.tsx`

### Data Tables

- Standard pattern: `DataTable.tsx` component with TanStack Table
- Server-side pagination in dashboard views
- Status badges and action buttons in table rows

### File Organization

- **Actions**: `*-actions.ts` files contain Server Actions
- **Schemas**: Zod schemas for validation (e.g., `new-user-schema.ts`)
- **Components**: Business logic components in feature directories

## Testing Strategy

- Unit tests in `__tests__/` directory
- Focus on business logic and utility functions
- Database operations tested with transaction rollbacks

When working on this codebase, prioritize understanding the status management system and the relationship between the three main business domains (boxes, apartments, vehicles).
