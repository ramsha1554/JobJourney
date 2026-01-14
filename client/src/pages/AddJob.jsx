import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useJobs } from '../hooks/useJobs';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const AddJob = () => {
    const navigate = useNavigate();
    const { createJob, isCreating } = useJobs();
    const { api } = useAuth();

    const { data: resumes } = useQuery({
        queryKey: ['resumes'],
        queryFn: async () => {
            const { data } = await api.get('/resumes');
            return data.data;
        }
    });

    const [formData, setFormData] = useState({
        title: '',
        company: '',
        location: 'Remote',
        status: 'Applied',
        url: '',
        salary: '',
        resume: '',
        notes: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        createJob(formData, {
            onSuccess: () => {
                navigate('/jobs');
            }
        });
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center space-x-4">
                <Link to="/jobs" className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <h1 className="text-2xl font-bold text-gray-900">Track New Application</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="card p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Job Title *</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                className="input-field"
                                placeholder="Senior Frontend Engineer"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Company Name *</label>
                            <input
                                type="text"
                                name="company"
                                value={formData.company}
                                onChange={handleChange}
                                required
                                className="input-field"
                                placeholder="Tech Corp Inc."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="Remote / London / NY"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Current Status</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="input-field"
                            >
                                <option value="Applied">Applied</option>
                                <option value="Interview">Interview</option>
                                <option value="Offer">Offer</option>
                                <option value="Rejected">Rejected</option>
                                <option value="Ghosted">Ghosted</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Job URL</label>
                            <input
                                type="url"
                                name="url"
                                value={formData.url}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="https://linkedin.com/jobs/..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Salary Range</label>
                            <input
                                type="text"
                                name="salary"
                                value={formData.salary}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="e.g. $120k - $150k"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Resume Used</label>
                        <select
                            name="resume"
                            value={formData.resume}
                            onChange={handleChange}
                            className="input-field appearance-none bg-white"
                        >
                            <option value="">Select a specific resume version...</option>
                            {resumes?.map(resume => (
                                <option key={resume._id} value={resume._id}>
                                    {resume.name} ({format(new Date(resume.createdAt), 'MMM dd')})
                                </option>
                            ))}
                        </select>
                        <p className="text-xs text-gray-500 mt-1">
                            Tracking which resume you used helps analyze performance later.
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            rows="4"
                            className="input-field py-3"
                            placeholder="Paste job description highlights or personal notes here..."
                        ></textarea>
                    </div>
                </div>

                <div className="flex justify-end space-x-4">
                    <Link to="/jobs" className="btn-secondary">Cancel</Link>
                    <button
                        type="submit"
                        disabled={isCreating}
                        className="btn-primary flex items-center min-w-[120px] justify-center"
                    >
                        {isCreating ? <Loader2 className="w-5 h-5 animate-spin" /> : <>
                            <Save className="w-5 h-5 mr-2" />
                            Save Job
                        </>}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddJob;
