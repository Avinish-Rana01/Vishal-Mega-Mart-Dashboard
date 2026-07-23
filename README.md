# Vishal-Mega-Mart-Dashboard

A modern React + Vite web dashboard application for Vishal Mega Mart POS, converted from ASP.NET WebForms.

## Features
- **Live Stock Management**: Connected via API service to ASP.NET C# WebMethod `GetLiveStockDetails`.
- **Cycle Count Management**: Interactive modal for viewing article stock breakdowns.
- **Reusable DataTableCard Component**: Modular component supporting client-side search, multi-column sorting, custom cell renderers, and total footer rows.
- **Modern UI & Aesthetic Design**: Custom responsive sidebar, breadcrumbs navigation, dark blue card headers, and user account management.

## Tech Stack
- **Framework**: React 19 + Vite
- **Icons**: Lucide React
- **Styling**: Vanilla CSS with modern typography, gradients, and custom components

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure Environment (`.env`):
   ```env
   VITE_API_BASE_URL=https://localhost:44314
   ```

3. Run Development Server:
   ```bash
   npm run dev
   ```

4. Build for Production:
   ```bash
   npm run build
   ```
