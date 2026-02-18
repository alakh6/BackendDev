const express = require("express");
const app = express();

app.use(express.json());

let todos = [];
let idCounter = 1;

app.post("/todos", (req, res) => {
  const todo = {
    id: idCounter++,
    task: req.body.task,
    completed: false
  };
  todos.push(todo);
  res.status(201).json(todo);
});

app.get("/todos", (req, res) => {
  res.json(todos);
});

app.put("/todos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const todo = todos.find(t => t.id === id);

  if (!todo) {
    return res.status(404).json({ message: "Todo not found" });
  }

  todo.task = req.body.task ?? todo.task;
  todo.completed = req.body.completed ?? todo.completed;

  res.json(todo);
});

app.delete("/todos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  todos = todos.filter(t => t.id !== id);
  res.json({ message: "Todo deleted" });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});