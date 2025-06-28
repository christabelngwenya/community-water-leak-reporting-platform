
# Water Leak Reporting Platform

A modern web application designed to streamline water leak reporting and management for water utility companies. This platform provides an intuitive interface for citizens to report water leaks and track the status of their reports in real-time.

## Features

### For Citizens
- Easy Report Submission: Simple form to report water leaks with location details
- Real-time Status Tracking: Check the status of submitted reports using phone number
- Zimbabwean Phone Validation: Automatic validation for Zimbabwean mobile numbers (+263 format)
- Responsive Design: Works seamlessly on desktop and mobile devices
- Emergency Contact Information: Quick access to emergency contacts

### For Administrators
- Email Notifications: Instant email alerts when new reports are submitted
- Database Management: Centralized storage of all reports with status tracking
- Report Analytics: Track pending vs. resolved reports
- Contact Management: Easy communication with reporters

## Architecture

This project follows a full-stack architecture with:

- Frontend: React.js with styled-components for modern UI
- Backend: Node.js with Express.js REST API
- Database: MySQL for data persistence
- Email Service: Nodemailer for automated notifications

## Project Structure

```
water-leak-reporting-platform/
├── backend/                 # Node.js server
│   ├── server.js           # Express server with API endpoints
│   ├── package.json        # Backend dependencies
│   └── .env               # Environment variables (create this)
├── leak-report-form/       # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   └── ReportLeakForm.js  # Main form component
│   │   ├── App.js
│   │   └── index.js
│   └── package.json        # Frontend dependencies
└── README.md              # This file
```

## Quick Start

### Prerequisites

- Node.js (v14 or higher)
- MySQL database
- Gmail account (for email notifications)

### 1. Database Setup

Create a MySQL database and table:

```sql
CREATE DATABASE water_management;
USE water_management;

CREATE TABLE reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    contact VARCHAR(20) NOT NULL,
    location TEXT NOT NULL,
    issue TEXT NOT NULL,
    status ENUM('pending', 'in_progress', 'fixed') DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    notified BOOLEAN DEFAULT FALSE
);
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:

```env
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=water_management
GMAIL_APP_PASSWORD=your_gmail_app_password
PORT=5001
```

Start the backend server:

```bash
npm start
```

### 3. Frontend Setup

```bash
cd leak-report-form
npm install
npm start
```

The application will be available at `http://localhost:3000`

## API Endpoints

### POST `/api/reports`
Submit a new water leak report

**Request Body:**
```json
{
  "name": "John Doe",
  "contact": "+263712345678",
  "location": "123 Main Street, Harare",
  "issue": "Burst pipe in front of house"
}
```

**Response:**
```json
{
  "message": "Report submitted successfully and notification sent",
  "reportId": 123
}
```

### GET `/api/reports/status/:contact`
Check report status by phone number

**Response:**
```json
{
  "id": 123,
  "status": "pending",
  "created_at": "2024-01-15 10:30:00",
  "message": "Report status: pending"
}
```

## UI Features

- Modern Design: Clean, professional interface with smooth animations
- Form Validation: Real-time validation for phone numbers and required fields
- Status Indicators: Color-coded status messages (pending, fixed, etc.)
- Country Flag: Zimbabwe flag icon for phone number input
- Responsive Layout: Optimized for all screen sizes
- Loading States: Visual feedback during form submission

## Configuration

### Email Settings
The system uses Gmail SMTP for sending notifications. Configure your Gmail app password in the `.env` file.

### Phone Number Validation
The system validates Zimbabwean mobile numbers in the format: `+2637[1|3|7|8][0-9]{7}`

### Database Configuration
Modify the database connection settings in `backend/server.js` or use environment variables.

## Development

### Adding New Features
1. Frontend: Add new components in `leak-report-form/src/components/`
2. Backend: Add new routes in `backend/server.js`
3. Database: Modify the `reports` table schema as needed

### Testing
- Frontend: `npm test` (in leak-report-form directory)
- Backend: Manual testing with tools like Postman

## Email Notifications

The system automatically sends email notifications to administrators when:
- A new report is submitted
- Includes reporter details and location
- Shows total count of pending reports

## Security Considerations

- Input validation on both frontend and backend
- SQL injection prevention using parameterized queries
- CORS configuration for cross-origin requests
- Environment variables for sensitive data

## Emergency Contacts

The platform displays emergency contact information incase its an emergency that needs to be resolved soon:
- Phone: +263715108592
- Email: christabelchrissy01@gmail.com
- Website: www.watermanagement.com

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.

## Support

For technical support or questions about the water leak reporting platform, please contact:
- Email: christabelchrissy01@gmail.com
- Phone: +263715108592

Built with ❤️ for better water management in Zimbabwe
