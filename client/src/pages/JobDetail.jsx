import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { useJobs } from '../hooks/useJobs';
import { ArrowLeft, Building2, MapPin, Globe, ExternalLink, FileText, Calendar, Clock, Monitor, Edit2 } from 'lucide-react';
import { format } from 'date-fns';

const JobDetail = () => {
    const { id } = useParams();
    const { api } = useAuth();
    const navigate = useNavigate();
    const { updateJob, isUpdating } = useJobs();
    const [interviewMode, setInterviewMode] = useState(false);

    const { data: job, isLoading } = useQuery({
        queryKey: ['job', id],
        queryFn: async () => {
            const { data } = await api.get(`/jobs/${id}`);
            return data.data;
        }
    });

    if (isLoading) return <div className="flex justify-center items-center h-full">Loading...</div>;
    if (!job) return <div>Job not found</div>;

    const handleStatusChange = (newStatus) => {
        updateJob({ id, status: newStatus });
    };

    if (interviewMode) {
        return (
            <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
                <div className="max-w-4xl mx-auto p-8">
                    <div className="flex justify-between items-center mb-8 border-b pb-4">
                        <div>
                            <span className="text-sm font-bold text-brand-600 uppercase tracking-widest">Interview Mode</span>
                            <h1 className="text-3xl font-bold text-gray-900 mt-2">{job.title}</h1>
                            <p className="text-xl text-gray-500">{job.company}</p>
                        </div>
                        <button
                            onClick={() => setInterviewMode(false)}
                            className="btn-secondary"
                        >
                            Exit Mode
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div className="p-6 bg-gray-50 rounded-xl border border-gray-100">
                                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                                    <FileText className="w-5 h-5 mr-2 text-gray-500" />
                                    Resume Submitted
                                </h3>
                                {job.resume ? (
                                    <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200">
                                        <span className="font-medium text-gray-700">{job.resume.name}</span>
                                        <span className="text-xs text-gray-400">PDF</span>
                                    </div>
                                ) : (
                                    <p className="text-gray-400 italic">No resume linked</p>
                                )}
                            </div>

                            <div className="p-6 bg-brand-50 rounded-xl border border-brand-100">
                                <h3 className="font-semibold text-teal mb-3">Key Talking Points</h3>
                                <ul className="list-disc list-inside text-midnight/80 space-y-2 text-sm leading-relaxed">
                                    <li>Why do you want to work at {job.company}?</li>
                                    <li>Experience with React and Node.js</li>
                                    <li>Tell me about a challenging project.</li>
                                </ul>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="p-6 bg-indigo-50 rounded-xl border border-indigo-100 h-full">
                                <h3 className="font-semibold text-indigo-900 mb-3">Job Description / Notes</h3>
                                <div className="prose prose-sm text-indigo-800 whitespace-pre-wrap leading-relaxed">
                                    {job.notes || "No notes added yet."}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Link to="/jobs" className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
                        <div className="flex items-center text-gray-500 text-sm mt-1">
                            <Building2 className="w-4 h-4 mr-1" />
                            <span className="mr-3">{job.company}</span>
                            <MapPin className="w-4 h-4 mr-1" />
                            <span>{job.location}</span>
                        </div>
                    </div>
                </div>
                <div className="flex space-x-3">
                    <button
                        onClick={() => setInterviewMode(true)}
                        className="btn-primary bg-indigo-600 hover:bg-indigo-700 flex items-center"
                    >
                        <Monitor className="w-4 h-4 mr-2" />
                        Interview Mode
                    </button>
                    <select
                        value={job.status}
                        onChange={(e) => handleStatusChange(e.target.value)}
                        className="btn-secondary py-2 border-gray-300"
                    >
                        {['Applied', 'Interview', 'Offer', 'Rejected', 'Ghosted'].map(status => (
                            <option key={status} value={status}>{status}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="card p-6">
                        <h3 className="text-lg font-semibold mb-4">Application Details</h3>
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div>
                                <label className="text-xs text-gray-500 uppercase tracking-wide">Applied On</label>
                                <p className="font-medium text-gray-900 flex items-center mt-1">
                                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                                    {format(new Date(job.dateApplied), 'MMMM dd, yyyy')}
                                </p>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 uppercase tracking-wide">Job Link</label>
                                {job.jobUrl ? (
                                    <a href={job.jobUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-brand-600 hover:underline flex items-center mt-1">
                                        <Globe className="w-4 h-4 mr-2" />
                                        View Posting <ExternalLink className="w-3 h-3 ml-1" />
                                    </a>
                                ) : (
                                    <p className="text-gray-400 mt-1">Not provided</p>
                                )}
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 uppercase tracking-wide">Salary</label>
                                <p className="font-medium text-gray-900 mt-1">{job.salary || 'N/A'}</p>
                            </div>
                        </div>

                        <div className="border-t pt-4">
                            <h4 className="font-medium text-gray-900 mb-2">Notes</h4>
                            <p className="text-gray-600 whitespace-pre-wrap">{job.notes || 'No notes added.'}</p>
                        </div>
                    </div>

                    <div className="card p-6">
                        <h3 className="text-lg font-semibold mb-4">Timeline</h3>
                        <div className="space-y-4">
                            {/* Init Event */}
                            <div className="flex gap-4">
                                <div className="flex flex-col items-center">
                                    <div className="w-2 h-2 rounded-full bg-gray-300 mt-2"></div>
                                    <div className="w-0.5 flex-1 bg-gray-200 my-1"></div>
                                </div>
                                <div className="pb-4">
                                    <p className="text-sm font-medium text-gray-900">Application Created</p>
                                    <p className="text-xs text-gray-500">{format(new Date(job.createdAt), 'MMM dd, h:mm a')}</p>
                                </div>
                            </div>

                            {/* History Events */}
                            {job.history?.map((event, idx) => (
                                <div key={idx} className="flex gap-4">
                                    <div className="flex flex-col items-center">
                                        <div className="w-2 h-2 rounded-full bg-brand-500 mt-2"></div>
                                        {idx !== job.history.length - 1 && <div className="w-0.5 flex-1 bg-gray-200 my-1"></div>}
                                    </div>
                                    <div className="pb-4">
                                        <p className="text-sm font-medium text-gray-900">Status changed to <span className="font-bold">{event.status}</span></p>
                                        <p className="text-xs text-gray-500">{format(new Date(event.changedAt), 'MMM dd, h:mm a')}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <div className="card p-6">
                        <h3 className="font-semibold text-gray-900 mb-4">Attachments</h3>
                        {job.resume ? (
                            <div className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                                <FileText className="w-8 h-8 text-red-500 mr-3" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">{job.resume.name}</p>
                                    <p className="text-xs text-gray-500">PDF Document</p>
                                </div>
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500">No resume linked.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobDetail;
