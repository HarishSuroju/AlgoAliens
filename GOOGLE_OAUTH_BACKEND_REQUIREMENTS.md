# Google OAuth Backend API Requirements

## Overview
This document outlines the backend API endpoints required to handle Google OAuth authentication and store user data in the alien database.

## Required Endpoints

### 1. Google Login Endpoint
**POST** `/auth/google/login`

**Purpose**: Handle Google OAuth login for existing users

**Request Body**:
```json
{
  "email": "user@gmail.com",
  "username": "John Doe",
  "googleId": "1234567890",
  "picture": "https://lh3.googleusercontent.com/...",
  "accessToken": "ya29.a0AfH6SMB..."
}
```

**Response**:
```json
{
  "success": true,
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": 123,
    "email": "user@gmail.com",
    "username": "John Doe",
    "picture": "https://lh3.googleusercontent.com/..."
  }
}
```

**Logic**:
1. Check if user exists in users table by email or googleId
2. If user exists, return JWT token
3. If user doesn't exist, return error asking to sign up

### 2. Google Signup Endpoint
**POST** `/auth/google/signup`

**Purpose**: Handle Google OAuth signup for new users

**Request Body**:
```json
{
  "email": "user@gmail.com",
  "username": "John Doe",
  "googleId": "1234567890",
  "picture": "https://lh3.googleusercontent.com/...",
  "accessToken": "ya29.a0AfH6SMB..."
}
```

**Response**:
```json
{
  "success": true,
  "message": "Signup successful",
  "token": "jwt_token_here",
  "user": {
    "id": 124,
    "email": "user@gmail.com",
    "username": "John Doe",
    "picture": "https://lh3.googleusercontent.com/..."
  }
}
```

**Logic**:
1. Check if user already exists by email or googleId
2. If user exists, return error asking to login
3. If user doesn't exist, create new user in users table
4. Store: email, username (from Google name), googleId, picture URL
5. Return JWT token for authentication

## Database Schema Requirements

### Users Table
The users table should include these fields for Google OAuth:

```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(255) NOT NULL,
  password VARCHAR(255) NULL, -- NULL for OAuth users
  google_id VARCHAR(255) UNIQUE NULL,
  picture_url TEXT NULL,
  auth_provider ENUM('local', 'google', 'github') DEFAULT 'local',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  -- other existing fields...
);
```

## Implementation Notes

1. **Email as Primary Identifier**: Use email as the primary way to identify users across different auth methods
2. **Username from Google**: Store the Google display name as username
3. **Profile Picture**: Store the Google profile picture URL for avatar display
4. **Auth Provider**: Track which authentication method was used
5. **JWT Token**: Generate and return JWT token for session management
6. **Validation**: Validate Google access token with Google API before processing
7. **Error Handling**: Proper error responses for duplicate users, invalid tokens, etc.

## Security Considerations

1. Validate Google access token with Google's token validation endpoint
2. Use HTTPS for all OAuth communications
3. Implement proper JWT token expiration
4. Store sensitive data securely (consider encrypting profile URLs)
5. Implement rate limiting for OAuth endpoints