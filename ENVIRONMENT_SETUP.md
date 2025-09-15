# Environment Setup

## Important: Environment Variables

**⚠️ NEVER commit the `.env` file to version control!**

This project uses environment variables to store sensitive configuration data like database credentials, API keys, and secrets.

### Setup Instructions:

1. **Copy the example file:**
   ```bash
   cp Backend/.env.example Backend/.env
   ```

2. **Fill in your actual values:**
   Open `Backend/.env` and replace all placeholder values with your actual configuration:

   - **Database**: Update with your PostgreSQL credentials
   - **JWT_SECRET**: Generate a secure random string
   - **Email**: Use Gmail App Password (not your regular password)
   - **Twilio**: Add your Twilio credentials for SMS (optional)
   - **GitHub OAuth**: Add your GitHub OAuth app credentials

3. **Security Notes:**
   - The `.env` file is already excluded from Git via `.gitignore`
   - Never share your `.env` file contents
   - Use different values for production and development
   - Regenerate secrets if accidentally exposed

### Required Environment Variables:

| Variable | Description | Required |
|----------|-------------|----------|
| `DB_HOST` | PostgreSQL host | Yes |
| `DB_USER` | PostgreSQL username | Yes |
| `DB_PASS` | PostgreSQL password | Yes |
| `DB_NAME` | PostgreSQL database name | Yes |
| `JWT_SECRET` | Secret key for JWT tokens | Yes |
| `SMTP_USER` | Gmail address for sending emails | Yes |
| `SMTP_PASS` | Gmail App Password | Yes |
| `GITHUB_CLIENT_ID` | GitHub OAuth Client ID | No* |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth Client Secret | No* |
| `TWILIO_*` | Twilio SMS credentials | No* |

*Optional features will be disabled if not provided.

## Database Setup

1. Install PostgreSQL
2. Create a database for the project
3. Update the database connection variables in `.env`
4. The application will create necessary tables automatically

## Gmail App Password Setup

1. Enable 2-Factor Authentication on your Gmail account
2. Go to Google Account settings → Security → App passwords
3. Generate an app password for "Mail"
4. Use this app password in `SMTP_PASS`, not your regular Gmail password