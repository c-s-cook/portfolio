# Portfolio CMS - Dynamic Content Management System

A full-stack **content management system** built with Next.js that serves as a dynamic portfolio showcase for web developers. The application features a public-facing portfolio display, authenticated admin publishing tools, and serverless cloud infrastructure for asset management.

## Overview

This application demonstrates proficiency across multiple technical tiers:

- **Frontend**: Next.js 16 with React 19, TypeScript, and dynamic routing
- **Backend**: AWS Lambda functions for serverless image processing and data management
- **Database**: MongoDB Atlas (user authentication) + AWS DynamoDB (portfolio content)
- **Storage**: AWS S3 with CloudFront CDN for optimized image delivery
- **Email**: Nodemailer with DreamHost SMTP for transactional emails

## Key Features

### 👥 Public Portfolio Display
- Browse projects and certifications with rich media galleries
- Dynamic carousel preview system
- Tag-based filtering and categorization
- Mobile-responsive design

### 🔐 Authentication System
- User signup with email verification
- Secure login with JWT token-based sessions (20-minute expiry)
- Password reset functionality with token validation
- Protected admin publishing routes

### 📊 Admin Dashboard
- Overview of published projects and certifications
- System metrics and statistics
- Quick access to publishing tools

### 📝 Publishing System
- Create and edit portfolio items (projects & certifications)
- Rich text editor (Quill) for detailed content
- Auto-save functionality using sessionStorage
- Form validation with real-time feedback
- **Slug-based URL generation** for SEO-friendly links

### 🖼️ PhotoUpload Component ⭐ (Featured)
The **PhotoUpload** component (located in [app/components/AddItems/PhotoUpload.tsx](app/components/AddItems/PhotoUpload.tsx)) is a sophisticated image management tool:

**Capabilities:**
- Drag-and-drop or click-to-select image uploads (JPEG/PNG)
- Real-time image preview before upload
- **Auto-upload** with configurable delay (default: 60 seconds) and retry logic (default: 3 attempts)
- Optional image caption and "star marking" for banner/featured images
- Full error handling and upload status tracking
- Support for demo mode using blob URLs

**Integration:**
The component seamlessly integrates into the publishing form, uploading images to the `/api/img` endpoint which:
1. Validates JWT authentication
2. Uploads original to AWS S3
3. Triggers Lambda image compression
4. Generates thumbnails for gallery display
5. Caches via CloudFront CDN for fast delivery

### 📤 Dashboard/Publish Page ⭐ (Featured)
The publish system (located at [app/dashboard/publish/[[...params]]/page.tsx](app/dashboard/publish/[[...params]]/page.tsx)) provides flexible content creation:

**Features:**
- **Dynamic routing** supports multiple modes: `/dashboard/publish/[itemType]/[action]`
  - Create new: `/dashboard/publish/project` or `/dashboard/publish/certification`
  - Edit existing: `/dashboard/publish/project/edit/[id]` or `/dashboard/publish/certification/edit/[id]`
- **Rich form fields**: title, slug, rich text content, tags, repository/live URLs, certification dates
- **Auto-save** every 2-4.5 seconds to prevent data loss
- **Progressive enhancement**: uploads images before publishing, validates all fields
- **Smart publishing**: Sends to `/api/portfolio` endpoint which auto-increments item IDs and stores in DynamoDB

## Data Architecture

```
User Uploads Image
    ↓
PhotoUpload Component (preview & validation)
    ↓
POST /api/img (JWT authenticated)
    ↓
AWS S3 Upload → S3 Event Trigger
    ↓
Lambda: portfolio-img-compression
    ↓
Original + Compressed + Thumbnail → CloudFront CDN
    ├─ Public Portfolio Display ← getPortfolio() ← /api/portfolio (Lambda)
    ├─ Rich Gallery Views
    └─ localStorage Caching for Performance

Publishing Form Data
    ↓
Validation & Image Upload
    ↓
POST /api/portfolio (Lambda: portfolio-items-post)
    ↓
AWS DynamoDB (persistent storage)
    ↓
Public Display Pages (projects/certifications routes)
```

## Technology Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend** | Next.js 16, React 19, TypeScript, CSS Modules |
| **State Management** | React Hooks, sessionStorage, localStorage |
| **Rich Text** | Quill Editor with custom styling |
| **Backend (Serverless)** | AWS Lambda (Node.js), AWS DynamoDB, AWS S3 |
| **Authentication** | MongoDB Atlas, JWT tokens, Nodemailer |
| **CDN** | AWS CloudFront (image optimization & caching) |
| **Email** | Nodemailer + DreamHost SMTP |
| **Build & Dev** | ESLint, TypeScript compiler |

## Project Structure

```
frontend/
├── app/
│   ├── (auth)/              # Authentication routes (login, signup, reset, verify)
│   ├── (content)/           # Public content pages (projects, certifications)
│   ├── api/                 # API endpoints
│   │   ├── auth/           # Authentication operations
│   │   ├── portfolio/      # Publish/fetch portfolio items
│   │   ├── img/            # Image upload to S3
│   │   └── metrics/        # Dashboard metrics
│   ├── components/          # Reusable React components
│   │   ├── AddItems/       # PhotoUpload & TagsInput components
│   │   ├── Navbar/         # Navigation with hamburger menu
│   │   ├── PreviewCard/    # Portfolio item display card
│   │   ├── PreviewDeck/    # Carousel gallery component
│   │   └── Quill/          # Rich text editor wrapper
│   ├── dashboard/           # Admin panel
│   │   └── publish/        # Create/edit portfolio items
│   └── config files        # Next.js, TypeScript, ESLint configs
├── lib/
│   ├── findKey.ts          # Utility functions
│   ├── getPortfolio.ts     # API client for portfolio data
│   ├── sendMail.ts         # Email sending utility
│   └── types.ts            # TypeScript type definitions
└── models/
    └── User.ts             # MongoDB User schema & methods

lambdas/
├── portfolio-items-get/    # DynamoDB query Lambda
├── portfolio-items-post/   # DynamoDB insert Lambda
└── portfolio-img-compression/ # S3 image optimization Lambda
```

## Getting Started

### Prerequisites
- Node.js 18+
- AWS account (S3, Lambda, DynamoDB)
- MongoDB Atlas account
- DreamHost SMTP credentials (or alternative email service)

### Installation

```bash
# Install dependencies
npm install

# Create .env for environment variables
# Refer to .env.example for required vs optional environment variables

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

### Development Scripts

```bash
npm run dev        # Start development server with hot reload
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run ESLint checks
```

## API Endpoints

| Endpoint | Method | Purpose | Authentication |
|----------|--------|---------|-----------------|
| `/api/auth` | POST | Signup, login, verify email, reset password | Optional |
| `/api/portfolio` | GET | Fetch all projects and certifications | None |
| `/api/portfolio` | POST | Publish new portfolio item | JWT (Admin) |
| `/api/img` | POST | Upload image to S3 | JWT (Admin) |
| `/api/metrics` | GET | Retrieve dashboard system metrics | Optional |

## Key Components

### PhotoUpload (Featured) ⭐
**File**: [frontend/app/components/AddItems/PhotoUpload.tsx](app/components/AddItems/PhotoUpload.tsx)

Handles all image upload workflows with preview, validation, and error recovery.

### Dashboard/Publish (Featured) ⭐
**File**: [frontend/app/dashboard/publish/[[...params]]/page.tsx](app/dashboard/publish/[[...params]]/page.tsx)

Complete publishing interface for creating and editing portfolio items.

### PreviewCard
**File**: [frontend/app/components/PreviewCard/PreviewCard.tsx](app/components/PreviewCard/PreviewCard.tsx)

Displays individual portfolio items (projects/certifications) with images and metadata.

### PreviewDeck
**File**: [frontend/app/components/PreviewDeck/PreviewDeck.tsx](app/components/PreviewDeck/PreviewDeck.tsx)

Carousel component for browsing multiple portfolio items on the homepage.


## Learning Outcomes

This project demonstrates:
- ✅ Full-stack development with modern frameworks (Next.js, React)
- ✅ TypeScript for type-safe code
- ✅ Serverless architecture (AWS Lambda, DynamoDB, S3)
- ✅ Authentication & authorization (JWT, email verification)
- ✅ Image optimization & CDN integration
- ✅ Form handling with validation and auto-save
- ✅ API design (RESTful endpoints)
- ✅ Database design (relational MongoDB + NoSQL DynamoDB)
- ✅ Rich UI components (Quill editor, carousels, galleries)
- ✅ Responsive design and mobile-first approach
- ✅ Error handling and retry logic
- ✅ Performance optimization (image compression, caching)
