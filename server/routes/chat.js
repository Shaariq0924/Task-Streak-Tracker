const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

router.post('/', auth, async (req, res) => {
    try {
        const { message } = req.body;

        // In a real app, you might want to fetch user context or tasks here
        // const tasks = await Task.find({ userId: req.user.id });

        if (!process.env.GOOGLE_API_KEY) {
            return res.status(500).json({ error: "Google API Key is missing on the server." });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `You are a helpful productivity assistant. The user asks: "${message}". Check their tone and provide a motivating short answer.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.json({ reply: text });
    } catch (err) {
        console.error("Gemini API Error:", err);
        // Return specifics if possible, or general error
        res.status(500).json({ error: err.message || 'Server Error connecting to AI' });
    }
});

module.exports = router;
