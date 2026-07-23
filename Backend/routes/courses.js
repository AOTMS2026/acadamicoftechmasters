const express = require('express');
const router = express.Router();
const Course = require('../models/Course');

router.get('/', async (req, res) => {
    try {
        const query = req.query.category ? { category: req.query.category } : {};
        const courses = await Course.find(query)
            .select('id slug title category image price originalPrice rating themeColor duration level')
            .lean();
        res.json(courses);
    } catch (err) {
        console.error('GET /api/courses failed:', err);
        res.status(500).json({ message: 'Failed to fetch courses', error: err.message });
    }
});

router.get('/:slug', async (req, res) => {
    try {
        const course = await Course.findOne({ slug: req.params.slug }).lean();
        if (!course) return res.status(404).send('Course not found');
        res.json(course);
    } catch (err) {
        console.error(`GET /api/courses/${req.params.slug} failed:`, err);
        res.status(500).json({ message: 'Failed to fetch course', error: err.message });
    }
});

module.exports = router;
