import express from "express";
import prisma from "../config/database";

const router = express.Router();

router.post("/checkin", async (req, res) => {
  try {
    const { userId, archetype, partStage, reflection } = req.body;
    if (!userId || !archetype || !partStage || !reflection)
      return res.status(400).json({ error: "Missing required fields" });

    const checkIn = await prisma.iFSCheckIn.create({
      data: { userId, archetype, partStage, reflection },
    });
    res.status(201).json(checkIn);
  } catch (err) {
    console.error("IFS Check-In Error:", err);
    res.status(500).json({ error: "Failed to save check-in" });
  }
});

router.post("/sync", async (req, res) => {
  try {
    const { checkIns } = req.body;
    if (!Array.isArray(checkIns))
      return res.status(400).json({ error: "Invalid payload" });

    const saved = await prisma.iFSCheckIn.createMany({ data: checkIns });
    res.status(201).json(saved);
  } catch (err) {
    console.error("IFS Sync Error:", err);
    res.status(500).json({ error: "Failed to sync check-ins" });
  }
});

export default router;
