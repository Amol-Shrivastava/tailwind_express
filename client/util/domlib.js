import { formatDate } from "../util/valueCheck.js";

const registerBtn = document.getElementById("registerBtn");

const showErrorMsg = (parentCont, childCont) => {
  parentCont.classList.add("border-red-500");
  parentCont.classList.remove("mb-6");

  if (
    !document.body.contains(
      document.getElementById(childCont.getAttribute("id"))
    )
  ) {
    parentCont.insertAdjacentElement("afterend", childCont);
    registerBtn.disabled = true;
  }
};

const suggestionErrorEl = (id, text) => {
  const suggestionEl = document.createElement("p");
  suggestionEl.setAttribute("id", id);
  suggestionEl.innerHTML = text;
  suggestionEl.classList.add("text-sm");
  suggestionEl.classList.add("text-red-500");
  return suggestionEl;
};

const removeSuggestionErrorEl = (parentCont, childCont) => {
  setTimeout(() => {
    parentCont.classList.remove("border-red-500");
    parentCont.classList.add("mb-6");
    childCont ? childCont.remove() : null;
    registerBtn.disabled = false;
  }, 1500);
};

const createPopup = (contId, textId, text) => {
  const popupDiv = document.createElement("div");

  popupDiv.classList.add("fixed");
  popupDiv.classList.add("top-2/4");
  popupDiv.classList.add("left-2/4");
  popupDiv.classList.add("w-[200px]");
  popupDiv.classList.add("h-[150px]");
  popupDiv.classList.add("bg-white");
  popupDiv.classList.add("p-4");
  popupDiv.classList.add("drop-shadow-md");
  popupDiv.classList.add("visible");

  popupDiv.setAttribute("id", contId);
  const textEl = document.createElement("p");
  textEl.setAttribute("id", textId);
  textEl.classList.add("text-gray-800");
  textEl.classList.add("text-base");
  textEl.classList.add("font-mono");
  textEl.innerHTML = text;

  popupDiv.insertAdjacentElement("afterbegin", textEl);

  return popupDiv;
};

const hidePopup = (contId) => {
  const popupDiv = document.getElementById(contId);
  popupDiv.remove();
};

const navigateToPage = (url) => {
  window.location.href = url;
};

const showForm = (el, action = null, btn = null) => {
  el.classList.remove("scale-y-0", "blur-md");
  el.classList.add("scale-y-100", "duration-200");
  el.classList.remove("scale-y-0");
  if (action && btn) {
    btn.value = action;
  }
};

const hideForm = (el) => {
  el.classList.remove("scale-y-100", "duration-200");
  el.classList.add("scale-y-0");
  el.classList.remove("scale-y-100", "duration-200");
};

const blurIn = (el) => {
  el.classList.add("blur-md");
};

const blurOut = (el) => {
  el.classList.remove("blur-md");
};

const createListItems = (title, id, status) => {
  const listEl = document.createElement("li");
  const listUl = document.getElementById("list_box");

  listEl.classList.add(
    "mb-4",
    "flex",
    "justify-between",
    "items-center",
    "rounded-md",
    "px-2",
    "py-4"
  );
  if (status == "OPEN") {
    listEl.classList.add("bg-red-300");
  } else if (status == "WIP") {
    listEl.classList.add("bg-orange-200");
  } else if (status == "CLOSED") {
    listEl.classList.add("bg-green-300");
  } else if (["TIME'S UP"].includes(status)) {
    listEl.classList.add("bg-gray-400");
  }
  if (!["CLOSED", "TIME'S UP"].includes(status)) {
    listEl.innerHTML = `<span id="taskTitle" class="text-gray-600  text-xl">${title}</span>
  <span id="taskId" class="text-gray-600 hidden text-xl">${id}</span>
  <div id="btnsCont" class="pointer-events-none">
  <button id="edit_task_btn" class="mr-3 cursor-pointer pointer-events-auto fill-slate-400 hover:fill-slate-800">
    <svg clip-rule="evenodd" class="w-6 h-6  pointer-events-none" fill-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m19 20.25c0-.402-.356-.75-.75-.75-2.561 0-11.939 0-14.5 0-.394 0-.75.348-.75.75s.356.75.75.75h14.5c.394 0 .75-.348.75-.75zm-7.403-3.398 9.124-9.125c.171-.171.279-.423.279-.684 0-.229-.083-.466-.28-.662l-3.115-3.104c-.185-.185-.429-.277-.672-.277s-.486.092-.672.277l-9.143 9.103c-.569 1.763-1.555 4.823-1.626 5.081-.02.075-.029.15-.029.224 0 .461.349.848.765.848.511 0 .991-.189 5.369-1.681zm-3.27-3.342 2.137 2.137-3.168 1.046zm.955-1.166 7.651-7.616 2.335 2.327-7.637 7.638z" fill-rule="nonzero"/></svg>
  </button>
  <button id="delTaskBtn" class="cursor-pointer pointer-events-auto fill-slate-400 hover:fill-slate-800">
    <svg clip-rule="evenodd" fill-rule="evenodd" class="w-6 h-6  pointer-events-none" stroke-linejoin="round" stroke-miterlimit="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" id="del_task_btn"><path d="m4.015 5.494h-.253c-.413 0-.747-.335-.747-.747s.334-.747.747-.747h5.253v-1c0-.535.474-1 1-1h4c.526 0 1 .465 1 1v1h5.254c.412 0 .746.335.746.747s-.334.747-.746.747h-.254v15.435c0 .591-.448 1.071-1 1.071-2.873 0-11.127 0-14 0-.552 0-1-.48-1-1.071zm14.5 0h-13v15.006h13zm-4.25 2.506c-.414 0-.75.336-.75.75v8.5c0 .414.336.75.75.75s.75-.336.75-.75v-8.5c0-.414-.336-.75-.75-.75zm-4.5 0c-.414 0-.75.336-.75.75v8.5c0 .414.336.75.75.75s.75-.336.75-.75v-8.5c0-.414-.336-.75-.75-.75zm3.75-4v-.5h-3v.5z" fill-rule="nonzero"/></svg>
  </button>`;
  } else {
    listEl.innerHTML = `<span id="taskTitle" class="text-gray-600  text-xl">${title}</span>
    <span id="taskId" class="text-gray-600 hidden text-xl">${id}</span>
    <div id="btnsCont" class="pointer-events-none">
    <button id="delTaskBtn" class="cursor-pointer pointer-events-auto fill-slate-800">
      <svg clip-rule="evenodd" fill-rule="evenodd" class="w-6 h-6  pointer-events-none" stroke-linejoin="round" stroke-miterlimit="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" id="del_task_btn"><path d="m4.015 5.494h-.253c-.413 0-.747-.335-.747-.747s.334-.747.747-.747h5.253v-1c0-.535.474-1 1-1h4c.526 0 1 .465 1 1v1h5.254c.412 0 .746.335.746.747s-.334.747-.746.747h-.254v15.435c0 .591-.448 1.071-1 1.071-2.873 0-11.127 0-14 0-.552 0-1-.48-1-1.071zm14.5 0h-13v15.006h13zm-4.25 2.506c-.414 0-.75.336-.75.75v8.5c0 .414.336.75.75.75s.75-.336.75-.75v-8.5c0-.414-.336-.75-.75-.75zm-4.5 0c-.414 0-.75.336-.75.75v8.5c0 .414.336.75.75.75s.75-.336.75-.75v-8.5c0-.414-.336-.75-.75-.75zm3.75-4v-.5h-3v.5z" fill-rule="nonzero"/></svg>
    </button>`;
  }

  listUl.insertAdjacentElement("beforeend", listEl);
};

const createFormDiv = ({ title, description, status, completionDate }) => {
  const formBox = document.getElementById("formBox");
  const targetDiv = document.createElement("div");
  targetDiv.classList.add(
    "flex",
    "flex-col",
    "space-y-2.5",
    "px-2",
    "py-2",
    "rounded-sm"
  );
  targetDiv.innerHTML = `         
          <!-- TASK TITLE -->
          <label for="task_title" class="text-base text-slate-500 italic after:content-['*'] after:ml-0.5 after:text-red-400">Task Title</label>
          <input type="text" name="task_title" id="task_title" placholder="Task title" class="px-2 py-2 bg-gray-200 focus:bg-slate-300 rounded-sm placeholder-slate-200 text-xl outline-1 outline-gray-100 text-gray-700" value=${title}>
        </div>

        <!-- TASK DESCRIPTION -->
        <div id="task_description_box" class="px-2 py-2 rounded-sm  flex flex-col">
          <label for="task_desc" class="text-base text-slate-500 italic after:content-['*'] after:ml-0.5 after:text-red-400">Task Description</label>
          <textarea name="task_desc" id="task_desc" placholder="Task title" class="px-2 py-2 bg-gray-200 focus:bg-slate-300 rounded-sm placeholder-slate-200 text-base outline-1 outline-gray-100 text-gray-700" cols="30" rows="5" value=${description}></textarea> 
        </div>

        <!-- TASK STATUS -->
        <div id="task_status_box" class="px-2 py-2 rounded-sm  flex flex-col space-y-1">
          <label for="task_status" class="text-base text-slate-500 italic after:content-['*'] after:ml-0.5 after:text-red-400">Task Status</label>
          <div id="task_status" class="px-2 py-3 hover:cursor-pointer bg-gray-200 focus:bg-slate-300 rounded-sm placeholder-slate-200 text-base outline-1 outline-gray-100 text-gray-700 relative "><span id="status_selected" class="text-gray-400">${status}</span>
            <div class="absolute top-[50px] w-full h-auto left-0 rounded-sm bg-gray-200 z-10 scale-y-0 ease-out transition duration-150 origin-top" id="options_list">
            <span class="italic hover:bg-orange-500 block py-2 px-1" id="OPEN">OPEN</span>
            <span class="block italic hover:bg-orange-500 border-t-2 border-b-2
             border-gray-300 py-2 px-1" id="WIP">WIP</span>
            <span class="block italic hover:bg-orange-500 py-2 px-1" id="CLOSED">CLOSED</span>
          </div>
        </div>

        <input type="text" name="task_status" id="task_status_show" placholder="Task title" class="px-2 py-2 bg-gray-200 focus:bg-slate-300 rounded-sm placeholder-slate-200 text-xl outline-1 outline-gray-100 text-gray-600 value=${status} hidden">
        </div>

         <!-- TASK COMPLETION DATE -->
        <div id="task_completion_date_box" class="px-2 py-2 rounded-sm  flex flex-col">
          <label for="task_completion_date" class="text-base text-slate-500 italic after:content-['*'] after:ml-0.5 after:text-red-400">Task Completion Date</label>
          <input type="date" name="task_completion_date"   id="task_completion_date" class="mt-1 px-2 py-2 bg-gray-200 focus:bg-slate-300 rounded-sm placeholder-slate-200 w-full h-auto text-base outline-1 outline-gray-100 text-gray-700" value=${formatDate(
            completionDate
          )}></input> 
        </div>

        <!-- SUBMIT BTN -->
        <button class="block px-2 py-3 mt-4 mb-3 bg-orange-300  text-gray-400 hover:bg-orange-400 hover:text-gray-600 rounded-md font-semibold uppercase hover:tracking-wide" id="task_submit_btn">
          Submit
        </button>

        <button class="block px-2 py-3 my-1.5 bg-gray-300  text-orange-400 hover:bg-orange-400 hover:text-gray-600 rounded-md font-semibold uppercase hover:tracking-wide" id="task_cancel_btn">
          Cancel
        </button>
`;

  formBox.insertAdjacentElement("afterbegin", targetDiv);
};

const removeListItems = (ul_id) => {
  document.getElementById(ul_id).innerHTML = "";
};

export {
  showErrorMsg,
  suggestionErrorEl,
  navigateToPage,
  removeSuggestionErrorEl,
  createPopup,
  hidePopup,
  showForm,
  hideForm,
  blurIn,
  blurOut,
  createListItems,
  createFormDiv,
  removeListItems,
};
