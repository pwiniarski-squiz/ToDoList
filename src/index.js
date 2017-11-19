//import _ from 'lodash';
import './style.css';
import Icon from './search-icon.png';
require("font-awesome-webpack");

var taskList = document.getElementById('taskList');
var taskElements = document.getElementsByClassName('taskItem');
var addTask = document.getElementById('addTask');
var clearTasks = document.getElementById('clearList');
var UID = 1;
var dragSrcEl = null;

/* Drag and Drop events */
function dragStart(e) {
    this.style.opacity = '0.4';
    dragSrcEl = this;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
};

function dragEnter(e) {
    this.classList.add('over');
}

function dragLeave(e) {
    e.stopPropagation();
    this.classList.remove('over');
}

function dragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    return false;
}

function dragDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation(); // Stops some browsers from redirecting.
    }

    // Don't do anything if dropping the same column we're dragging.
    if (dragSrcEl != this) {
        // Set the source column's HTML to the HTML of the column we dropped on.
        dragSrcEl.innerHTML = this.innerHTML;
        this.innerHTML = e.dataTransfer.getData('text/html');
    }

    return false;
}

function dragEnd(e) {
    var listItens = document.querySelectorAll('.taskItem');
    [].forEach.call(listItens, function(item) {
        item.classList.remove('over');
    });
    this.style.opacity = '1';

}

function addEventsDragAndDrop(el) {
    el.addEventListener('dragstart', dragStart, false);
    el.addEventListener('dragenter', dragEnter, false);
    el.addEventListener('dragover', dragOver, false);
    el.addEventListener('dragleave', dragLeave, false);
    el.addEventListener('drop', dragDrop, false);
    el.addEventListener('dragend', dragEnd, false);
}

/* Drag and Drop events ends */

function createTask(description) {
    this.id = UID++;
    this.description = description;
    this.isCompleted = false;
}

function createCheckbox() {
    var checkbox = document.createElement('div');
    checkbox.setAttribute('class', 'checkbox');
    var icon = document.createElement('i');
    icon.setAttribute('class', 'unmarked fa fa-check');
    checkbox.appendChild(icon);
    return checkbox;
}

function createSpan(desc) {
    var taskelspan = document.createElement('span');
    taskelspan.appendChild(document.createTextNode(desc));
    return taskelspan;
}

function createButton() {
    var removeBtn = document.createElement('i');
    removeBtn.setAttribute('class', 'taskItem__remove fa fa-close');
    return removeBtn;
}

function addTaskToList() {
    var task = document.getElementById('task');
    var taskel = document.createElement('li');
    var taskModel = new createTask(task.value);
    var checkbox = createCheckbox();
    var span = createSpan(taskModel.description);
    var removeBtn = createButton();

    taskel.setAttribute('data-id', taskModel.id);
    taskel.setAttribute('data-state', taskModel.isCompleted);
    taskel.setAttribute('draggable', true);
    taskel.setAttribute('class', 'taskItem')
    taskel.appendChild(checkbox);
    taskel.appendChild(span);
    taskel.appendChild(removeBtn);
    taskList.appendChild(taskel);
    //addEventsDragAndDrop(taskel);

}

function removeTaskFromList(button, el) {
    if (confirm('Chcesz usunąć element listy ?')) {
        el.classList.add('removed');
        setTimeout(function() { taskList.removeChild(el); }, 800);
        button.removeEventListener('click', removeTaskFromList);
        el.classList.remove('removed');
    }
}

function markTask(el) {
    if (el.target.getAttribute('class').includes('unmarked')) {
        console.log('marked');
        el.target.classList.remove('unmarked');
        el.target.classList.add('marked');
    } else {
        console.log('unmarked');
        el.target.classList.remove('marked');
        el.target.classList.add('unmarked');
    }
}

function clearList() {
    taskList.innerHTML = '';
    taskList.classList.remove('removed');
}

// var observer = new MutationObserver(function(mutations) {  
//     mutations.forEach(function(mutation) {    
//         console.log('Mutation type: ' + mutation.type);    
//         if (mutation.type == 'childList') {    
//             if (mutation.addedNodes.length >= 1) {
//                 if (mutation.addedNodes[0].nodeName != '#text') {          
//                     console.log('Added ' + mutation.addedNodes[0].tagName + ' tag.');        
//                 }      
//             }      
//             else if (mutation.removedNodes.length >= 1) {  
//                 console.log('Removed ' + mutation.removedNodes[0].tagName + ' tag.')      
//             }    
//         }    
//         else if (mutation.type == 'attributes') {       console.log('Modified ' + mutation.attributeName + ' attribute.')     }        
//     });  
// });  
// var observerConfig = {        
//     attributes: true,
//             childList: true,
//             characterData: true
// };  
// observer.observe(taskList, { childList: true, subtree: true });
// observer.disconnect();

function updateList(el, buttonclassList) {
    var button = el.target;
    var parent = el.target.parentElement;
    if (el.target.classList.value.includes('remove')) {
        button.addEventListener('click', function(e) {
            removeTaskFromList(button, parent);
        }, true);
    } else {
        button.addEventListener('click', function(e) {
            markTask(e);
            e.stopImmediatePropagation();
        }, true);
    }
}


document.addEventListener("DOMContentLoaded", () => {
    addTask.addEventListener('click', addTaskToList);
    taskList.addEventListener('click', function(e) {
        if (taskList.children) {
            if (e.target.nodeName === 'I') {
                updateList(e, e.target.classList);
            }
        } else {
            e.stopImmediatePropagation();
        }
    }, true);
    taskList.addEventListener('mousedown', function(e) {
        if (taskList.children) {
            if (e.target.nodeName === 'LI') {
                addEventsDragAndDrop(e.target);
            }
        }
    }, false);
    clearTasks.addEventListener('click', function() {
        if (confirm('Chcesz usunąć wszystkie elementy listy ?')) {
            taskList.classList.add('removed');
            setTimeout(clearList, 800);
        }
    });
});