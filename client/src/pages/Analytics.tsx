import { useOutletContext } from "react-router-dom";
import { Category } from "../types";
import { Flame, CheckCircle2, Trophy, TrendingUp, Activity, PieChart as PieIcon, MoreHorizontal } from "lucide-react";
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, PieChart, Pie, Cell, Legend,
    Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
    RadialBarChart, RadialBar,
    LineChart, Line
} from 'recharts';
import { motion } from "framer-motion";

interface DashboardContext {
    categories: Category[];
}

export default function Analytics() {
    const { categories } = useOutletContext<DashboardContext>();

    const totalStreak = categories.reduce((acc, cat) => acc + cat.currentStreak, 0);
    const activeCategories = categories.filter(c => c.currentStreak > 0).length;

    // --- MOCK DATA FOR CHARTS ---
    const weeklyActivity = [
        { name: 'Mon', completed: 4, focus: 80, income: 2400 },
        { name: 'Tue', completed: 6, focus: 90, income: 1398 },
        { name: 'Wed', completed: 3, focus: 60, income: 9800 },
        { name: 'Thu', completed: 8, focus: 95, income: 3908 },
        { name: 'Fri', completed: 5, focus: 75, income: 4800 },
        { name: 'Sat', completed: 9, focus: 100, income: 3800 },
        { name: 'Sun', completed: 7, focus: 85, income: 4300 },
    ];

    // Radar Data (Spread)
    const radarData = categories.map(cat => ({
        subject: cat.name,
        A: cat.currentStreak + 10, // Mock "Expected"
        B: cat.currentStreak,      // Actual
        fullMark: 100
    }));

    // Fallback if no categories
    const safeRadarData = radarData.length >= 3 ? radarData : [
        { subject: 'Work', A: 90, B: 80, fullMark: 100 },
        { subject: 'Health', A: 80, B: 70, fullMark: 100 },
        { subject: 'Code', A: 95, B: 90, fullMark: 100 },
        { subject: 'Read', A: 60, B: 40, fullMark: 100 },
        { subject: 'Social', A: 70, B: 60, fullMark: 100 },
        { subject: 'Home', A: 50, B: 30, fullMark: 100 },
    ];

    // Radial Data (Percentile)
    const radialData = [
        { name: '18-24', uv: 31.47, pv: 2400, fill: '#8884d8' },
        { name: '25-29', uv: 26.69, pv: 4567, fill: '#83a6ed' },
        { name: '30-34', uv: 15.69, pv: 1398, fill: '#8dd1e1' },
        { name: '35-39', uv: 8.22, pv: 9800, fill: '#82ca9d' },
        { name: '40-49', uv: 8.63, pv: 3908, fill: '#a4de6c' },
        { name: '50+', uv: 2.63, pv: 4800, fill: '#d0ed57' },
        { name: 'unknow', uv: 6.67, pv: 4800, fill: '#ffc658' }
    ];

    const simpleRadialData = [
        { name: 'Completed', value: 76, fill: '#3b82f6' },
        { name: 'Remaining', value: 24, fill: '#1e293b' }
    ];

    const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f97316', '#22c55e', '#eab308'];

    return (
        <div className="p-6 md:p-8 overflow-y-auto h-full space-y-6 animate-in fade-in zoom-in-95 duration-500">

            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 w-fit">
                        Overview
                    </h2>
                    <p className="text-slate-400 text-sm mt-1">Real Time Visualization</p>
                </div>
            </div>

            {/* Top Stat Cards with Sparklines */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <StatCard
                    title="Total Streak"
                    value={totalStreak}
                    subValue="+15% vs last week"
                    icon={Flame}
                    color="text-orange-500"
                    bg="bg-orange-500/10"
                    data={weeklyActivity}
                    dataKey="completed"
                    stroke="#f97316"
                />
                <StatCard
                    title="Active Lists"
                    value={activeCategories}
                    subValue="Stable"
                    icon={CheckCircle2}
                    color="text-blue-500"
                    bg="bg-blue-500/10"
                    data={weeklyActivity}
                    dataKey="focus"
                    stroke="#3b82f6"
                />
                <StatCard
                    title="Productivity"
                    value="92%"
                    subValue="Top 5%"
                    icon={Trophy}
                    color="text-purple-500"
                    bg="bg-purple-500/10"
                    data={weeklyActivity}
                    dataKey="focus"
                    stroke="#a855f7"
                />
            </div>

            {/* Main Grid: Live Info & Spread */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Live Information (Area Chart) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="lg:col-span-2 glass p-6 rounded-3xl border-slate-800 relative overflow-hidden"
                >
                    <div className="flex justify-between items-center mb-6 z-10 relative">
                        <div>
                            <h3 className="text-lg font-bold text-white">Live Information</h3>
                            <p className="text-xs text-slate-500">Real Time Visualization in Minutes</p>
                        </div>
                        <MoreHorizontal className="text-slate-500 cursor-pointer" />
                    </div>

                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={weeklyActivity}>
                                <defs>
                                    <linearGradient id="colorLive" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorLive2" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4} />
                                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis hide />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px' }}
                                    itemStyle={{ color: '#e2e8f0' }}
                                />
                                <Area type="monotone" dataKey="completed" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorLive)" />
                                <Area type="monotone" dataKey="focus" stroke="#22c55e" strokeWidth={3} fillOpacity={1} fill="url(#colorLive2)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Spread (Radar Chart) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    className="glass p-6 rounded-3xl border-slate-800"
                >
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-white">Spread</h3>
                        <Activity size={16} className="text-slate-500" />
                    </div>
                    <div className="h-[250px] w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={safeRadarData}>
                                <PolarGrid stroke="#334155" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                <Radar
                                    name="Actual"
                                    dataKey="B"
                                    stroke="#3b82f6"
                                    strokeWidth={2}
                                    fill="#3b82f6"
                                    fillOpacity={0.5}
                                />
                                <Radar
                                    name="Expected"
                                    dataKey="A"
                                    stroke="#22c55e"
                                    strokeWidth={2}
                                    fill="#22c55e"
                                    fillOpacity={0.2}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                                    itemStyle={{ color: '#e2e8f0' }}
                                />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>

            {/* Bottom Grid: Annual & Percentiles */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Annual Information (Bar Chart) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                    className="lg:col-span-2 glass p-6 rounded-3xl border-slate-800"
                >
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-white">Annual Information</h3>
                        <div className="flex gap-2">
                            <div className="h-2 w-2 rounded-full bg-blue-500 self-center" />
                            <span className="text-xs text-slate-400">Completed</span>
                            <div className="h-2 w-2 rounded-full bg-green-500 self-center" />
                            <span className="text-xs text-slate-400">Focus</span>
                        </div>
                    </div>
                    <div className="h-[200px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={weeklyActivity} barSize={12}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    cursor={{ fill: '#1e293b' }}
                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                                    itemStyle={{ color: '#e2e8f0' }}
                                />
                                <Bar dataKey="completed" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="focus" fill="#22c55e" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Percentile (Radial Bar) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                    className="glass p-6 rounded-3xl border-slate-800 flex flex-col justify-between"
                >
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-bold text-white">Percentile</h3>
                        <PieIcon size={16} className="text-slate-500" />
                    </div>

                    <div className="h-[180px] w-full relative -ml-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadialBarChart cx="50%" cy="50%" innerRadius="70%" outerRadius="100%" barSize={10} data={simpleRadialData} startAngle={90} endAngle={-270}>
                                <RadialBar
                                    background
                                    dataKey="value"
                                    cornerRadius={30 / 2}
                                    fill="#3b82f6"
                                />
                                <text x="50%" y="45%" textAnchor="middle" dominantBaseline="middle" className="fill-slate-400 text-xs font-medium">
                                    SCORE
                                </text>
                                <text x="50%" y="55%" textAnchor="middle" dominantBaseline="middle" className="fill-white text-3xl font-bold">
                                    76%
                                </text>
                            </RadialBarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-2">
                        <div className="text-center p-2 bg-slate-800/50 rounded-xl">
                            <span className="text-green-400 text-xs font-bold">↑ 65%</span>
                            <p className="text-[10px] text-slate-500 uppercase">Growth</p>
                        </div>
                        <div className="text-center p-2 bg-slate-800/50 rounded-xl">
                            <span className="text-blue-400 text-xs font-bold">↑ 46%</span>
                            <p className="text-[10px] text-slate-500 uppercase">Consistency</p>
                        </div>
                    </div>
                </motion.div>

            </div>
        </div>
    );
}

function StatCard({ title, value, subValue, icon: Icon, color, bg, data, dataKey, stroke }: any) {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="glass-card p-5 rounded-3xl flex flex-col justify-between hover:border-slate-700/50 transition-all border border-transparent bg-white/5 dark:bg-slate-900/40 min-h-[140px]"
        >
            <div className="flex justify-between items-start mb-2">
                <div>
                    <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">{title}</p>
                    <div className="flex items-baseline gap-2">
                        <h4 className="text-2xl font-bold text-white">{value}</h4>
                        {subValue && <span className={`text-[10px] ${subValue.includes('+') ? 'text-green-400' : 'text-slate-500'}`}>{subValue}</span>}
                    </div>
                </div>
                <div className={`p-2 rounded-xl ${bg}`}>
                    <Icon className={color} size={18} />
                </div>
            </div>

            {/* Sparkline */}
            <div className="h-10 w-full mt-2">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <Line type="monotone" dataKey={dataKey} stroke={stroke} strokeWidth={2} dot={false} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
}
