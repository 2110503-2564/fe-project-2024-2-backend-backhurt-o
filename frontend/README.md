# Co-Working Space Reservation Frontend

This is the frontend for the Co-working Space Reservation System, built with Next.js, TypeScript, and Tailwind CSS.

## Features

- User authentication (login/register)
- Browse available co-working spaces
- Make reservations for specific time slots
- View and manage your reservations
- User profile management
- Responsive UI for all devices

## Prerequisites

- Node.js 18.x or later
- npm or yarn
- Backend API running (default: http://localhost:5003)

## Getting Started

1. Clone the repository:

```bash
git clone <repository-url>
cd frontend-coworking
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Set up environment variables:
   
Create a `.env.local` file in the root directory with the following variables:

```
NEXT_PUBLIC_API_URL=http://localhost:5003/api/v1
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=YOUR-API-MAP-KEY
```

Adjust the URL to match your backend API endpoint.

4. Start the development server:

```bash
npm run dev
# or
yarn dev
```

5. Open your browser and navigate to [http://localhost:3000](http://localhost:3000)

## Building for Production

To build the app for production:

```bash
npm run build
# or
yarn build
```

To run the production build:

```bash
npm run start
# or
yarn start
```

## Folder Structure

- `src/app`: Page components and app router
- `src/components`: Reusable UI components
- `src/contexts`: React context providers (auth, etc.)
- `src/lib`: Utilities, API client, etc.
- `public`: Static assets

## Backend API

This frontend is designed to work with the Co-working Space Reservation Backend API. Make sure the backend server is running before using this frontend.
