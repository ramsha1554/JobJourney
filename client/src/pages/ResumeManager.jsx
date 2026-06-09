import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { Upload, FileText, Trash2, Loader2, Plus, ExternalLink, File } from 'lucide-react';
import { format } from 'date-fns';

const ResumeManager = () => {
    const { api } = useAuth();
    const queryClient = useQueryClient();
    const [file, setFile] = useState(null);
    const [name, setName] = useState('');
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef(null);

    const { data: resumes, isLoading } = useQuery({
        queryKey: ['resumes'],
        queryFn: async () => {
            const { data } = await api.get('/resumes');
            return data.data;
        }
    });

    const uploadMutation = useMutation({
        mutationFn: async (formData) => {
            const { data } = await api.post('/resumes', formData);
            return data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['resumes']);
            setFile(null);
            setName('');
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
        const formData = new FormData();
        formData.append('file', file);
        formData.append('name', name || file.name);
        uploadMutation.mutate(formData);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        const dropped = e.dataTransfer.files[0];
        if (dropped) setFile(dropped);
    };

    const handleFileChange = (e) => {
        if (e.target.files[0]) setFile(e.target.files[0]);
    };

    const formatFileSize = (bytes) => {
        if (!bytes) return '';
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    if (isLoading) return (
        <div className="flex justify-center items-center h-full">
            <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
        </div>
    );

    return (
        <div className="max-w-3xl mx-auto space-y-8">

            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Resumes</h1>
                <p className="text-gray-500 mt-1">Upload and manage your CV versions for AI match analysis.</p>
            </div>

            {/* Upload Card */}
            <div className="card p-6 space-y-5">
                <div className="flex items-center gap-2 mb-1">
                    <div className="w-7 h-7 rounded-lg bg-brand-50 flex items-center justify-center">
                        <Plus className="w-4 h-4 text-brand-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">Upload New Version</h3>
                </div>

                {/* Name input */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Resume Name <span className="text-gray-400 font-normal">(optional)</span>
                    </label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Frontend Developer CV"
                        className="input-field"
                    />
                </div>

                {/* Drag & drop zone */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">File</label>
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                        onDragLeave={() => setDragOver(false)}
                        onDrop={handleDrop}
                        className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
                            dragOver
                                ? 'border-brand-500 bg-brand-50'
                                : file
                                ? 'border-brand-300 bg-brand-50'
                                : 'border-gray-200 bg-gray-50 hover:border-brand-300 hover:bg-brand-50'
                        }`}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            onChange={handleFileChange}
                            accept=".pdf,.doc,.docx"
                            className="hidden"
                        />
                        {file ? (
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center">
                                    <File className="w-5 h-5 text-brand-600" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900 text-sm">{file.name}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">{formatFileSize(file.size)}</p>
                                </div>
                                <button
                                    onClick={(e) => { e.stopPropagation(); setFile(null); }}
                                    className="text-xs text-red-500 hover:text-red-600 transition-colors mt-1"
                                >
                                    Remove
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                                    <Upload className="w-5 h-5 text-gray-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-700">
                                        Drop your file here, or <span className="text-brand-600">browse</span>
                                    </p>
                                    <p className="text-xs text-gray-400 mt-0.5">PDF, DOC, DOCX — up to 5MB</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Upload button */}
                <button
                    onClick={handleUpload}
                    disabled={!file || uploadMutation.isPending}
                    className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {uploadMutation.isPending ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> Uploading...</>
                    ) : (
                        <><Upload className="w-4 h-4" /> Upload Resume</>
                    )}
                </button>
            </div>

            {/* Resume List */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">
                        Your Resumes
                        {resumes?.length > 0 && (
                            <span className="ml-2 text-xs font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                                {resumes.length}
                            </span>
                        )}
                    </h3>
                </div>

                {resumes?.length === 0 ? (
                    <div className="card p-12 text-center">
                        <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-4">
                            <FileText className="w-7 h-7 text-gray-300" />
                        </div>
                        <p className="font-medium text-gray-500">No resumes yet</p>
                        <p className="text-sm text-gray-400 mt-1">Upload your first CV to get started with AI match analysis.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {resumes?.map((resume, index) => (
                            <div
                                key={resume._id}
                                className="card p-4 flex items-center justify-between hover:shadow-md transition-shadow duration-200"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center flex-shrink-0">
                                        <FileText className="w-5 h-5 text-brand-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900 text-sm">{resume.name}</h4>
                                        <p className="text-xs text-gray-400 mt-0.5">
                                            Uploaded {format(new Date(resume.createdAt), 'MMM dd, yyyy')}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <a
                                        href={resume.filePath}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center gap-1.5 text-xs font-medium text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100 px-3 py-1.5 rounded-lg transition-colors"
                                    >
                                        <ExternalLink className="w-3.5 h-3.5" />
                                        View
                                    </a>
                                    <button
                                        onClick={() => {
                                            if (confirm('Delete this resume?')) {
                                                deleteMutation.mutate(resume._id);
                                            }
                                        }}
                                        disabled={deleteMutation.isPending}
                                        className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResumeManager;