# TaskStreak - Daily Task & Habit Tracker

TaskStreak is a modern, full-stack MERN application designed to help you organize your life, track your habits, and maintain consistency. It features a beautiful glassmorphism UI, detailed analytics, and an integrated AI assistant.

![Project Screenshot](https://via.placeholder.com/1200x600?text=TaskStreak+Dashboard+Preview)

## ✨ Features

- **🛡️ Authentication**: Secure Login and Signup with JWT.
- **📝 Task Management**: Create, Read, Update (Edit), and Delete tasks.
- **📂 Categories & Lists**: Organize tasks into custom categories (e.g., Work, Personal, Fitness).
- **🔥 Streak Tracking**: Visual streak counters for each category to keep you motivated.
- **📊 Analytics Dashboard**: 
  - Weekly, Monthly, and Yearly consistency tracking.
  - Smart suggestions based on your performance.
- **🤖 AI Assistant**: Built-in Gemini AI chat to help with productivity tips and motivation.
- **🎨 Modern UI/UX**: 
  - Glassmorphism design aesthetic.
  - **Dark/Light/System** theme switching.
  - Smooth animations with Framer Motion.
- **📱 Fully Responsive**: Works seamlessly on Desktop and Mobile. behavior.

## 🛠️ Tech Stack

### Frontend
- **React** (Vite)
- **TypeScript**
- **Tailwind CSS** (Styling)
- **Framer Motion** (Animations)
- **Lucide React** (Icons)
- **Axios** (API Requests)

### Backend
- **Node.js** & **Express**
- **MongoDB** (Database)
- **Mongoose** (ODM)
- **JWT** (Authentication)
- **Google Gemini API** (AI)

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas Account (or local MongoDB)
- Google Gemini API Key

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/task-streak-tracker.git
    cd task-streak-tracker
    ```

2.  **Install Dependencies**
    ```bash
    # Install server dependencies
    cd server
    npm install

    # Install client dependencies
    cd ../client
    npm install
    # or
    npm install --force # if facing peer dependency issues
    ```

3.  **Environment Variables**
    Create a `.env` file in the `server` folder:
    ```env
    PORT=5000
    MONGODB_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret_key
    GOOGLE_API_KEY=your_gemini_api_key
    ```

    Create a `.env` file in the `client` folder:
    ```env
    VITE_API_URL=http://localhost:5000
    ```

4.  **Run Locally**
    Open two terminals:

    *Terminal 1 (Server):*
    ```bash
    cd server
    npm run dev
    ```

    *Terminal 2 (Client):*
    ```bash
    cd client
    npm run dev
    ```
