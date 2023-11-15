// Função para carregar tarefas salvas localmente
function loadTasks(darkMode) {
    var savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
        var tasks = JSON.parse(savedTasks);

        tasks.forEach(function (task) {
            addTaskToDOM(task.column, task.text, task.completed, task.number, task.darkMode);
        });
    } else {
        // Se não houver tarefas salvas, adicione as tarefas padrão ao DOM
        addTaskToDOM(1, 'Default Task 1', false, null);
        addTaskToDOM(2, 'Default Task 2', true, 0);
    }

    applyDarkMode(darkMode);
}

// Função para salvar tarefas localmente
function saveTasks() {
    var tasks = [];
    var columns = document.querySelectorAll('.task-list');

    columns.forEach(function (column, columnIndex) {
        var tasksInColumn = column.querySelectorAll('.task');

        tasksInColumn.forEach(function (task) {
            var textElement = task.querySelector('span');
            var text = textElement ? textElement.textContent || textElement.innerText : '';

            var completed = task.classList.contains('completed');
            var number = task.querySelector('input[type="number"]').value || null;

            tasks.push({
                column: columnIndex + 1,
                text: text,
                completed: completed,
                number: number
            });
        });
    });

    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Função para adicionar uma tarefa ao DOM
function addTaskToDOM(column, text, completed, number, darkMode) {
    var listId = (column === 1) ? "list1" : (column === 2) ? "list2" : "list1";
    var taskList = document.getElementById(listId);
    var taskItem = document.createElement("li");

    taskItem.className = "task";

    if (completed) {
        taskItem.classList.add("completed");
    } else {
        taskItem.style.backgroundColor = '#fff'; // Defina a cor de fundo como branca para tarefas não concluídas
    }

    setTaskBackground(taskItem, number, completed, modeSwitch.checked);

    taskItem.innerHTML = `
        <div class="task-content">
            <span id="taskName" contenteditable="true">${text}</span>
        </div>
        <input type="number" placeholder="Ep/Cap/Nota" value="${number || ''}" oninput="updateNumber(this)">
        <button id="trash" onclick="removeTask(this)"><img style="filter: invert(1);" width="100%" src="trash.png"></button>
    `;

    taskList.appendChild(taskItem);

    // Configura o evento de clique para marcar como concluído
    taskItem.addEventListener('click', function () {
        taskItem.classList.toggle("completed");
        saveTasks();
    });

    // Configura o evento personalizado para o elemento de texto da tarefa
    setupTextChangeEvent(taskItem.querySelector('.task-content span'), darkMode);
}

// Função para definir o fundo da tarefa com base no número
function setTaskBackground(taskItem, number, completed) {
    var backgroundColor;

    // Modo claro
    if (number === null) {
        backgroundColor = '#fff'; // Fundo branco se o número for nulo
    } else if (number === 0 && !completed) {
        backgroundColor = '#f57878'; // Fundo vermelho claro se o número for 0
    } else if (number > 0 && !completed) {
        backgroundColor = '#e6c477'; // Fundo amarelo claro para outros valores
    } else if (completed) {
        backgroundColor = '#c3f0aa'; // Fundo verde claro para tarefas concluídas
    }

    taskItem.style.backgroundColor = backgroundColor;
}
// Função para atualizar o número de uma tarefa
function updateNumber(input) {
    var taskItem = input.closest('.task');
    if (taskItem) {
        var number = input.valueAsNumber;
        setTaskBackground(taskItem, number);

        // Adicione a verificação para voltar ao branco se o número for nulo
        if (number === null) {
            taskItem.classList.remove("completed"); // Remova a classe completed se o número for nulo
        }

        saveTasks(); // Salva as tarefas sempre que o número da tarefa for alterado
    }
}

// Adiciona evento personalizado para alterações no texto da tarefa
function setupTextChangeEvent(element) {
    element.addEventListener('input', function () {
        saveTasks(); // Salva as tarefas sempre que o texto da tarefa for alterado
    });
}

// Função para adicionar uma tarefa
function addTask(column) {
    var taskInput = document.getElementById("taskInput");
    var taskText = taskInput.value.trim();

    if (taskText === "") {
        alert("fala ae quale o anime/manga");
        return;
    }

    if (column !== 0) {
        addTaskToDOM(column, taskText, false);
        saveTasks();
        taskInput.value = "";
    } else {
        addTaskToDOM(1, taskText, false);
        saveTasks();
        taskInput.value = "";

        addTaskToDOM(2, taskText, false);
        saveTasks();
        taskInput.value = "";
    };
}

// Função para remover uma tarefa
function removeTask(button) {
    var taskItem = button.parentNode;
    taskItem.parentNode.removeChild(taskItem);
    saveTasks();
}

// Função para marcar/desmarcar uma tarefa como concluída
function completeTask(checkbox) {
    var taskItem = checkbox.closest('.task');
    if (taskItem) {
        taskItem.classList.toggle("completed", checkbox.checked);
        saveTasks();
    }
}

function toTop() {
    window.scrollTo({top: 0, behavior: 'smooth'});
}


function toggleDarkMode() {
    const body = document.body;
    const taskItems = document.querySelectorAll('.task');
    const modeSwitch = document.getElementById('ui-switch');

    body.classList.toggle('dark-mode', modeSwitch.checked); // Adiciona ou remove a classe 'dark-mode' com base no estado do switch

    // Atualiza a cor de fundo das tarefas com base no modo escuro
    taskItems.forEach(taskItem => {
        const numberInput = taskItem.querySelector('input[type="number"]');
        const number = numberInput.valueAsNumber;
        setTaskBackground(taskItem, number, taskItem.classList.contains('completed'), modeSwitch.checked);
        
        // Atualiza a cor do texto dentro das tarefas com base no modo escuro
        const taskContent = taskItem.querySelector('.task-content span');
        taskContent.style.color = '#000';
    });

     // Salva o estado do modo escuro
     localStorage.setItem('darkMode', modeSwitch.checked);
}
// Adicione o evento de alteração do modo escuro
const modeSwitch = document.getElementById('ui-switch');
modeSwitch.addEventListener('change', () => {
    const body = document.body;
    const taskContents = document.querySelectorAll('.task-content');

    toggleDarkMode();

    body.style.backgroundColor = modeSwitch.checked ? '#212121' : '#fff';
    body.style.color = modeSwitch.checked ? '#fff' : '#000';

    // Atualiza a cor do texto nas tarefas com base no modo escuro
    taskContents.forEach(taskContent => {
        taskContent.style.color = '#000';
    });
});

// Função para aplicar o modo escuro ou claro ao corpo da página
function applyDarkMode(darkMode) {
    const body = document.body;
    const taskItems = document.querySelectorAll('.task');
    const taskContents = document.querySelectorAll('.task-content span');

    body.classList.toggle('dark-mode', darkMode);

    // Atualiza a cor de fundo e o texto das tarefas com base no modo escuro
    taskItems.forEach(taskItem => {
        const numberInput = taskItem.querySelector('input[type="number"]');
        const number = numberInput.valueAsNumber;
        setTaskBackground(taskItem, number, taskItem.classList.contains('completed'), darkMode);

        const taskContent = taskItem.querySelector('.task-content span');
        taskContent.style.color = '#000';
    });
}

// Carregar tarefas ao abrir a página
document.addEventListener("DOMContentLoaded", function () {
    const modeSwitch = document.getElementById('ui-switch');

    // Obter o estado do modo escuro do localStorage
    const initialDarkMode = localStorage.getItem('darkMode') === 'true';

    // Configurar o estado inicial do modeSwitch
    modeSwitch.checked = initialDarkMode;

    // Aplicar o modo escuro ou claro ao corpo da página
    applyDarkMode(initialDarkMode);

    // Carregar tarefas com o estado inicial do modo escuro
    loadTasks(initialDarkMode);
});

// Adicione o evento de alteração do modo escuro
modeSwitch.addEventListener('change', () => {
    const darkMode = modeSwitch.checked;
    
    // Aplica o modo escuro ou claro ao corpo da página
    applyDarkMode(darkMode);

    // Salva o estado do modo escuro no localStorage
    localStorage.setItem('darkMode', darkMode);
});
