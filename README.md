# TaskStreak - Daily Task & Habit Tracker

TaskStreak is a premium, high-performance productivity application designed to help you build unshakeable habits. It combines a modern "Atlassian-style" interface with gamified consistency challenges and beautiful aesthetics (including a Ghibli-inspired animated theme).

## ✨ Unique Features

-   **🎨 Ghibli-Style Dynamic Theme**: A beautiful, animated landscape background that brings your dashboard to life with a "Ken Burns" zoom effect.
-   **🌑 True Black Dark Mode**: A deep, OLED-friendly "Neutral Black" theme designed for focus and aesthetics (no slate-blue tints).
-   **📅 Consistency Challenge**:
    -   Commit to **25, 50, or 100-day** challenges.
    -   Visual grid tracking with progress bars.
    -   **Undo Capability**: Mistakenly marked a day? Just click again to undo.
-   **ℹ️ Dashboard Info Hub**: A dedicated "Info" section explaining the core mission: **Momentum, Focus, and Growth**.
-   **🛡️ Secure Authentication**: Robust Login/Signup system with JWT, ensuring your data is private.
-   **🤖 AI Coach Integration**: built-in Gemini AI chat to get productivity advice instantly.
-   **📝 Smart Task Management**:
    -   Organize by categories (Work, Personal, etc.).
    -   **Creation Date Tracking**: See exactly when you started each task.
    -   Edit, Delete, and Complete with smooth animations.

## 🛠️ Tech Stack

### Frontend
-   **Framework**: React (Vite) + TypeScript
-   **Styling**: Tailwind CSS + Framer Motion (Animations)
-   **Icons**: Lucide React
-   **State/Network**: Context API + Axios

### Backend
-   **Runtime**: Node.js & Express
-   **Database**: MongoDB (Mongoose Schema)
-   **Security**: JSON Web Tokens (JWT) & Bcrypt
-   **AI**: Google Generative AI (Gemini)

## 🚀 Getting Started

### Prerequisites
-   Node.js (v18+)
-   MongoDB Atlas URI
-   Google Gemini API Key

### Installation

1.  **Clone the Repo**
    ```bash
    git clone https://github.com/yourusername/task-streak.git
    cd task-streak
    ```

2.  **Server Setup**
    ```bash
    cd server
    npm install
    ```
    Create a `.env` file in the `server` directory:
    ```env
    PORT=5000
    MONGODB_URI=your_mongodb_connection_string
    JWT_SECRET=your_secret_key
    GOOGLE_API_KEY=your_gemini_api_key
    ```
    Start the server:
    ```bash
    npm run dev
    ```

3.  **Client Setup**
    Open a new terminal:
    ```bash
    cd client
    npm install
    ```
    Create a `.env` file in the `client` directory:
    ```env
    VITE_API_URL=http://localhost:5000
    ```
    Start the frontend:
    ```bash
    npm run dev
    ```

## 📸 Screenshots

### Consistency Challenge
Track your 25, 50, or 100-day journey with an interactive grid.

### True Black Dashboard
A distraction-free, high-contrast interface for maximum productivity.

---

## 📖 User Guide

Welcome to DAILYTASK! Here is how to get the most out of your productivity tracker.

### Getting Started

1.  **Sign Up**: Create an account to save your progress in the cloud.
2.  **Create Lists**: Organize tasks by category (e.g., Work, Personal, Gym).
3.  **Add Tasks**: Click the "+" button or "Create Task" in the sidebar.

### Features

#### 🏆 Consistency Challenge
Build unbreakable habits.
1.  Navigate to **Challenge** in the sidebar.
2.  Select your duration: **25 Days**, **50 Days**, or **100 Days**.
3.  Each day you complete your core tasks, click the corresponding day box.
4.  **Undo**: Click a completed box again to remove the checkmark if you made a mistake.
5.  Watch your progress bar fill up!

#### 📊 Analytics
See your growth.
- Check your **Current Streak**.
- View completion rates across different categories.

#### 🌑 Theme
Customize your view.
- By default, the app uses a **True Black / Premium Dark Mode**.
- Toggle to **Light Mode** using the sun icon in the sidebar footer if preferred.

#### 🤖 AI Coach
Need motivation?
- Click the **Ask AI** button in the bottom right.
- Chat with your personal productivity assistant powered by Gemini.

---

## 🤝 Contributing
1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License
Distributed under the MIT License.
