# Task Manager API

## Overview

Task Manager API is a simple Node.js and Express-based RESTful API for managing tasks. It supports creating, reading, updating, deleting, and filtering tasks, with support for priority levels and completion status. Tasks are persisted in a local JSON file (`task.json`).

## Setup Instructions

1. **Clone the repository**
2. **Install dependencies**
   ```sh
   npm install
   ```
3. **Start the server**
   ```sh
   node server.js
   ```
   The server runs on `http://localhost:3000` by default.

## API Endpoints

### 1. Get All Tasks
- **GET /tasks**
- Returns all tasks, sorted by creation date (newest first).
- **Query Parameters:**
  - `completed=true|false` (optional) — filter by completion status.
- **Example:**
  ```sh
  curl http://localhost:3000/tasks?completed=true
  ```

### 2. Get Task by ID
- **GET /tasks/:id**
- Returns a single task by its ID.
- **Example:**
  ```sh
  curl http://localhost:3000/tasks/1
  ```

### 3. Get Tasks by Priority
- **GET /tasks/priority/:level**
- Returns tasks filtered by priority (`low`, `medium`, `high`).
- **Example:**
  ```sh
  curl http://localhost:3000/tasks/priority/high
  ```

### 4. Create a New Task
- **POST /tasks**
- Creates a new task.
- **Request Body (JSON):**
  ```json
  {
    "title": "Task Title",
    "description": "Task Description",
    "completed": false,
    "priority": "medium"
  }
  ```
- **Example:**
  ```sh
  curl -X POST http://localhost:3000/tasks \
    -H "Content-Type: application/json" \
    -d '{"title":"New Task","description":"Details","completed":false,"priority":"high"}'
  ```

### 5. Update a Task
- **PUT /tasks/:id**
- Updates an existing task by ID.
- **Request Body (JSON):**
  ```json
  {
    "title": "Updated Title",
    "description": "Updated Description",
    "completed": true,
    "priority": "low"
  }
  ```
- **Example:**
  ```sh
  curl -X PUT http://localhost:3000/tasks/1 \
    -H "Content-Type: application/json" \
    -d '{"title":"Updated Task","completed":true}'
  ```

### 6. Delete a Task
- **DELETE /tasks/:id**
- Deletes a task by its ID.
- **Example:**
  ```sh
  curl -X DELETE http://localhost:3000/tasks/1
  ```

## Notes
- All data is stored in `task.json`.
- The API validates required fields and data types.
- Priority must be one of: `low`, `medium`, `high`.
- Completed must be a boolean value.