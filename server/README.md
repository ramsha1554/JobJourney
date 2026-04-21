# JobJourney - Backend (Server)

This is the Node.js/Express backend for the JobJourney application.

## 🛠️ Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Security**: Helmet, CORS, Bcrypt hashing
- **Auth**: Stateless JWT-based authentication
- **Logging**: Morgan for HTTP request logging

## 📁 Project Structure
- `models/`: Mongoose schemas for Users, Job Applications, Resumes, Tasks, and Contacts.
- `routes/`: Express routers organized by feature.
- `controllers/`: Logic handlers for the API endpoints.
- `middleware/`: Authentication checks and error handlers.
- `config/`: Database connection logic.

## 📡 API Endpoints
- `/api/auth`: Registration and Login.
- `/api/jobs`: CRUD operations for job applications.
- `/api/tasks`: Management of job-related tasks.
- `/api/resumes`: Handling resume metadata and uploads.
- `/api/analytics`: Stats aggregation for the dashboard.

## 🚀 Setup
```bash
npm install
# Configure .env
npm run dev
```
Ensure a MongoDB instance is running and accessible via the connection string in your `.env` file.
