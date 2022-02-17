import { updateTask } from "./main.js";
import { deleteTask } from "./main.js";

export default function (task, index, doValidation = true) {
    // Todo Validation

    // debugger;
    if (doValidation) {
        const result = isValid(task);
        if (result.status === false)
            return result;
    }


    // End Validation

    const li = document.createElement('li');

    li.className = 'task';

    // Div
    const div = document.createElement('div');
    div.className = 'task-box d-flex justify-content-between align-items-center alert alert-dark bg-opacity-50';
    div.setAttribute('role', 'alert');

    // Strong
    const strong = document.createElement('strong');
    strong.appendChild(document.createTextNode(task));

    div.appendChild(strong);

    // Child Div
    const childDiv = document.createElement('div');
    childDiv.className = 'd-flex align-items-center';

    //! Delete Button
    const updateBtn = document.createElement('button');
    updateBtn.className = 'btn btn-primary text-capitalize me-3';

    updateBtn.appendChild(document.createTextNode('update'));

    updateBtn.setAttribute('data-index', index);

    updateBtn.onclick = function () {
        updateTask(this.getAttribute('data-index'));
    };

    childDiv.appendChild(updateBtn);

    //! Delete Button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn-close';

    deleteBtn.setAttribute('data-index', index);

    deleteBtn.onclick = function () {
        deleteTask(this.getAttribute('data-index'));
    };

    childDiv.appendChild(deleteBtn);

    div.appendChild(childDiv);

    li.appendChild(div);

    return {
        status: true,
        result: li
    }
};

export const isValid = function (task) {
    for (let error of ERRORS) {
        if (error.method(task))
            return {
                status: false,
                result: error.msg
            }
    }

    return {
        status: true,
        result: null
    }
}

const ERRORS = [
    {
        msg: `You Can't Add Empty Task Or Only Spaces`,
        method: function (str) {
            return str.trim() ? false : true;
        }
    },
    {
        msg: '',
        method: function (str) {
            let length = 0;
            if (localStorage.getItem('tasksLength') !== undefined)
                length = +localStorage.getItem('tasksLength');
            else
                return false;

            for (let i = 0; i < length; i++) {
                if (str === localStorage.getItem(String(i))) {
                    this.msg = `This Task Is Already Written, Task Number ${i + 1}`;
                    return true;
                }
            }

            return false;
        }
    }
];