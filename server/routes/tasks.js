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

// @route   DELETE api/tasks/categories/:id
// @desc    Delete a category and its tasks
// @access  Private
router.delete('/categories/:id', auth, async (req, res) => {
    try {
        const category = await TaskCategory.findById(req.params.id);
        if (!category) return res.status(404).json({ msg: 'Category not found' });
        if (category.userId.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

        // Delete all tasks in this category
        await Task.deleteMany({ categoryId: req.params.id });

        // Delete the category
        await category.deleteOne();

        res.json({ msg: 'Category and associated tasks removed' });
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

        // Check if this is a title update or completion toggle
        const { title, isCompleted } = req.body;

        if (title !== undefined) {
            task.title = title;
        }

        // Toggle logic or Explicit Set
        if (isCompleted !== undefined) {
            task.isCompleted = isCompleted;
        } else if (title === undefined) {
            // Only toggle if no specific fields provided (ignoring just title update)
            task.isCompleted = !task.isCompleted;
        }

        // Validation: If marking as completed, check if task is from today
        if (task.isCompleted) {
            const taskDate = new Date(task.createdAt);
            taskDate.setHours(0, 0, 0, 0);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            // Allow completing only if task was created today (or strictly not in the past?)
            // User said: "not completed on the day when it was added"
            // So if today > taskDate, it's expired.
            if (taskDate < today) {
                return res.status(400).json({ msg: 'Cannot complete tasks from previous days.' });
            }
        }

        // Handle completion date
        if (task.isCompleted) {
            if (!task.completedAt) task.completedAt = new Date();
        } else {
            task.completedAt = null;
        }

        await task.save();

        // Streak Logic
        const category = await TaskCategory.findById(task.categoryId);
        if (category) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (task.isCompleted) {
                // INCREMENT LOGIC
                let lastDate = category.lastCompletedDate ? new Date(category.lastCompletedDate) : null;
                if (lastDate) lastDate.setHours(0, 0, 0, 0);

                // If not completed today, update streak
                if (!lastDate || lastDate < today) {
                    const yesterday = new Date(today);
                    yesterday.setDate(yesterday.getDate() - 1);

                    // Check if consecutive (last completed was yesterday)
                    if (lastDate && lastDate.getTime() === yesterday.getTime()) {
                        category.currentStreak += 1;
                    } else {
                        // Streak broken or new start
                        category.currentStreak = 1;
                    }

                    category.lastCompletedDate = new Date();
                    category.history.push(new Date());
                    await category.save();
                }
            } else {
                // DECREMENT LOGIC (Revert if unchecking)
                // Check if any OTHER tasks are completed today for this category
                const startOfDay = new Date();
                startOfDay.setHours(0, 0, 0, 0);
                const endOfDay = new Date();
                endOfDay.setHours(23, 59, 59, 999);

                const completedTodayCount = await Task.countDocuments({
                    categoryId: task.categoryId,
                    isCompleted: true,
                    completedAt: { $gte: startOfDay, $lte: endOfDay },
                    _id: { $ne: task._id } // Exclude current task
                });

                if (completedTodayCount === 0) {
                    // No other tasks completed today -> Revert streak
                    // Only revert if we actually incremented it today (lastCompletedDate is today)
                    let lastDate = category.lastCompletedDate ? new Date(category.lastCompletedDate) : null;
                    if (lastDate) lastDate.setHours(0, 0, 0, 0);

                    if (lastDate && lastDate.getTime() === today.getTime()) {
                        category.history.pop(); // Remove today's entry
                        // Revert to pervious date
                        const previousDateStr = category.history.length > 0 ? category.history[category.history.length - 1] : null;
                        category.lastCompletedDate = previousDateStr ? new Date(previousDateStr) : null;

                        // Decrement streak, ensure not negative
                        category.currentStreak = Math.max(0, category.currentStreak - 1);
                        await category.save();
                    }
                }
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
