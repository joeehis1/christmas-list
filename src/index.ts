import { List, ListItem } from "./List.js";

import { render } from "./reef.es.min.js";

// import

const christmasList = new List();

let listEl: HTMLElement;
let formEl: HTMLFormElement;
let notificationPlace: HTMLElement;
let editInput: HTMLInputElement;
let selectedItemId: number | null;

document.addEventListener("readystatechange", () => {
  listEl = document.querySelector("#list");
  formEl = document.querySelector("#list-form");
  notificationPlace = document.querySelector("#notifications");

  render(listEl, listTemplate(christmasList.getAll()));

  formEl.addEventListener("submit", handleSubmit);
  listEl.addEventListener("click", handleListItem);
  christmasList.listen("duplicateitemerror", onDuplicateItem);
  christmasList.listen("newitemadded", onNewItemAdded);
  christmasList.listen("modified", onItemModified);
  christmasList.listen("listitemdeleted", onItemModified);
});

function onItemModified({ payload }) {
  updater();
  showNotification(payload.messages);
}

function onNewItemAdded() {
  updater();
}

function handleListItem(e: MouseEvent) {
  const target = e.target as HTMLElement;
  if (target.closest(`button[data-item-action="edit"]`)) {
    // The buttons are being selected this way because of the icons
    const button = target.closest(
      "button[data-item-action]"
    ) as HTMLButtonElement;
    handleEdit(button);
  } else if (target.closest(`button[data-item-action="delete"]`)) {
    const button = target.closest(
      `button[data-item-action="delete"]`
    ) as HTMLElement;
    handleDelete(button);
  }
}

function handleDelete(button: HTMLElement) {
  const itemId = Number(button.dataset.delete);
  console.log(itemId);
  christmasList.deleteItem(itemId);
}

function handleEdit(button: HTMLButtonElement) {
  if (selectedItemId && editInput) {
    const parentContainer = editInput.closest(
      "li #item-text-area"
    ) as HTMLSpanElement;
    replaceEdittingElements(parentContainer);
  }
  selectedItemId = Number(button.dataset.edit);
  const parentContainer = button.closest("li");
  appendInput(parentContainer);
  console.log(selectedItemId);
}

function appendInput(parentContainer: HTMLElement) {
  editInput = document.createElement("input");
  const cancelbutton = document.createElement("button");
  const saveButton = document.createElement("button");
  cancelbutton.innerHTML = '<i class="fa-solid fa-ban"></i>';
  saveButton.innerHTML = '<i class="fa-solid fa-floppy-disk"></i>';

  const item = christmasList.getItem(selectedItemId);
  editInput.value = item.name;
  const itemTextArea = parentContainer.querySelector("#item-text-area");
  itemTextArea.innerHTML = "";
  itemTextArea.append(editInput, cancelbutton, saveButton);
  editInput.focus();
  cancelbutton.addEventListener("click", handleCancel);
  saveButton.addEventListener("click", handleSave);
}

function handleCancel(e: MouseEvent) {
  const target = e.target as HTMLElement;
  const parentContainer = target.closest(
    "li #item-text-area"
  ) as HTMLSpanElement;
  replaceEdittingElements(parentContainer);
}

function replaceEdittingElements(parentContainer: HTMLElement) {
  console.log("Blur");
  const selectedItem = christmasList.getItem(selectedItemId);
  parentContainer.innerHTML = selectedItem.name;
  editInput = null;
  selectedItemId = null;
}

function handleSave(e: MouseEvent) {
  console.log("Will now save this input");
  // if empty do nothing until the person clicks cancel just cancel the operation
  const currentValue = editInput.value;
  if (!currentValue.trim()) {
    handleCancel(e);
    return;
  }
  console.log(currentValue, selectedItemId);
  christmasList.editItem(selectedItemId, currentValue);
  editInput = null;
  selectedItemId = null;
}

function onDuplicateItem({ payload }) {
  console.log(payload.messages);
  showNotification(payload.messages);
}

function showNotification(notifications: string[]) {
  const ul = document.createElement("ul");
  notifications.forEach((message) => {
    const li = document.createElement("li");
    li.innerText = message;
    ul.append(li);
  });

  notificationPlace.innerHTML = "";

  notificationPlace.append(ul);

  setTimeout(() => {
    ul.remove();
    christmasList.clearNotifications();
  }, 4000);
}

function updater() {
  render(listEl, listTemplate(christmasList.getAll()));
}

function handleSubmit(e: SubmitEvent) {
  e.preventDefault();
  const form = e.target as HTMLFormElement;
  const itemInputEl = form.querySelector("input") as HTMLInputElement;
  const value = itemInputEl.value;
  //   christmasList.
  christmasList.additem(value);
  form.reset();
}

function listTemplate(list: ListItem[]) {
  if (list.length === 0) {
    return `<p>You have not added any elements to the list</p>`;
  }
  return `<ul class="displayed-list">
    ${list
      .map((item) => {
        return `<li class="displayed-list-item"><span class="item-text" id="item-text-area">${item.name}</span><button data-item-action="edit" data-edit=${item.id}><i class="fa-solid fa-pen-to-square"></i></button> <button data-item-action="delete" data-delete=${item.id}><i class="fa-solid fa-trash"></i></button></li>`;
      })
      .join("")}
    </ul>
    `;
}
