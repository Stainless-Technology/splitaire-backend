# 💰 Bill Splitter Backend API

A comprehensive backend API for splitting bills and expenses among groups. Supports both authenticated users and guest users, with features like multiple split methods, email notifications, and payment tracking.

## ✨ Features

### Core Features
- 🔐 **Optional Authentication**: Users can split bills without creating an account
- 👥 **Multiple Split Methods**: 
  - Equal split
  - Percentage-based split
  - Custom amount split
  - Item-based split
- 📧 **Email Notifications**: Automatic notifications for bill creation, updates, and payments
- 💳 **Payment Tracking**: Mark payments as complete and track bill settlement
- 🌍 **Multi-Currency Support**: USD, EUR, GBP, NGN, CAD, AUD, INR, JPY, CNY
- 📊 **Bill Management**: Create, read, update, and delete bills
- 🔗 **Shareable Links**: Each bill gets a unique shareable link

### User Features (Optional)
- User registration and authentication
- Profile management
- Bill history
- Statistics dashboard

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v5 or higher)
- npm or yarn

### Installation

1. **Clone the repository** (or extract the zip file)
   ```bash
   cd bill-splitter-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/bill-splitter
   JWT_SECRET=your-super-secret-jwt-key
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password
   FRONTEND_URL=http://localhost:3000
   ```

4. **Build the project**
   ```bash
   npm run build
   ```

5. **Start the server**
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm start
   ```

The server will start at `http://localhost:5000`

## 📡 API Endpoints

### Health Check
```
GET /api/health
```

### Authentication Routes

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "securepass123"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepass123"
}
```

#### Get Profile
```http
GET /api/auth/me
Authorization: Bearer <token>
```

#### Update Profile
```http
PUT /api/auth/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "fullName": "John Smith"
}
```

### Bill Routes

#### Create Bill (Guest or Authenticated)
```http
POST /api/bills
Content-Type: application/json

{
  "billName": "Team Dinner",
  "totalAmount": 150.00,
  "currency": "USD",
  "participants": [
    { "name": "Alice", "email": "alice@example.com" },
    { "name": "Bob", "email": "bob@example.com" },
    { "name": "Charlie", "email": "charlie@example.com" }
  ],
  "splitMethod": "equal",
  "notes": "Pizza and drinks",
  "createdByName": "Alice",
  "createdByEmail": "alice@example.com"
}
```

**Split Methods:**

1. **Equal Split**
```json
{
  "splitMethod": "equal"
}
```

2. **Percentage Split**
```json
{
  "splitMethod": "percentage",
  "customSplits": [
    { "participantEmail": "alice@example.com", "percentage": 40 },
    { "participantEmail": "bob@example.com", "percentage": 35 },
    { "participantEmail": "charlie@example.com", "percentage": 25 }
  ]
}
```

3. **Custom Amount Split**
```json
{
  "splitMethod": "custom",
  "customSplits": [
    { "participantEmail": "alice@example.com", "amount": 60 },
    { "participantEmail": "bob@example.com", "amount": 50 },
    { "participantEmail": "charlie@example.com", "amount": 40 }
  ]
}
```

4. **Item-Based Split**
```json
{
  "splitMethod": "itemBased",
  "items": [
    {
      "description": "Pizza",
      "amount": 30,
      "paidBy": "alice@example.com",
      "splitBetween": ["alice@example.com", "bob@example.com"]
    },
    {
      "description": "Drinks",
      "amount": 20,
      "paidBy": "charlie@example.com",
      "splitBetween": ["alice@example.com", "bob@example.com", "charlie@example.com"]
    }
  ]
}
```

#### Get Bill by ID
```http
GET /api/bills/:billId
```

#### Get User's Bills (Authenticated)
```http
GET /api/bills?page=1&limit=10&settled=false
Authorization: Bearer <token>
```

#### Update Bill
```http
PUT /api/bills/:billId
Content-Type: application/json

{
  "billName": "Updated Team Dinner",
  "totalAmount": 175.00,
  "notes": "Updated total"
}
```

#### Mark Payment
```http
PATCH /api/bills/:billId/payment
Content-Type: application/json

{
  "participantEmail": "alice@example.com",
  "isPaid": true
}
```

#### Delete Bill (Authenticated)
```http
DELETE /api/bills/:billId
Authorization: Bearer <token>
```

#### Get Bill Statistics (Authenticated)
```http
GET /api/bills/stats
Authorization: Bearer <token>
```

## 📋 Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message describing what went wrong",
  "error": "Technical error details"
}
```

### Validation Error Response
```json
{
  "success": false,
  "message": "Validation failed. Please check the provided data.",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email address"
    }
  ]
}
```

## 🗄️ Database Schema

### User Model
```typescript
{
  fullName: string;
  email: string; // unique
  password: string; // hashed
  createdAt: Date;
  updatedAt: Date;
}
```

### Bill Model
```typescript
{
  billId: string; // unique identifier for sharing
  billName: string;
  totalAmount: number;
  currency: string;
  createdBy?: ObjectId; // reference to User (optional)
  createdByEmail?: string; // for guest users
  createdByName?: string; // for guest users
  participants: [
    {
      participantId: string;
      name: string;
      email: string;
      amountOwed: number;
      isPaid: boolean;
      paidAt?: Date;
    }
  ];
  items?: [
    {
      description: string;
      amount: number;
      paidBy: string;
      splitBetween: string[];
    }
  ];
  splitMethod: 'equal' | 'percentage' | 'custom' | 'itemBased';
  notes?: string;
  isSettled: boolean;
  settledAt?: Date;
  expiresAt?: Date; // guest bills expire after 90 days
  createdAt: Date;
  updatedAt: Date;
}
```

## 📧 Email Configuration

The application sends email notifications for:
- Bill creation
- Bill updates
- Payment confirmations
- Bill settlement

### Gmail Configuration (Example)
1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password: https://myaccount.google.com/apppasswords
3. Use the App Password in your `.env` file

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-char-app-password
```

## 🔒 Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Input validation and sanitization
- CORS protection
- Environment variable protection
- Graceful error handling without exposing sensitive data

## 🛠️ Project Structure

```
bill-splitter-backend/
├── src/
│   ├── config/
│   │   ├── config.ts           # Environment configuration
│   │   └── database.ts         # MongoDB connection
│   ├── controllers/
│   │   ├── authController.ts   # Authentication logic
│   │   └── billController.ts   # Bill management logic
│   ├── middleware/
│   │   ├── auth.ts             # Authentication middleware
│   │   ├── errorHandler.ts    # Error handling middleware
│   │   └── validation.ts       # Input validation
│   ├── models/
│   │   ├── User.ts             # User schema
│   │   └── Bill.ts             # Bill schema
│   ├── routes/
│   │   ├── authRoutes.ts       # Auth endpoints
│   │   ├── billRoutes.ts       # Bill endpoints
│   │   └── index.ts            # Route aggregator
│   ├── types/
│   │   └── index.ts            # TypeScript interfaces
│   ├── utils/
│   │   ├── apiResponse.ts      # Response helpers
│   │   ├── billCalculations.ts # Split calculations
│   │   ├── emailService.ts     # Email utilities
│   │   └── jwt.ts              # JWT utilities
│   ├── app.ts                  # Express app setup
│   └── server.ts               # Server entry point
├── .env.example                # Environment template
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## 🧪 Testing

You can test the API using:
- Postman
- cURL
- Any HTTP client

Example cURL command:
```bash
curl -X POST http://localhost:5000/api/bills \
  -H "Content-Type: application/json" \
  -d '{
    "billName": "Test Bill",
    "totalAmount": 100,
    "participants": [
      {"name": "Alice", "email": "alice@test.com"},
      {"name": "Bob", "email": "bob@test.com"}
    ],
    "splitMethod": "equal",
    "createdByName": "Alice",
    "createdByEmail": "alice@test.com"
  }'
```

## 🐛 Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (authentication required) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Not Found |
| 409 | Conflict (duplicate entry) |
| 500 | Internal Server Error |

## 📝 License

This project is licensed under the ISC License.

## 🤝 Support

For issues or questions, please create an issue in the repository.

## 🔄 Updates

- Version 1.0.0 - Initial release with full bill splitting functionality
