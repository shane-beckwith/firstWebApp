// ============================================
// REVIEWS ROUTES
// ============================================
// This file defines all the URL endpoints for reviews
// Each route maps a URL + HTTP method to a controller method

import express from "express"
import ReviewsController from "../controllers/reviewsController"

// ============================================
// CREATE ROUTER
// ============================================
// Router is like a mini Express app
// It groups related routes together
const router = express.Router()

// ============================================
// DEFINE ROUTES
// ============================================

// Route 1: GET /api/v1/reviews
// Purpose: Get all reviews
// Method: GET
// Controller: ReviewsController.getReviews
router.route("/").get(ReviewsController.getReviews)

// Route 2: POST /api/v1/reviews
// Purpose: Create a new review
// Method: POST
// Controller: ReviewsController.createReview
router.route("/").post(ReviewsController.createReview)

// Route 3: GET /api/v1/reviews/:id
// Purpose: Get a single review by ID
// Method: GET
// Controller: ReviewsController.getReviewById
// :id = URL parameter (e.g., /api/v1/reviews/507f1f77...)
router.route("/:id").get(ReviewsController.getReviewById)

// Route 4: PUT /api/v1/reviews/:id
// Purpose: Update a review
// Method: PUT
// Controller: ReviewsController.updateReview
router.route("/:id").put(ReviewsController.updateReview)

// Route 5: DELETE /api/v1/reviews/:id
// Purpose: Delete a review
// Method: DELETE
// Controller: ReviewsController.deleteReview
router.route("/:id").delete(ReviewsController.deleteReview)

// ============================================
// EXPORT ROUTER
// ============================================
export default router