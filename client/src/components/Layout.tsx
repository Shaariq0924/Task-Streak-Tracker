import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { ChatWidget } from "./ChatWidget";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { Menu } from "lucide-react";
import { Category } from "../types";

export function Layout() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { user } = useAuth();
    const location = useLocation();

    useEffect(() => {
        fetchCategories();
    }, []);

    // Close sidebar on route change (mobile)
    useEffect(() => {
        setIsSidebarOpen(false);
    }, [location.pathname]);

    const fetchCategories = async () => {
        try {
            const res = await axios.get(import.meta.env.VITE_API_URL + '/api/tasks/categories');
            setCategories(res.data);
            // Auto-select removed to allow Dashboard Overview
        } catch (error) {
            console.error("Error fetching categories", error);
        }
    };

    const handleAddCategory = async (name: string) => {
        try {
            const res = await axios.post(import.meta.env.VITE_API_URL + '/api/tasks/categories', { name });
            setCategories([...categories, res.data]);
            setSelectedCategoryId(res.data._id);
        } catch (error) {
            console.error("Error adding category", error);
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
        <div className="flex h-screen bg-background text-foreground font-sans overflow-hidden selection:bg-purple-500/30 selection:text-purple-200 relative">
            {/* Animated Ghibli Background */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-20 dark:opacity-10">
                <img
                    src="/ghibli.png"
                    alt="Background"
                    className="w-full h-full object-cover blur-sm animate-ken-burns"
                />
                <div className="absolute inset-0 bg-background/80" />
            </div>

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

            <Sidebar
                categories={categories}
                selectedCategoryId={selectedCategoryId}
                onSelectCategory={setSelectedCategoryId}
                onAddCategory={handleAddCategory}
                onUpdateCategory={fetchCategories}
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            <main className="flex-1 flex flex-col relative w-full z-10">
                {/* Mobile Header */}
                <div className="md:hidden p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50 backdrop-blur-sm z-30">
                    <h1 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                        TaskStreak
                    </h1>
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        <Menu size={24} className="text-slate-200" />
                    </button>
                </div>

                <div className="flex-1 relative overflow-hidden flex flex-col">
                    <Outlet context={context} />
                </div>

                <ChatWidget />
            </main>
        </div>
    );
}
