import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Briefcase, FileText, BarChart2, LogOut, Github, Twitter, Linkedin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Layout = () => {
    const { user, logout } = useAuth();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    const navItems = [
        { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/jobs', icon: Briefcase, label: 'Applications' },
        { path: '/resumes', icon: FileText, label: 'Resumes' },
        { path: '/analytics', icon: BarChart2, label: 'Analytics' },
    ];

    return (
        <div className="flex h-screen bg-soft-white text-midnight font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-midnight border-r border-gray-800 hidden md:flex flex-col shadow-xl z-10">
                <div className="p-8">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-teal to-blue-400 bg-clip-text text-transparent tracking-tight">
                        CareerPath
                    </h1>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${isActive(item.path)
                                ? 'bg-white/10 text-teal shadow-inner translate-x-1 backdrop-blur-sm'
                                : 'text-gray-400 hover:bg-white/5 hover:text-white hover:translate-x-1'
                                }`}
                        >
                            <item.icon className={`w-5 h-5 mr-3 ${isActive(item.path) ? 'text-teal' : 'text-gray-500'}`} />
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="p-6 border-t border-gray-800 mt-auto">
                    <div className="flex items-center mb-6">
                        <div className="w-10 h-10 rounded-full bg-teal/20 flex items-center justify-center text-teal font-bold ring-2 ring-teal/30">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-3 overflow-hidden">
                            <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
                            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="flex items-center w-full px-4 py-2.5 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                    >
                        <LogOut className="w-4 h-4 mr-3" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Mobile Header */}
                <header className="md:hidden bg-white border-b border-fog p-4 flex items-center justify-between shadow-sm z-20">
                    <h1 className="text-xl font-bold text-midnight">CareerPath</h1>
                </header>

                {/* Scrollable Main Content */}
                <main className="flex-1 overflow-y-auto p-6 md:p-12 scroll-smooth">
                    <div className="max-w-7xl mx-auto min-h-[calc(100vh-140px)]">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={location.pathname}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                            >
                                <Outlet />
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Footer */}
                    <footer className="mt-12 py-8 border-t border-fog bg-soft-white">
                        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
                            <div className="mb-4 md:mb-0">
                                <p>&copy; {new Date().getFullYear()} CareerPath. Built with React & Node.</p>
                            </div>
                            <div className="flex space-x-6">
                                <a href="#" className="hover:text-teal transition-colors"><Github className="w-4 h-4" /></a>
                                <a href="#" className="hover:text-teal transition-colors"><Twitter className="w-4 h-4" /></a>
                                <a href="#" className="hover:text-teal transition-colors"><Linkedin className="w-4 h-4" /></a>
                            </div>
                        </div>
                    </footer>
                </main>
            </div>
        </div>
    );
};

export default Layout;
