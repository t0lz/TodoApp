document.addEventListener('DOMContentLoaded', (event) => {
    class Task {
        constructor(text, completed = false) {
            this.text = text;
            this.completed = completed;
        }

        createElement() {
            const li = document.createElement('li');
            li.innerHTML = `
                <p>${this.text}</p>
                ${!this.completed ? `
                <div>
                    <button class="complete"><img src="icons/checkmark.svg" alt="Завершить" width="18" height="18"></button>
                    <button class="delete"><img src="icons/trash.svg" alt="Удалить" width="18" height="18"></button>
                </div>` : ''}
            `;
            return li;
        }
    }

    class TaskList {
        constructor(elementId) {
            this.listElement = document.getElementById(elementId);
        }

        addTask(task) {
            const li = task.createElement();
            this.listElement.appendChild(li);
            return li;
        }

        removeTask(taskElement) {
            taskElement.remove();
        }

        getTasks() {
            return Array.from(this.listElement.querySelectorAll('li')).map(li => {
                const text = li.querySelector('p').innerText;
                return new Task(text, this.listElement.id === 'finished');
            });
        }

        count() {
            return this.listElement.children.length;
        }
    }

    class TaskManager {
        constructor() {
            this.itemInput = document.getElementById('Item');
            this.addItemButton = document.getElementById('Add');
            this.itemsList = new TaskList('Items');
            this.finishedList = new TaskList('finished');
            this.countItems = document.getElementById('countItems');
            this.completedCount = document.getElementById('completedCount');

            this.addItemButton.addEventListener('click', (e) => this.addTaskHandler(e));

            this.loadTasks();
        }

        addTaskHandler(e) {
            e.preventDefault();
            this.addTask(this.itemInput.value);
            this.itemInput.value = '';
        }

        addTask(taskText) {
            if (taskText.trim() === '') return;

            const task = new Task(taskText);
            const li = this.itemsList.addTask(task);
            this.updateCount();

            li.querySelector('.complete').addEventListener('click', () => this.completeTask(li));
            li.querySelector('.delete').addEventListener('click', () => this.deleteTask(li, 'Items'));

            this.saveTasks();
        }

        completeTask(taskElement) {
            const taskText = taskElement.querySelector('p').innerText;
            this.itemsList.removeTask(taskElement);
            this.updateCount();

            const task = new Task(taskText, true);
            this.finishedList.addTask(task);
            this.updateCount();

            this.saveTasks();
        }

        deleteTask(taskElement, listType) {
            if (listType === 'Items') {
                this.itemsList.removeTask(taskElement);
            } else {
                this.finishedList.removeTask(taskElement);
            }
            this.updateCount();
            this.saveTasks();
        }

        updateCount() {
            this.countItems.innerText = this.itemsList.count();
            this.completedCount.innerText = this.finishedList.count();
        }

        saveTasks() {
            const tasks = [...this.itemsList.getTasks(), ...this.finishedList.getTasks()];
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }

        loadTasks() {
            const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
            tasks.forEach(task => {
                const taskObj = new Task(task.text, task.completed);
                if (task.completed) {
                    this.finishedList.addTask(taskObj);
                } else {
                    const li = this.itemsList.addTask(taskObj);
                    li.querySelector('.complete').addEventListener('click', () => this.completeTask(li));
                    li.querySelector('.delete').addEventListener('click', () => this.deleteTask(li, 'Items'));
                }
            });
            this.updateCount();
        }
    }

    new TaskManager();
});

