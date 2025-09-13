# LuminaFlow Admin Dashboard - Backend

Complete Node.js/Express backend for the LuminaFlow Admin Dashboard system.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Installation

1. **Clone and Setup**
   ```bash
   cd backend
   npm install
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env
   # Update .env with your configurations
   ```

3. **Database Setup**
   ```bash
   # Seed the database with sample data
   npm run seed
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

5. **Start Production Server**
   ```bash
   npm start
   ```

## 📊 Admin Dashboard Features

### Core Modules
- **Dashboard Overview**: Real-time stats, charts, and recent activities
- **User Management**: Complete CRUD operations for users
- **Plans Management**: Investment plans configuration
- **Earnings Analytics**: Revenue, profit, and user earnings tracking
- **Withdrawals Management**: Approval/rejection system with bank integration
- **Reports & Analytics**: Comprehensive business intelligence
- **Content Management**: News, ads, and marketing content
- **Staff Management**: Team performance and role management

### Authentication & Security
- JWT-based authentication system
- Role-based access control (Admin, Staff, User)
- Password hashing with bcrypt
- Rate limiting and security headers
- Input validation with Joi

## 🛠 API Endpoints

### Authentication
```
POST /api/auth/login          - Admin login
POST /api/auth/setup          - Initial admin setup
PATCH /api/auth/change-password - Change admin password
```

### Dashboard
```
GET /api/admin/dashboard/stats      - Overview statistics
GET /api/admin/dashboard/revenue    - Revenue chart data
GET /api/admin/dashboard/activities - Recent activities
```

### User Management
```
GET /api/users                 - Get all users (paginated)
GET /api/users/:id             - Get user details
PATCH /api/users/:id/status    - Block/unblock user
```

### Plans Management
```
GET /api/plans          - Get all plans
POST /api/plans         - Create new plan
PUT /api/plans/:id      - Update plan
DELETE /api/plans/:id   - Delete plan
```

### Earnings Analytics
```
GET /api/earnings/analytics    - Earnings overview
GET /api/earnings/top-earners  - Top performing users
GET /api/earnings/plan-wise    - Plan-wise earnings
```

### Withdrawals
```
GET /api/withdrawals              - Get withdrawal requests
PATCH /api/withdrawals/:id/approve - Approve withdrawal
PATCH /api/withdrawals/:id/reject  - Reject withdrawal
```

### Reports & Analytics
```
GET /api/reports/revenue       - Revenue reports
GET /api/reports/users         - User analytics
POST /api/reports/export       - Export reports
```

### Content Management
```
GET /api/content               - Get all content
POST /api/content              - Create content
PUT /api/content/:id           - Update content
DELETE /api/content/:id        - Delete content
PATCH /api/content/:id/status  - Publish/unpublish
```

### Staff Management
```
GET /api/staff                     - Get all staff
POST /api/staff                    - Add staff member
PUT /api/staff/:id                 - Update staff
PATCH /api/staff/:id/status        - Update staff status
GET /api/staff/:id/performance     - Staff performance
```

## 📁 Project Structure

```
backend/
├── config/
│   └── database.js         # MongoDB connection
├── middleware/
│   ├── auth.js            # Authentication middleware
│   └── upload.js          # File upload handling
├── models/
│   ├── User.js            # User schema
│   ├── Plan.js            # Investment plan schema
│   ├── Withdrawal.js      # Withdrawal schema
│   ├── Earnings.js        # Earnings schema
│   └── Content.js         # Content schema
├── routes/
│   ├── auth.js            # Authentication routes
│   ├── admin.js           # Admin dashboard routes
│   ├── users.js           # User management routes
│   ├── plans.js           # Plans management routes
│   ├── earnings.js        # Earnings analytics routes
│   ├── withdrawals.js     # Withdrawals management routes
│   ├── reports.js         # Reports & analytics routes
│   ├── content.js         # Content management routes
│   └── staff.js           # Staff management routes
├── scripts/
│   └── seedDatabase.js    # Database seeding script
├── utils/
│   └── validation.js      # Input validation schemas
├── uploads/               # File upload directory
├── .env.example          # Environment variables template
├── server.js             # Main server file
└── package.json          # Dependencies and scripts
```

## 🗄 Database Models

### User Model
- Personal information (name, email, phone)
- Authentication (password, role, status)
- Investment details (plan, level, referrals)
- KYC information
- Wallet details (balance, deposits, withdrawals, earnings)
- Subscription details

### Plan Model
- Plan configuration (name, fees, investment amounts)
- Features and benefits
- Profit percentages
- Referral bonuses

### Withdrawal Model
- User withdrawal requests
- Bank account details
- Status tracking (pending, approved, rejected, processed)
- Admin approval workflow

### Earnings Model
- Daily earnings tracking
- Referral bonuses
- Level bonuses
- Special rewards

### Content Model
- News articles
- Advertisements
- Marketing campaigns
- Announcements

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for secure password storage
- **Rate Limiting**: Prevents API abuse (100 requests per 15 minutes)
- **Input Validation**: Joi schemas for all API inputs
- **CORS Configuration**: Controlled cross-origin requests
- **Helmet Security**: Security headers for production
- **File Upload Security**: Type and size validation
- **Role-Based Access**: Admin, staff, and user permissions

## 📊 Analytics & Reporting

- **Real-time Dashboard**: Live statistics and metrics
- **Revenue Analytics**: Daily, weekly, monthly profit tracking
- **User Analytics**: Growth trends, retention rates
- **Plan Performance**: Plan-wise earnings and user distribution
- **Withdrawal Analytics**: Processing times and success rates
- **Export Functionality**: PDF and Excel report generation

## 🚦 Getting Started

1. **Initial Setup**
   ```bash
   npm run seed
   ```
   This creates:
   - Admin user (admin@luminaflow.com / Admin@123)
   - Sample investment plans
   - Sample users and content

2. **Access Admin Dashboard**
   - Frontend: Connect to `http://localhost:5173`
   - Backend: `http://localhost:5000`
   - Login with admin credentials

3. **API Testing**
   - Health check: `GET http://localhost:5000/api/health`
   - API docs: `GET http://localhost:5000/api/docs`

## 🛡 Production Deployment

1. **Environment Variables**
   ```env
   NODE_ENV=production
   MONGODB_URI=your_production_mongodb_uri
   JWT_SECRET=your_strong_jwt_secret
   FRONTEND_URL=your_frontend_domain
   ```

2. **Security Checklist**
   - Set strong JWT secret
   - Configure CORS for production domain
   - Set up MongoDB with authentication
   - Configure file upload limits
   - Set up SSL/HTTPS
   - Configure rate limiting for production

3. **Monitoring**
   - Health check endpoint for uptime monitoring
   - Error logging and reporting
   - Performance monitoring
   - Database connection monitoring

## 📞 Support

For technical support or questions:
- Check API documentation: `/api/docs`
- Health status: `/api/health`
- Review error logs for troubleshooting

---

**LuminaFlow Admin Backend** - Complete investment management solution with comprehensive admin controls and analytics.