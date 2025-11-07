//import the database getters/setters
import ReviewsDAO from "../dao/reviewsDAO"

export default class ReviewsController {

    // ============================================
    // GET ALL REVIEWS
    // ============================================
    static async getReviews(req: any, res: any) {
        try {
            // Step 1: Call the DAO to get reviews from database
            // The DAO does the actual database work
            const result = await ReviewsDAO.getReviews()

            // Step 2: Send the response
            // res.json() automatically:
            // - Sets Content-Type to application/json
            // - Converts JavaScript object to JSON string
            // - Sends it to the frontend
            res.json(result)

        } catch (e) {
            // Step 3: Handle any unexpected errors
            // 500 = Internal Server Error
            // This catches errors we didn't anticipate
            res.status(500).json({ error: e })
        }
    }

    static async createReview(req: any, res: any) {
        try {
            // Step 1: Extract data from request body
            // Destructuring - pulls properties out of req.body
            const { pizzaName, rating, comment, reviewer, restaurant } = req.body

            // Check for required fields
            if (!pizzaName || !rating || !comment || !reviewer) {
                // 400 = Bad Request (client sent invalid data)
                return res.status(400).json({
                    error: "Missing required fields",
                    required: ["pizzaName", "rating", "comment", "reviewer"]
                })
            }

            // Validate rating is a number
            if (typeof rating !== 'number') {
                return res.status(400).json({
                    error: "Rating must be a number"
                })
            }

            // Validate rating is between 1 and 5
            if (rating < 1 || rating > 5) {
                return res.status(400).json({
                    error: "Rating must be between 1 and 5"
                })
            }

            // Step 3: Call DAO to save to database
            // Now that we've validated, let the DAO do the work
            const result = await ReviewsDAO.addReview(
                pizzaName,
                rating,
                comment,
                reviewer,
                restaurant
            )

            // Step 4: Check if DAO had an error
            if (result.error) {
                // 500 = Internal Server Error (database problem)
                return res.status(500).json({
                    error: "Failed to create review",
                    details: result.error
                })
            }

            //Step 5: Send success response
            //201 = Created (new resource was created)
            res.status(201).json({
                success: true,
                message: "Review created successfully",
                id: result.id
            })

        } catch (e) {
            // Catch any unexpected errors
            console.error('Error in createReview:', e)
            res.status(500).json({ error: "Unexpected error occurred" })
        }
    }

    // ============================================
// GET SINGLE REVIEW BY ID
// ============================================
    static async getReviewById(req: any, res: any) {
        try {
            // Step 1: Get ID from URL parameters
            // URL: /api/v1/reviews/507f1f77bcf86cd799439011
            // req.params.id = "507f1f77bcf86cd799439011"
            const review = await ReviewsDAO.getReviewByID(req.params.id)

            // Step 2: Check if review was found
            // DAO returns null if not found
            if (!review) {
                // 404 = Not Found
                return res.status(404).json({
                    error: "Review not found",
                    id: req.params.id
                })
            }

            // Step 3: Send the review
            res.json(review)

        } catch (e) {
            console.error('Error in getReviewById:', e)
            res.status(500).json({ error: "Failed to fetch review" })
        }
    }

    // ============================================
    // UPDATE REVIEW
    // ============================================
    static async updateReview(req: any, res: any) {
        try {
            // Step 1: Get ID from URL and updates from body
            const id = req.params.id
            const updates = req.body

            // Step 2: Validate - at least one field to update
            if (Object.keys(updates).length === 0) {
                return res.status(400).json({
                    error: "No fields to update"
                })
            }

            // Step 3: Validate rating if provided
            if (updates.rating !== undefined) {
                if (typeof updates.rating !== 'number' || updates.rating < 1 || updates.rating > 5) {
                    return res.status(400).json({
                        error: "Rating must be a number between 1 and 5"
                    })
                }
            }

            // Step 4: Call DAO to update
            const result = await ReviewsDAO.updateReview(id, updates)

            // Step 5: Check if update was successful
            if (!result.success) {
                return res.status(404).json({
                    error: "Review not found or not modified"
                })
            }

            // Step 6: Send success response
            res.json({
                success: true,
                message: "Review updated successfully"
            })

        } catch (e) {
            console.error('Error in updateReview:', e)
            res.status(500).json({ error: "Failed to update review" })
        }
    }


    // ============================================
// DELETE REVIEW
// ============================================
    static async deleteReview(req: any, res: any) {
        try {
            // Step 1: Get ID from URL
            const id = req.params.id

            // Step 2: Call DAO to delete
            const result = await ReviewsDAO.deleteReview(id)

            // Step 3: Check if deletion was successful
            if (!result.success) {
                return res.status(404).json({
                    error: "Review not found"
                })
            }

            // Step 4: Send success response
            res.json({
                success: true,
                message: "Review deleted successfully"
            })

        } catch (e) {
            console.error('Error in deleteReview:', e)
            res.status(500).json({ error: "Failed to delete review" })
        }
    }
}