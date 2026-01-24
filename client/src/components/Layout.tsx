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
        <div className="flex h-screen bg-slate-950 text-slate-200 font-sans overflow-hidden selection:bg-blue-500/30 selection:text-blue-200">
            {/* Background Gradients */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px]" />
            </div>

            <Sidebar
                categories={categories}
                selectedCategoryId={selectedCategoryId}
                onSelectCategory={setSelectedCategoryId}
                onAddCategory={handleAddCategory}
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
