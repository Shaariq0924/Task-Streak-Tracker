import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import {
    LayoutDashboard, Calendar, BarChart3, Medal, Info,
    Search, LogOut, Hexagon, Plus, ChevronDown
} from "lucide-react";
import { Category } from "../types";
import { motion, AnimatePresence } from "framer-motion";

interface NavbarProps {
    categories: Category[];
    onSelectCategory: (id: string) => void;
    onAddCategory: (name: string) => void;
    onDeleteCategory?: (id: string) => void;
}

export function Navbar({ categories, onSelectCategory, onAddCategory }: NavbarProps) {
    const { user, logout } = useAuth();
    const { theme, setTheme } = useTheme();
    const location = useLocation();
    const [isListsOpen, setIsListsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [newCategoryName, setNewCategoryName] = useState("");

    const navItems = [
        { icon: LayoutDashboard, label: "Dashboard", path: "/" },
        { icon: Calendar, label: "Calendar", path: "/calendar" },
        { icon: BarChart3, label: "Analytics", path: "/analytics" },
        { icon: Medal, label: "Challenge", path: "/challenge" },
        { icon: Info, label: "Info", path: "/about" },
    ];

    const filteredCategories = categories.filter(cat =>
        cat.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <nav className="border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">

                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 shrink-0">
                    <Hexagon className="text-blue-500 fill-blue-500/20" size={24} />
                    TaskStreak
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${location.pathname === item.path
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                }`}
                        >
                            <item.icon size={16} />
                            {item.label}
                        </Link>
                    ))}
                </div>

                {/* Right Side Actions */}
                <div className="flex items-center gap-3">

                    {/* Lists Dropdown (Replaces Sidebar Lists) */}
                    <div className="relative">
                        <button
                            onClick={() => setIsListsOpen(!isListsOpen)}
                            className="flex items-center gap-2 px-3 py-2 bg-secondary/50 hover:bg-secondary rounded-lg text-sm font-medium text-foreground transition-all"
                        >
                            <span>Lists</span>
                            <ChevronDown size={14} className={`transition-transform ${isListsOpen ? "rotate-180" : ""}`} />
                        </button>

                        <AnimatePresence>
                            {isListsOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="absolute right-0 top-full mt-2 w-64 bg-card border border-border rounded-xl shadow-xl p-2 max-h-[400px] overflow-y-auto"
                                >
                                    {/* Search Inside Dropdown */}
                                    <div className="px-2 pb-2">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-3 h-3" />
                                            <input
                                                autoFocus
                                                type="text"
                                                placeholder="Find list..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="w-full bg-secondary border-none rounded-md pl-8 pr-2 py-1.5 text-xs focus:ring-1 focus:ring-primary"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-0.5">
                                        {filteredCategories.map(cat => (
                                            <button
                                                key={cat._id}
                                                onClick={() => {
                                                    onSelectCategory(cat._id);
                                                    setIsListsOpen(false);
                                                }}
                                                className="w-full text-left px-3 py-2 rounded-md hover:bg-muted text-sm text-foreground/80 hover:text-foreground truncate"
                                            >
                                                {cat.name}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="pt-2 mt-2 border-t border-border">
                                        <form
                                            onSubmit={(e) => {
                                                e.preventDefault();
                                                if (newCategoryName) {
                                                    onAddCategory(newCategoryName);
                                                    setNewCategoryName("");
                                                }
                                            }}
                                            className="px-2 flex gap-2"
                                        >
                                            <input
                                                value={newCategoryName}
                                                onChange={e => setNewCategoryName(e.target.value)}
                                                placeholder="New list..."
                                                className="flex-1 bg-secondary rounded px-2 py-1 text-xs"
                                            />
                                            <button type="submit" className="p-1 text-primary hover:bg-primary/10 rounded">
                                                <Plus size={14} />
                                            </button>
                                        </form>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="h-6 w-px bg-border mx-1" />

                    <button
                        onClick={logout}
                        className="text-muted-foreground hover:text-destructive transition-colors p-2"
                        title="Sign Out"
                    >
                        <LogOut size={20} />
                    </button>
                </div>
            </div>
        </nav>
    );
}
