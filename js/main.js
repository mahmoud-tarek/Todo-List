import createTaskNode, { isValid } from './template.js';

const taskInput = document.getElementById('taskInput');
const taskBtn = document.getElementById('taskBtn');
const taskItems = document.getElementById('taskItems');
const deleteAll = document.getElementById('deleteAll');

const taskList = [];


// ============ Start IIFE ============
(function () {
    if (localStorage.getItem('tasksLength')) {

        for (let i = 0; i < +localStorage.getItem('tasksLength'); i++)
            taskList.push(localStorage.getItem(String(i)));
    }

    for (let i = 0; i < taskList.length; i++) {
        const item = createTaskNode(taskList[i], i, false);
        if (item.status)
            taskItems.appendChild(item.result);
        else
            alert(item.result);
    }

    if (taskList.length === 0)
        deleteAll.setAttribute('disabled', 'true');

})();
// ============ End IIFE   ============

//* Add Task
taskBtn.addEventListener('click', function () {

    if (this.innerText === 'Update Task')
        return;

    const taskNode = createTaskNode(taskInput.value, taskList.length);

    // debugger;
    // Todo Validation
    if (!taskNode.status) {
        alert(taskNode.result);
        return;
    }

    deleteAll.removeAttribute('disabled');

    taskList.push(taskInput.value);

    localStorage.setItem(taskList.length - 1, taskInput.value);
    localStorage.setItem('tasksLength', String(taskList.length));


    taskItems.appendChild(taskNode.result);


    taskInput.value = '';
});


// Update Task
export function updateTask(index) {

    const tasks = document.querySelectorAll('.task');
    const subTitle = document.getElementById('subTitle');
    index = +index;

    let taskItem = tasks[index].querySelector('strong');

    taskInput.value = taskItem.innerText;

    subTitle.classList.remove('d-none');

    subTitle.innerText = 'update task';

    taskBtn.innerText = 'update task';

    taskBtn.onclick = function () {
        if (taskBtn.innerText === 'Update Task') {
            const task = taskInput.value;
            const result = isValid(task);
            if (result.status) {
                taskItem.innerText = task;
                taskList[index] = task;
                localStorage.setItem(String(index), task);

                subTitle.classList.add('d-none');
                taskBtn.innerText = 'Add Task';
                taskInput.value = '';
            }
            else
                alert(result.result);
        }
    }

};

//! Delete Task
export function deleteTask(index) {

    const tasks = document.querySelectorAll('.task');
    index = +index;

    $(tasks[index]).slideUp(500, function () {
        this.remove();
    });
    // tasks[index].remove();

    taskList.splice(index, 1);

    if (taskList.length === 0)
        deleteAll.setAttribute('disabled', 'true');

    for (let i = index + 1; i < tasks.length; i++)
        tasks[i].querySelector('.btn-close').setAttribute('data-index', String(i - 1));


    localStorage.clear();
    for (let i = 0; i < taskList.length; i++)
        localStorage.setItem(String(i), taskList[i]);

    localStorage.setItem('tasksLength', String(taskList.length));

};

//! Delete All
deleteAll.onclick = function () {
    $(taskItems).slideUp(800, function () {
        taskItems.innerHTML = '';
        taskItems.style.display = 'block';
    });

    taskList.splice(0, taskList.length);

    localStorage.clear();

    deleteAll.setAttribute('disabled', 'true');
}
