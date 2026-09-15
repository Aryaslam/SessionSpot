# SessionSpot

SessionSpot is a web-based classroom booking system designed for school clubs and school administrators.

It allows club administrators to check classroom availability, submit booking requests, track their requests, and receive approval or rejection responses. School administrators can manage classrooms and clubs, review booking requests, and approve or reject them.

## Features

### Club Admin

- Register a club administrator account
- Wait for school administrator approval before accessing the system
- Log in through a dedicated Club Admin login
- View active classrooms
- View classroom availability through a calendar
- Create classroom booking requests
- Select multiple classrooms for a request
- Automatically check classroom availability for the requested date and time
- Edit pending requests
- Cancel pending requests
- View accepted and rejected responses
- View rejection reasons
- View digital signatures attached to accepted/rejected responses
- Change password
- Switch between light and dark themes
- Switch between English and Bahasa Indonesia

### School Admin

- Log in through a dedicated School Admin login
- View and manage classrooms
- Add classrooms
- Edit classroom names, grades, and descriptions
- Activate or deactivate classrooms
- View classroom booking calendars
- View registered clubs
- Create and manage club information
- View club administrators
- Invite additional club administrator accounts
- Manage pending club administrator registrations
- Remove club administrator accounts with a recorded reason
- View all booking requests
- Separate pending requests from request history
- View individual request details
- Approve booking requests
- Reject booking requests with a reason
- Attach an optional digital signature when responding to requests
- Change application appearance settings
- Switch between English and Bahasa Indonesia

## Tech Stack

- [Next.js](https://nextjs.org/) 16
- [React](https://react.dev/) 19
- TypeScript
- [Tailwind CSS](https://tailwindcss.com/) 4
- [Supabase](https://supabase.com/)
  - Authentication
  - PostgreSQL database
  - Row Level Security
  - Storage
  - Database functions / RPCs
- ESLint

## Architecture

SessionSpot uses Next.js for the application layer and Supabase for authentication, database operations, and storage.

```text
┌──────────────────────┐
│      Next.js         │
│   App Router         │
├──────────────────────┤
│ Server Components    │
│ Client Components    │
│ API Routes           │
│ Authentication       │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│       Supabase       │
├──────────────────────┤
│ Authentication       │
│ PostgreSQL           │
│ Row Level Security   │
│ Storage              │
│ Database RPCs        │
└──────────────────────┘
```
Authentication is handled through Supabase Auth. Server-side role checks are performed by the application, while database Row Level Security remains the primary authorization boundary.

## User Roles

SessionSpot currently supports two roles:

### `school_admin`

School administrators are responsible for:

* Managing classrooms
* Managing clubs
* Managing club administrator accounts
* Reviewing booking requests
* Accepting or rejecting requests

### `club_admin`

Club administrators are responsible for:

* Managing their club's booking requests
* Checking classroom availability
* Creating requests
* Editing pending requests
* Cancelling pending requests
* Viewing responses

## Request Lifecycle

```text
A typical classroom booking follows this flow:

Club Admin
    │
    │ Create request
    ▼
┌─────────┐
│ Pending │
└────┬────┘
     │
     ├───────────────┐
     │               │
     ▼               ▼
  Accept           Reject
     │               │
     ▼               ▼
 Accepted          Rejected
     │
     ▼
 Classroom booking
```
Club administrators can edit or cancel a request while it is still pending.

## Project Structure

```text
school-class-booking/
├── app/
│   ├── api/
│   │   ├── accounts/
│   │   │   └── [id]/
│   │   │       ├── reject/
│   │   │       └── remove/
│   │   ├── clubs/
│   │   │   ├── [clubId]/
│   │   │   │   ├── accounts/
│   │   │   │   └── invite/
│   │   │   └── public-list/
│   │   └── signature-url/
│   │
│   ├── club-admin/
│   │   ├── classrooms/
│   │   ├── dashboard/
│   │   ├── login/
│   │   ├── register/
│   │   ├── requests/
│   │   │   ├── [id]/edit/
│   │   │   └── new/
│   │   ├── responses/
│   │   ├── set-password/
│   │   └── settings/
│   │
│   ├── school-admin/
│   │   ├── classrooms/
│   │   ├── clubs/
│   │   ├── dashboard/
│   │   ├── login/
│   │   ├── requests/
│   │   │   └── [id]/
│   │   └── settings/
│   │
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   ├── approve-reject-form.tsx
│   ├── cancel-request-button.tsx
│   ├── change-password-button.tsx
│   ├── classroom-calendar-modal.tsx
│   ├── classroom-grid.tsx
│   ├── classroom-manager.tsx
│   ├── classroom-select.tsx
│   ├── club-accounts-manager.tsx
│   ├── club-calendar.tsx
│   ├── club-detail-modal.tsx
│   ├── club-form.tsx
│   ├── club-manager.tsx
│   ├── login-form.tsx
│   ├── pending-accounts-manager.tsx
│   ├── register-form.tsx
│   ├── request-form.tsx
│   ├── set-password-form.tsx
│   ├── settings-form.tsx
│   ├── sign-out-button.tsx
│   └── view-signature-button.tsx
│
├── lib/
│   ├── auth.ts
│   ├── i18n.ts
│   ├── types.ts
│   └── supabase/
│       ├── admin.ts
│       ├── client.ts
│       └── server.ts
│
├── AGENTS.md
├── CLAUDE.md
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── proxy.ts
└── tsconfig.json
```
## Getting Started

### Prerequisites

Make sure you have:

* Node.js installed
* A Supabase project
* A configured Supabase database
* Supabase Authentication enabled

### Install dependencies

```bash
npm install
```

### Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

The `SUPABASE_SERVICE_ROLE_KEY` is a sensitive server-side credential and must never be exposed to the browser or committed to Git.

For an open-source repository, commit an `.env.example` file instead:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

### Run the development server

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

### Build for production

```bash
npm run build
```

### Start the production server

```bash
npm start
```

### Run ESLint

```bash
npm run lint
```

## Supabase

SessionSpot relies on Supabase for its backend.

The application expects database resources including:

* `profiles`
* `clubs`
* `classrooms`
* `requests`
* `request_classrooms`
* `responses`

It also uses several PostgreSQL functions through Supabase RPC:

* `create_request`
* `update_request`
* `cancel_request`
* `approve_request`
* `reject_request`
* `available_classrooms`
* `classroom_booked_dates`
* `club_booked_dates`

The exact database schema, RLS policies, functions, triggers, and storage configuration should be maintained separately as Supabase migrations.

A recommended structure is:

```text
supabase/
└── migrations/
    ├── 001_initial_schema.sql
    ├── 002_rls_policies.sql
    ├── 003_booking_functions.sql
    └── 004_storage.sql
```

## Authentication and Authorization

SessionSpot uses Supabase Auth for user authentication.

After authentication, the application retrieves the user's profile and verifies:

* The user's role
* The account status
* The associated club, when applicable

Supported account statuses include:

* `pending`
* `removed`

A pending Club Admin cannot access the dashboard until approved by a School Admin.

Removed accounts are signed out and redirected to the appropriate login page.

Application-level role checks are implemented in `lib/auth.ts`.

However, application-level checks should not be considered the final authorization boundary. Database Row Level Security should independently enforce access to protected data.

## Digital Signatures

School administrators can optionally upload a digital signature when accepting or rejecting a request.

Signatures are stored in the Supabase Storage bucket:

```text
digital-signatures
```

The application does not expose the storage object directly. Instead, authorized users request a short-lived signed URL through:

```text
POST /api/signature-url
```

The signed URL currently expires after 60 seconds.

The `digital-signatures` bucket should remain private.

## Club Logos

Clubs may have a logo associated with them.

Logo files are stored in the Supabase Storage bucket:

```text
club-logos
```

The application uses the configured Supabase project URL to construct public logo URLs.

If club logos contain private or sensitive information, the storage bucket should be configured appropriately rather than exposed publicly.

## Club Administrator Registration

Club administrators can register through:

```text
/club-admin/register
```

The registration process associates the account with a club and places the account into a pending state.

School administrators can review pending registrations and remove rejected accounts.

School administrators can also invite additional club administrator accounts by email.

Each club currently supports a maximum of 5 connected club administrator accounts.

Email invitations require SMTP configuration in Supabase.

## Availability

Before submitting a booking request, the application checks classroom availability using the `available_classrooms` RPC.

The request form checks:

* Date
* Start time
* End time
* Classroom availability

A request cannot be submitted without:

* At least one classroom
* A usage date
* A start time
* An end time
* A valid time range
* A reason

The application also rechecks selected classroom availability before submitting the request.

## Internationalization

The interface currently supports:

* English
* Bahasa Indonesia

The selected language is stored in a browser cookie named:

```text
locale
```

Translations are defined in:

```text
lib/i18n.ts
```

## Theme

The application supports:

* Light mode
* Dark mode

The selected theme is stored in a browser cookie named:

```text
theme
```

## Deployment

SessionSpot can be deployed to Vercel.

A recommended deployment workflow is:

```text
GitHub
   │
   ▼
Vercel
   │
   ▼
Next.js Application
   │
   ▼
Supabase
```

For Vercel deployment:

1. Push the repository to GitHub.
2. Import the repository into Vercel.
3. Configure the required environment variables in Vercel.
4. Deploy the application.

Do not commit production credentials to GitHub.

The production environment should contain the real Supabase credentials through Vercel Environment Variables.

## Open Source Security

If this repository is made public, keep the following information private:

* `SUPABASE_SERVICE_ROLE_KEY`
* Production credentials
* Passwords
* Real user accounts
* Real student or staff information
* Production database dumps
* Private digital signatures
* Private storage credentials
* Other secrets or authentication tokens

### Public repository

The public repository can contain:

```text
Source code
README
Documentation
.env.example
Supabase migrations
Synthetic seed data
Configuration that is safe to expose
```

### Private deployment

Keep the following in the production environment:

```text
Real Supabase project
Real users
Real database records
Production storage
Production environment variables
Service-role credentials
```

### Check Git history

Before making the repository public, inspect the entire Git history.

For example:

```bash
git grep -n "SUPABASE_SERVICE_ROLE_KEY"
git grep -n "NEXT_PUBLIC_SUPABASE"
git log --all --full-history -- .env.local
git log -p --all
```

Checking only the current version of the repository is not sufficient. A secret committed in an old commit can remain accessible in Git history.

If a service-role key has ever been committed, rotate the key before making the repository public and clean the Git history if necessary.

## Environment-Specific Configuration

The current `next.config.ts` contains development-specific origins/IP addresses.

Before publishing the repository publicly, review values such as:

```text
192.168.x.x
172.x.x.x
```

and other development infrastructure addresses.

These are not necessarily secrets, but they may expose unnecessary information about the development environment and generally do not belong in a reusable open-source configuration unless they are actually required.

## Security Considerations

SessionSpot uses several layers of protection:

* Supabase Auth for authentication
* Server-side role validation
* Row Level Security for database authorization
* Server-only service-role access
* Private storage for digital signatures
* Short-lived signed URLs for signature access

When modifying the application, ensure that authorization is enforced at the database level as well as in the UI/API layer.

Important cases to test include:

* A Club Admin cannot access another club's requests.
* A Club Admin cannot approve or reject requests.
* A School Admin can review requests.
* Unauthenticated users cannot access protected data.
* Pending Club Admin accounts cannot access the dashboard.
* Removed accounts cannot access the application.
* Digital signatures cannot be accessed by unauthorized users.
* A user cannot modify another user's request.
* A user cannot bypass classroom availability checks by directly calling an RPC.

## Development Notes

The project includes `AGENTS.md` with project-specific instructions for working with the current Next.js version.

In particular, the project explicitly recommends checking the installed Next.js documentation under:

```text
node_modules/next/dist/docs/
```

before making changes that depend on Next.js APIs or conventions.

This is especially important because the project uses Next.js 16, where APIs and conventions may differ from older Next.js versions.

## Current TODO / Known Issues

The current project README tracks:

* Supabase email rate-limit handling when creating an account

Additional backend reproducibility work may be required before the project can be fully cloned and deployed from scratch, particularly if the Supabase schema, RLS policies, RPC functions, storage configuration, and seed data are not included in the repository.

## Contributing

Contributions are welcome.

Before submitting a pull request:

1. Install dependencies.

```bash
npm install
```

2. Run the linter.

```bash
npm run lint
```

3. Test the production build.

```bash
npm run build
```

4. Verify authentication and authorization behavior.
5. Make sure no secrets or private data are included.
6. Keep Supabase schema changes versioned through migrations.

## License

No license has currently been selected for this project.

If you intend to make SessionSpot genuinely open source, add a license file such as:

```text
LICENSE
```

Common choices include:

* MIT for a simple permissive license
* Apache-2.0 for a permissive license with additional patent-related provisions

Do not label a repository as "open source" without actually providing an appropriate license.

## Project Status

SessionSpot is an actively developed classroom booking system.

The core workflow currently includes:

```text
Club Registration
       ↓
School Admin Approval
       ↓
Club Admin Login
       ↓
Classroom Availability
       ↓
Booking Request
       ↓
School Admin Review
       ↓
Accept / Reject
       ↓
Club Admin Response
```

The project is intended to provide a simple, centralized way for schools to manage classroom usage by student clubs.
