const API_URL = 'http://localhost:8081/data';

let currentTasks = [];

document.addEventListener('DOMContentLoaded', async () => {
    try {
        await loadTasks();
        setupEventListeners();

        setInterval(updateCountdown, 1000);
    } catch (error) {
        console.error("Failed to load tasks:", error);
        alert("Failed to load tasks... -_-) fking sqlite!!!!! im just tired");
    }
});

function setupEventListeners() {
    document.getElementById('add-task-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        try {
            await createTask({
                title: document.getElementById('task-title').value,
                description: document.getElementById('task-description').value,
                dueDate: document.getElementById('task-date').value,
                completed: false
            });
            await loadTasks();
        } catch (error) {
            console.error("Error:", error);
            alert('Hmm, i cant add this task. Try again, it could help (not really)');
        }
    });

    document.getElementById('sort-tasks').addEventListener('change', loadTasks);

    const editForm = document.getElementById('edit-task-form');
    if (editForm) {
        editForm.addEventListener('submit', handleEditSubmit);
    } else {
        console.error("Edit form issue ");
    }

    const cancelEditBtn = document.getElementById('cancel-edit');
    if (cancelEditBtn) {
        cancelEditBtn.addEventListener('click', closeEditModal);
    } else {
        console.error("Cancel edit btn issue ");
    }

    const closeEditModalBtn = document.getElementById('close-edit-modal');
    if (closeEditModalBtn) {
        closeEditModalBtn.addEventListener('click', closeEditModal);
    } else {
        console.error("Close edit modal btn issue ");
    }
}

async function loadTasks() {
    try {
        const sortBy = document.getElementById('sort-tasks').value;
        const response = await fetch(`${API_URL}?sortBy=${sortBy}`);

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        currentTasks = await response.json();
        renderTasks(currentTasks);
        updateTaskCounter();
        updateCountdown();
    } catch (error) {
        console.error("Failed to load tasks:", error);
        throw error;
    }
}

function renderTasks(tasks) {
    const taskList = document.getElementById('task-list');
    const emptyState = document.getElementById('empty-state');

    if (tasks.length === 0) {
        emptyState.style.display = 'block';
        taskList.style.display = 'none';
        return;
    }

    emptyState.style.display = 'none';
    taskList.style.display = 'block';

    taskList.innerHTML = tasks.map(task => `
        <li class="task-item ${task.completed ? 'completed' : ''}" data-id="${task.id}">
            <div class="task-header">
                <div class="task-title">${task.title}</div>
                <div class="task-date">
                    ${new Date(task.dueDate).toLocaleDateString()} • 
                    <span class="${getDateLabelClass(task.dueDate)}">
                        ${calculateDaysLeft(task.dueDate)}
                    </span>
                </div>
            </div>
            <div class="task-content">
                <div class="task-description">${task.description || 'No description provided.'}</div>
                <div class="task-actions">
                    <button class="btn btn-sm ${task.completed ? '' : 'btn-success'} toggle-complete-btn" 
                            onclick="toggleComplete('${task.id}')">
                        ${task.completed ? 'Undo' : 'Complete'}
                    </button>
                    <button class="btn btn-sm edit-btn" onclick="openEditModal('${task.id}')">Edit</button>
                    <button class="btn btn-sm btn-danger delete-btn" onclick="deleteTask('${task.id}')">Delete</button>
                </div>
            </div>
        </li>
    `).join('');
}

async function createTask(task) {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task)
    });

    if (!response.ok) {
        throw new Error(`Failed to create task: ${response.status} ${response.statusText}`);
    }

    return await response.json();
}

async function toggleComplete(id) {
    try {
        const task = currentTasks.find(t => t.id == id);
        if (!task) return;

        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ completed: !task.completed })
        });

        if (!response.ok) throw new Error("Failed to update task");

        await loadTasks();
    } catch (error) {
        console.error("Error toggling task:", error);
        alert("Failed to update task status.");
    }
}

async function deleteTask(id) {
    // if (!confirm("Are you sure you want to delete this task?")) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error("Failed to delete task");

        await loadTasks();
    } catch (error) {
        console.error("Error deleting task:", error);
        alert("Failed to delete task.");
    }
}

async function openEditModal(id) {
    try {
        const task = currentTasks.find(t => t.id == id);
        if (!task) return;

        document.getElementById('edit-task-id').value = task.id;
        document.getElementById('edit-task-title').value = task.title;
        document.getElementById('edit-task-description').value = task.description || '';
        document.getElementById('edit-task-date').value = task.dueDate.split('T')[0];

        document.getElementById('edit-modal').classList.add('active');
    } catch (error) {
        console.error("Error opening edit modal:", error);
        alert("Failed to load task for editing.");
    }
}

window.handleEditSubmit = async function(e) {
    e.preventDefault();

    try {
        const task = currentTasks.find(t => t.id == document.getElementById('edit-task-id').value);
        if (!task) {
            throw new Error("Task not found in currentTasks");
        }

        const updatedTask = {
            id: document.getElementById('edit-task-id').value,
            title: document.getElementById('edit-task-title').value,
            description: document.getElementById('edit-task-description').value,
            dueDate: document.getElementById('edit-task-date').value,
            completed: task.completed
        };

        const response = await fetch(`${API_URL}/${updatedTask.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedTask)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to update task: ${response.status} ${errorText}`);
        }

        closeEditModal();
        await loadTasks();
    } catch (error) {
        console.error("Error updating task:", error);
        alert("cannot update this task< sorry : " + error.message);
    }
}

function closeEditModal() {
    document.getElementById('edit-modal').classList.remove('active');
}

function updateTaskCounter() {
    const remaining = currentTasks.filter(t => !t.completed).length;
    document.getElementById('task-counter').textContent =
        `${remaining} ${remaining === 1 ? 'task' : 'tasks'} remaining`;
}

function calculateDaysLeft(dueDate) {
    const today = new Date();
    const due = new Date(dueDate);
    const diff = due - today;
    const daysLeft = Math.ceil(diff / (1000 * 60 * 60 * 24));

    if (daysLeft < 0) return `${Math.abs(daysLeft)} days overdue`;
    if (daysLeft === 0) return "Due today";
    return `${daysLeft} days left`;
}

function getDateLabelClass(dueDate) {
    const daysLeft = Math.ceil((new Date(dueDate) - new Date()) / (1000 * 60 * 60 * 24));
    return daysLeft < 0 ? "text-danger" : daysLeft === 0 ? "text-warning" : "";
}

function updateCountdown() {
    const upcomingTasks = currentTasks
        .filter(task => !task.completed && new Date(task.dueDate) > new Date())
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

    if (upcomingTasks.length === 0) {
        document.getElementById('countdown').textContent = "No upcoming tasks";
        return;
    }

    const nearestTask = upcomingTasks[0];
    const dueDate = new Date(nearestTask.dueDate);
    const now = new Date();

    // Calculate time difference in milliseconds
    const diff = dueDate - now;

    if (diff <= 0) {
        document.getElementById('countdown').textContent = `${nearestTask.title} is due now!`;
        return;
    }

    // Convert to days, hours, minutes, seconds
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('countdown').textContent =
        `Time until "${nearestTask.title}": ${days}d ${hours}h ${minutes}m ${seconds}s`;
}



// Global functions for event handlers
window.toggleComplete = toggleComplete;
window.deleteTask = deleteTask;
window.openEditModal = openEditModal;
window.closeEditModal = closeEditModal;
window.handleEditSubmit = handleEditSubmit;



