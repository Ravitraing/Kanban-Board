let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

/* ---------------- SAVE TASKS ---------------- */
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

/* ---------------- ADD TASK ---------------- */
function addTask() {
    let input = document.getElementById("taskInput");
    let title = input.value.trim();

    if (title === "") {
        alert("Task cannot be empty ❌");
        return;
    }

    let task = {
        id: Date.now(),
        title: title,
        status: "todo"
    };

    tasks.push(task);
    saveTasks();
    input.value = "";
    renderTasks();
}

/* ---------------- RENDER TASKS ---------------- */
function renderTasks() {
    const columns = {
        todo: document.getElementById("todo"),
        inprogress: document.getElementById("inprogress"),
        done: document.getElementById("done")
    };

    // Reset columns with heading + counter
    columns.todo.innerHTML = `<h2>📝 Todo (${tasks.filter(t => t.status==="todo").length})</h2>`;
    columns.inprogress.innerHTML = `<h2>⚙️ In Progress (${tasks.filter(t => t.status==="inprogress").length})</h2>`;
    columns.done.innerHTML = `<h2>✅ Done (${tasks.filter(t => t.status==="done").length})</h2>`;

    // Render tasks in order
    tasks.forEach(task => {
        let div = document.createElement("div");
        div.className = "task";
        div.draggable = true;
        div.id = task.id;

        // Drag events
        div.addEventListener("dragstart", drag);

        div.innerHTML = `
            <strong>${task.title}</strong>
            <div class="task-actions">
                <button onclick="editTask(${task.id})">✏️</button>
                <button onclick="deleteTask(${task.id})">🗑️</button>
            </div>
        `;

        columns[task.status].appendChild(div);
    });
}

/* ---------------- DELETE TASK ---------------- */
function deleteTask(id) {
    if (!confirm("Are you sure to delete this task? 🗑️")) return;

    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
}

/* ---------------- EDIT TASK ---------------- */
function editTask(id) {
    let task = tasks.find(t => t.id === id);

    let newTitle = prompt("Edit task:", task.title);

    if (!newTitle || newTitle.trim() === "") return;

    task.title = newTitle.trim();

    saveTasks();
    renderTasks();
}

/* ---------------- DRAG & DROP ---------------- */
let dragSrcId = null;

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    dragSrcId = Number(ev.target.id);
    ev.dataTransfer.effectAllowed = "move";
}

function drop(ev) {
    ev.preventDefault();
    const targetColumn = ev.currentTarget.id;

    // Find dragged task
    let draggedTaskIndex = tasks.findIndex(t => t.id === dragSrcId);
    let draggedTask = tasks[draggedTaskIndex];

    // Remove dragged task from its position
    tasks.splice(draggedTaskIndex, 1);

    // Find index to insert in new column
    let columnTasks = tasks.filter(t => t.status === targetColumn);
    let lastIndexInColumn = -1;
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].status === targetColumn) lastIndexInColumn = i;
    }

    // Insert after last task in column
    tasks.splice(lastIndexInColumn + 1, 0, {...draggedTask, status: targetColumn});

    saveTasks();
    renderTasks();
}

/* ---------------- DRAG-OVER HIGHLIGHT ---------------- */
document.querySelectorAll(".column").forEach(col => {
    col.addEventListener("dragenter", () => col.classList.add("drag-over"));
    col.addEventListener("dragleave", () => col.classList.remove("drag-over"));
    col.addEventListener("drop", () => col.classList.remove("drag-over"));
});

/* ---------------- LOAD ON START ---------------- */
renderTasks();