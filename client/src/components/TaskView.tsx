import { useState, useEffect } from "react";
import { CheckCircle2, Circle, Calendar, Flame, Trophy, Trash2, Pencil } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import api from "../utils/api";

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
            await api.put(`/api/tasks/${taskId}`, {
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
            const res = await api.get('/api/tasks');
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
            const res = await api.post('/api/tasks', {
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
            // Determine new status based on current state
            const task = tasks.find(t => t._id === taskId);
            if (!task) return;

            // Check if task is expired (created before today)
            const taskDate = new Date(task.createdAt);
            taskDate.setHours(0, 0, 0, 0);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (!task.isCompleted && taskDate < today) {
                // Prevent ticking if expired and not completed
                return;
            }

            const newStatus = !task.isCompleted;

            // Optimistic update
            setTasks(prev => prev.map(t =>
                t._id === taskId ? { ...t, isCompleted: newStatus } : t
            ));

            const res = await api.put(`/api/tasks/${taskId}`, {
                isCompleted: newStatus
            });

            // Confirm with server state to prevent desync
            setTasks(prev => prev.map(t =>
                t._id === taskId ? res.data : t
            ));

            onUpdateCategory(); // Refresh streaks
        } catch (error) {
            console.error("Error toggling task", error);
            fetchTasks(); // Revert on error
        }
    };

    const deleteTask = async (taskId: string) => {
        try {
            setTasks(tasks.filter(t => t._id !== taskId));
            await api.delete(`/api/tasks/${taskId}`);
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
        <div className="flex-1 p-8 overflow-y-auto">
            <header className="mb-8">
                <div className="flex justify-between items-end mb-4">
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-2">{selectedCategory?.name}</h2>
                        <div className="flex items-center gap-2 text-slate-400">
                            <Calendar size={16} />
                            <span className="text-sm">{format(new Date(), "EEEE, MMMM do")}</span>
                        </div>
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
                </div >
                <div className="flex justify-between mt-2 text-xs text-slate-500 font-medium">
                    <span>{completedCount} completed</span>
                    <span>{tasks.length - completedCount} remaining</span>
                </div>
            </header >

            {/* Add Task */}
            <form onSubmit={handleAddTask} className="mb-8">
                <input
                    type="text"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="Add a new task..."
                    className="w-full bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl px-6 py-4 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-lg shadow-black/20"
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
                                ? "bg-muted/50 border-border/50 opacity-60"
                                : "bg-card/50 backdrop-blur-sm border-border/50 hover:border-border hover:shadow-lg hover:shadow-primary/5"
                                }`}
                        >
                            <button
                                onClick={() => toggleTask(task._id)}
                                disabled={!task.isCompleted && new Date(task.createdAt).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)}
                                className={`shrink-0 transition-transform active:scale-95 ${!task.isCompleted && new Date(task.createdAt).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                                    }`}
                            >
                                {task.isCompleted ? (
                                    <CheckCircle2 className="text-blue-500" size={24} />
                                ) : (
                                    new Date(task.createdAt).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0) ? (
                                        <Circle className="text-slate-700" size={24} />
                                    ) : (
                                        <Circle className="text-slate-600 group-hover:text-blue-400 transition-colors" size={24} />
                                    )
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
                                    <div className="flex flex-col">
                                        <span
                                            onClick={() => !task.isCompleted && startEditingTask(task)}
                                            className={`font-medium transition-all block cursor-text ${task.isCompleted ? "text-slate-500 line-through decoration-slate-600" : "text-slate-200"
                                                }`}
                                        >
                                            {task.title}
                                        </span>
                                        {task.createdAt && (
                                            <span className="text-[10px] text-slate-500 font-medium mt-0.5">
                                                Added {format(new Date(task.createdAt), "MMM d, h:mm a")}
                                            </span>
                                        )}
                                    </div>
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

                {
                    tasks.length === 0 && !loading && (
                        <div className="text-center py-12 text-slate-600">
                            <p>No tasks yet. Add one to get started!</p>
                        </div>
                    )
                }
            </div>
        </div>
    );
}
