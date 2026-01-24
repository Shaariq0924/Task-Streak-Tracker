import { useState } from "react";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, isToday } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Calendar() {
    const [currentDate, setCurrentDate] = useState(new Date());

    const startDate = startOfWeek(startOfMonth(currentDate));
    const endDate = endOfWeek(endOfMonth(currentDate));
    const days = eachDayOfInterval({ start: startDate, end: endDate });

    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return (
        <div className="p-6 md:p-8 h-full overflow-y-auto">
            <div className="flex flex-col h-full max-h-[900px]">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-1">Calendar</h2>
                        <p className="text-slate-400">{format(currentDate, "MMMM yyyy")}</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}
                            className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button
                            onClick={() => setCurrentDate(new Date())}
                            className="px-3 py-1 text-sm font-medium bg-blue-600/10 text-blue-400 rounded-lg hover:bg-blue-600/20 transition-colors"
                        >
                            Today
                        </button>
                        <button
                            onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}
                            className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>

                {/* Calendar Grid */}
                <div className="flex-1 bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col">
                    {/* Header */}
                    <div className="grid grid-cols-7 border-b border-slate-800">
                        {weekDays.map(day => (
                            <div key={day} className="py-3 text-center text-sm font-semibold text-slate-500 bg-slate-900/50">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Days */}
                    <div className="grid grid-cols-7 flex-1 auto-rows-fr">
                        {days.map((day) => (
                            <div
                                key={day.toString()}
                                className={`
                                    min-h-[100px] border-b border-r border-slate-800/50 p-2 relative group transition-colors hover:bg-slate-800/30
                                    ${!isSameMonth(day, currentDate) ? "bg-slate-950/30" : ""}
                                `}
                            >
                                <span className={`
                                    text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full
                                    ${isToday(day)
                                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
                                        : !isSameMonth(day, currentDate) ? "text-slate-600" : "text-slate-400 group-hover:text-white"
                                    }
                                `}>
                                    {format(day, "d")}
                                </span>

                                {/* Mock Events - In real app, map tasks here */}
                                {isSameDay(day, new Date()) && (
                                    <div className="mt-2 space-y-1">
                                        <div className="px-2 py-1 bg-purple-500/20 text-purple-300 text-[10px] rounded border border-purple-500/20 truncate">
                                            Pay bills
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
