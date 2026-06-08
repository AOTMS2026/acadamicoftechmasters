/**
 * Seed Script: Master DSA Using Python Workshop
 * Run: node seedDSAWorkshop.js
 * This inserts the "Master DSA Using Python" workshop into MongoDB.
 */

const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const Workshop = require('./models/Workshop');

const dsaWorkshop = {
    id: 'dsa-python-001',
    name: 'Master DSA Using Python',
    tagline: 'DSA INTENSIVE WORKSHOP',
    mode: 'Online',
    date: 'Coming Soon',
    duration: '2 Days',
    bannerUrl: 'https://res.cloudinary.com/dcmt06mac/image/upload/v1780932367/ChatGPT_Image_Jun_8_2026_08_55_09_PM_d2pk9t.png',   // Add your Cloudinary banner URL here
    thumbnailUrl: 'https://res.cloudinary.com/dcmt06mac/image/upload/v1780932304/ChatGPT_Image_Jun_8_2026_08_50_58_PM_ucuo8v.png', // Add your Cloudinary thumbnail URL here
    description:
        'Crack coding interviews and build a strong algorithmic foundation with Python. This intensive hands-on workshop covers all major Data Structures & Algorithms — from arrays and linked lists to trees, graphs, dynamic programming, and beyond — using Python\'s clean syntax and powerful standard library.',
    eligibility: 'Anyone with basic Python knowledge',
    level: 'Beginner to Advanced',
    startDate: null,
    endDate: null,
    registrationStatus: 'OPEN',
    showRegisterButton: true,
    whatYouWillLearn: [
        'Arrays, Strings & Hashing',
        'Linked Lists & Stacks/Queues',
        'Trees, Heaps & Graphs',
        'Sorting & Searching Algorithms',
        'Dynamic Programming & Recursion',
        'Python-specific Optimisations',
        'Interview Problem-Solving Patterns',
        'Certificate of Completion',
    ],
};

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('✅ Connected to MongoDB');

        // Avoid duplicates
        const existing = await Workshop.findOne({ id: dsaWorkshop.id });
        if (existing) {
            console.log('ℹ️  Workshop already exists. Updating...');
            await Workshop.updateOne({ id: dsaWorkshop.id }, { $set: dsaWorkshop });
            console.log('✅ Workshop updated successfully.');
        } else {
            await Workshop.create(dsaWorkshop);
            console.log('✅ "Master DSA Using Python" workshop seeded successfully!');
        }
    } catch (err) {
        console.error('❌ Error seeding workshop:', err);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Disconnected from MongoDB');
    }
}

seed();