let header = document.querySelector("h1")
let addBtn = document.querySelector("button")
let input = document.querySelector("input")
let listOfTasks = document.querySelector(".tasks-list")
let progressBar = document.getElementById("progress")
let number = document.getElementById("number")
let completeBtn = document.getElementById("complete-btn")
let inCompleteBtn = document.getElementById("incomplete-btn")
let notifyBox = document.getElementById("notifyBox")

let date = new Date()
let weekday = new Array(7);
weekday[0] = "Sunday 🖖";
weekday[1] = "Monday 💪😀";
weekday[2] = "Tuesday 😜";
weekday[3] = "Wednesday 😌☕️";
weekday[4] = "Thursday 🤗";
weekday[5] = "Friday 🍻";
weekday[6] = "Saturday 😴";

let randomWordArray = Array(
    "Oh my, it's ",
    "Whoop, it's ",
    "Happy ",
    "Seems it's ",
    "Awesome, it's ",
    "Have a nice ",
    "Happy fabulous ",
    "Enjoy your "
);

let day = weekday[date.getDay()]
let randomWord = randomWordArray[Math.floor(Math.random() * randomWordArray.length)];

header.innerHTML = randomWord + day;

//Empty Array to store tasks
let arrayOfTasks = [];

//save Tasks in LocalStorage
let saveTasksLocalstorage = () => {
    localStorage.setItem("tasks", JSON.stringify(arrayOfTasks))
}
// add new task
let addTask = () => {
    if (input.value.trim()) {
        arrayOfTasks.push({
            id: Date.now(),
            taskName: input.value.trim(),
            completed: false,
            new: true,
            edit:false
        })
    }
    addTaskToList();
    updateState()
    saveTasksLocalstorage()
    notify("Task Added ✔")

}
// make task completed and add some animation 
let completeTask = (index) => {
    arrayOfTasks[index].completed = !arrayOfTasks[index].completed
    addTaskToList()
    updateState()

    let taskItem = listOfTasks.children[index].querySelector('.item');
    // Add the animation class
    taskItem.classList.add('flipInX');
    setTimeout(() => {
        taskItem.classList.remove('flipInX');
    }, 500);
    saveTasksLocalstorage()
}
// delete task 
let deleteTask = (id, index) => {
    let taskItem = listOfTasks.children[index].querySelector('.item');
    taskItem.classList.add('slide-out');
    setTimeout(() => {
        arrayOfTasks = arrayOfTasks.filter(task => task.id != id);
        addTaskToList();
        updateState();
        saveTasksLocalstorage();
    }, 500);
    notify("Task Deleted 👍")
}
// edit task and modify it then push it 
let editTask = (id, index) => {
    input.value = arrayOfTasks[index].taskName
    console.log()
    arrayOfTasks = arrayOfTasks.filter(task => task.id != id)
    addTaskToList()
    updateState()
    saveTasksLocalstorage()
    notify("Task Will be Edited 👌")
}

//update progressbar

let updateState = () => {
    let completeTasks = arrayOfTasks.filter((task) => task.completed).length
    let totalTasks = arrayOfTasks.length
    let progress = (completeTasks / totalTasks) * 100
    progressBar.style.width = `${progress}%`
    number.innerHTML = `${completeTasks}/${totalTasks}`
}

// add all tasks to the page 

let addTaskToList = () => {
    listOfTasks.innerHTML = ""

    arrayOfTasks.forEach((task, index) => {
        let listItem = document.createElement("li")
        listItem.innerHTML =
            `
        <div class="item ${task.new ? 'flipInX' : ''} ${task.completed ? "complete" : ""}">
            <div class="${task.completed ? "completed" : ""}">
                <input type="checkbox" ${task.completed ? "checked" : ""}>
                <p>${task.taskName}</p>
            </div>
            <div class="icons">
                <i class="fa-solid fa-pen-to-square update" onClick="editTask(${task.id},${index})"></i>
                <i class="fa-solid fa-trash delete" onClick="deleteTask(${task.id},${index})"></i>
            </div>
        </div>
        `
        listItem.addEventListener("change", () => completeTask(index))
        listOfTasks.append(listItem)
        if (task.new) {
            setTimeout(() => {
                listItem.querySelector('.item').classList.remove('flipInX');
                task.new = false;
            }, 1500);
        }
    })
}
// addbtn (+) actions
addBtn.onclick = (e) => {
    e.preventDefault()
    addTask();
    input.value = ""
}
// make notification if any update or delete or adding tasks
let notify = (msg) => {
    let toast = document.createElement("div")
    toast.classList.add("toast")
    toast.innerHTML = msg
    notifyBox.appendChild(toast)
    if (msg.includes("Edited")) {
        toast.classList.add("edited")
    }
    else if (msg.includes("Deleted")) {
        toast.classList.add("deleted")
    }
    setTimeout(() => {
        toast.remove()
    }, 2000)
}
// view all complete tasks
let viewCompleteTasks = () => {
    listOfTasks.innerHTML = ""
    let completedTasks = arrayOfTasks.filter((task) => task.completed === true)
    completedTasks.forEach((task, index) => {
        let listItem = document.createElement("li")
        listItem.innerHTML =
            `
        <div class="item ${task.completed ? "complete" : ""}">
            <div class="${task.completed ? "completed" : ""}">
                <input type="checkbox" ${task.completed ? "checked" : ""}>
                <p>${task.taskName}</p>
            </div>
            <div class="icons">
                <i class="fa-solid fa-pen-to-square update" onClick="editTask(${task.id})"></i>
                <i class="fa-solid fa-trash delete" onClick="deleteTask(${task.id},${index})"></i>
            </div>
        </div>
        `
        listItem.addEventListener("change", () => completeTask(index))
        listOfTasks.append(listItem)

    })
}

// view all incomplete tasks
let viewInCompleteTasks = () => {
    listOfTasks.innerHTML = ""
    let completedTasks = arrayOfTasks.filter((task) => task.completed === false)
    completedTasks.forEach((task, index) => {
        let listItem = document.createElement("li")
        listItem.innerHTML =
            `
        <div class="item ">
            <div >
                <input type="checkbox" >
                <p>${task.taskName}</p>
            </div>
            <div class="icons">
                <i class="fa-solid fa-pen-to-square update" onClick="editTask(${task.id})"></i>
                <i class="fa-solid fa-trash delete" onClick="deleteTask(${task.id},${index})"></i>
            </div>
        </div>
        `
        listItem.addEventListener("change", () => completeTask(index))
        listOfTasks.append(listItem)

    })
}
//get tasks from localstorage 
if (localStorage.getItem("tasks")) {
    arrayOfTasks = JSON.parse(localStorage.getItem("tasks"));
    console.log(arrayOfTasks)
    addTaskToList()
    updateState()
}

// completeBtn action
completeBtn.onclick = () => {
    completeBtn.classList.toggle('active');
    completeBtn.classList.toggle('inactive');

    if (completeBtn.classList.contains('active')) {
        viewCompleteTasks()
    } else {
        addTaskToList()
        updateState()
        saveTasksLocalstorage()
    }
}
completeBtn.classList.add('inactive');

// incompleteBtn action

inCompleteBtn.onclick = () => {
    inCompleteBtn.classList.toggle('active');
    inCompleteBtn.classList.toggle('inactive');

    if (inCompleteBtn.classList.contains('active')) {
        viewInCompleteTasks()
    } else {
        addTaskToList()
        updateState()
        saveTasksLocalstorage()
    }
}
inCompleteBtn.classList.add('inactive');
