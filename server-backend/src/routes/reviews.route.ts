// ============================================
// REVIEWS ROUTES
// ============================================
// This file defines all routes related to reviews
// Routes are mounted at /api/v1/reviews in server.ts

import express from "express"
import { Request, Response } from "express"

// Create a router
// Router is like a mini Express app that handles a group of routes
const router = express.Router()

// ============================================
// ROUTES
// ============================================

// GET /api/v1/reviews
// Get all reviews
router.route("/").get((req: Request, res: Response) => {
    // TODO: Replace with actual database query
    // For now, just send test response
    res.json({
        message: "Reviews endpoint working!",
        reviews: []
    })
})

// You'll add more routes here:
// POST /api/v1/reviews - Create new review
// GET /api/v1/reviews/:id - Get single review
// PUT /api/v1/reviews/:id - Update review
// DELETE /api/v1/reviews/:id - Delete review

// ============================================
// EXPORT ROUTER
// ============================================

export default router