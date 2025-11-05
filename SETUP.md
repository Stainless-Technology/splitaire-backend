# 🚀 Quick Setup Guide

Follow these steps to get the Bill Splitter backend up and running in minutes!

## Prerequisites

Before you begin, make sure you have:
- ✅ Node.js v16+ installed ([Download](https://nodejs.org/))
- ✅ MongoDB installed and running ([Download](https://www.mongodb.com/try/download/community))
- ✅ A code editor (VS Code recommended)

## Setup Steps

### 1. Extract the Project
Extract the `bill-splitter-backend.zip` file to your desired location.

### 2. Install Dependencies
```bash
cd bill-splitter-backend
npm install
```

### 3. Configure Environment Variables
Copy the example environment file:
```bash
cp .env.example .env
```

Open `.env` and configure your settings:

**Minimum Required Configuration:**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bill-splitter
JWT_SECRET=change-this-to-a-random-secure-string
```

**Optional Email Configuration (for notifications):**
If you want email notifications to work, configure these:
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@billsplitter.com
```

> **Note:** For Gmail, you need to create an App Password:
> 1. Enable 2-Factor Authentication
> 2. Go to https://myaccount.google.com/apppasswords
> 3. Generate an app password and use it in EMAIL_PASSWORD

### 4. Build the Project
```bash
npm run build
```

### 5. Start MongoDB
Make sure MongoDB is running on your system:
```bash
# On macOS (with homebrew)
brew services start mongodb-community

# On Linux
sudo systemctl start mongod

# On Windows
# MongoDB should start automatically as a service
```

### 6. Start the Server

**Development Mode (with auto-reload):**
```bash
npm run dev
```

**Production Mode:**
```bash
npm start
```

You should see:
```
✅ MongoDB Connected Successfully
🚀 Bill Splitter API Server Started Successfully!
📡 Server running on: http://localhost:5000
```

### 7. Test the API

Open your browser or use curl:
```bash
curl http://localhost:5000/api/health
```

You should get:
```json
{
  "success": true,
  "message": "Bill Splitter API is running successfully!",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "development"
}
```

## 🧪 Testing the API

### Option 1: Using Postman
1. Open Postman
2. Import the file: `Bill-Splitter-API.postman_collection.json`
3. Set the `baseUrl` variable to `http://localhost:5000`
4. Start testing the endpoints!

### Option 2: Using cURL

**Create a bill (guest):**
```bash
curl -X POST http://localhost:5000/api/bills \
  -H "Content-Type: application/json" \
  -d '{
    "billName": "Test Dinner",
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

**Register a user:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

## 📁 Project Structure

```
bill-splitter-backend/
├── src/                    # Source code
│   ├── config/            # Configuration files
│   ├── controllers/       # Request handlers
│   ├── middleware/        # Express middleware
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── types/            # TypeScript types
│   ├── utils/            # Utility functions
│   ├── app.ts            # Express app setup
│   └── server.ts         # Server entry point
├── dist/                  # Compiled JavaScript (after build)
├── .env                   # Your environment variables
├── .env.example          # Environment template
├── package.json          # Project dependencies
├── tsconfig.json         # TypeScript configuration
└── README.md             # Full documentation
```

## 🔧 Common Issues & Solutions

### MongoDB Connection Error
**Problem:** "Failed to connect to MongoDB"
**Solution:** 
- Make sure MongoDB is running
- Check your `MONGODB_URI` in `.env`
- Default: `mongodb://localhost:27017/bill-splitter`

### Port Already in Use
**Problem:** "Port 5000 is already in use"
**Solution:**
- Change `PORT` in `.env` to a different port (e.g., 5001)
- Or kill the process using port 5000

### Email Not Sending
**Problem:** Emails are not being sent
**Solution:**
- Check your email configuration in `.env`
- For Gmail, make sure you're using an App Password, not your regular password
- The app will still work without email configuration - notifications just won't be sent

## 📚 Next Steps

1. ✅ Read the full `README.md` for detailed API documentation
2. ✅ Import the Postman collection to test all endpoints
3. ✅ Build your frontend to consume this API
4. ✅ Deploy to production (Heroku, DigitalOcean, AWS, etc.)

## 🆘 Need Help?

- 📖 Check the full `README.md` for complete documentation
- 🐛 Review the error logs in the console
- 💡 Test with the Postman collection
- 📧 Email configuration is optional - the app works without it

## 🎉 You're All Set!

Your Bill Splitter backend is now running! Start building your frontend or test the API using Postman or cURL.

Happy coding! 💻
