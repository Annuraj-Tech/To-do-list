let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

const saveTasks = () => localStorage.setItem("tasks", JSON.stringify(tasks));

function toggleForm() {
  const p = document.getElementById("formPopup");
  p.style.display = p.style.display === "flex" ? "none" : "flex";
}

function addTask() {
  const text = document.getElementById("taskInput").value.trim();
  const category = document.getElementById("category").value;
  const priority = document.getElementById("priority").value;
  const deadline = document.getElementById("deadline").value;
  if (!text) return alert("Please enter a task.");

  tasks.push({ text, category, priority, deadline, done: false });
  saveTasks();
  showTasks();
  toggleForm();
  document.getElementById("taskInput").value = "";
  document.getElementById("deadline").value = "";
}

function showTasks() {
  ["high", "medium", "low"].forEach(l => (document.getElementById(l + "List").innerHTML = ""));
  tasks.forEach((t, i) => {
    t.priority ||= "Low";
    const p = t.priority.charAt(0).toUpperCase() + t.priority.slice(1).toLowerCase();
    const list = document.getElementById(p.toLowerCase() + "List");
    if (!list) return;
    const dText = t.deadline ? new Date(t.deadline).toLocaleString() : "";
    const overdue = t.deadline && new Date(t.deadline) < new Date();
    const li = document.createElement("li");
    li.className = `priority-${p}${t.done ? " completed" : ""}`;
    li.innerHTML = `
      <div>
        <span>${t.text} <small>(${t.category})</small></span><br>
        ${dText ? `<small style="color:${overdue ? 'red' : 'gray'}">Deadline: ${dText}</small>` : ""}
      </div>
      <div class="actions">
        <button onclick="markDone(${i})">✔</button>
        <button onclick="editTask(${i})">✎</button>
        <button onclick="deleteTask(${i})">🗑</button>
      </div>`;
    list.appendChild(li);
  });
}

function markDone(i) {
  tasks[i].done = !tasks[i].done;
  saveTasks();
  showTasks();
}

function editTask(i) {
  const t = prompt("Edit your task:", tasks[i].text);
  if (t && t.trim()) {
    tasks[i].text = t.trim();
    saveTasks();
    showTasks();
  }
}

function deleteTask(i) {
  if (confirm("Are you sure you want to delete this task?")) {
    tasks.splice(i, 1);
    saveTasks();
    showTasks();
  }
}

showTasks();
