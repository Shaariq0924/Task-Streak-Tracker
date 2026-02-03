import { useState } from "react";
import { CheckCircle2, CalendarClock, Trophy } from "lucide-react";
import { format } from "date-fns";
import confetti from "canvas-confetti";

export default function ConsistencyChallenge() {
    // Mock State - In real app, persist this
    const [selectedDuration, setSelectedDuration] = useState<25 | 50 | 100>(25);
    const [completedDays, setCompletedDays] = useState<Record<number, string>>({});

    const handleBoxClick = (day: number) => {
        setCompletedDays(prev => {
            const newState = { ...prev };
            if (newState[day]) {
                delete newState[day]; // Undo/Delete
            } else {
                newState[day] = new Date().toISOString(); // Mark as done
                // Trigger Confetti
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 }
                });
            }
            return newState;
        });
    };

    const progress = (Object.keys(completedDays).length / selectedDuration) * 100;

    return (
        <div className="p-6 md:p-8 h-full overflow-y-auto animate-in">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                            Consistency Challenge
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">
                            Build a habit by showing up every single day.
                        </p>
                    </div>

                    <div className="flex gap-2">
                        {[25, 50, 100].map((num) => (
                            <button
                                key={num}
                                onClick={() => {
                                    setSelectedDuration(num as any);
                                    setCompletedDays({}); // Reset for demo
                                }}
                                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${selectedDuration === num
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
                                    : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-700"
                                    }`}
                            >
                                {num} Days
                            </button>
                        ))}
                    </div>
                </div>

                {/* Progress Card */}
                <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
                    <div className="absolute top-0 left-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500" style={{ width: `${progress}%` }} />
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-500/10 rounded-xl">
                            <Trophy className="text-blue-500" size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Current Progress</p>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                {Object.keys(completedDays).length} / {selectedDuration} Days
                            </p>
                        </div>
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-3">
                    {Array.from({ length: selectedDuration }).map((_, i) => {
                        const day = i + 1;
                        const isCompleted = !!completedDays[day];
                        const dateCompleted = isCompleted ? new Date(completedDays[day]) : null;

                        return (
                            <button
                                key={day}
                                onClick={() => handleBoxClick(day)}
                                className={`
                                    aspect-square rounded-xl flex flex-col items-center justify-center relative group transition-all duration-300
                                    ${isCompleted
                                        ? "bg-green-500 text-white shadow-lg shadow-green-500/20 scale-95"
                                        : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 hover:-translate-y-1 hover:shadow-xl"
                                    }
                                `}
                            >
                                {isCompleted ? (
                                    <CheckCircle2 size={24} className="animate-in" />
                                ) : (
                                    <span className="font-bold text-slate-400 dark:text-slate-600 group-hover:text-slate-600 dark:group-hover:text-slate-300">
                                        {day}
                                    </span>
                                )}

                                {isCompleted && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/80 text-white text-[10px] opacity-0 group-hover:opacity-100 transition-opacity rounded-xl p-1 text-center backdrop-blur-sm cursor-pointer">
                                        <div className="flex flex-col items-center">
                                            <CalendarClock size={12} className="mb-1" />
                                            <span>{format(dateCompleted!, "MMM d")}</span>
                                            <span className="opacity-75">{format(dateCompleted!, "h:mm a")}</span>
                                            <span className="text-red-400 font-bold mt-1">Undo</span>
                                        </div>
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
