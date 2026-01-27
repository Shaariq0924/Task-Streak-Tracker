import { useState, useEffect } from "react";
import { CheckCircle2, Circle, Calendar, Flame, Trophy, Trash2, Pencil } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import axios from "axios";

interface Task {
    _id: string;
    title: string;
    isCompleted: boolean;
    deadline?: string;
    createdAt: string;
}

interface Category {
    _id: string;
    name: string;
    currentStreak: number;
}

interface TaskViewProps {
    categoryId: string | null;
    categories: Category[];
    onUpdateCategory: () => void;
}

export function TaskView({ categoryId, categories, onUpdateCategory }: TaskViewProps) {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTaskTitle, setNewTaskTitle] = useState("");
    const [loading, setLoading] = useState(false);

    // Edit State
    const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
    const [editingTaskTitle, setEditingTaskTitle] = useState("");

    const startEditingTask = (task: Task) => {
        setEditingTaskId(task._id);
        setEditingTaskTitle(task.title);
    };

    const handleEditTask = async (taskId: string) => {
        if (!editingTaskTitle.trim()) {
            setEditingTaskId(null);
            return;
        }

        // Optimistic update
        setTasks(tasks.map(t =>
            t._id === taskId ? { ...t, title: editingTaskTitle } : t
        ));
        setEditingTaskId(null);

        try {
            await axios.put(`${import.meta.env.VITE_API_URL}/api/tasks/${taskId}`, {
                title: editingTaskTitle
            });
        } catch (error) {
            console.error("Error editing task", error);
            fetchTasks(); // Revert
        }
    };

    const selectedCategory = categories.find(c => c._id === categoryId);

    useEffect(() => {
        if (categoryId) {
            fetchTasks();
        }
    }, [categoryId]);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const res = await axios.get(import.meta.env.VITE_API_URL + '/api/tasks');
            // Filter by category client-side or backend-side. 
            // Backend returns all tasks currently, let's filter here for simplicity or update backend to filter.
            // Current backend: returns all tasks for user.
            const filtered = res.data.filter((t: any) => t.categoryId === categoryId);
            setTasks(filtered);
        } catch (error) {
            console.error("Error fetching tasks", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddTask = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTaskTitle.trim() || !categoryId) return;

        try {
            const res = await axios.post(import.meta.env.VITE_API_URL + '/api/tasks', {
                title: newTaskTitle,
                categoryId
            });
            setTasks([res.data, ...tasks]);
            setNewTaskTitle("");
        } catch (error) {
            console.error("Error adding task", error);
        }
    };

    const toggleTask = async (taskId: string) => {
        try {
            // Optimistic update
            setTasks(tasks.map(t =>
                t._id === taskId ? { ...t, isCompleted: !t.isCompleted } : t
            ));

            await axios.put(`${import.meta.env.VITE_API_URL}/api/tasks/${taskId}`);
            onUpdateCategory(); // Refresh streaks
        } catch (error) {
            console.error("Error toggling task", error);
            fetchTasks(); // Revert on error
        }
    };

    const deleteTask = async (taskId: string) => {
        try {
            setTasks(tasks.filter(t => t._id !== taskId));
            await axios.delete(`${import.meta.env.VITE_API_URL}/api/tasks/${taskId}`);
        } catch (error) {
            console.error("Error deleting task", error);
            fetchTasks();
        }
    };

    if (!categoryId) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
                <Trophy size={48} className="mb-4 opacity-20" />
                <p>Select a category to view tasks</p>
            </div>
        );
    }

    const completedCount = tasks.filter(t => t.isCompleted).length;
    const progress = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;

    return (
        <div className="flex-1 bg-slate-950 p-8 overflow-y-auto">
            <header className="mb-8">
                <div className="flex justify-between items-end mb-4">
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-2">{selectedCategory?.name}</h2>
                        <div className="flex items-center gap-2 text-slate-400">
                            <Calendar size={16} />
                            <span className="text-sm">{format(new Date(), "EEEE, MMMM do")}</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-4xl font-bold bg-gradient-to-br from-orange-400 to-red-500 bg-clip-text text-transparent flex justify-end items-center gap-2">
                            <Flame className="text-orange-500 fill-orange-500" />
                            {selectedCategory?.currentStreak || 0}
                        </div>
                        <div className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-1">Day Streak</div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                </div>
                <div className="flex justify-between mt-2 text-xs text-slate-500 font-medium">
                    <span>{completedCount} completed</span>
                    <span>{tasks.length - completedCount} remaining</span>
                </div>
            </header>

            {/* Add Task */}
            <form onSubmit={handleAddTask} className="mb-8">
                <input
                    type="text"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="Add a new task..."
                    className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl px-6 py-4 text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-lg shadow-black/20"
                />
            </form>

            {/* Tasks List */}
            <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                    {tasks.map((task) => (
                        <motion.div
                            key={task._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            layout
                            className={`group flex items-center gap-4 p-4 rounded-xl border transition-all ${task.isCompleted
                                ? "bg-slate-900/30 border-slate-800/50 opacity-60"
                                : "bg-slate-900 border-slate-800 hover:border-slate-700 hover:shadow-lg hover:shadow-blue-500/5"
                                }`}
                        >
                            <button onClick={() => toggleTask(task._id)} className="shrink-0 transition-transform active:scale-95">
                                {task.isCompleted ? (
                                    <CheckCircle2 className="text-blue-500" size={24} />
                                ) : (
                                    <Circle className="text-slate-600 group-hover:text-blue-400 transition-colors" size={24} />
                                )}
                            </button>

                            <div className="flex-1">
                                {editingTaskId === task._id ? (
                                    <form
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            handleEditTask(task._id);
                                        }}
                                        className="w-full"
                                    >
                                        <input
                                            autoFocus
                                            type="text"
                                            value={editingTaskTitle}
                                            onChange={(e) => setEditingTaskTitle(e.target.value)}
                                            onBlur={() => handleEditTask(task._id)}
                                            className="w-full bg-slate-800 border-b border-blue-500 text-slate-200 focus:outline-none py-1"
                                        />
                                    </form>
                                ) : (
                                    <span
                                        onClick={() => !task.isCompleted && startEditingTask(task)}
                                        className={`font-medium transition-all block cursor-text ${task.isCompleted ? "text-slate-500 line-through decoration-slate-600" : "text-slate-200"
                                            }`}
                                    >
                                        {task.title}
                                    </span>
                                )}
                            </div>

                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                {!task.isCompleted && editingTaskId !== task._id && (
                                    <button
                                        onClick={() => startEditingTask(task)}
                                        className="p-2 text-slate-600 hover:text-blue-400 transition-all hover:bg-blue-500/10 rounded-lg"
                                        title="Edit Task"
                                    >
                                        <Pencil size={18} />
                                    </button>
                                )}
                                <button
                                    onClick={() => deleteTask(task._id)}
                                    className="text-slate-600 hover:text-red-400 transition-all p-2 hover:bg-red-500/10 rounded-lg"
                                    title="Delete Task"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {tasks.length === 0 && !loading && (
                    <div className="text-center py-12 text-slate-600">
                        <p>No tasks yet. Add one to get started!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
