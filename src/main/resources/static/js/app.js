const API_URL = '/data';

document.addEventListener('DOMContentLoaded', async () => {
    await loadTasks();

    // Обработчик формы добавления
    document.getElementById('add-task-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        await createTask({
            title: document.getElementById('task-title').value,
            description: document.getElementById('task-description').value,
            dueDate: document.getElementById('task-date').value,
            completed: false
        });
        await loadTasks();
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
    await fetch(API_URL, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(task)
    });
}

async function deleteTask(id) {
    await fetch(`${API_URL}/${id}`, {method: 'DELETE'});
    await loadTasks();
}