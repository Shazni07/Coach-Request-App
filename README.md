# Coach Request Application

A full-stack web application for managing coach trip requests, built with React, Node.js, and SQLite.

## 🚀 Features

### Customer Features
- Submit trip requests with:
  - Name and phone number
  - Pickup and dropoff locations
  - Pickup time
  - Number of passengers
  - Additional notes
- Real-time form validation
- Success confirmation messages
- Responsive design for all devices

### Coordinator Features
- Secure admin panel login
- Dashboard with request management:
  - View all trip requests
  - Filter requests by status
  - Approve/Reject requests
  - Schedule trips with driver and vehicle assignment
  - View daily request analytics
- Driver and vehicle management
- Request status tracking (Pending, Approved, Rejected, Scheduled)

## 🛠 Technical Stack

### Frontend
- React.js with Vite
- TailwindCSS for styling
- React Router for navigation
- React Hot Toast for notifications
- Lucide React for icons
- JWT authentication

### Backend
- Node.js
- Express.js
- SQLite3 with Knex.js
- JSON Web Tokens (JWT)
- Joi for validation
- ESM modules

## 📦 Project Structure

```
├── backend/
│   ├── migrations/         # Database schema
│   ├── seeds/             # Sample data
│   └── src/
│       ├── auth/          # Authentication
│       ├── requests/      # Trip requests
│       ├── utils/         # Utilities
│       ├── db.js         # Database setup
│       └── server.js     # Express server
├── frontend/
│   ├── public/           # Static assets
│   └── src/
│       ├── api/          # API client
│       ├── components/   # Reusable components
│       ├── hooks/        # Custom hooks
│       └── pages/        # Page components
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn
- Git

### Installation

1. Clone the repository
```bash
git clone https://github.com/Shazni07/Coach-Request-App.git
cd Coach-Request-App
```

2. Install Backend Dependencies
```bash
cd backend
npm install
```

3. Set up the database
```bash
npm run migrate
npm run seed
```

4. Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

### Running the Application

1. Start the Backend Server
```bash
cd backend
npm run start
```

2. Start the Frontend Development Server
```bash
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:4000

## 🔐 Authentication

### Coordinator Login
- Email: coord@example.com
- Password: password123

### Viewer Login
- Email: viewer@example.com
- Password: viewer123

## 📱 Features in Detail

### Customer Request Form
- Client-side validation for all fields
- Phone number format validation
- Minimum passenger count validation
- Required field highlighting
- Success/error notifications

### Admin Dashboard
- Real-time request status updates
- Inline actions for request management
- Modal for scheduling details
- Driver and vehicle selection
- Date-time scheduling
- Status filtering
- Analytics view

### Security Features
- JWT-based authentication
- Role-based access control
- Protected API endpoints
- Secure password handling

## 📊 Database Schema

### Tables
- service_requests
- drivers
- vehicles
- assignments
- users

## 🔄 API Endpoints

### Public Endpoints
- POST /api/requests - Create new request
- POST /api/auth/login - User login

### Protected Endpoints
- GET /api/requests - List all requests
- PATCH /api/requests/:id/status - Update request status
- POST /api/requests/:id/schedule - Schedule request
- GET /api/drivers - List drivers
- GET /api/vehicles - List vehicles
- GET /api/analytics/daily - Get daily stats

## 🎨 UI/UX Features

- Responsive design for all screen sizes
- Interactive form validation
- Loading states and animations
- Toast notifications
- Modal dialogs
- Status badges
- Intuitive navigation
- Clean, modern interface

## 👥 User Roles

### Coordinator
- Full access to all features
- Can approve/reject requests
- Can schedule trips
- Can view analytics

### Viewer
- Can view requests
- Can view schedules
- Cannot modify data

## 📈 Future Enhancements

- Email notifications
- Customer request tracking
- Advanced analytics
- Driver scheduling optimization
- Vehicle maintenance tracking
- Mobile app version

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.