import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, FolderOpen, Folder } from 'lucide-react';
import { ProblemItem } from './ProblemItem';

interface Problem {
    title: string;
    link: string;
    difficulty: string;
}

interface TopicData {
    topic: string;
    problems: Problem[];
}

interface TopicGroupProps {
    topicData: TopicData;
    completedProblems: Set<string>;
    toggleProblem: (title: string) => void;
    idx: number; // For staggered animation
}

export const TopicGroup: React.FC<TopicGroupProps> = ({ topicData, completedProblems, toggleProblem, idx }) => {
    const [isOpen, setIsOpen] = useState(true);

    // Calculate progress
    const completedCount = topicData.problems.filter(p => completedProblems.has(p.title)).length;
    const totalCount = topicData.problems.length;
    const progress = Math.round((completedCount / totalCount) * 100);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="rounded-2xl border border-border bg-card/30 backdrop-blur-sm overflow-hidden mb-6"
        >
            {/* Header */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
            >
                <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${isOpen ? 'bg-primary/20 text-primary' : 'bg-secondary text-muted-foreground'}`}>
                        {isOpen ? <FolderOpen size={20} /> : <Folder size={20} />}
                    </div>
                    <div className="text-left">
                        <h2 className="text-lg font-semibold text-foreground">{topicData.topic}</h2>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <div className="h-1.5 w-24 bg-secondary rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-primary"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                />
                            </div>
                            <span>{completedCount}/{totalCount} Done ({progress}%)</span>
                        </div>
                    </div>
                </div>

                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <ChevronDown size={20} className="text-muted-foreground" />
                </motion.div>
            </button>

            {/* Content Body */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="p-4 grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-border/50">
                            {topicData.problems.map((problem, i) => (
                                <ProblemItem
                                    key={problem.title}
                                    problem={problem}
                                    isCompleted={completedProblems.has(problem.title)}
                                    onToggle={() => toggleProblem(problem.title)}
                                    index={i}
                                />
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};
