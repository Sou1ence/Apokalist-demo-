const API_URL = 'http://localhost:8081/data';

document.addEventListener('DOMContentLoaded', async () => {
    try {
        await loadTasks();
    } catch (error) {
        console.error("Failed to load tasks:", error);
    }

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
        }
    });
});

async function loadTasks() {
    const sortBy = document.getElementById('sort-tasks').value;
    const tasks = await fetch(`${API_URL}?sortBy=${sortBy}`).then(res => res.json());

    const taskList = document.getElementById('task-list');
    taskList.innerHTML = tasks.map(task => `
        <li class="task-item" data-id="${task.id}">
            <div class="task-header">
                <div class="task-title">${task.title}</div>
                <div class="task-date">
                    ${new Date(task.dueDate).toLocaleDateString()} • 
                    <span>${calculateDaysLeft(task.dueDate)}</span>
                </div>
            </div>
            <div class="task-actions">
                <button class="btn delete-btn" onclick="deleteTask(${task.id})">Delete</button>
            </div>
        </li>
    `).join('');
}

async function createTask(task) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(task)
        });
        if (!response.ok) {
            throw new Error(`Failed to create task: ${response.status} ${response.statusText}`);
        }
        const newTask = await response.json();
        console.log('Task created:', newTask);
        return newTask;
    } catch (error) {
        console.error('Error creating task:', error);
        alert('Failed to add task. Please try again.');
        throw error;
    }
}

async function deleteTask(id) {
    await fetch(`${API_URL}/${id}`, {method: 'DELETE'});
    await loadTasks();
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