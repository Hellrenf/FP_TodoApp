const addBtn = document.querySelector(".add-btn");
const okBtn = document.querySelector(".ok-btn");
const clearBtn = document.querySelector(".clear-btn");
const closeBtn = document.querySelector(".close-icon");
const loginFormSignupBtn = document.querySelector(".log-in-form__sign-up-btn");
const loginFormLoginBtn = document.querySelector(".log-in-form__log-in-btn");
const signupFormSignupBtn = document.querySelector(
  ".sign-up-form__sign-up-btn",
);
const returnBtn = document.querySelector(".return-btn");
const taskInput = document.querySelector(".task-input");
const editTaskInput = document.querySelector(".edit-task-input");
const loginFormUsernameInput = document.querySelector(
  ".log-in-form__username-input",
);
const loginFormPasswordInput = document.querySelector(
  ".log-in-form__password-input",
);
const signupFormUsernameInput = document.querySelector(
  ".sign-up-form__username-input",
);
const signupFormPasswordInput = document.querySelector(
  ".sign-up-form__password-input",
);
const signupFormConfirmPasswordInput = document.querySelector(
  ".sign-up-form__confirm-password-input",
);
const taskListContainer = document.querySelector(".task-list-container");
const todoListContainer = document.querySelector(".todo-list-container");
const overlay = document.querySelector(".overlay");
const editTaskContainer = document.querySelector(".edit-container");
const loginFormContainer = document.querySelector(".log-in-form");
const signupFormContainer = document.querySelector(".sign-up-form");
const errorContainer = document.querySelector(".error-container");
const successContainer = document.querySelector(".success-container");
const errorMsgText = document.querySelector(".error-text");

const loadAccounts = function () {
  return JSON.parse(localStorage.getItem("accounts")) || [];
};

const saveAccounts = function () {
  localStorage.setItem("accounts", JSON.stringify(accounts));
};

let accounts = loadAccounts();
let currentAccount;

const createTask = (task, id = Date.now(), status = "pending") => ({
  task,
  id,
  status,
});

const createTaskList = () => [];

const createAccount = (username, password) => ({
  username,
  password,
  taskList: createTaskList(),
});

const render = function () {
  taskListContainer.innerHTML = "";

  if (!currentAccount?.taskList?.length) return;

  currentAccount.taskList.forEach((task) => {
    const taskDiv = document.createElement("div");
    taskDiv.classList.add("task-container");
    if (task.status === "done") taskDiv.classList.add("completed");
    taskDiv.dataset.taskId = task.id;

    const taskParagraph = document.createElement("p");
    taskParagraph.classList.add("task-paragraph");

    taskParagraph.textContent = task.task;

    taskParagraph.title = task.task;

    taskDiv.appendChild(taskParagraph);

    const btnDiv = document.createElement("div");
    btnDiv.classList.add("buttons-container");

    const btnTexts = ["Toggle", "Edit", "Delete"];

    btnTexts.forEach((text) => {
      const btn = document.createElement("button");
      btn.textContent = text;

      btn.classList.add("buttons-container-btn");

      if (btn.textContent === "Toggle") btn.classList.add("toggle-btn");
      else if (btn.textContent === "Edit") btn.classList.add("edit-btn");
      else if (btn.textContent === "Delete") btn.classList.add("delete-btn");

      btnDiv.appendChild(btn);
    });

    taskDiv.appendChild(btnDiv);

    taskListContainer.appendChild(taskDiv);
  });
};

const toggleForm = function () {
  const loginDisplay = getComputedStyle(loginFormContainer).display;

  if (loginDisplay === "none") {
    loginFormContainer.style.display = "flex";
    signupFormContainer.style.display = "none";
  } else {
    loginFormContainer.style.display = "none";
    signupFormContainer.style.display = "flex";
  }
};

loginFormSignupBtn.addEventListener("click", () => {
  toggleForm();
});

returnBtn.addEventListener("click", () => {
  toggleForm();
});

let messageIsVisible = false;

const hideMessage = function (isSuccess = false) {
  const container = isSuccess ? successContainer : errorContainer;
  container.style.transform = "translateY(-200%)";

  setTimeout(() => {
    container.style.display = "none";
    messageIsVisible = false;
  }, 500);
};

let message = "";

const showMessage = function (isSuccess = false) {
  messageIsVisible = true;

  const container = isSuccess ? successContainer : errorContainer;
  if (!isSuccess) errorMsgText.textContent = message;

  container.style.display = "flex";

  setTimeout(() => {
    container.style.transform = "translateY(-50%)";
  }, 10);

  setTimeout(() => hideMessage(isSuccess), 5000);
};

const toggleEyeBtn = function (inputContainer, loginForm = true) {
  if (!loginForm) {
    inputContainer
      .querySelector(".sign-up-form__eye-btn")
      .classList.toggle("active");
    inputContainer.querySelector(".closed").classList.toggle("active");
  } else {
    inputContainer.querySelector(".eye-btn").classList.toggle("active");
    inputContainer.querySelector(".closed").classList.toggle("active");
  }
};

const togglePasswordVisibility = function (e, loginForm = true) {
  const target = e.target;
  if (
    !target.classList.contains(loginForm ? "eye-btn" : "sign-up-form__eye-btn")
  )
    return;

  const eyeBtn = target.closest(
    loginForm ? ".eye-btn" : ".sign-up-form__eye-btn",
  );
  const passwordInputContainer = target.closest(".password-input-container");
  const passwordInput = passwordInputContainer.querySelector(".password-input");

  passwordInput.type = eyeBtn.classList.contains("closed")
    ? "password"
    : "text";

  toggleEyeBtn(passwordInputContainer, loginForm);
};

loginFormContainer.addEventListener("click", (e) => {
  togglePasswordVisibility(e);
});

signupFormContainer.addEventListener("click", (e) => {
  togglePasswordVisibility(e, false);
});

const validUsernameChars = /^(?![0-9_])[a-zA-Z0-9_]{3,20}$/;
const validPasswordChars = /^[A-Za-z0-9@$!%*?&]{8,20}$/g;

const getAccount = (username) =>
  accounts.find((account) => account.username === username);

const isUsernameValid = function (username) {
  const accAlreadyInUse = getAccount(username);
  if (accAlreadyInUse) {
    message = "Username is already in use.";
    return false;
  }
  if (!username.trim()) {
    message = "Username cannot be empty.";
    return false;
  }
  if (!validUsernameChars.test(username)) {
    message =
      "Username must be 3-20 characters long, start with a letter, and contain only Latin letters, digits, and '_'.";
    return false;
  }

  return true;
};

const isPasswordValid = function (password) {
  if (!password.trim()) {
    message = "Password cannot be empty.";
    return false;
  }
  if (!validPasswordChars.test(password)) {
    message =
      "Password must be 8-20 characters long and contain only allowed characters.";
    return false;
  }
  return true;
};

signupFormSignupBtn.addEventListener("click", (e) => {
  e.preventDefault();

  const username = signupFormUsernameInput.value;
  const password = signupFormPasswordInput.value;
  const confirmationPassword = signupFormConfirmPasswordInput.value;

  if (!isUsernameValid(username)) {
    if (!messageIsVisible) {
      showMessage();
    }
    return;
  }

  if (!isPasswordValid(password)) {
    if (!messageIsVisible) {
      showMessage();
    }
    return;
  }

  if (confirmationPassword !== password) {
    message = "Passwords do not match";
    showMessage();
    return;
  }

  accounts = [...accounts, createAccount(username, password)];
  saveAccounts();
  showMessage(true);
  toggleForm();
  signupFormUsernameInput.value = "";
  signupFormPasswordInput.value = "";
  signupFormConfirmPasswordInput.value = "";
});

loginFormLoginBtn.addEventListener("click", (e) => {
  e.preventDefault();

  const username = loginFormUsernameInput.value;
  const password = loginFormPasswordInput.value;

  if (!username.trim()) {
    if (!messageIsVisible) {
      message = "Username cannot be empty.";
      showMessage();
    }
    return;
  }

  if (!password.trim()) {
    if (!messageIsVisible) {
      message = "Password cannot be empty.";
      showMessage();
    }
    return;
  }

  const acc = getAccount(username);

  if (!acc || password !== acc.password) {
    if (!messageIsVisible) {
      message = "Wrong login or password.";
      showMessage();
    }
    return;
  }

  overlay.classList.remove("active");
  todoListContainer.style.display = "flex";

  loginFormContainer.style.display = "none";

  currentAccount = acc;
  render();
});

const cleanInputValue = (inputValue) =>
  inputValue.trim()[0].toUpperCase() + inputValue.slice(1);

const addTask = function (task) {
  currentAccount.taskList = [...currentAccount.taskList, task];
};

const handleAddTask = function () {
  const taskInputValue = taskInput.value;
  if (!taskInputValue.trim()) return;

  const text = cleanInputValue(taskInputValue);

  addTask(createTask(text));
  taskInput.value = "";
  saveAccounts();
  render();
};

addBtn.addEventListener("click", () => {
  handleAddTask();
});

taskInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    handleAddTask();
  }
});

const toggleTaskStatus = function (task) {
  if (task.status === "pending") {
    task.status = "done";
  } else {
    task.status = "pending";
  }
  saveAccounts();
  render();
};

const deleteTask = function (taskId) {
  currentAccount.taskList = currentAccount.taskList.filter(
    (task) => task.id !== Number(taskId),
  );
};

const handleDeleteTask = function (taskId) {
  deleteTask(taskId);
  saveAccounts();
  render();
};

const getTask = (taskId) =>
  currentAccount.taskList.find((t) => t.id === Number(taskId));

const handleEditTask = function (taskId) {
  const editTaskInputValue = editTaskInput.value;
  if (!editTaskInputValue.trim()) return;

  const editedText = cleanInputValue(editTaskInputValue);

  const task = getTask(taskId);

  task.task = editedText;
  saveAccounts();
};

const toggleEditModal = function () {
  if (overlay.classList.contains("active")) {
    overlay.classList.remove("active");
    editTaskContainer.classList.remove("active");
    closeBtn.classList.remove("active");
  } else {
    overlay.classList.add("active");
    editTaskContainer.classList.add("active");
    closeBtn.classList.add("active");
  }
};

const clearCompletedTasks = function () {
  currentAccount.taskList = currentAccount.taskList.filter(
    (task) => task.status === "pending",
  );
};

clearBtn.addEventListener("click", () => {
  clearCompletedTasks();
  render();
});

taskListContainer.addEventListener("click", (e) => {
  const target = e.target;
  if (!target.classList.contains("buttons-container-btn")) return;

  const taskContainer = target.closest(".task-container");
  const taskId = taskContainer.dataset.taskId;
  const task = getTask(taskId);

  if (target.classList.contains("toggle-btn")) {
    toggleTaskStatus(task);
  } else if (target.classList.contains("delete-btn")) {
    handleDeleteTask(taskId);
  } else if (target.classList.contains("edit-btn")) {
    toggleEditModal();
    editTaskInput.value = task.task;
    editTaskContainer.dataset.editId = taskId;
  }
});

const getTaskId = () => editTaskContainer.dataset.editId;

okBtn.addEventListener("click", () => {
  const taskId = getTaskId();
  handleEditTask(taskId);
  toggleEditModal();
  render();
});

editTaskInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const taskId = getTaskId();
    handleEditTask(taskId);
    toggleEditModal();
    render();
  }
});
