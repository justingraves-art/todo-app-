const express = require("express");
const router = express.Router();
const Task = require("./models/task");


// ---------------------------------- ↓ API ROUTES ↓ ---------------------------------------
//Get all tasks
router.get("/api/tasks", async (req, res) => {
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
router.post("/api/tasks/todo", async (req, res) => {
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
router.patch("/api/tasks/complete/:id", async (req, res) => {
    try {
        const { completed } = req.body;
        const taskId = req.params.id;

        const taskComplete = await Task.findByIdAndUpdate(taskId, { completed }, { new: true });

        if (!taskComplete) {
            return res.status(404).json({message: "Task not 'found!'"});

            
        }

        res.json({ task: taskComplete, message: "Task set to ` complete`"});
        
    } catch (error) {
        console.error("Error:",error);  
        res.status(500).json({ message: "Error completeing tasks!"});      
    }
});



//To make the task not complete
router.patch("/api/tasks/notComplete/:id", async(req,res) =>{
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
router.delete("/api/tasks/delete/:id", async (req, res) => {
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
router.put("/api/tasks/update/:id", async (req, res) => {

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

module.exports = router
