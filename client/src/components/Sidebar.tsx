import { useState } from "react";
import { Plus, Flame, Hexagon, LogOut, X, LayoutDashboard, Calendar, BarChart3, Moon, Sun, Monitor, PlusCircle, Pencil } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { Category } from "../types";
import axios from "axios";

interface SidebarProps {
    categories: Category[];
    selectedCategoryId: string | null;
    onSelectCategory: (id: string) => void;
    onAddCategory: (name: string) => void;
    onUpdateCategory?: () => void;
    isOpen?: boolean;
    onClose?: () => void;
}

export function Sidebar({ categories, selectedCategoryId, onSelectCategory, onAddCategory, onUpdateCategory, isOpen = false, onClose }: SidebarProps) {
    const { user, logout } = useAuth();
    const { theme, setTheme } = useTheme();
    const [isAdding, setIsAdding] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState("");
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [editingName, setEditingName] = useState("");
    const location = useLocation();

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
            await axios.put(`${import.meta.env.VITE_API_URL}/api/tasks/categories/${id}`, { name: editingName });
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

                <div className="flex-1 overflow-y-auto px-3 space-y-6">
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
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${location.pathname === item.path && (!selectedCategoryId || item.path !== "/")
                                    ? "bg-primary/10 text-primary font-medium"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                    }`}
                            >
                                <item.icon size={18} />
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    {/* Categories */}
                    <div className="space-y-1">
                        <div className="text-xs font-semibold text-muted-foreground uppercase px-3 py-2">
                            Lists
                        </div>

                        {categories.map((cat) => (
                            <div key={cat._id} className="group/item relative">
                                {isEditing === cat._id ? (
                                    <form
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            handleRename(cat._id);
                                        }}
                                        className="px-3 py-2"
                                    >
                                        <input
                                            autoFocus
                                            type="text"
                                            value={editingName}
                                            onChange={(e) => setEditingName(e.target.value)}
                                            onBlur={() => handleRename(cat._id)}
                                            className="w-full bg-slate-900 border border-blue-500 rounded-lg px-2 py-1 text-sm text-white focus:outline-none"
                                        />
                                    </form>
                                ) : (
                                    <button
                                        onClick={() => {
                                            onSelectCategory(cat._id);
                                            onClose?.();
                                        }}
                                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${selectedCategoryId === cat._id && location.pathname === "/"
                                            ? "bg-muted text-foreground shadow-sm"
                                            : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                                            }`}
                                    >
                                        <span className="font-medium truncate text-sm">{cat.name}</span>
                                        {cat.currentStreak > 0 && (
                                            <span className="flex items-center gap-1 text-[10px] font-bold text-orange-500 bg-orange-500/10 px-1.5 py-0.5 rounded-full">
                                                <Flame size={10} className="fill-orange-500" />
                                                {cat.currentStreak}
                                            </span>
                                        )}
                                    </button>
                                )}
                                {!isEditing && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            startEditing(cat);
                                        }}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-500 hover:text-blue-400 opacity-0 group-hover/item:opacity-100 transition-opacity bg-card shadow-sm rounded-md border border-border"
                                        title="Rename List"
                                    >
                                        <Pencil size={12} />
                                    </button>
                                )}
                            </div>
                        ))}

                        {isAdding ? (
                            <form onSubmit={handleAddSubmit} className="px-2 py-1">
                                <input
                                    autoFocus
                                    type="text"
                                    value={newCategoryName}
                                    onChange={(e) => setNewCategoryName(e.target.value)}
                                    onBlur={() => !newCategoryName && setIsAdding(false)}
                                    className="w-full bg-background border border-input rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                                    placeholder="List Name..."
                                />
                            </form>
                        ) : (
                            <button
                                onClick={() => setIsAdding(true)}
                                className="w-full flex items-center gap-2 px-3 py-2 text-muted-foreground hover:text-primary transition-colors rounded-xl hover:bg-muted group"
                            >
                                <div className="w-5 h-5 rounded-lg border border-dashed border-border flex items-center justify-center group-hover:border-primary/50">
                                    <Plus size={12} />
                                </div>
                                <span className="text-sm font-medium">New List</span>
                            </button>
                        )}
                    </div>
                </div>

                <div className="p-4 border-t border-border bg-card/50">
                    <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-lg mb-4">
                        <button
                            onClick={() => setTheme("light")}
                            className={`flex-1 p-1.5 rounded-md flex items-center justify-center transition-all ${theme === "light" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                        >
                            <Sun size={16} />
                        </button>
                        <button
                            onClick={() => setTheme("system")}
                            className={`flex-1 p-1.5 rounded-md flex items-center justify-center transition-all ${theme === "system" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                        >
                            <Monitor size={16} />
                        </button>
                        <button
                            onClick={() => setTheme("dark")}
                            className={`flex-1 p-1.5 rounded-md flex items-center justify-center transition-all ${theme === "dark" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
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
            </div>
        </>
    );
}
