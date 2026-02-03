import { useState } from "react";
import { Plus, Hexagon, LogOut, X, LayoutDashboard, Calendar, BarChart3, Moon, Sun, PlusCircle, Pencil, Medal, Info, Search, Trash2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { Category } from "../types";
import api from "../utils/api";

interface SidebarProps {
    categories: Category[];
    selectedCategoryId: string | null;
    onSelectCategory: (id: string) => void;
    onAddCategory: (name: string) => void;
    onUpdateCategory?: () => void;
    onDeleteCategory?: (id: string) => void;
    isOpen?: boolean;
    onClose?: () => void;
}

export function Sidebar({ categories, selectedCategoryId, onSelectCategory, onAddCategory, onUpdateCategory, onDeleteCategory, isOpen = false, onClose }: SidebarProps) {
    const { user, logout } = useAuth();
    const { theme, setTheme } = useTheme();
    const [isAdding, setIsAdding] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState("");
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [editingName, setEditingName] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const location = useLocation();

    const filteredCategories = categories.filter(cat =>
        cat.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const startEditing = (cat: Category) => {
        setIsEditing(cat._id);
        setEditingName(cat.name);
    };

    const handleRename = async (id: string) => {
        if (!editingName.trim()) {
            setIsEditing(null);
            return;
        }
        try {
            await api.put(`/api/tasks/categories/${id}`, { name: editingName });
            if (onUpdateCategory) onUpdateCategory();
            setIsEditing(null);
        } catch (error) {
            console.error("Error renaming category", error);
        }
    };

    const handleAddSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newCategoryName.trim()) {
            onAddCategory(newCategoryName);
            setNewCategoryName("");
            setIsAdding(false);
        }
    };

    const navItems = [
        { icon: LayoutDashboard, label: "Dashboard", path: "/" },
        { icon: PlusCircle, label: "Create Task", path: "/create-task" },
        { icon: Calendar, label: "Calendar", path: "/calendar" },
        { icon: BarChart3, label: "Analytics", path: "/analytics" },
        { icon: Medal, label: "Challenge", path: "/challenge" },
        { icon: Info, label: "Info", path: "/about" },
    ];

    return (
        <>
            {/* Mobile Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <div className={`
                fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border flex flex-col h-full shrink-0 transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:z-0
                ${isOpen ? "translate-x-0" : "-translate-x-full"}
            `}>
                <div className="p-6 flex justify-between items-center">
                    <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 flex items-center gap-2">
                        <Hexagon className="text-blue-500 fill-blue-500/20" />
                        TaskStreak
                    </h1>
                    <button onClick={onClose} className="md:hidden text-muted-foreground hover:text-foreground">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-3 space-y-4">
                    {/* Sidebar Header & Search */}
                    <div className="pb-2 pt-1">
                        <div className="relative mb-4">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search lists..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-secondary border-none rounded-md pl-9 pr-3 py-2 text-sm focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted-foreground/70"
                            />
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="space-y-1">
                        <div className="text-xs font-semibold text-muted-foreground uppercase px-3 py-2">
                            Menu
                        </div>
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => {
                                    onClose?.();
                                    if (item.path === "/") onSelectCategory(""); // Clear selection for Dashboard
                                }}
                                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all text-sm ${location.pathname === item.path && (!selectedCategoryId || item.path !== "/")
                                    ? "bg-blue-100 text-blue-700 font-medium dark:bg-blue-900/30 dark:text-blue-400"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                    }`}
                            >
                                <item.icon size={18} />
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    {/* Categories */}
                    <div className="space-y-1 mt-6">
                        <div className="flex items-center justify-between px-3 py-2">
                            <div className="text-xs font-semibold text-muted-foreground uppercase">
                                Lists
                            </div>
                            <button
                                onClick={() => setIsAdding(true)}
                                className="text-muted-foreground hover:text-primary transition-colors p-1 hover:bg-muted rounded"
                                title="Add List"
                            >
                                <Plus size={14} />
                            </button>
                        </div>

                        {filteredCategories.map((cat) => (
                            <div key={cat._id} className="group/item relative px-2">
                                {isEditing === cat._id ? (
                                    <form
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            handleRename(cat._id);
                                        }}
                                        className="py-1"
                                    >
                                        <input
                                            autoFocus
                                            type="text"
                                            value={editingName}
                                            onChange={(e) => setEditingName(e.target.value)}
                                            onBlur={() => handleRename(cat._id)}
                                            className="w-full bg-white dark:bg-slate-800 border-2 border-primary rounded-md px-2 py-1.5 text-sm focus:outline-none shadow-sm"
                                        />
                                    </form>
                                ) : (
                                    <button
                                        onClick={() => {
                                            onSelectCategory(cat._id);
                                            onClose?.();
                                        }}
                                        className={`w-full flex items-center justify-between px-3 py-2 rounded-md transition-all text-sm group ${selectedCategoryId === cat._id && location.pathname === "/"
                                            ? "bg-blue-50 text-blue-700 font-medium dark:bg-blue-900/20 dark:text-blue-400"
                                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                            }`}
                                    >
                                        <span className="truncate">{cat.name}</span>
                                        {/* Removed Streak Icon as per request */}
                                    </button>
                                )}
                                {!isEditing && (
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover/item:opacity-100 transition-opacity bg-background/80 backdrop-blur-sm rounded-md shadow-sm border border-border">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                startEditing(cat);
                                            }}
                                            className="p-1 px-1.5 text-slate-500 hover:text-primary hover:bg-primary/10 rounded-l-md transition-all border-r border-border"
                                            title="Rename"
                                        >
                                            <Pencil size={12} />
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onDeleteCategory && onDeleteCategory(cat._id);
                                            }}
                                            className="p-1 px-1.5 text-slate-500 hover:text-destructive hover:bg-destructive/10 rounded-r-md transition-all"
                                            title="Delete"
                                        >
                                            <Trash2 size={12} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}

                        {isAdding && (
                            <form onSubmit={handleAddSubmit} className="px-3 py-1">
                                <input
                                    autoFocus
                                    type="text"
                                    value={newCategoryName}
                                    onChange={(e) => setNewCategoryName(e.target.value)}
                                    onBlur={() => !newCategoryName && setIsAdding(false)}
                                    className="w-full bg-white dark:bg-slate-800 border-2 border-primary rounded-md px-3 py-1.5 text-sm focus:outline-none shadow-sm"
                                    placeholder="List Name..."
                                />
                            </form>
                        )}
                    </div>
                </div>

                <div className="p-4 border-t border-border bg-card/50">
                    <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-lg mb-4">
                        <button
                            onClick={() => setTheme("light")}
                            className={`flex-1 p-1.5 rounded-md flex items-center justify-center transition-all ${theme === "light" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                            title="Light Mode"
                        >
                            <Sun size={16} />
                        </button>
                        <button
                            onClick={() => setTheme("dark")}
                            className={`flex-1 p-1.5 rounded-md flex items-center justify-center transition-all ${theme === "dark" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                            title="Dark Mode"
                        >
                            <Moon size={16} />
                        </button>
                    </div>

                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center font-bold text-white text-sm shadow-lg shadow-purple-500/20">
                            {user?.username?.[0]?.toUpperCase() || "U"}
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-medium text-foreground truncate">{user?.username}</p>
                            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="w-full flex items-center gap-2 px-3 py-2.5 text-destructive hover:bg-destructive/10 rounded-xl transition-colors text-sm font-medium border border-transparent hover:border-destructive/20"
                    >
                        <LogOut size={16} />
                        Sign Out
                    </button>
                </div>
            </div >
        </>
    );
}
