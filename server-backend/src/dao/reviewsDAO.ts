/*
* CRUD OPS
* Create
* Read
* Read One
* Update
* Delete
*
* */


// Import MongoDB types
import { MongoClient, Collection, ObjectId } from "mongodb"

// This variable will hold our database collection
// It's outside the class so all methods can access it
// Think of it as a "connection pool" to the database
let reviews: Collection

export default class ReviewsDAO {
    // Methods will go here


    // ============================================
    // INJECT DATABASE CONNECTION
    // ============================================
    // This method is called ONCE when the server starts
    // It gives the DAO access to the database
    static async injectDB(conn: MongoClient) {
        // If already connected, don't reconnect
        if (reviews) {
            return
        }

        try {
            // Connect to specific database and collection
            // conn.db("database_name").collection("collection_name")
            reviews = conn.db("pizza_reviews").collection("reviews")
            console.log('✅ ReviewsDAO connected to database')
        } catch (e) {
            console.error(`❌ Unable to connect ReviewsDAO: ${e}`)
        }
    }


    /*```

    **Breaking it down:**

    1. **`if (reviews)`** = Check if already connected
       - Prevents connecting twice
       - `reviews` variable is either undefined or a Collection

    2. **`conn.db("pizza_reviews")`** = Select database
       - Like opening a specific file cabinet
       - "pizza_reviews" is the database name

    3. **`.collection("reviews")`** = Select collection
       - Like opening a specific drawer in the cabinet
       - "reviews" is where we store review documents

    4. **`reviews = ...`** = Store the connection
       - Now all other methods can use `reviews`

    **Analogy:**
    ```
        MongoDB = Library Building
        Database = Section (Fiction, Non-Fiction)
        Collection = Bookshelf (Mystery, Romance)
        Document = Individual Book*/


    // ============================================
    // GET ALL REVIEWS
    // ============================================
    static async getReviews() {
        try {
            // Step 1: Query the database
            // reviews.find() = "Find all documents in the reviews collection"
            // No parameters = get everything (no filter)
            const cursor = reviews.find()

            // Step 2: Convert cursor to array
            // cursor = like a pointer to results
            // toArray() = actually fetch all the data
            const reviewsList = await cursor.toArray()

            // Step 3: Return the data
            // Also include the total count
            return {
                reviews: reviewsList,      // Array of review objects
                total: reviewsList.length  // How many reviews total
            }

        } catch (e) {
            // If something goes wrong, log the error
            console.error(`Unable to get reviews: ${e}`)

            // Return empty array instead of crashing
            return {reviews: [], error: e}
        }
    }

    /*
    * Breaking It Down:
1. What is a cursor?
typescriptconst cursor = reviews.find()
A cursor is like a bookmark or pointer to the results.
Analogy:

You ask Google to search for "pizza reviews"
Google doesn't immediately show you ALL results
It shows you a "cursor" (page 1, 2, 3...)
You can click "next" to get more

In MongoDB:

find() doesn't immediately load all data
It creates a cursor that points to the data
You use toArray() to actually fetch it

Why not load immediately?

Efficient! What if there are 1 million reviews?
Cursor lets you paginate, limit, sort, etc.


2. What does toArray() do?
typescriptconst reviewsList = await cursor.toArray()

Converts the cursor into an actual JavaScript array
Fetches all the data from MongoDB
Waits for the database (that's why we use await)

Before toArray():
typescriptcursor = Pointer → [review1, review2, review3...]
After toArray():
typescriptreviewsList = [
  { _id: "123", pizzaName: "Margherita", rating: 5 },
  { _id: "456", pizzaName: "Pepperoni", rating: 4 },
  { _id: "789", pizzaName: "Hawaiian", rating: 3 }
]

3. Why return an object instead of just the array?
typescript// ❌ Could do this (just the array)
return reviewsList

// ✅ Better - return an object
return {
  reviews: reviewsList,
  total: reviewsList.length
}
Benefits of returning an object:

Extensible - Can add more fields later
Clear - Frontend knows what each field is
Consistent - All methods return similar structure

Frontend usage:
typescriptconst data = await ReviewsDAO.getReviews()
console.log(data.reviews)  // Array of reviews
console.log(data.total)    // Count

4. Why the try/catch?
typescripttry {
  // Code that might fail
} catch (e) {
  // Handle the error gracefully
  return { reviews: [], error: e }
}
Why might it fail?

Database connection lost
Collection doesn't exist
MongoDB server crashed
Network issues

Without try/catch:

App crashes
User sees error page
Bad experience

With try/catch:

Return empty array
Log the error for debugging
App keeps running
User sees "No reviews yet" instead of crash

*/

    // ============================================
    // ADD NEW REVIEW
    // ============================================
    static async addReview(
        pizzaName: string,
        rating: number,
        comment: string,
        reviewer: string,
        restaurant?: string
    ) {
        try {
            // Step 1: Create the document to insert
            // This is what we'll save to MongoDB
            const reviewDoc = {
                pizzaName,                          // Required field
                rating,                             // Required field
                comment,                            // Required field
                reviewer,                           // Required field
                restaurant: restaurant || "Unknown", // Optional, default to "Unknown"
                createdAt: new Date(),              // Timestamp when created
                updatedAt: new Date()               // Timestamp when last updated
            }

            // Step 2: Insert the document into the collection
            // insertOne() = add one document to the database
            const result = await reviews.insertOne(reviewDoc)

            // Step 3: Return success with the new ID
            return {
                success: true,              // Indicates success
                id: result.insertedId       // MongoDB's auto-generated ID
            }

        } catch (e) {
            console.error(`Unable to add review: ${e}`)
            return {error: e}
        }
    }

    /*
    *Breaking It Down:
1. Method Parameters
typescriptstatic async addReview(
  pizzaName: string,      // ← Required parameter
  rating: number,         // ← Required parameter
  comment: string,        // ← Required parameter
  reviewer: string,       // ← Required parameter
  restaurant?: string     // ← Optional parameter (has ?)
)
Why list parameters instead of one object?
Option A (What we're doing):
typescriptaddReview("Margherita", 5, "Great!", "Shane", "Joe's Pizza")
// Clear what each parameter is by position
Option B (Object parameter):
typescriptaddReview({
  pizzaName: "Margherita",
  rating: 5,
  comment: "Great!",
  reviewer: "Shane",
  restaurant: "Joe's Pizza"
})
// More verbose but more flexible
Both work! We're using Option A for simplicity.

2. Building the Document
typescriptconst reviewDoc = {
  pizzaName,
  rating,
  comment,
  reviewer,
  restaurant: restaurant || "Unknown",
  createdAt: new Date(),
  updatedAt: new Date()
}
Property Shorthand:
typescript// These are the same:
{ pizzaName: pizzaName }  // ← Long form
{ pizzaName }             // ← Shorthand
Default Values:
typescriptrestaurant: restaurant || "Unknown"
This means:

If restaurant is provided → use it
If restaurant is undefined → use "Unknown"

Example:
typescript// With restaurant
addReview("Margherita", 5, "Good", "Shane", "Joe's")
// restaurant = "Joe's"

// Without restaurant
addReview("Margherita", 5, "Good", "Shane")
// restaurant = "Unknown"
Timestamps:
typescriptcreatedAt: new Date()   // Current date/time
updatedAt: new Date()   // Same as createdAt initially
new Date() creates a JavaScript Date object representing right now.

3. Inserting the Document
typescriptconst result = await reviews.insertOne(reviewDoc)
What happens:

MongoDB receives the document
Automatically generates a unique _id
Saves it to the "reviews" collection
Returns confirmation with the generated ID

The result object looks like:
typescript{
  acknowledged: true,              // Operation succeeded
  insertedId: ObjectId("507f1f77...") // The new ID
}

4. Returning the Result
typescriptreturn {
  success: true,
  id: result.insertedId
}
Why return the ID?

Frontend might want to redirect to the new review
Can use it to fetch the review immediately
Confirm what was created

Frontend usage:
typescriptconst result = await ReviewsDAO.addReview(...)
if (result.success) {
  console.log(`Created review with ID: ${result.id}`)
  // Redirect to: /reviews/${result.id}
}
    * */


    // ============================================
    // GET REVIEW BY ID
    // ============================================
    static async getReviewByID(id: string) {
        try {
            const review = await reviews.findOne({_id: new ObjectId(id)})
            return review
        } catch (e) {
            console.error(`Unable to get review: ${e}`)
            return null
        }
    }

    // ============================================
    // UPDATE REVIEW
    // ============================================
    static async updateReview(id: string, updates: any) {
        try {
            // Step 1: Add updated timestamp
            // Automatically track when this review was last modified
            updates.updatedAt = new Date()

            // Step 2: Update the document
            // updateOne() = update one document
            // First parameter: which document to update (find by _id)
            // Second parameter: what to update ($set operator)
            const result = await reviews.updateOne(
                { _id: new ObjectId(id) },    // Find document with this ID
                { $set: updates }              // Update these fields
            )

            // Step 3: Return success status
            // modifiedCount = how many documents were changed
            // If 0, either ID doesn't exist or nothing changed
            return { success: result.modifiedCount > 0 }

        } catch (e) {
            console.error(`Unable to update review: ${e}`)
            return { error: e }
        }
    }


    // ============================================
    // DELETE REVIEW
    // ============================================
    static async deleteReview(id: string) {
        try {
            // Step 1: Delete the document
            // deleteOne() = remove one document from collection
            // Parameter: which document to delete (find by _id)
            const result = await reviews.deleteOne({
                _id: new ObjectId(id)
            })

            // Step 2: Return success status
            // deletedCount = how many documents were removed
            // Should be 1 if found and deleted, 0 if not found
            return { success: result.deletedCount > 0 }

        } catch (e) {
            console.error(`Unable to delete review: ${e}`)
            return { error: e }
        }
    }
}