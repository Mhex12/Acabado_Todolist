// Get elements
const taskSubmissionForm = document.getElementById('task-submission-form'); 
const taskInputField = document.getElementById('task-input-field'); 
const dueDateInputField = document.getElementById('due-date-input'); 
const taskListElement = document.getElementById('task-list'); 
const currentWeekDayElement = document.getElementById('current-week-day'); 
const currentDateElement = document.getElementById('current-date-display'); 
const currentTaskStatusElement = document.getElementById('current-task-status');
const quoteInputField = document.getElementById('quote-input-field'); 
const submitQuoteButton = document.getElementById('submit-quote-button'); 
const displayedQuoteElement = document.getElementById('displayed-quote');

// Load tasks from localStorage
document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    updateTaskStatus();
    updateRealTimeDate(); // 
});

// Load the quote from localStorage on page load
document.addEventListener('DOMContentLoaded', () => {
    const savedQuote = localStorage.getItem('quote');
    if (savedQuote) {
        displayedQuoteElement.textContent = savedQuote; 
    }
});

// Add task
taskSubmissionForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const task = taskInputField.value;
    const date = dueDateInputField.value;

    if (task && date) {
        if (taskSubmissionForm.dataset.editing === "true") {
            // If editing, update the task
            const taskIndex = taskSubmissionForm.dataset.index;
            updateTaskInList(taskIndex, task, date);
        } else {
            // If not editing, add a new task
            addTaskToList(task, date);
            saveTask(task, date);
        }

        taskInputField.value = '';
        dueDateInputField.value = '';
        updateTaskStatus(); 
        delete taskSubmissionForm.dataset.editing; 
        delete taskSubmissionForm.dataset.index; 
    }
});

// Function to add task to the list (HTML)
function addTaskToList(task, date) {
    const listItem = document.createElement('li');
    listItem.innerHTML = `
        <span class="task-text">${date} - ${task}</span>
        <div>
            <button class="edit-button">Edit</button>
            <button class="delete-button">Delete</button>
        </div>
    `;
    taskListElement.insertBefore(listItem, taskListElement.firstChild);

    // Add event listeners for edit and delete buttons
    listItem.querySelector('.delete-button').addEventListener('click', deleteTask);
    listItem.querySelector('.edit-button').addEventListener('click', editTask);
}

// Save task to localStorage
function saveTask(task, date) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push({ task, date }); 
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Update task in localStorage and DOM
function updateTaskInList(index, task, date) {
    let tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks[index] = { task, date }; // Update the task
    localStorage.setItem('tasks', JSON.stringify(tasks));
    
    // Update the UI as well
    const listItem = taskListElement.children[index];
    listItem.querySelector('.task-text').innerText = `${date} - ${task}`;
}

// Load tasks from localStorage
function loadTasks() {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(taskObj => addTaskToList(taskObj.task, taskObj.date));
}

// Update task status (label)
function updateTaskStatus() {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // Update task status message
    if (tasks.length > 0) {
        currentTaskStatusElement.textContent = 'You have a task';
    } else {
        currentTaskStatusElement.textContent = 'No task for today';
    }
}

// Delete task
function deleteTask(event) {
    const listItem = event.target.closest('li'); 
    const task = listItem.querySelector('.task-text').innerText.split(' - ')[1].trim(); 
    const date = listItem.querySelector('.task-text').innerText.split(' - ')[0].trim(); 
    const index = Array.from(taskListElement.children).indexOf(listItem); 
    listItem.remove();

    let tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks = tasks.filter((taskObj, i) => i !== index); // 
    localStorage.setItem('tasks', JSON.stringify(tasks));

    updateTaskStatus(); //
}

// Edit task
function editTask(event) {
    const listItem = event.target.closest('li');
    const taskText = listItem.querySelector('.task-text').innerText.split(' - ')[1].trim();
    const dateText = listItem.querySelector('.task-text').innerText.split(' - ')[0].trim();
    
    // Pre-fill input fields with current values
    taskInputField.value = taskText;
    dueDateInputField.value = dateText;

    // Set editing state
    taskSubmissionForm.dataset.editing = "true"; // Set editing flag
    taskSubmissionForm.dataset.index = Array.from(taskListElement.children).indexOf(listItem); 
}

// Update the date and day in real-time
function updateRealTimeDate() {
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    // Update date and day every second
    setInterval(() => {
        const now = new Date();
        const dayOfWeek = dayNames[now.getDay()];
        const currentDate = now.getDate();

        // Set the day and date elements
        currentWeekDayElement.textContent = dayOfWeek.toUpperCase();
        currentDateElement.textContent = currentDate;
    }, 1000); // Update every second
}

/*FOR THE QUOTE BUTTON*/

// Add event listener to the submit quote button
submitQuoteButton.addEventListener('click', function() {
    const newQuote = quoteInputField.value.trim(); 

    if (newQuote) { 
        displayedQuoteElement.textContent = newQuote; 
        localStorage.setItem('quote', newQuote); 
        quoteInputField.value = ''; 
    } else {
        alert('Please enter a valid quote.'); 
    }
});
