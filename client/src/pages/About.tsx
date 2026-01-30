import { Info, Shield, Zap, Heart } from 'lucide-react';

export default function About() {
    return (
        <div className="p-6 md:p-12 h-full overflow-y-auto animate-in space-y-12">

            {/* Header */}
            <div className="text-center max-w-2xl mx-auto space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                    Welcome to DAILYTASK
                </h1>
                <p className="text-lg text-slate-500 dark:text-slate-400">
                    Your personal productivity companion designed to help you build consistency and achieve your goals.
                </p>
            </div>

            {/* Mission Section */}
            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                <div className="glass-card p-6 rounded-2xl space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                        <Zap size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Build Momentum</h3>
                    <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                        Consistency is key. Our streak tracking and challenge modes are gamified to keep you motivated every single day.
                    </p>
                </div>

                <div className="glass-card p-6 rounded-2xl space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                        <Shield size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Stay Focused</h3>
                    <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                        A distraction-free, high-contrast interface designed to help you focus on what matters most: your tasks.
                    </p>
                </div>

                <div className="glass-card p-6 rounded-2xl space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-500">
                        <Heart size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Track Growth</h3>
                    <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                        Visual analytics and insights give you a clear picture of your progress and habits over time.
                    </p>
                </div>
            </div>

            {/* Info Footer */}
            <div className="max-w-4xl mx-auto text-center border-t border-slate-200 dark:border-slate-800 pt-12 space-y-2">
                <div className="flex items-center justify-center gap-2 text-slate-900 dark:text-white font-semibold">
                    <Info size={18} />
                    <span>App Information</span>
                </div>
                <p className="text-slate-500 dark:text-slate-500 text-sm">
                    Version 1.0.0 &bull; Built with MERN Stack
                </p>
                <p className="text-slate-500 dark:text-slate-500 text-sm">
                    &copy; {new Date().getFullYear()} TaskStreak. All rights reserved.
                </p>
            </div>
        </div>
    );
}
