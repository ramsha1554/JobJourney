import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid
} from 'recharts';
import { Loader2, BarChart3, PieChart as PieIcon, TrendingUp, Clock, Smile } from 'lucide-react';
import { motion } from 'framer-motion';

const Analytics = () => {
    const { api } = useAuth();

    const { data: statsData, isLoading } = useQuery({
        queryKey: ['analyticsStats'],
        queryFn: async () => {
            const { data } = await api.get('/analytics/dashboard');
            return data.data;
        }
    });

    const { stats, monthlyApplications } = statsData || { stats: { total: 0, Applied: 0, Interview: 0, Offer: 0, Rejected: 0, Ghosted: 0 }, monthlyApplications: [] };

    const pieData = [
        { name: 'Applied', value: stats.Applied || 0 },
        { name: 'Interview', value: stats.Interview || 0 },
        { name: 'Offer', value: stats.Offer || 0 },
        { name: 'Rejected', value: stats.Rejected || 0 },
        { name: 'Ghosted', value: stats.Ghosted || 0 }
    ].filter(item => item.value > 0);

    const COLORS = ['#22C55E', '#0EA5E9', '#F59E0B', '#EF4444', '#8B5CF6'];

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-full">
                <Loader2 className="w-10 h-10 animate-spin text-brand-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6 sm:space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Analytics</h1>
                    <p className="text-sm sm:text-base text-gray-500 max-w-xl">Track your application performance with charts, month-over-month activity, and a status distribution breakdown.</p>
                </div>
                <div className="rounded-3xl bg-teal-50 border border-teal-100 p-4 text-teal-900 inline-flex items-center gap-3">
                    <TrendingUp className="w-5 h-5" />
                    <span className="text-sm font-semibold">Always keep your pipeline moving.</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {[
                    {
                        label: 'Total Applications',
                        value: stats.total,
                        icon: <BarChart3 className="w-5 h-5 text-cyan-600" />,
                        description: 'All applications tracked across statuses.'
                    },
                    {
                        label: 'Active Pipeline',
                        value: (stats.Applied || 0) + (stats.Interview || 0) + (stats.Offer || 0),
                        icon: <Clock className="w-5 h-5 text-amber-600" />,
                        description: 'Jobs still in progress and worth following up.'
                    },
                    {
                        label: 'Conversion Rate',
                        value: stats.total ? `${Math.round(((stats.Offer || 0) / stats.total) * 100)}%` : '0%',
                        icon: <Smile className="w-5 h-5 text-emerald-600" />,
                        description: 'Offers per tracked application.'
                    }
                ].map((card, index) => (
                    <motion.div
                        key={card.label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.08 }}
                        className="rounded-3xl bg-white border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-sm font-medium text-gray-500">{card.label}</p>
                            <div className="rounded-2xl bg-gray-100 p-3">{card.icon}</div>
                        </div>
                        <h2 className="text-4xl font-bold text-gray-900 tracking-tight">{card.value}</h2>
                        <p className="mt-3 text-sm text-gray-500">{card.description}</p>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2 rounded-3xl bg-white border border-gray-100 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-xl font-semibold text-gray-900">Applications Over Time</h3>
                            <p className="text-sm text-gray-500">A look at activity for the last six months.</p>
                        </div>
                    </div>
<div className="h-80 w-full" style={{ minHeight: 320 }}>
                        <div className="h-full w-full" style={{ minHeight: 320 }}>
                            {monthlyApplications.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={monthlyApplications} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="_id" tickFormatter={(val) => `${val.month}/${val.year}`} tick={{ fontSize: 12 }} />
                                        <YAxis />
                                        <Tooltip labelFormatter={(label) => `${label.month}/${label.year}`} />
                                        <Bar dataKey="count" fill="#22C55E" radius={[8, 8, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex items-center justify-center text-gray-400">No activity data yet.</div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="rounded-3xl bg-white border border-gray-100 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-xl font-semibold text-gray-900">Status Distribution</h3>
                            <p className="text-sm text-gray-500">How your applications break down by status.</p>
                        </div>
                        <PieIcon className="w-5 h-5 text-slate-500" />
                    </div>
<div className="h-80 w-full">
                        <div className="h-full w-full" style={{ minHeight: 320 }}>
                            {pieData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={pieData} innerRadius={60} outerRadius={90} paddingAngle={6} dataKey="value">
                                            {pieData.map((entry, index) => (
                                                <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value) => `${value} application${value === 1 ? '' : 's'}`} />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex items-center justify-center text-gray-400">No status data available.</div>
                            )}
                        </div>
                    </div>
                    <div className="mt-6 grid gap-3">
                        {pieData.map((entry, index) => (
                            <div key={entry.name} className="flex items-center justify-between rounded-2xl bg-slate-50 p-3">
                                <div className="flex items-center gap-3">
                                    <span className="inline-flex h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                    <span className="text-sm font-medium text-gray-700">{entry.name}</span>
                                </div>
                                <span className="text-sm text-gray-500">{entry.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;

