const mongoose = require("mongoose");

const FoodSchema = new mongoose.Schema({
    userId: String,
    name: String,
    calories: Number,
    date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Food", FoodSchema);
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();
        res.json({ message: "User registered" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ token, user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
const express = require("express");
const Food = require("../models/Food");
const router = express.Router();

router.post("/add", async (req, res) => {
    const { userId, name, calories } = req.body;
    try {
        const food = new Food({ userId, name, calories });
        await food.save();
        res.json(food);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/:userId", async (req, res) => {
    try {
        const foods = await Food.find({ userId: req.params.userId });
        res.json(foods);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
