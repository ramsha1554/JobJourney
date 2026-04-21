# JobJourney - Career Track & Growth Platform

JobJourney is a comprehensive, full-stack application designed to empower job seekers by providing a centralized hub for managing the entire job application lifecycle. From tracking applications and managing resumes to visualizing career progress, JobJourney streamlines the process of finding your next professional opportunity.

## 🚀 Purpose & Vision

The core purpose of JobJourney is to reduce the cognitive load and organizational chaos often associated with job hunting. It transforms a scattered process into a structured, data-driven journey, allowing users to:
- **Organize**: Keep track of every application, contact, and interview in one place.
- **Visualize**: Gain insights into application status distributions through interactive charts.
- **Manage**: Store and access different versions of resumes and portfolios.
- **Execute**: Never miss a follow-up or interview with integrated task tracking.

---

## 🛠️ Tech Stack

### Frontend (Client)
- **Framework**: [React 19](https://react.dev/) - Utilizing the latest features for a high-performance UI.
- **Build Tool**: [Vite](https://vitejs.dev/) - Lightning-fast development and optimized production builds.
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) - Modern, utility-first CSS for a clean and responsive design.
- **State Management & Data Fetching**: [TanStack Query (React Query)](https://tanstack.com/query/latest) - Efficient caching and server-state management.
- **Animations**: [Framer Motion](https://www.framer.com/motion/) - Smooth transitions and interactive micro-animations.
- **Data Visualization**: [Recharts](https://recharts.org/) - Beautiful, responsive charts for application analytics.
- **Drag & Drop**: [@hello-pangea/dnd](https://github.com/hello-pangea/dnd) - Powering the intuitive Kanban Board.
- **Icons**: [Lucide React](https://lucide.dev/) - Consistent and modern iconography.

### Backend (Server)
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/) - Fast, unopinionated web framework.
- **Database**: [MongoDB](https://www.mongodb.com/) - NoSQL database for flexible data modeling.
- **ODM**: [Mongoose](https://mongoosejs.com/) - Structured schema definitions and validation.
- **Authentication**: [JSON Web Tokens (JWT)](https://jwt.io/) & [Bcrypt](https://github.com/kelektiv/node.bcrypt.js) - Secure, stateless authentication.
- **File Handling**: [Multer](https://github.com/expressjs/multer) - For resume and document uploads.
- **Security**: [Helmet](https://helmetjs.github.io/) & [CORS](https://github.com/expressjs/cors) - Standard security headers and cross-origin resource sharing.

---

## 🏗️ Application Structure

The project follows a modular MERN architecture with a clear separation of concerns.

### [Server](./server) (Backend)
- **`models/`**: MongoDB schemas (User, JobApplication, Resume, Task, Contact).
- **`routes/`**: API endpoints organized by resource.
- **`controllers/`**: Logical handlers for each route.
- **`middleware/`**: Auth guards, error handling, and file upload processing.
- **`config/`**: Database connection and environment configurations.

### [Client](./client) (Frontend)
- **`pages/`**: Primary views (Dashboard, JobBoard, JobDetail, ResumeManager, Login/Register).
- **`components/`**: Reusable UI elements (Layout, Navbar, KanbanCards, Charts).
- **`hooks/`**: Custom hooks (e.g., `useJobs`, `useAuth`) for shared logic.
- **`context/`**: React Context for global state (e.g., Authentication).
- **`utils/`**: Helper functions and API clients (Axios).
- **`assets/`**: Static images and global styles.

---

## ✨ Key Features

1.  **Analytical Dashboard**: High-level overview of your job search progress with metrics and status-based distribution charts.
2.  **Kanban Job Board**: Intuitive drag-and-drop interface to move applications through stages like "Applied", "Interview", "Offer", and "Rejected".
3.  **Detailed Application Tracking**: Store job IDs, salary ranges, company information, and direct links to job postings.
4.  **Resume Management**: Centralized storage for multiple resume versions, optimized for different roles.
5.  **Task & Networking Management**: Track upcoming interviews and keep notes on networking contacts within the hiring company.
6.  **Responsive Design**: A sleek, mobile-friendly interface with a specialized "Midnight & Teal" therapeutic color palette for a stress-free experience.

---

## 🚥 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)

### Installation

1.  **Clone the repository**
    ```bash
    git clone <repository-url>
    ```

2.  **Setup Server**
    ```bash
    cd server
    npm install
    # Create a .env file with:
    # PORT=5000
    # MONGO_URI=your_mongodb_uri
    # JWT_SECRET=your_jwt_secret
    npm run dev
    ```

3.  **Setup Client**
    ```bash
    cd client
    npm install
    npm run dev
    ```

The application will be running at `http://localhost:5173` (Frontend) and `http://localhost:5000` (Backend).
