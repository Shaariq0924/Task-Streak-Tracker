import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Calendar from './pages/Calendar';
import { Layout } from './components/Layout';
import CreateTask from './pages/CreateTask';
import ConsistencyChallenge from './pages/ConsistencyChallenge';
import About from './pages/About';

function PrivateRoute({ children }: { children: JSX.Element }) {
    const { token, loading } = useAuth();

    if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-slate-500">Loading...</div>;

    return token ? children : <Navigate to="/login" />;
}

function PublicRoute({ children }: { children: JSX.Element }) {
    const { token, loading } = useAuth();

    if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-slate-500">Loading...</div>;

    return !token ? children : <Navigate to="/" />;
}

function App() {
    return (
        <Routes>
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />

            <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
                <Route index element={<Dashboard />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="calendar" element={<Calendar />} />
                <Route path="challenge" element={<ConsistencyChallenge />} />
                <Route path="about" element={<About />} />
                <Route path="create-task" element={<CreateTask />} />
            </Route>
        </Routes>
    );
}

export default App;
