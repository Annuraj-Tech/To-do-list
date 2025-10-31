// --- Load tasks from localStorage ---
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// --- Save tasks to localStorage ---
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// --- Toggle the popup form visibility ---
function toggleForm() {
  const popup = document.getElementById("formPopup");
  popup.style.display = popup.style.display === "flex" ? "none" : "flex";
}

// --- Add a new task ---
function addTask() {
  const text = document.getElementById("taskInput").value.trim();
  const category = document.getElementById("category").value;
  const priority = document.getElementById("priority").value;
  const deadline = document.getElementById("deadline").value;

  if (!text) {
    alert("Please enter a task.");
    return;
  }

  // Create task object
  const task = {
    text,
    category,
    priority,
    deadline,
    done: false,
  };

  // Push to tasks array and save
  tasks.push(task);
  saveTasks();

  // Update UI
  showTasks();
  toggleForm();

  // Clear input fields
  document.getElementById("taskInput").value = "";
  document.getElementById("deadline").value = "";
}

// --- Display all tasks ---
function showTasks() {
  // Clear all lists first
  ["high", "medium", "low"].forEach(level => {
    const list = document.getElementById(level + "List");
    if (list) list.innerHTML = "";
  });

  // Display tasks
  tasks.forEach((t, i) => {
    // Ensure valid priority
    if (!t.priority) t.priority = "Low";

    const priorityId = t.priority.charAt(0).toUpperCase() + t.priority.slice(1).toLowerCase();
    const listId = priorityId.toLowerCase() + "List";
    const listElement = document.getElementById(listId);

    if (!listElement) return; // Skip invalid priorities

    const li = document.createElement("li");
    li.className = `priority-${priorityId}${t.done ? " completed" : ""}`;

    const deadlineText = t.deadline ? new Date(t.deadline).toLocaleString() : "";
    const isOverdue = t.deadline && new Date(t.deadline) < new Date();

    li.innerHTML = `
      <div>
        <span>${t.text} <small>(${t.category})</small></span><br>
        ${deadlineText ? `<small style="color:${isOverdue ? 'red' : 'gray'}">Deadline: ${deadlineText}</small>` : ""}
      </div>
      <div class="actions">
        <button onclick="markDone(${i})">✔</button>
        <button onclick="editTask(${i})">✎</button>
        <button onclick="deleteTask(${i})">🗑</button>
      </div>
    `;

    listElement.appendChild(li);
  });
}

// --- Mark a task as completed ---
function markDone(i) {
  tasks[i].done = !tasks[i].done;
  saveTasks();
  showTasks();
}

// --- Edit an existing task ---
function editTask(i) {
  const newText = prompt("Edit your task:", tasks[i].text);
  if (newText !== null && newText.trim() !== "") {
    tasks[i].text = newText.trim();
    saveTasks();
    showTasks();
  }
}

// --- Delete a task ---
function deleteTask(i) {
  if (confirm("Are you sure you want to delete this task?")) {
    tasks.splice(i, 1);
    saveTasks();
    showTasks();
  }
}

// --- Initial load ---
showTasks();
