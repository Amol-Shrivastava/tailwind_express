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

const showForm = (el) => {
  el.classList.remove("scale-y-0", "blur-md");
  el.classList.add("scale-y-100", "duration-200");
  el.classList.remove("scale-y-0");
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
};
