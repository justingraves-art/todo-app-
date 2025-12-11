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

app.use(cors("*")); // Enables use of CORS - * means every domain is now allowed acces to this server to send and receive data - not secure - * is for development only





// ---------------------------------- ↓ Database connection & app startup ↓ ---------------------------------------

//IIFE

(async() => {
    try {
        mongoose.set("autoIndex", false);
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



// Define the task schema (data structure)
const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true},
    dueDate: { type: Date, required: true},
    dateCreated: { type: Date, required: true, default: Date.now},
    completed: { type: Boolean, required: true, default: false}
});



//Define indexes for performance
taskSchema.index({ dueDate: 1});
taskSchema.index({ dateCreated: 1});


// Type of data structure to be used in database
const Task = mongoose.model("Task", taskSchema);




// ---------------------------------- ↓ API ROUTES ↓ ---------------------------------------
//Get all tasks
app.get("/api/tasks", async (req, res) => {
    try {
        const { sortBy } = req.query;
        let sortOption = {};

        if (sortBy === "dueDate"){
            sortOption = { dueDate: 1 };
         } else if (sortBy === "dateCreated") {
            sortOption = { dateCreated: 1 };
            }
        

        const tasks = await Task.find(({})).sort(sortOption);

    if (!tasks) {
        return res.status(404).json({ message: "Tasks not found!"});
    }
        res.json(tasks);      
    } catch (error) {
        console.error("Error:",error);  
        res.status(500).json({ message: "Error grabbing tasks!"});
    }   
});




//Create a new task and add it to the array
app.post("/api/tasks/todo", async (req, res) => {
    try {
        const {title, description, dueDate} = req.body;

       const taskData = { title, description, dueDate};
       const createTask = new Task(taskData);
       const newTask = await createTask.save();
        
        res.json({ message: "Task created successfully!", task: newTask});
        
    } catch (error) {
        console.error("Error:",error);  
        res.status(500).json({ message: "Error creating tasks!"});      
    }
});



//Complete the task 
app.patch("/api/tasks/todo", async (req, res) => {
    try {
        const {title, description, dueDate} = req.body;

       const taskData = { title, description, dueDate};
       const createTask = new Task(taskData);
       const newTask = await createTask.save();
        
        res.json({ message: "Task created successfully!", task: newTask});
        
    } catch (error) {
        console.error("Error:",error);  
        res.status(500).json({ message: "Error creating tasks!"});      
    }
});



//To make the task not complete
app.patch("/api/tasks/notComplete/:id", async(req,res) =>{
    try {
        const { completed } = req.body;
        const taskId = req.params.id;

        const taskNotComplete = await Task.findByIdAndUpdate(taskId, { completed }, { new: true });

        if (!taskNotComplete) {
            return res.status(404).json({message: "Task not 'found!'"});

            
        }

        res.json({ task: taskNotComplete, message: "Task set to `not complete`"});
        
    } catch (error) {
        console.error("Error", error);
        res.status(500).json({ message: "Error making the task completed!"});    
    }
});


//To delete the task
app.delete("/api/tasks/delete/:id", async (req, res) => {
    try {
        const taskId = req.params.id;
        const deletedTask = await Task.findByIdAndDelete(taskId);

        if (!deletedTask) {
            return res.status(404).json({ message: "Task not found!"});         
        }

        res.json({ task: deletedTask, message: "Task deleted successfully!"})
        
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Error deleting the task!"});  
    }
});



//To edit the task and update the details
app.put("/api/tasks/update/:id", async (req, res) => {

    try {
        const taskId = req.params.id;
        const { title, description, dueDate} = req.body;

        const taskData = { title, description, dueDate };
        const updatedTask = await Task.findByIdAndUpdate(taskId, taskData, {new: true});

        if (!updatedTask) {
            return res.status(404).json({ message: "Task not found"});
        }

        res.json({task: updatedTask, message: "Task updated successfully!"})
        
    } catch (error) {
        console.error("Error", error);
        res.status(500).json({ message: "Error updating the task!"});   
    }

});



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

