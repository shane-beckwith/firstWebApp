// ============================================
// INDEX.TS - Server Entry Point & DB Connection
// ============================================

import dotenv from "dotenv"
dotenv.config()

import app from "./server"
import { MongoClient } from "mongodb"
import ReviewsDAO from "./dao/reviewsDAO"

// REMOVE THIS LINE - it's causing the conflict:
// const MongoClient = mongodb.MongoClient

const mongo_usr = process.env.MONGO_USERNAME
const mongo_pass = process.env.MONGO_PASSWORD

const mongo_uri = `mongodb+srv://${mongo_usr}:${mongo_pass}@cluster0.j0lmx0v.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

const port = process.env.PORT || 5001

MongoClient.connect(
    mongo_uri,
    {
        maxPoolSize: 50,
        wtimeoutMS: 2500,
    }
)
    .catch((err: any) => {
        console.error('❌ MongoDB connection failed:', err.stack)
        process.exit(1)
    })
    .then(async (client: any) => {
        if (!client) {
            console.error('❌ MongoDB client is undefined')
            return
        }

        console.log('✅ Connected to MongoDB Atlas')

        await ReviewsDAO.injectDB(client)

        app.listen(port, () => {
            console.log(`🚀 Server running on http://localhost:${port}`)
            console.log(`📝 Reviews endpoint: http://localhost:${port}/api/v1/reviews`)
        })
    })