// routes/auth.js - Dùng 'import' và 'export default'
import express from "express";
const router = express.Router();

// ... (logic signup, login của bạn ở đây) ...
router.post("/signup", (req, res) => {
    res.send("Auth signup route");
});

router.post("/login", (req, res) => {
    res.send("Auth login route");
});

frontend
export default router; // Quan trọng: dùng 'export default'//////
main
