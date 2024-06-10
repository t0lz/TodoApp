document.addEventListener('DOMContentLoaded', (event) => {
    const itemInput = document.getElementById('Item');
    const addItemButton = document.getElementById('Add');
    const itemsList = document.getElementById('Items');
    const finishedList = document.getElementById('finished');
    const countItems = document.getElementById('countItems');
    const completedCount = document.getElementById('completedCount');

    loadTasks();

    addItemButton.addEventListener('click', (e) => {
        e.preventDefault();
        addTask(itemInput.value);
        itemInput.value = '';
    });

    function addTask(taskText) {
        if (taskText.trim() === '') return;

        const li = document.createElement('li');
        li.innerHTML = `
            <p>${taskText}</p>
            <div>
                <button id="complete"><img src="icons/checkmark.svg" alt="Завершить" width="18" height="18"></button>
                <button id="delete"><img src="icons/trash.svg" alt="Удалить" width="18" height="18"></button>
            </div>
        `;
        itemsList.appendChild(li);
        updateCount();

        li.querySelector('#complete').addEventListener('click', () => completeTask(li));
        li.querySelector('#delete').addEventListener('click', () => deleteTask(li, 'Items'));

        saveTasks();
    }

    function completeTask(taskElement) {
        const taskText = taskElement.querySelector('p').innerText;
        taskElement.remove();
        updateCount();

        const li = document.createElement('li');
        li.innerHTML = `
            <p>${taskText}</p>
        `;
        finishedList.appendChild(li);
        updateCount();

        saveTasks();
    }

    function deleteTask(taskElement, listType) {
        taskElement.remove();
        updateCount();
        
        saveTasks();
    }

    function updateCount() {
        countItems.innerText = itemsList.children.length;
        completedCount.innerText = finishedList.children.length;
    }

    function saveTasks() {
        const tasks = [];
        itemsList.querySelectorAll('li').forEach(li => {
            tasks.push({ text: li.querySelector('p').innerText, completed: false });
        });
        finishedList.querySelectorAll('li').forEach(li => {
            tasks.push({ text: li.querySelector('p').innerText, completed: true });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => {
            if (task.completed) {
                const li = document.createElement('li');
                li.innerHTML = `
                    <p>${task.text}</p>
                `;
                finishedList.appendChild(li);
            } else {
                const li = document.createElement('li');
                li.innerHTML = `
                    <p>${task.text}</p>
                    <div>
                        <button id="complete"><img src="icons/checkmark.svg" alt="Завершить" width="16" height="16"></button>
                        <button id="delete"><img src="icons/trash.svg" alt="Удалить" width="16" height="16"></button>
                    </div>
                `;
                itemsList.appendChild(li);
                li.querySelector('#complete').addEventListener('click', () => completeTask(li));
                li.querySelector('#delete').addEventListener('click', () => deleteTask(li, 'Items'));
            }
        });
        updateCount();
    }
});
