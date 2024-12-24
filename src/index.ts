import { List, ListItem } from "./List.js";

import { render } from "./reef.es.min.js";

// import

const christmasList = new List();

christmasList.additem("boots");
christmasList.additem("BOOTS");

let listEl: HTMLElement;
let formEl: HTMLFormElement;
let notificationPlace: HTMLElement;

document.addEventListener("readystatechange", () => {
  listEl = document.querySelector("#list");
  formEl = document.querySelector("#list-form");
  notificationPlace = document.querySelector("#notifications");

  render(listEl, listTemplate(christmasList.getAll()));

  formEl.addEventListener("submit", handleSubmit);
  christmasList.listen("duplicateitemerror", ({ payload }) => {
    console.log(payload.messages);
    showNotification(payload.messages);
  });
  christmasList.listen("updated", () => {
    updater();
  });
});

function showNotification(notifications: string[]) {
  const ul = document.createElement("ul");
  notifications.forEach((message) => {
    const li = document.createElement("li");
    li.innerText = message;
    ul.append(li);
  });

  notificationPlace.append(ul);

  setTimeout(() => {
    ul.remove();
  }, 3000);
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
    return `<p>You have not added any elements to the list`;
  }
  return `<ul class="displayed-list">
    ${list
      .map((item) => {
        return `<li>${item.print()}<button>Edit</button> <button>Delete</button></li>`;
      })
      .join("")}
    </ul>
    `;
}
