import { List } from "./List.js";
import { render } from "./reef.es.min.js";
// import
const christmasList = new List();
let listEl;
let formEl;
let notificationPlace;
let editInput;
let selectedItemId;
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
function handleListItem(e) {
    const target = e.target;
    if (target.closest(`button[data-item-action="edit"]`)) {
        // The buttons are being selected this way because of the icons
        const button = target.closest("button[data-item-action]");
        handleEdit(button);
    }
    else if (target.closest(`button[data-item-action="delete"]`)) {
        const button = target.closest(`button[data-item-action="delete"]`);
        handleDelete(button);
    }
}
function handleDelete(button) {
    const itemId = Number(button.dataset.delete);
    console.log(itemId);
    christmasList.deleteItem(itemId);
}
function handleEdit(button) {
    if (selectedItemId && editInput) {
        const parentContainer = editInput.closest("li #item-text-area");
        replaceEdittingElements(parentContainer);
    }
    selectedItemId = Number(button.dataset.edit);
    const parentContainer = button.closest("li");
    appendInput(parentContainer);
    console.log(selectedItemId);
}
function appendInput(parentContainer) {
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
function handleCancel(e) {
    const target = e.target;
    const parentContainer = target.closest("li #item-text-area");
    replaceEdittingElements(parentContainer);
}
function replaceEdittingElements(parentContainer) {
    console.log("Blur");
    const selectedItem = christmasList.getItem(selectedItemId);
    parentContainer.innerHTML = selectedItem.name;
    editInput = null;
    selectedItemId = null;
}
function handleSave(e) {
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
function showNotification(notifications) {
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
function handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const itemInputEl = form.querySelector("input");
    const value = itemInputEl.value;
    //   christmasList.
    christmasList.additem(value);
    form.reset();
}
function listTemplate(list) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLElBQUksRUFBWSxNQUFNLFdBQVcsQ0FBQztBQUUzQyxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFFMUMsU0FBUztBQUVULE1BQU0sYUFBYSxHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7QUFFakMsSUFBSSxNQUFtQixDQUFDO0FBQ3hCLElBQUksTUFBdUIsQ0FBQztBQUM1QixJQUFJLGlCQUE4QixDQUFDO0FBQ25DLElBQUksU0FBMkIsQ0FBQztBQUNoQyxJQUFJLGNBQTZCLENBQUM7QUFFbEMsUUFBUSxDQUFDLGdCQUFnQixDQUFDLGtCQUFrQixFQUFFLEdBQUcsRUFBRTtJQUNqRCxNQUFNLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUN6QyxNQUFNLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUM5QyxpQkFBaUIsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLGdCQUFnQixDQUFDLENBQUM7SUFFN0QsTUFBTSxDQUFDLE1BQU0sRUFBRSxZQUFZLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQztJQUVyRCxNQUFNLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLFlBQVksQ0FBQyxDQUFDO0lBQ2hELE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsY0FBYyxDQUFDLENBQUM7SUFDakQsYUFBYSxDQUFDLE1BQU0sQ0FBQyxvQkFBb0IsRUFBRSxlQUFlLENBQUMsQ0FBQztJQUM1RCxhQUFhLENBQUMsTUFBTSxDQUFDLGNBQWMsRUFBRSxjQUFjLENBQUMsQ0FBQztJQUNyRCxhQUFhLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxjQUFjLENBQUMsQ0FBQztJQUNqRCxhQUFhLENBQUMs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