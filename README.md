# AlgoAliens - Learning Platform

A modern web application built with React and Vite, featuring user authentication, profile management, and interactive learning experiences.

## 🚀 Features

- **User Authentication**: Email/password and Google OAuth login
- **Profile Management**: Upload profile pictures, manage personal information
- **Onboarding Flow**: Personalized setup for new users
- **Responsive Design**: Mobile-friendly interface
- **Real-time Updates**: Dynamic profile and navigation updates

## 🛠️ Tech Stack

### Frontend
- React 19.1.1
- Vite 7.1.2
- Tailwind CSS 3.4.17
- Framer Motion 12.23.12
- React Router DOM 7.9.1
- Lucide React Icons

### Backend
- Node.js with Express
- PostgreSQL database
- JWT authentication
- Multer for file uploads
- Nodemailer for email services

## 📋 Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- Gmail account (for email services)

## ⚙️ Installation & Setup

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd AlgoAliens
```

### 2. Install dependencies
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd Backend
npm install
cd ..
```

### 3. Environment Configuration
**⚠️ IMPORTANT**: Never commit the `.env` file to version control!

```bash
# Copy the example environment file
cp Backend/.env.example Backend/.env
```

Then edit `Backend/.env` with your actual configuration values. See [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md) for detailed instructions.

### 4. Database Setup
1. Install PostgreSQL
2. Create a database for the project
3. Update database credentials in `Backend/.env`
4. The application will create tables automatically on first run

### 5. Run the application

```bash
# Start the backend server (Terminal 1)
cd Backend
node server.js

# Start the frontend development server (Terminal 2)
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:4000

## 📁 Project Structure

```
AlgoAliens/
├── src/
│   ├── components/          # Reusable UI components
│   ├── pages/              # Page components
│   ├── hooks/              # Custom React hooks
│   └── assets/             # Static assets
├── Backend/
│   ├── server.js           # Express server
│   ├── uploads/            # User uploaded files
│   ├── .env.example        # Environment template
│   └── .env                # Environment variables (not in git)
└── README.md
```

## 🔐 Security Notes

- Environment variables are properly excluded from version control
- JWT tokens are used for secure authentication
- File upload validation and size limits are enforced
- Gmail App Passwords are required (not regular passwords)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Ensure `.env` files are not committed
5. Submit a pull request

## 🔧 Development Notes

- Uses Vite for fast development and building
- ESLint configured for code quality
- Hot Module Replacement (HMR) enabled
- Responsive design with Tailwind CSS
- Smooth animations with Framer Motion
