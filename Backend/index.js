// --------------------------- ↓ SETTING UP DEPENDENCIES ↓ --------------------------------
require("dotenv").config();
const express = require("express"); //Enables the use of express.js
const cors = require("cors");
const mongoose = require("mongoose");

// ---------------------------- ↓ INITIAL APP CONFIGURATION ↓ -----------------------------
const port = process.env.PORT || 3000; // Uses port number on device to serve the backend
const app = express(); //Using express.js to power our application /server


// -------------------------------- ↓ MIDDLEWARE SETUP ↓ -----------------------------------

app.use(express.json()); // Uses express in JSON format

const corsOptions = {
    origins: "https//todo-app-woad-ten-73.vercel.app",
    methods: ["get", "post", "put", "patch", "DELETE"],
    credentials: true
};


app.use(cors("corsOptions")); // Enables use of CORS - * means every domain is now allowed acces to this server to send and receive data - not secure - * is for development only

//----------------------------Routes---------------------------------

const taskRoutes = require("./routes/taskRoutes");

app.use("/api/tasks", taskRoutes);



// ---------------------------------- ↓ Database connection & app startup ↓ ---------------------------------------

//IIFE

(async() => {
    try {
        mongoose.set("autoIndex", false);
        const Task = require("./models/task");


        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ database connected");

        await Task.syncIndexes();
        console.log(`indexes created!`);
        
        app.listen(port, () =>{
          console.log(`✅ to do app is live on port ${port}`);
        });
    } catch (err) {
       console.error("❌ startup Error:", err) 
       process.exit(1);
    }
})();






/*
app.get("/get/example", async(req, res) =>{
    res.son("Hello i am a message from the backend!");
});

CRUD
C - Create - post
R - Read - get
U - Update - Patch
D - Delete - Delete */
// ---------------------------------- ↓ APP STARTUP ↓ ---------------------------------------

