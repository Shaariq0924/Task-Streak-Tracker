import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Check, Lock, Youtube, FileText } from 'lucide-react';

interface Problem {
    title: string;
    link: string;
    difficulty: string;
}

interface ProblemItemProps {
    problem: Problem;
    isCompleted: boolean;
    onToggle: () => void;
    index: number;
}

export const ProblemItem: React.FC<ProblemItemProps> = ({ problem, isCompleted, onToggle, index }) => {

    const getDifficultyColor = (diff: string) => {
        switch (diff.toLowerCase()) {
            case 'easy': return 'text-green-400 bg-green-400/10 border-green-400/20';
            case 'medium': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
            case 'hard': return 'text-red-400 bg-red-400/10 border-red-400/20';
            default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`group relative flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 ${isCompleted
                    ? 'bg-secondary/30 border-primary/20'
                    : 'bg-card/50 border-border/50 hover:bg-card hover:border-border hover:shadow-lg hover:shadow-primary/5'
                }`}
        >
            {/* Checkbox */}
            <button
                onClick={onToggle}
                className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${isCompleted
                        ? 'bg-primary border-primary text-primary-foreground scale-110'
                        : 'border-muted-foreground/50 hover:border-primary group-hover:scale-110'
                    }`}
            >
                {isCompleted && <Check size={14} strokeWidth={3} />}
            </button>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    <h3 className={`font-medium truncate transition-colors ${isCompleted ? 'text-muted-foreground line-through decoration-primary/50' : 'text-foreground'
                        }`}>
                        {problem.title}
                    </h3>
                    <span className={`text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded border ${getDifficultyColor(problem.difficulty)}`}>
                        {problem.difficulty}
                    </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <a
                        href={problem.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 hover:text-primary transition-colors"
                    >
                        <ExternalLink size={12} />
                        Solve Problem
                    </a>
                    {/* Placeholder links for future features */}
                    {/* 
                    <span className="flex items-center gap-1 hover:text-red-400 cursor-not-allowed opacity-50">
                        <Youtube size={12} />
                        Video
                    </span>
                    <span className="flex items-center gap-1 hover:text-blue-400 cursor-not-allowed opacity-50">
                        <FileText size={12} />
                        Notes
                    </span>
                    */}
                </div>
            </div>

            {/* Animated Glow on Complete */}
            {isCompleted && (
                <motion.div
                    layoutId="glow"
                    className="absolute inset-0 rounded-xl bg-primary/5 -z-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                />
            )}
        </motion.div>
    );
};
