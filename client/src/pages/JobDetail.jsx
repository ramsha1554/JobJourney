import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import { useJobs } from "../hooks/useJobs";
import {
  ArrowLeft,
  Building2,
  MapPin,
  Globe,
  ExternalLink,
  FileText,
  Calendar,
  Monitor,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";

const JobDetail = () => {
  const { id } = useParams();
  const { api } = useAuth();
  const { updateJob } = useJobs();

  const [interviewMode, setInterviewMode] = useState(false);

  const [aiError, setAiError] = useState("");
  const [aiQuestions, setAiQuestions] = useState([]);
  const [aiQuestionsLoading, setAiQuestionsLoading] = useState(false);
  const [aiAnalysisLoading, setAiAnalysisLoading] = useState(false);

  const [aiAnalysis, setAiAnalysis] = useState(null);

  const { data: job, isLoading } = useQuery({
    queryKey: ["job", id],
    queryFn: async () => {
      const { data } = await api.get(`/jobs/${id}`);
      return data.data;
    },
  });

  const handleStatusChange = (newStatus) => {
    updateJob({ id, status: newStatus });
  };

  const analysisMutation = useMutation({
    mutationFn: async (jobId) => {
      const { data } = await api.post(`/ai/analyze/${jobId}`);
      return data.data;
    },
    onSuccess: (data) => {
      setAiAnalysis(data);
    },
    onError: (err) => {
      setAiError(
        err?.response?.data?.error || err.message || "AI analysis failed",
      );
    },
    onSettled: () => {
      setAiAnalysisLoading(false);
    },
  });

  const questionsMutation = useMutation({
    mutationFn: async (jobId) => {
      const { data } = await api.post(`/ai/questions/${jobId}`);
      return data.data.questions;
    },
    onSuccess: (data) => {
      setAiQuestions(Array.isArray(data) ? data : []);
    },
    onError: (err) => {
      setAiError(
        err?.response?.data?.error ||
          err.message ||
          "Interview question generation failed",
      );
    },
    onSettled: () => {
      setAiQuestionsLoading(false);
    },
  });

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-full">Loading...</div>
    );
  if (!job) return <div>Job not found</div>;

  if (interviewMode) {
    return (
      <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-8">
          <div className="flex justify-between items-center mb-8 border-b pb-4">
            <div>
              <span className="text-sm font-bold text-brand-600 uppercase tracking-widest">
                Interview Mode
              </span>
              <h1 className="text-3xl font-bold text-gray-900 mt-2">
                {job.title}
              </h1>
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
                    <span className="font-medium text-gray-700">
                      {job.resume.name}
                    </span>
                    <span className="text-xs text-gray-400">PDF</span>
                  </div>
                ) : (
                  <p className="text-gray-400 italic">No resume linked</p>
                )}
              </div>

              <div className="p-6 bg-brand-50 rounded-xl border border-brand-100">
                <h3 className="font-semibold text-teal mb-3">
                  Key Talking Points
                </h3>
                <ul className="list-disc list-inside text-midnight/80 space-y-2 text-sm leading-relaxed">
                  <li>Why do you want to work at {job.company}?</li>
                  <li>Experience with React and Node.js</li>
                  <li>Tell me about a challenging project.</li>
                </ul>
              </div>
            </div>

            <div className="space-y-6">
              <div className="p-6 bg-indigo-50 rounded-xl border border-indigo-100 h-full">
                <h3 className="font-semibold text-indigo-900 mb-3">
                  Job Description / Notes
                </h3>
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
          <Link
            to="/jobs"
            className="p-2 hover:bg-gray-100 rounded-full text-gray-500"
          >
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

        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <button
            onClick={() => setInterviewMode(true)}
            className="btn-primary bg-indigo-600 hover:bg-indigo-700 flex items-center"
          >
            <Monitor className="w-4 h-4 mr-2" />
            Interview Mode
          </button>

          <button
            onClick={() => {
              setAiError("");
              setAiQuestions([]);
              setAiAnalysis(null);
              setAiAnalysisLoading(true);
              analysisMutation.mutate(id);
            }}
            disabled={aiAnalysisLoading}
            className="btn-secondary py-2 border-gray-300 flex items-center justify-center"
          >
            {aiAnalysisLoading ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : null}
            Analyze Resume Match
          </button>

          <button
            onClick={() => {
              setAiError("");
              setAiQuestionsLoading(true);
              questionsMutation.mutate(id);
            }}
            disabled={aiQuestionsLoading}
            className="btn-secondary py-2 border-gray-300 flex items-center justify-center"
          >
            {aiQuestionsLoading ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : null}
            Generate Interview Questions
          </button>

          <select
            value={job.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="btn-secondary py-2 border-gray-300"
          >
            {["Applied", "Interview", "Offer", "Rejected", "Ghosted"].map(
              (status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ),
            )}
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
                <label className="text-xs text-gray-500 uppercase tracking-wide">
                  Applied On
                </label>
                <p className="font-medium text-gray-900 flex items-center mt-1">
                  <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                  {format(new Date(job.dateApplied), "MMMM dd, yyyy")}
                </p>
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wide">
                  Job Link
                </label>
                {job.jobUrl ? (
                  <a
                    href={job.jobUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-brand-600 hover:underline flex items-center mt-1"
                  >
                    <Globe className="w-4 h-4 mr-2" />
                    View Posting <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                ) : (
                  <p className="text-gray-400 mt-1">Not provided</p>
                )}
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wide">
                  Interview Date
                </label>
                <div className="flex items-center mt-1">
                  <input
                    type="date"
                    value={
                      job.interviewDate
                        ? new Date(job.interviewDate).toISOString().slice(0, 10)
                        : ""
                    }
                    onChange={(e) => {
                      const v = e.target.value;
                      updateJob({
                        id,
                        interviewDate: v ? new Date(v) : null,
                      });
                    }}
                    className="btn-secondary py-2 border-gray-300 w-full"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wide">
                  Salary
                </label>
                <p className="font-medium text-gray-900 mt-1">
                  {job.salary || "N/A"}
                </p>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium text-gray-900 mb-2">Notes</h4>
              <p className="text-gray-600 whitespace-pre-wrap">
                {job.notes || "No notes added."}
              </p>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-semibold mb-4">Timeline</h3>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-2 h-2 rounded-full bg-gray-300 mt-2"></div>
                  <div className="w-0.5 flex-1 bg-gray-200 my-1"></div>
                </div>
                <div className="pb-4">
                  <p className="text-sm font-medium text-gray-900">
                    Application Created
                  </p>
                  <p className="text-xs text-gray-500">
                    {format(new Date(job.createdAt), "MMM dd, h:mm a")}
                  </p>
                </div>
              </div>

              {job.history?.map((event, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-2 rounded-full bg-brand-500 mt-2"></div>
                    {idx !== job.history.length - 1 && (
                      <div className="w-0.5 flex-1 bg-gray-200 my-1"></div>
                    )}
                  </div>
                  <div className="pb-4">
                    <p className="text-sm font-medium text-gray-900">
                      Status changed to{" "}
                      <span className="font-bold">{event.status}</span>
                    </p>
                    <p className="text-xs text-gray-500">
                      {format(new Date(event.changedAt), "MMM dd, h:mm a")}
                    </p>
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
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {job.resume.name}
                  </p>
                  <p className="text-xs text-gray-500">PDF Document</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No resume linked.</p>
            )}
          </div>

          {aiError ? (
            <div className="card p-6 border border-red-200 bg-red-50">
              <h3 className="font-semibold text-red-800 mb-2">AI Error</h3>
              <p className="text-sm text-red-700 whitespace-pre-wrap">
                {aiError}
              </p>
            </div>
          ) : null}

          {aiAnalysisLoading ? (
            <div className="card p-6">
              <div className="flex items-center">
                <Loader2 className="w-5 h-5 animate-spin mr-2 text-brand-600" />
                <p className="text-sm font-medium text-gray-700">
                  Analyzing resume match…
                </p>
              </div>
            </div>
          ) : null}

          {aiAnalysis ? (
            <div className="card p-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                Resume Match Analysis
              </h3>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-700">
                    Match Score
                  </p>
                  <p className="text-sm font-bold text-gray-900">
                    {aiAnalysis.matchScore}%
                  </p>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-3 bg-indigo-600 rounded-full"
                    style={{
                      width: `${Math.max(0, Math.min(100, aiAnalysis.matchScore || 0))}%`,
                    }}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    Missing Keywords
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {(aiAnalysis.missingKeywords || []).map((kw, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 text-xs rounded-full bg-amber-50 text-amber-800 border border-amber-100"
                      >
                        {kw}
                      </span>
                    ))}
                    {(aiAnalysis.missingKeywords || []).length === 0 ? (
                      <span className="text-sm text-gray-500">None</span>
                    ) : null}
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    Skill Gaps
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {(aiAnalysis.skillGaps || []).map((gap, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 text-xs rounded-full bg-rose-50 text-rose-800 border border-rose-100"
                      >
                        {gap}
                      </span>
                    ))}
                    {(aiAnalysis.skillGaps || []).length === 0 ? (
                      <span className="text-sm text-gray-500">None</span>
                    ) : null}
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    Improvement Suggestions
                  </p>
                  <p className="text-sm text-gray-700 mt-2 leading-relaxed">
                    {aiAnalysis.improvementSuggestions ||
                      "No suggestions returned."}
                  </p>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {aiQuestionsLoading ? (
        <div className="card p-6">
          <div className="flex items-center">
            <Loader2 className="w-5 h-5 animate-spin mr-2 text-brand-600" />
            <p className="text-sm font-medium text-gray-700">
              Generating interview questions…
            </p>
          </div>
        </div>
      ) : null}

      {aiQuestions && aiQuestions.length > 0 ? (
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-3">Interview Questions</h3>
          <ul className="space-y-2">
            {aiQuestions.map((q, idx) => (
              <li
                key={idx}
                className="p-3 rounded-lg border border-gray-200 bg-white"
              >
                <span className="text-sm font-medium text-gray-900">
                  Q{idx + 1}.
                </span>
                <span className="text-sm text-gray-700 ml-2">{q}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
};

export default JobDetail;
