import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, Code2, Sparkles, CheckCircle2 } from 'lucide-react';
import checklistData from '../data/dsa-checklist.json';
import { TopicGroup } from '../components/DSAChecklist/TopicGroup';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use'; // Assuming react-use might be installed, or we can use a custom hook. 
// Actually, let's not assume external libs if not sure. I'll use a simple confetti or skip it if package not found.
// I will skip Confetti for now to avoid package issues, or implement a simple one.

interface ChecklistContext {
    user: any;
}

export default function DSAChecklist() {
    const { user } = useOutletContext<ChecklistContext>();
    const [completedProblems, setCompletedProblems] = useState<Set<string>>(new Set());
    const [showConfetti, setShowConfetti] = useState(false);

    // Load progress from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('dsa-checklist-progress');
        if (saved) {
            setCompletedProblems(new Set(JSON.parse(saved)));
        }
    }, []);

    // Save progress
    useEffect(() => {
        localStorage.setItem('dsa-checklist-progress', JSON.stringify(Array.from(completedProblems)));
    }, [completedProblems]);

    const toggleProblem = (title: string) => {
        setCompletedProblems(prev => {
            const newSet = new Set(prev);
            if (newSet.has(title)) {
                newSet.delete(title);
            } else {
                newSet.add(title);
                // Trigger mini celebration or check for major milestones here
            }
            return newSet;
        });
    };

    // Calculate total stats
    const totalProblems = checklistData.reduce((acc, topic) => acc + topic.problems.length, 0);
    const totalCompleted = completedProblems.size;
    const globalProgress = Math.round((totalCompleted / totalProblems) * 100);

    return (
        <div className="h-full overflow-y-auto w-full p-4 md:p-8 scrollbar-hide">
            <div className="max-w-6xl mx-auto space-y-8 pb-20">

                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative rounded-3xl bg-gradient-to-r from-violet-600 to-indigo-600 p-8 md:p-12 text-white overflow-hidden shadow-2xl"
                >
                    <div className="absolute top-0 right-0 p-12 opacity-10 transform rotate-12">
                        <Code2 size={200} />
                    </div>

                    <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-md border border-white/10 uppercase tracking-wider">
                                    TUF+ SDE Sheet
                                </span>
                                <span className="flex items-center gap-1 text-xs font-medium text-white/80">
                                    <Sparkles size={12} className="text-yellow-300" />
                                    Premium
                                </span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
                                DSA <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 to-blue-200">Consistency</span>
                            </h1>
                            <p className="text-indigo-100 max-w-lg text-lg leading-relaxed">
                                Master Data Structures and Algorithms with this curated checklist. Track your progress and crush your interviews.
                            </p>
                        </div>

                        {/* Global Progress Card */}
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 w-full md:w-auto min-w-[280px]">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-indigo-100">Total Progress</span>
                                <Trophy className="text-yellow-300" size={20} />
                            </div>
                            <div className="text-3xl font-bold mb-2">{globalProgress}%</div>
                            <div className="w-full bg-black/20 rounded-full h-2.5 overflow-hidden">
                                <motion.div
                                    className="h-full bg-gradient-to-r from-cyan-300 to-blue-400"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${globalProgress}%` }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                />
                            </div>
                            <div className="mt-2 text-xs text-indigo-200 text-right">
                                {totalCompleted} of {totalProblems} problems solved
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Topics Grid */}
                <div className="space-y-6">
                    {checklistData.map((topic, idx) => (
                        <TopicGroup
                            key={topic.topic}
                            topicData={topic}
                            completedProblems={completedProblems}
                            toggleProblem={toggleProblem}
                            idx={idx}
                        />
                    ))}
                </div>

            </div>
        </div>
    );
}
