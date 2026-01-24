import { useOutletContext } from "react-router-dom";
import { TaskView } from "../components/TaskView";
import { Category } from "../types";
import { format, subDays, isSameDay, parseISO } from "date-fns";
import { motion } from "framer-motion";
import { TrendingUp, Award, Calendar, AlertCircle } from "lucide-react";

interface DashboardContext {
    categories: Category[];
    selectedCategoryId: string | null;
    fetchCategories: () => void;
}

export default function Dashboard() {
    const { categories, selectedCategoryId, fetchCategories } = useOutletContext<DashboardContext>();

    if (selectedCategoryId) {
        return (
            <TaskView
                categoryId={selectedCategoryId}
                categories={categories}
                onUpdateCategory={fetchCategories}
            />
        );
    }

    // --- Analytics Logic ---
    const today = new Date();

    // Helper to check if any category was completed on a specific date
    const checkCompletion = (date: Date) => {
        return categories.some(cat =>
            cat.history?.some(h => isSameDay(parseISO(h), date))
        );
    };

    const calculateConsistency = (days: number) => {
        let completedDays = 0;
        for (let i = 0; i < days; i++) {
            const date = subDays(today, i);
            if (checkCompletion(date)) {
                completedDays++;
            }
        }
        return Math.round((completedDays / days) * 100);
    };

    const weeklyConsistency = calculateConsistency(7);
    const monthlyConsistency = calculateConsistency(30);
    const yearlyConsistency = calculateConsistency(365);

    // Suggestions Logic
    const getSuggestion = () => {
        if (weeklyConsistency === 100) return "You're unstoppable! Keep maintaining this perfect streak.";
        if (weeklyConsistency >= 80) return "You're doing great! Try to close the gap for a perfect week.";
        if (weeklyConsistency >= 50) return "Good consistency. Focus on not missing two days in a row.";
        return "Start small. Aim to complete at least one task today to build momentum.";
    };

    const activeStreaks = categories.filter(c => c.currentStreak > 0).length;

    return (
        <div className="flex-1 p-8 overflow-y-auto">
            <header className="mb-10">
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 mb-2">
                    Dashboard Overview
                </h1>
                <p className="text-slate-400">Track your consistency and improvement over time</p>
            </header>

            {/* Consistency Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass p-6 rounded-2xl relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Calendar size={64} />
                    </div>
                    <h3 className="text-slate-400 font-medium mb-2">Weekly Consistency</h3>
                    <div className="flex items-end gap-2">
                        <span className="text-4xl font-bold text-white">{weeklyConsistency}%</span>
                        <span className="text-sm text-slate-500 mb-1">last 7 days</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full mt-4 overflow-hidden">
                        <div className="bg-blue-500 h-full rounded-full" style={{ width: `${weeklyConsistency}%` }} />
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass p-6 rounded-2xl relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <TrendingUp size={64} />
                    </div>
                    <h3 className="text-slate-400 font-medium mb-2">Monthly Consistency</h3>
                    <div className="flex items-end gap-2">
                        <span className="text-4xl font-bold text-white">{monthlyConsistency}%</span>
                        <span className="text-sm text-slate-500 mb-1">last 30 days</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full mt-4 overflow-hidden">
                        <div className="bg-purple-500 h-full rounded-full" style={{ width: `${monthlyConsistency}%` }} />
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="glass p-6 rounded-2xl relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Award size={64} />
                    </div>
                    <h3 className="text-slate-400 font-medium mb-2">Yearly Consistency</h3>
                    <div className="flex items-end gap-2">
                        <span className="text-4xl font-bold text-white">{yearlyConsistency}%</span>
                        <span className="text-sm text-slate-500 mb-1">last 365 days</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full mt-4 overflow-hidden">
                        <div className="bg-orange-500 h-full rounded-full" style={{ width: `${yearlyConsistency}%` }} />
                    </div>
                </motion.div>
            </div>

            {/* Suggestions & Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="glass p-6 rounded-2xl border-l-4 border-l-blue-500"
                >
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <AlertCircle className="text-blue-400" />
                        Suggestion
                    </h3>
                    <p className="text-slate-300 text-lg leading-relaxed">
                        "{getSuggestion()}"
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="glass p-6 rounded-2xl"
                >
                    <h3 className="text-xl font-bold text-white mb-4">Quick Stats</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                            <span className="text-slate-400">Total Categories</span>
                            <span className="text-white font-mono">{categories.length}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                            <span className="text-slate-400">Active Streaks</span>
                            <span className="text-white font-mono">{activeStreaks}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-slate-400">Total Completed Today</span>
                            <span className="text-white font-mono">
                                {categories.filter(c => c.history?.some(h => isSameDay(parseISO(h), today))).length}
                            </span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
