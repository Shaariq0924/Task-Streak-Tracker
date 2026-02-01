import { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar as CalendarIcon, Clock, Tag, Plus, Check } from "lucide-react";
import { Category } from "../types";
import api from "../utils/api";

interface DashboardContext {
    categories: Category[];
}

export default function CreateTask() {
    const { categories } = useOutletContext<DashboardContext>();
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [deadline, setDeadline] = useState("");
    const [isCreatingCategory, setIsCreatingCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (categories.length > 0 && !categoryId) {
            setCategoryId(categories[0]._id);
        }
    }, [categories]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            let finalCategoryId = categoryId;

            // If creating a new category on the fly
            if (isCreatingCategory && newCategoryName.trim()) {
                const res = await api.post('/api/tasks/categories', { name: newCategoryName });
                finalCategoryId = res.data._id;
            }

            if (!finalCategoryId) {
                alert("Please select or create a category");
                setLoading(false);
                return;
            }

            await api.post('/api/tasks', {
                title,
                categoryId: finalCategoryId,
                deadline: deadline ? new Date(deadline) : undefined
            });

            navigate('/');
        } catch (error) {
            console.error("Error creating task", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-1 p-8 overflow-y-auto">
            <div className="max-w-2xl mx-auto">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8"
                >
                    <ArrowLeft size={20} />
                    Back
                </button>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass p-8 rounded-3xl"
                >
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 mb-2">
                        Create New Task
                    </h1>
                    <p className="text-slate-400 mb-8">Add a new task to your daily streak</p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Task Title
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g., Read 10 pages"
                                className="w-full bg-background/50 border border-input rounded-xl px-4 py-3 text-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Category
                            </label>

                            {!isCreatingCategory ? (
                                <div className="space-y-3">
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        {categories.map((cat) => (
                                            <button
                                                key={cat._id}
                                                type="button"
                                                onClick={() => setSelectedCategoryId(cat._id)}
                                                className={`p - 3 rounded - xl border text - sm font - medium transition - all text - left flex items - center justify - between group ${selectedCategoryId === cat._id
                                                        ? "bg-primary/20 border-primary text-primary"
                                                        : "bg-card border-border text-muted-foreground hover:border-primary/50"
                                                    } `}
                                            >
                                                {cat.name}
                                                {selectedCategoryId === cat._id && <Check size={16} />}
                                            </button>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={() => setIsCreatingCategory(true)}
                                            className="p-3 rounded-xl border border-dashed border-border text-muted-foreground hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2"
                                        >
                                            <Plus size={16} />
                                            New Category
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-card/50 p-4 rounded-xl border border-border">
                                    <h3 className="text-sm font-medium mb-3">New Category</h3>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={newCategoryName}
                                            onChange={(e) => setNewCategoryName(e.target.value)}
                                            placeholder="Category Name"
                                            className="flex-1 bg-background border border-input rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                                            autoFocus
                                        />
                                        <button
                                            type="button"
                                            onClick={handleCreateCategory}
                                            disabled={!newCategoryName.trim()}
                                            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
                                        >
                                            Add
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setIsCreatingCategory(false)}
                                            className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading || !title.trim() || !selectedCategoryId}
                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold py-4 rounded-xl transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                <Plus size={20} />
                                {loading ? "Creating..." : "Create Task"}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}
