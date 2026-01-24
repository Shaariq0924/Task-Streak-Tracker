const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Task = require('../models/Task');
const TaskCategory = require('../models/TaskCategory');

// === CATEGORIES ===

// @route   GET api/tasks/categories
// @desc    Get all categories for user
// @access  Private
router.get('/categories', auth, async (req, res) => {
    try {
        const categories = await TaskCategory.find({ userId: req.user.id });

        // Lazy Streak Reset Logic
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        const updatedCategories = await Promise.all(categories.map(async (cat) => {
            if (!cat.lastCompletedDate) return cat;

            const lastDate = new Date(cat.lastCompletedDate);
            lastDate.setHours(0, 0, 0, 0);

            // If last completed date is before yesterday, streak is broken
            if (lastDate < yesterday) {
                cat.currentStreak = 0;
                await cat.save();
            }
            return cat;
        }));

        res.json(updatedCategories);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/tasks/categories
// @desc    Create a category
// @access  Private
router.post('/categories', auth, async (req, res) => {
    try {
        const { name, color } = req.body;
        const newCategory = new TaskCategory({
            userId: req.user.id,
            name,
            color
        });
        const category = await newCategory.save();
        res.json(category);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// === TASKS ===

// @route   GET api/tasks
// @desc    Get all tasks for user
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(tasks);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/tasks
// @desc    Create a task
// @access  Private
router.post('/', auth, async (req, res) => {
    try {
        const { title, categoryId, deadline } = req.body;
        const newTask = new Task({
            userId: req.user.id,
            categoryId,
            title,
            deadline
        });
        const task = await newTask.save();
        res.json(task);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/tasks/:id
// @desc    Update task (Toggle Completion)
// @access  Private
router.put('/:id', auth, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ msg: 'Task not found' });
        if (task.userId.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

        // Toggle logic
        const willBeCompleted = !task.isCompleted;
        task.isCompleted = willBeCompleted;
        task.completedAt = willBeCompleted ? new Date() : null;
        await task.save();

        // Streak Logic
        if (willBeCompleted) {
            const category = await TaskCategory.findById(task.categoryId);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            let lastDate = category.lastCompletedDate ? new Date(category.lastCompletedDate) : null;
            if (lastDate) lastDate.setHours(0, 0, 0, 0);

            // If not completed today, increment streak
            if (!lastDate || lastDate < today) {
                category.currentStreak += 1;
                category.lastCompletedDate = new Date();
                category.history.push(new Date());
                await category.save();
            }
        }

        res.json(task);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/tasks/:id
// @desc    Delete task
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ msg: 'Task not found' });
        if (task.userId.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

        await task.deleteOne();
        res.json({ msg: 'Task removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
