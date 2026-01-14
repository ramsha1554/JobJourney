const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

const auth = require('./routes/authRoutes');
const jobs = require('./routes/jobRoutes');
const tasks = require('./routes/taskRoutes');
const resumes = require('./routes/resumeRoutes');
const analytics = require('./routes/analyticsRoutes');

app.use('/api/auth', auth);
app.use('/api/jobs', jobs);
app.use('/api/tasks', tasks);
app.use('/api/resumes', resumes);
app.use('/api/analytics', analytics);

app.get('/', (req, res) => {
    res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
