import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "./Navbar";
import { ChatWidget } from "./ChatWidget";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import { Category } from "../types";

export function Layout() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
    const { user } = useAuth();
    const location = useLocation();

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await api.get('/api/tasks/categories');
            setCategories(res.data);
        } catch (error) {
            console.error("Error fetching categories", error);
        }
    };

    const handleAddCategory = async (name: string) => {
        try {
            const res = await api.post('/api/tasks/categories', { name });
            setCategories([...categories, res.data]);
            setSelectedCategoryId(res.data._id);
        } catch (error) {
            console.error("Error adding category", error);
        }
    };

    const handleDeleteCategory = async (id: string) => {
        if (!confirm("Are you sure? This will delete all tasks in this list.")) return;
        try {
            await api.delete(`/api/tasks/categories/${id}`);
            setCategories(categories.filter(c => c._id !== id));
            if (selectedCategoryId === id) {
                setSelectedCategoryId(null);
            }
        } catch (error) {
            console.error("Error deleting category", error);
        }
    };

    // Shared context for children pages
    const context = {
        categories,
        selectedCategoryId,
        setSelectedCategoryId,
        fetchCategories,
        user
    };

    return (
        <div className="flex flex-col h-screen bg-background text-foreground font-sans overflow-hidden selection:bg-purple-500/30 selection:text-purple-200 relative">

            {/* Navbar Replaces Sidebar */}
            <Navbar
                categories={categories}
                onSelectCategory={setSelectedCategoryId}
                onAddCategory={handleAddCategory}
                onDeleteCategory={handleDeleteCategory}
            />

            <main className="flex-1 flex flex-col relative w-full z-10 overflow-hidden">
                {/* Animated Ghibli Background (Behind content) */}
                <div className="absolute inset-0 z-[-1] pointer-events-none opacity-20 dark:opacity-10">
                    <img
                        src="/ghibli.png"
                        alt="Background"
                        className="w-full h-full object-cover blur-sm animate-ken-burns"
                    />
                    <div className="absolute inset-0 bg-background/80" />
                </div>

                <div className="flex-1 relative overflow-hidden flex flex-col">
                    <Outlet context={context} />
                </div>

                <ChatWidget />
            </main>

            <style>{`
                @keyframes ken-burns {
                    0% { transform: scale(1) translate(0, 0); }
                    50% { transform: scale(1.1) translate(-1%, -1%); }
                    100% { transform: scale(1) translate(0, 0); }
                }
                .animate-ken-burns {
                    animation: ken-burns 30s infinite ease-in-out;
                }
            `}</style>
        </div>
    );
}
