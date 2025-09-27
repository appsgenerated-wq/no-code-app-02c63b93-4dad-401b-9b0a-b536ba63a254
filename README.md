# Delivery App - Built with Manifest

This is a full-stack delivery management application built entirely with React and Manifest.

## Features

- **Role-Based Access Control**: Separate interfaces and permissions for Customers, Drivers, and Admins.
- **Customer Portal**: Customers can sign up, request new deliveries, and track the status of their existing deliveries.
- **Driver Portal**: Drivers can sign up, view a list of available deliveries, accept jobs, and update the status of their active deliveries.
- **Real-time Updates**: The dashboard automatically reflects changes in delivery statuses.
- **Admin Panel**: A built-in admin interface (accessible at `/admin`) for managing all users and deliveries.

## Getting Started

### Prerequisites

- Node.js
- A Manifest account and project

### Setup

1.  **Clone the repository.**
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Configure Environment Variables:**
    Create a `.env` file in the root of your project and add your Manifest project's Backend URL and App ID:
    ```
    VITE_BACKEND_URL=your_manifest_backend_url
    VITE_APP_ID=your_manifest_app_id
    ```
4.  **Run the application:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

## Demo Credentials

- **Admin**: `admin@manifest.build` / `admin` (Access via the `/admin` panel)
- You can create new Customer or Driver accounts through the signup form on the landing page.
