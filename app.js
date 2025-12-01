const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');

const data = require('./task.json');

// Middleware to parse incoming JSON requests
app.use(express.json());

// GET /tasks
app.get('/tasks', (req, res) => {
    let tasks = data.tasks;
    if (req.query.completed !== undefined) {
        const completed = req.query.completed === 'true';
        tasks = tasks.filter(t => t.completed === completed);
    }

    tasks = tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(tasks);
})

app.get('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id, 10);
    const task = data.tasks.find((t) => t.id === taskId);
    if (task) {
        res.send(task)
    } else {
        res.status(404).send({ error: 'Task not found' });
    }
});

app.get('/tasks/priority/:level', (req, res) => {
    const priorityId = req.params.level;
    if (!['low', 'high', 'medium'].includes(priorityId)) {
        return res.status(400).send({ error: 'Priority must be low, medium, or high' });
    }
    const tasks = data.tasks.filter(t => t.priority === priorityId);
    res.send(tasks)
});

app.post('/tasks', (req, res) => {
    const { title, description, completed, priority } = req.body;

    if (!title || !description) {
        return res.status(400).send({ error: 'Title and description are required' });
    }
    if (completed !== undefined && typeof completed !== 'boolean') {
        return res.status(400).send({ error: 'Completed must be a boolean value' });
    }
    if (priority && !['low', 'high', 'medium'].includes(priority)) {
        return res.status(400).send({ error: 'Priority must be low, medium, or high' });
    }

    const maxId = data.tasks.reduce((max, task) => (task.id > max ? task.id : max), 0)
    const newTask = {
        id: maxId + 1,
        title,
        description,
        priority: priority || 'low',
        completed: completed === true,
        createdAt: new Date().toISOString()
    }

    data.tasks.push(newTask);

    fs.writeFileSync(
        path.join(__dirname, 'task.json'),
        JSON.stringify(data, null, 2)
    );

    res.status(201).send(newTask);
});

app.put('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id, 10);
    const { title, description, completed, priority } = req.body;

    // Find the index of the task
    const taskIndex = data.tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) {
        return res.status(404).send({ error: 'Task not found' });
    }

    // Validation: title must be a non-empty string if provided, completed must be boolean if provided
    if (
        (title !== undefined && (typeof title !== 'string' || title.trim() === '')) ||
        (completed !== undefined && typeof completed !== 'boolean') ||
        (priority !== undefined && !['low', 'medium', 'high'].includes(priority)) ||
        (description !== undefined && (typeof description !== 'string' || description.trim() === ''))
    ) {
        return res.status(400).send({ error: 'Invalid data' });
    }

    if (title !== undefined) data.tasks[taskIndex].title = title;
    if (description !== undefined) data.tasks[taskIndex].description = description;
    if (completed !== undefined) data.tasks[taskIndex].completed = completed;
    if (priority !== undefined) data.tasks[taskIndex].priority = priority;

    fs.writeFileSync(
        path.join(__dirname, 'task.json'),
        JSON.stringify(data, null, 2)
    );

    res.status(200).send(data.tasks[taskIndex]);
});

app.delete('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id, 10);
    const taskIndex = data.tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) {
        return res.status(404).send({ error: 'Task not found' });
    }
    const updatedTask = data.tasks.filter(t => t.id !== taskId);
    data.tasks = updatedTask;

    fs.writeFileSync(
        path.join(__dirname, 'task.json'),
        JSON.stringify(data, null, 2)
    );
    res.status(200).send({
        message: 'Task deleted successfully'
    });
});

module.exports = app;
