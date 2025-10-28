// routes/profile.js - Dùng 'import' và 'export default'
import express from "express";
import User from "../models/User.js"; // Import 'default' từ User.js

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const userId = "690094f2f9c1dfe36edf030f"; 
    const user = await User.findById(userId).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/", async (req, res) => {
  try {
    const userId = "690094f2f9c1dfe36edf030f"; 
    const updates = req.body;
    const user = await User.findByIdAndUpdate(userId, updates, { new: true }).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router; // Quan trọng: dùng 'export default'