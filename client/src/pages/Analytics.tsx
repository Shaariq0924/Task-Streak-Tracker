import { useOutletContext } from "react-router-dom";
import { Category } from "../types";
import { Flame, CheckCircle2, Trophy, TrendingUp } from "lucide-react";

interface DashboardContext {
    categories: Category[];
}

export default function Analytics() {
    const { categories } = useOutletContext<DashboardContext>();

    const totalStreak = categories.reduce((acc, cat) => acc + cat.currentStreak, 0);
    const activeCategories = categories.filter(c => c.currentStreak > 0).length;

    return (
        <div className="p-6 md:p-8 overflow-y-auto h-full space-y-8">
            <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-bold text-white">Analytics</h2>
                <p className="text-slate-400">Track your productivity and streaks.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Total Streak Days"
                    value={totalStreak}
                    icon={Flame}
                    color="text-orange-500"
                    bg="bg-orange-500/10"
                />
                <StatCard
                    title="Active Lists"
                    value={activeCategories}
                    icon={CheckCircle2}
                    color="text-blue-500"
                    bg="bg-blue-500/10"
                />
                <StatCard
                    title="Completion Rate"
                    value="87%"
                    icon={TrendingUp}
                    color="text-green-500"
                    bg="bg-green-500/10"
                />
                <StatCard
                    title="Achievements"
                    value="12"
                    icon={Trophy}
                    color="text-purple-500"
                    bg="bg-purple-500/10"
                />
            </div>

            {/* Category Performance */}
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-6">Streak Performance by Category</h3>
                <div className="space-y-4">
                    {categories.map((cat) => (
                        <div key={cat._id} className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-300 font-medium">{cat.name}</span>
                                <span className="text-slate-400">{cat.currentStreak} days</span>
                            </div>
                            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-blue-500 rounded-full transition-all duration-500"
                                    style={{ width: `${Math.min(cat.currentStreak * 5, 100)}%` }} // Dummy scale 20 days = 100%
                                />
                            </div>
                        </div>
                    ))}
                    {categories.length === 0 && (
                        <div className="text-center text-slate-500 py-8">
                            No categories found. Create simple lists to track your tasks!
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon: Icon, color, bg }: any) {
    return (
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 p-6 rounded-2xl flex items-center gap-4 hover:border-slate-700 transition-colors">
            <div className={`p-3 rounded-xl ${bg}`}>
                <Icon className={color} size={24} />
            </div>
            <div>
                <p className="text-slate-400 text-sm font-medium">{title}</p>
                <p className="text-2xl font-bold text-white">{value}</p>
            </div>
        </div>
    );
}
