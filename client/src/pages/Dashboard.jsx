import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Loader2, Plus, Calendar, Clock, CheckCircle, FileText, CalendarCheck, Trophy, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Dashboard = () => {
    const { user, api } = useAuth();

    const { data: statsData, isLoading } = useQuery({
        queryKey: ['dashboardStats'],
        queryFn: async () => {
            const { data } = await api.get('/analytics/dashboard');
            return data.data;
        }
    });

    const COLORS = ['#2DD4BF', '#0A2540', '#6EE7B7', '#E5E7EB', '#9ca3af'];

    if (isLoading) {
        return <div className="flex justify-center items-center h-full"><Loader2 className="w-8 h-8 animate-spin text-brand-600" /></div>;
    }

    const { stats, monthlyApplications } = statsData || { stats: { total: 0 }, monthlyApplications: [] };

    const pieData = [
        { name: 'Applied', value: stats.Applied || 0 },
        { name: 'Interview', value: stats.Interview || 0 },
        { name: 'Offer', value: stats.Offer || 0 },
        { name: 'Rejected', value: stats.Rejected || 0 },
        { name: 'Ghosted', value: stats.Ghosted || 0 },
    ].filter(d => d.value > 0);

    return (
        <div className="space-y-6 sm:space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-sm sm:text-base text-gray-500">Welcome back, {user?.name}</p>
                </div>
                <Link to="/add-job" className="btn-primary w-full sm:w-auto flex items-center justify-center">
                    <Plus className="w-5 h-5 mr-2" />
                    Track New Job
                </Link>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    {
                        title: "Total Applications",
                        value: stats.total,
                        icon: <FileText className="w-5 h-5 text-blue-600" />,
                        bg: "bg-blue-50",
                        border: "hover:border-blue-200"
                    },
                    {
                        title: "Interviews",
                        value: stats.Interview || 0,
                        icon: <CalendarCheck className="w-5 h-5 text-purple-600" />,
                        bg: "bg-purple-50",
                        border: "hover:border-purple-200"
                    },
                    {
                        title: "Offers",
                        value: stats.Offer || 0,
                        icon: <Trophy className="w-5 h-5 text-emerald-600" />,
                        bg: "bg-emerald-50",
                        border: "hover:border-emerald-200"
                    },
                    {
                        title: "Active Processes",
                        value: (stats.Applied || 0) + (stats.Interview || 0) + (stats.Offer || 0),
                        icon: <Zap className="w-5 h-5 text-orange-600" />,
                        bg: "bg-orange-50",
                        border: "hover:border-orange-200"
                    }
                ].map((item, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group ${item.border}`}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-xl ${item.bg} transition-transform group-hover:scale-110 duration-300`}>
                                {item.icon}
                            </div>
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm font-medium mb-1 font-poppins">{item.title}</p>
                            <h3 className="text-3xl font-bold text-gray-900 font-poppins tracking-tight">{item.value}</h3>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="card p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Application Status</h3>
                    <div className="h-64">
                        {pieData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                <p>No data available</p>
                            </div>
                        )}
                    </div>
                    <div className="flex flex-wrap justify-center gap-4 mt-4 text-sm">
                        {pieData.map((entry, index) => (
                            <div key={entry.name} className="flex items-center">
                                <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                <span>{entry.name} ({entry.value})</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="card p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Application Activity</h3>
                    <div className="h-64">
                        {monthlyApplications.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={monthlyApplications}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis
                                        dataKey="_id"
                                        tickFormatter={(val) => `${val.month}/${val.year}`}
                                        tick={{ fontSize: 12 }}
                                    />
                                    <YAxis />
                                    <Tooltip labelFormatter={(val) => `${val.month}/${val.year}`} />
                                    <Bar dataKey="count" fill="#4ade80" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                <p>No activity yet</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tips for Success</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-start p-4 bg-brand-50 rounded-xl border border-brand-100">
                        <Calendar className="w-6 h-6 text-teal mr-3 mt-1" />
                        <div>
                            <h4 className="font-bold text-midnight text-sm">Consistency is Key</h4>
                            <p className="text-xs text-gray-600 mt-1 leading-relaxed">Try to apply to 3-5 relevant jobs every day rather than mass applying once a week.</p>
                        </div>
                    </div>
                    <div className="flex items-start p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                        <CheckCircle className="w-6 h-6 text-indigo-600 mr-3 mt-1" />
                        <div>
                            <h4 className="font-bold text-midnight text-sm">Tailor Your Resume</h4>
                            <p className="text-xs text-gray-600 mt-1 leading-relaxed">Use the Resume Manager to upload role-specific versions of your CV.</p>
                        </div>
                    </div>
                    <div className="flex items-start p-4 bg-green-50 rounded-xl border border-green-100">
                        <Clock className="w-6 h-6 text-green-600 mr-3 mt-1" />
                        <div>
                            <h4 className="font-bold text-midnight text-sm">Follow Up</h4>
                            <p className="text-xs text-gray-600 mt-1 leading-relaxed">Don't forget to follow up on applications that have been silent for 1-2 weeks.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
