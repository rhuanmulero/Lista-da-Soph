
function addTask() {
    var taskInput = document.getElementById("taskInput");
    var taskText = taskInput.value.trim();
    var dueDate = document.getElementById("dueDate").value;
    var priority = document.getElementById("priority").value;

    if (taskText !== "") {
        var newTask = {
            text: taskText,
            dueDate: dueDate,
            priority: priority,
            notes: "", 
            completed: false 
        };

        var tasks = JSON.parse(localStorage.getItem("tasks")) || [];

        tasks.push(newTask);

        localStorage.setItem("tasks", JSON.stringify(tasks));

        updateTaskList();

        taskInput.value = "";
    }
}

function clearTasks() {
    localStorage.removeItem("tasks");
    updateTaskList(); 
}

function updateTaskList() {
    var taskList = document.getElementById("taskList");
    taskList.innerHTML = ""; 

    var tabContent = document.getElementById("tabContent");
    tabContent.innerHTML = ""; 

    var tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    tasks.forEach(function(task, index) {
        var newTab = document.createElement("button");
        newTab.textContent = task.text;
        newTab.setAttribute("id", "tab" + index);
        newTab.addEventListener('click', function() {
            openTab("tab" + index);
        });
        taskList.appendChild(newTab);

        var newContent = document.createElement("div");
        newContent.innerHTML = `
            <h2>${task.text}</h2>
            <p>Data de Vencimento: ${task.dueDate}</p>
            <p>Prioridade: ${task.priority}</p>
            <textarea id="notes${index}" placeholder="Adicione observações...">${task.notes}</textarea>
            <button onclick="addInfo(${index})">Enviar Informações</button>
            <button onclick="completeTask(${index})">${task.completed ? 'Reabrir Tarefa' : 'Concluir Tarefa'}</button>
        `;
        newContent.setAttribute("id", "content" + index);
        newContent.classList.add("tab-pane");
        tabContent.appendChild(newContent);
    });
}


function addInfo(index) {
    var notes = document.getElementById("notes" + index).value;

    var tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    tasks[index].notes = notes;

    localStorage.setItem("tasks", JSON.stringify(tasks));

    updateTaskList();
}


function completeTask(index) {

    var tasks = JSON.parse(localStorage.getItem("tasks")) || [];


    tasks[index].completed = !tasks[index].completed;


    localStorage.setItem("tasks", JSON.stringify(tasks));

    var message = tasks[index].completed ? 'Tarefa concluída!' : 'Tarefa reaberta!';
    alert(message);


    updateTaskList();
}

function openTab(tabId) {
    var tabs = document.querySelectorAll(".task-list button");
    tabs.forEach(tab => {
        tab.classList.remove("active");
    });

    var tabContents = document.querySelectorAll(".tab-pane");
    tabContents.forEach(content => {
        content.classList.remove("active");
    });

    var tab = document.getElementById (tabId);
    tab.classList.add("active");

    var contentId = tabId.replace("tab", "content");
    var content = document.getElementById(contentId);
    content.classList.add("active");
}


function fetchWeatherSaoVicente() {
    const url = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/S%C3%A3o%20Vicente?unitGroup=us&key=7YB6QY997NUZZ5EMG4TYKJ2ED&contentType=json';

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao buscar a previsão do tempo para São Vicente');
            }
            return response.json();
        })
        .then(weatherData => {

            const temperatureCelsius = (weatherData.days[0].tempmax - 32) * 5 / 9;

            displayWeather(temperatureCelsius, 'São Vicente');
        })
        .catch(error => {
            console.error(error);
            document.getElementById('weather').innerHTML = 'Erro ao buscar a previsão do tempo para São Vicente';
        });
}

function fetchWeatherSaoPaulo() {
    const url = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/S%C3%A3o%20Paulo?unitGroup=us&key=7YB6QY997NUZZ5EMG4TYKJ2ED&contentType=json';

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao buscar a previsão do tempo para São Paulo');
            }
            return response.json();
        })
        .then(weatherData => {

            const temperatureCelsius = (weatherData.days[0].tempmax - 32) * 5 / 9;

            displayWeather(temperatureCelsius, 'São Paulo');
        })
        .catch(error => {
            console.error(error);
            document.getElementById('weather').innerHTML = 'Erro ao buscar a previsão do tempo para São Paulo';
        });
}


function displayWeather(temperatureCelsius, city) {
    const weatherDiv = document.getElementById('weather');
    const weatherHtml = `
        <h2>Previsão do Tempo para ${city}</h2>
        <p>Temperatura: ${temperatureCelsius.toFixed(1)} °C</p>
    `;
    weatherDiv.innerHTML = weatherHtml;
}

window.onload = function() {
    updateTaskList();
    fetchWeatherSaoVicente();
};
