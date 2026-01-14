import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { Upload, FileText, Trash2, Loader2, Check } from 'lucide-react';
import { format } from 'date-fns';

const ResumeManager = () => {
    const { api } = useAuth();
    const queryClient = useQueryClient();
    const [file, setFile] = useState(null);
    const [name, setName] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    const { data: resumes, isLoading } = useQuery({
        queryKey: ['resumes'],
        queryFn: async () => {
            const { data } = await api.get('/resumes');
            return data.data;
        }
    });

    const uploadMutation = useMutation({
        mutationFn: async (formData) => {
            const { data } = await api.post('/resumes', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['resumes']);
            setFile(null);
            setName('');
            setIsUploading(false);
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id) => {
            await api.delete(`/resumes/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['resumes']);
        }
    });

    const handleUpload = (e) => {
        e.preventDefault();
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('name', name || file.name);

        uploadMutation.mutate(formData);
    };

    if (isLoading) return <div className="flex justify-center items-center h-full"><Loader2 className="w-8 h-8 animate-spin text-brand-600" /></div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Resumes</h1>
                <p className="text-gray-500">Manage your CV stats and versions</p>
            </div>

            <div className="card p-6">
                <h3 className="text-lg font-semibold mb-4">Upload New Version</h3>
                <form onSubmit={handleUpload} className="flex gap-4 items-end">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Resume Name (Optional)</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Frontend Developer CV"
                            className="input-field"
                        />
                    </div>
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">File (PDF/DOC)</label>
                        <div className="relative border border-gray-300 rounded-lg bg-gray-50 p-2 flex items-center">
                            <input
                                type="file"
                                onChange={(e) => setFile(e.target.files[0])}
                                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100"
                                accept=".pdf,.doc,.docx"
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={!file || isUploading}
                        className="btn-primary flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isUploading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Upload className="w-4 h-4 mr-2" />}
                        Upload
                    </button>
                </form>
            </div>

            <div className="space-y-4">
                {resumes?.map((resume) => (
                    <div key={resume._id} className="card p-4 flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-brand-50 rounded-lg text-brand-600">
                                <FileText className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900">{resume.name}</h4>
                                <p className="text-sm text-gray-500">Uploaded {format(new Date(resume.createdAt), 'MMM dd, yyyy')}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <a
                                href="#"
                                onClick={(e) => { e.preventDefault(); alert("View functionality would open the PDF"); }}
                                className="text-sm text-brand-600 hover:text-brand-700 font-medium"
                            >
                                View
                            </a>
                            <button
                                onClick={() => {
                                    if (confirm('Are you sure you want to delete this resume?')) {
                                        deleteMutation.mutate(resume._id);
                                    }
                                }}
                                className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                ))}

                {resumes?.length === 0 && (
                    <div className="text-center py-12 text-gray-400">
                        <FileText className="w-12 h-12 mx-auto mb-3 opacity-20" />
                        <p>No resumes uploaded yet</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResumeManager;
