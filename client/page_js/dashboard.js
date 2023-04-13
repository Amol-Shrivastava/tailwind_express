// const moment = require("moment");
import { logoutUser } from "../util/auth.js";
import {
  showForm,
  hideForm,
  blurIn,
  blurOut,
  createListItems,
  removeListItems,
  addWaitingDiv,
  removeWaitingDiv,
} from "../util/domlib.js";
import { apiCall } from "../util/routerCalls.js";
import { clearForm, formatDate } from "../util/valueCheck.js";

const userNameEl = document.getElementById("username");
const logoutBtn = document.getElementById("logoutBtn");
const addTaskBtn = document.getElementById("addTasksBtn");

// Page Elements
const navBar = document.getElementById("navbar_dashboard");
const mainContent = document.getElementById("mainContentContainer");
const searchBar = document.getElementById("search_bar");
const loadMoreBtn = document.getElementById("load_more");

//List Elements
const list_box = document.getElementById("list_box");

// Form Elements
const newTaskForm = document.getElementById("task_form");
const formTitle = document.getElementById("formTitle");
const titleIpt = document.getElementById("task_title");
const descIpt = document.getElementById("task_desc");
const statusIpt = document.getElementById("task_status_show");
const task_status_div = document.getElementById("task_status");
const task_status_selected = document.getElementById("status_selected");
const dateIpt = document.getElementById("task_completion_date");
const taskSubmitBtn = document.getElementById("task_submit_btn");
const taskCancelBtn = document.getElementById("task_cancel_btn");
const dateShowVal = document.getElementById("dateShowBox");

//CONFIRMATION BOX ELEMENTS
const confirmationBox = document.getElementById("confirmation_box");
const confirmationAction = document.getElementById("confirmation_action");
const confirmationOKBtn = document.getElementById("confirmation_ok_btn");
const confirmationCancelBtn = document.getElementById(
  "confirmation_cancel_btn"
);

const task_optionsList = document.getElementById("options_list");
let selectedItemId = null;

let taskArr = null;
let page = 1;

onload = async (event) => {
  if (localStorage.getItem("username")) {
    const userName = localStorage.getItem("username");
    userNameEl.innerHTML = userName;
  }

  const { success, msg } = await _loadAllList();
  addWaitingDiv();
  if (success) {
    taskArr = msg;
    // new Date(meet.date).toLocaleString();
    taskArr = taskArr.map((el) =>
      el.completionDate
        ? {
            ...el,
            completionDate: new Date(el.completionDate).toLocaleString(),
          }
        : el
    );
    removeWaitingDiv();
    for (let i = 0; i < taskArr.length; i++) {
      createListItems(taskArr[i].title, taskArr[i]._id, taskArr[i].status);
    }
  } else {
    removeWaitingDiv();
    alert(msg);
  }
};

logoutBtn.addEventListener("click", logoutUser);

searchBar.addEventListener("input", searchHandler);

//SEARCH HANDLER
async function searchHandler(e) {
  let qVal = e.target.value;
  if (qVal) {
    const res = await fetch(`http://localhost:4000/tasks/search/${qVal}`, {
      METHOD: "GET",
    });
    const { success, msg } = await res.json();
    addWaitingDiv();
    if (success) {
      taskArr = msg;
    } else {
      alert(msg);
    }
  } else {
    const { success, msg } = await _loadAllList();

    if (success) {
      taskArr = msg;
    }
  }

  taskArr = taskArr.map((el) =>
    el.completionDate
      ? {
          ...el,
          completionDate: new Date(el.completionDate).toLocaleString(),
        }
      : el
  );
  removeWaitingDiv();
  removeListItems("list_box");
  for (let i = 0; i < taskArr.length; i++) {
    createListItems(taskArr[i].title, taskArr[i]._id, taskArr[i].status);
  }
}

//----FORM SHOW FORM HIDE
addTaskBtn.addEventListener("click", () => {
  //DOM MANIPULATION
  blurIn(navBar);
  blurIn(mainContent);

  formTitle.innerHTML = "Add a Task";
  task_status_div.classList.remove("hidden");
  statusIpt.classList.add("hidden");
  taskSubmitBtn.classList.remove("hidden");
  dateIpt.classList.remove("hidden");
  _clearForm();
  showForm(newTaskForm, "add", taskSubmitBtn);
});

taskSubmitBtn.addEventListener("click", (e) => {
  //DOM MANIPULATION
  blurIn(newTaskForm);
  confirmationAction.innerHTML = "Save";
  showForm(confirmationBox);
});

taskCancelBtn.addEventListener("click", (e) => {
  hideForm(newTaskForm);
  blurOut(navBar);
  blurOut(mainContent);
});

task_status_div.addEventListener("click", (e) => {
  showForm(task_optionsList);
});

task_optionsList.addEventListener("click", (e) => {
  const selectedStatus = e.target.id;
  task_status_selected.innerHTML = selectedStatus;
  statusIpt.value = selectedStatus;
});

newTaskForm.addEventListener("click", (e) => {
  if (
    task_optionsList.classList.contains("scale-y-100") &&
    e.target.id != "task_status"
  ) {
    hideForm(task_optionsList);
  }
});
//----FORM SHOW FORM HIDE

//----LIST BOX CLICK
list_box.addEventListener("click", (e) => {
  if (e.target.id == "edit_task_btn") {
    blurIn(navBar);
    blurIn(mainContent);

    formTitle.innerHTML = "Edit Task";
    _editFormConfiguration();
    // _editItemHandler(e);
    dateIpt.classList.remove("hidden");
    _showItemHandler(e, "edit");
    showForm(newTaskForm, "edit", taskSubmitBtn);

    selectedItemId =
      e.target.parentElement.parentElement.childNodes[2].innerText;
  } else if (e.target.id == "delTaskBtn") {
    blurIn(navBar);
    blurIn(mainContent);
    confirmationAction.innerHTML = "Delete";
    showForm(confirmationBox, "delete", taskSubmitBtn);
    selectedItemId =
      e.target.parentElement.parentElement.childNodes[2].innerText;
  } else if (e.target.id != "list_box") {
    blurIn(navBar);
    blurIn(mainContent);

    formTitle.innerHTML = "Task Detail";
    _detailFormConfiguration();
    _showItemHandler(e, "display");
    showForm(newTaskForm);
    selectedItemId = e.target.childNodes[2].innerText;
  }
});
//----LIST BOX CLICK

//---CONFIRMATION BOX CLICK
confirmationOKBtn.addEventListener("click", () => {
  //DOM MANIPULATION
  blurOut(navBar);
  blurOut(mainContent);

  const submitAction = taskSubmitBtn.value;

  if (submitAction == "add") {
    _postNewTask("http://localhost:4000/tasks/create", "POST");
    addWaitingDiv();
  } else if (submitAction == "edit") {
    console.log(selectedItemId);
    _postNewTask(
      `http://localhost:4000/tasks/update/${selectedItemId}`,
      "PATCH"
    );
    addWaitingDiv();
  } else {
    _postNewTask(
      `http://localhost:4000/tasks/delete/${selectedItemId}`,
      "DELETE"
    );
    addWaitingDiv();
  }

  removeWaitingDiv();
  hideForm(confirmationBox);
  hideForm(newTaskForm);
  clearForm([titleIpt, descIpt, dateIpt, task_status_selected]);
  blurOut(mainContent);
  location.reload();
});

confirmationCancelBtn.addEventListener("click", () => {
  blurOut(navBar);
  blurOut(mainContent);
  hideForm(confirmationBox);

  if (newTaskForm.classList.contains("scale-y-100")) {
    blurIn(navBar);
    blurIn(mainContent);
    blurOut(newTaskForm);
  }
});

//---CONFIRMATION BOX CLICK
const _detailFormConfiguration = () => {
  titleIpt.disabled = true;
  descIpt.disabled = true;
  task_status_div.classList.add("hidden");
  task_status_selected.classList.add("hidden");
  statusIpt.classList.remove("hidden");
  statusIpt.disabled = true;
  statusIpt.value = "OPEN";
  dateIpt.disabled = true;
  taskSubmitBtn.classList.add("hidden");
  dateShowVal.classList.add("hidden");
};

const _editFormConfiguration = () => {
  titleIpt.disabled = false;
  descIpt.disabled = false;
  task_status_div.classList.remove("hidden");
  task_status_selected.classList.remove("hidden");
  statusIpt.classList.add("hidden");
  statusIpt.disabled = false;
  // statusIpt.value = "OPEN";
  dateIpt.disabled = false;
  taskSubmitBtn.classList.remove("hidden");
  dateShowVal.classList.add("hidden");
};

async function _loadAllList() {
  const res = await apiCall("http://localhost:4000/tasks", {
    method: "GET",
  });
  const { success, msg } = await res.json();
  return { success, msg };
}

const _showItemHandler = (e, action) => {
  if (e.target.id == "edit_task_btn" || e.target.id == "delTaskBtn") {
    selectedItemId =
      e.target.parentElement.parentElement.childNodes[2].innerText;
  } else {
    selectedItemId = e.target.childNodes[2].innerText;
  }

  const selectedItem = taskArr.find((el) => el._id == selectedItemId);

  titleIpt.value = selectedItem.title;
  descIpt.value = selectedItem.description;
  task_status_selected.innerText = selectedItem.status;
  statusIpt.value = selectedItem.status;
  if (action == "display") {
    dateShowVal.value = selectedItem.completionDate;
    dateShowVal.disabled = true;
    dateIpt.classList.add("hidden");
    dateShowVal.classList.remove("hidden");
  } else if (action == "edit") {
    let dateArr = new Date(selectedItem.completionDate)
      .toLocaleDateString()
      .split("/")
      .reverse();
    dateArr[1] = dateArr[1].length == 1 ? "0" + dateArr[1] : dateArr[1];
    dateArr[2] = dateArr[2].length == 1 ? "0" + dateArr[2] : dateArr[2];
    let dateVal = dateArr.join("-");
    let timeArr = new Date(selectedItem.completionDate)
      .toLocaleTimeString()
      .split(" ")[0]
      .split(":");
    timeArr[0] = timeArr[0].length == 1 ? "0" + timeArr[0] : timeArr[0];
    timeArr[1] = timeArr[1].length == 1 ? "0" + timeArr[1] : timeArr[1];
    timeArr = timeArr.join(":");
    dateIpt.value = dateVal + "T" + timeArr;
  }
};

const _clearForm = () => {
  titleIpt.value = null;
  descIpt.value = null;
  statusIpt.value = null;
  dateIpt.value = null;
  task_status_selected.innerText = "OPEN";

  dateShowVal.value = null;
  titleIpt.disabled = false;
  descIpt.disabled = false;
  statusIpt.disabled = false;
  dateIpt.disabled = false;
  task_status_selected.classList.remove("hidden");
  dateShowVal.classList.add("hidden");
};

//CALL API
const _postNewTask = async (url, METHOD) => {
  let options = null;
  if (new Date(dateIpt.value) < Date.now()) {
    alert("You cannot schedule a task for past date.");
  }
  const formVal = {
    title: titleIpt.value,
    description: descIpt.value,
    completionDate: new Date(dateIpt.value),
    status: task_status_selected.innerHTML
      ? task_status_selected.innerHTML
      : statusIpt.value,
  };

  if (METHOD != "DELETE") {
    options = {
      method: METHOD,
      headers: {
        "Content-Type": "application/json",
        Accept: "application.json",
      },
      body: JSON.stringify(formVal),
    };
  } else {
    options = {
      method: METHOD,
    };
  }

  try {
    const res = await apiCall(url, options);
    const { success, msg } = await res.json();
    alert(msg);
  } catch (error) {
    console.log(error);
  }
};

const loadMore = async (e) => {
  if (e.target.id == "load_more") {
    const res = await fetch(
      `http://localhost:4000/tasks/loadMore?page=${page}`,
      {
        METHOD: "GET",
      }
    );
    const { success, msg } = await res.json();
    if (success) {
      taskArr = [...taskArr, ...msg];

      taskArr = taskArr.map((el) =>
        el.completionDate
          ? {
              ...el,
              completionDate: new Date(el.completionDate).toLocaleString(),
            }
          : el
      );

      removeListItems("list_box");
      for (let i = 0; i < taskArr.length; i++) {
        createListItems(taskArr[i].title, taskArr[i]._id, taskArr[i].status);
      }
    } else {
      alert(msg);
      document.getElementById("load_more").classList.add("hidden");
    }

    page++;
  }
};

loadMoreBtn.addEventListener("click", loadMore);
