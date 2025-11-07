// ============================================
// REVIEW INTERFACE
// ============================================
// This is a TypeScript interface
// It defines the "shape" of a review object
// Think of it as a form that must be filled out

// ============================================
// REVIEW INTERFACE
// ============================================
// This is a TypeScript interface
// It defines the "shape" of a review object
// Think of it as a form that must be filled out

export interface Review {
    // _id is the unique identifier MongoDB creates
    // ? means "optional" - MongoDB creates this automatically
    _id?: string;

    // pizzaName is required (no ?)
    // string type means it must be text
    // Example: "Margherita", "Pepperoni"
    pizzaName: string;

    // rating is required
    // number type means it must be a number
    // We'll validate it's between 1-5 in the controller
    rating: number;

    // comment is required
    // The actual review text from the user
    // Example: "Best pizza ever!"
    comment: string;

    // reviewer is required
    // Person who wrote the review
    // Example: "Shane", "John Doe"
    reviewer: string;

    // restaurant is optional (has ?)
    // Which pizza place this review is for
    // Example: "Joe's Pizza", "Pizza Hut"
    restaurant?: string;

    // createdAt is optional (MongoDB/DAO will set this)
    // Timestamp of when the review was created
    createdAt?: Date;

    // updatedAt is optional (MongoDB/DAO will set this)
    // Timestamp of when the review was last edited
    updatedAt?: Date;
}