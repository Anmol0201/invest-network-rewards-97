# WeNews Admin Panel

This is the admin panel frontend for the WeNews platform. It connects to the WeNews backend located in the `WeNews` directory to manage users, monitor platform activity, and handle administrative tasks.

## 🚀 Quick Start

### Prerequisites

1. **WeNews Backend Running**

   ```bash
   cd D:\Techori\wenews\WeNews\backend
   npm install
   npm start
   ```

   Backend should be running on `http://localhost:5000`

2. **Frontend Setup**
   ```bash
   cd D:\Techori\wenews\admin
   npm install
   npm run dev
   ```
   Frontend will be available at `http://localhost:8080`

### Admin Login

Use these credentials to access the admin panel:

- **Email:** `admin@wenews.com`
- **Password:** `admin123`

## 📁 Project Structure

```
src/
├── components/
│   ├── admin/           # Admin panel components
│   │   ├── DashboardOverview.tsx    # Real-time dashboard with WeNews data
│   │   ├── UserManagement.tsx       # User management with Firebase integration
│   │   ├── AdminHeader.tsx          # Header with logout functionality
│   │   └── AdminSidebar.tsx         # Navigation sidebar
│   ├── ui/              # Reusable UI components (shadcn/ui)
│   └── Login.tsx        # Authentication component
├── services/            # API service layer
│   ├── adminService.ts  # Admin API functions for WeNews backend
│   └── authService.ts   # Authentication with JWT tokens
├── lib/
│   └── api.ts           # Base API client with error handling
└── pages/
    └── Admin.tsx        # Main admin layout with authentication
```

## ✅ Features

### 🎯 Dashboard Overview

- **Real-time Statistics**: Live user counts, revenue, subscriptions
- **System Metrics**: Platform activity and engagement data
- **Wallet Integration**: Financial overview from WeNews backend
- **User Progress Tracking**: Level system and earnings
- **Recent Activity Feed**: Latest platform activities
- **Visual Analytics**: Charts for revenue, user growth, plan distribution

### 👥 User Management

- **Complete User Directory**: All users from WeNews Firebase database
- **Advanced Filtering**: Search by name, email, status, role
- **Role Management**: Promote/demote users between user/admin roles
- **Real-time User Statistics**: Dynamic counts and metrics
- **User Profile Details**: Wallet balance, earnings, levels, registration dates

### 🔐 Authentication System

- **Secure Login**: JWT-based authentication with WeNews backend
- **Session Management**: Persistent login across browser sessions
- **Auto-logout**: Automatic logout on token expiration
- **Protected Routes**: Admin-only access control

## 🔗 Backend Integration

### API Endpoints

The admin panel integrates with these WeNews backend endpoints:

```
POST /api/auth/login              # Admin authentication
GET  /api/admin/stats             # Dashboard statistics
GET  /api/admin/users             # User management data
PUT  /api/admin/users/:id/role    # Update user roles
GET  /api/dashboard/overview      # Dashboard overview data
GET  /api/dashboard/stats         # Quick statistics
```

### Data Flow Architecture

```
Frontend Component → Service Layer → API Client → WeNews Backend → Firebase
     ↑                                                                    ↓
User Interface ← Formatted Data ← Response Processing ← API Response ← Database
```

## 🛠️ Environment Configuration

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=WeNews Admin Panel
VITE_NODE_ENV=development
```

## 🏗️ Tech Stack

- **Frontend Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **Charts**: Recharts for data visualization
- **Routing**: React Router DOM
- **HTTP Client**: Fetch API with custom wrapper
- **State Management**: React Hooks
- **Backend**: Node.js + Express + Firebase (WeNews)

## 🚨 Troubleshooting

### Backend Connection Issues

```bash
# 1. Verify WeNews backend is running
cd D:\Techori\wenews\WeNews\backend
npm start

# 2. Check backend health
curl http://localhost:5000/api/health

# 3. Verify environment variables
echo $VITE_API_BASE_URL
```

### Authentication Problems

- **Clear browser storage**: `localStorage.clear()`
- **Check admin user exists** in WeNews Firebase database
- **Verify backend auth endpoints** are responding

### Data Loading Issues

- **Check browser console** for API errors
- **Inspect network tab** for failed requests
- **Verify WeNews backend** APIs are accessible

## 🎯 Development

### Adding New Features

1. **Create service functions** in appropriate service file
2. **Add TypeScript interfaces** for data types
3. **Build components** with loading states and error handling
4. **Add routing** in `Admin.tsx` if needed
5. **Update navigation** in `AdminSidebar.tsx`

### Project Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 📈 Future Enhancements

### Planned Features

- **Investment Plans Management**: Configure and monitor investment plans
- **Earnings Analytics**: Detailed earnings reports and calculations
- **Withdrawal Management**: Approval workflow for user withdrawals
- **Content Management**: News articles and platform content
- **Advanced Analytics**: User behavior tracking and insights
- **Notification System**: Admin notifications and alerts
- **Bulk Operations**: Mass user operations and data exports

## 📝 Notes

- This admin panel is designed to work exclusively with the WeNews backend
- All data is sourced from the WeNews Firebase database
- The project uses shadcn/ui for consistent design components
- JWT tokens are stored in localStorage for session management
- The admin panel automatically handles authentication state

## 🤝 Contributing

1. Ensure WeNews backend is running and accessible
2. Follow TypeScript best practices
3. Add proper error handling for all API calls
4. Include loading states for async operations
5. Use shadcn/ui components for consistency
