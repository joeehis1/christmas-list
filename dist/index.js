import { List } from "./List.js";
import { render } from "./reef.es.min.js";
// import
const christmasList = new List();
christmasList.additem("boots");
christmasList.additem("BOOTS");
let listEl;
let formEl;
let notificationPlace;
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
function showNotification(notifications) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLElBQUksRUFBWSxNQUFNLFdBQVcsQ0FBQztBQUUzQyxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFFMUMsU0FBUztBQUVULE1BQU0sYUFBYSxHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7QUFFakMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUMvQixhQUFhLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBRS9CLElBQUksTUFBbUIsQ0FBQztBQUN4QixJQUFJLE1BQXVCLENBQUM7QUFDNUIsSUFBSSxpQkFBOEIsQ0FBQztBQUVuQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsa0JBQWtCLEVBQUUsR0FBRyxFQUFFO0lBQ2pELE1BQU0sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3pDLE1BQU0sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQzlDLGlCQUFpQixHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztJQUU3RCxNQUFNLENBQUMsTUFBTSxFQUFFLFlBQVksQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBRXJELE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUUsWUFBWSxDQUFDLENBQUM7SUFDaEQsYUFBYSxDQUFDLE1BQU0sQ0FBQyxvQkFBb0IsRUFBRSxDQUFDLEVBQUUsT0FBTyxFQUFFLEVBQUUsRUFBRTtRQUN6RCxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUM5QixnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDckMsQ0FBQyxDQUFDLENBQUM7SUFDSCxhQUFhLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxHQUFHLEVBQUU7UUFDbkMsT0FBTyxFQUFFLENBQUM7SUFDWixDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDO0FBRUgsU0FBUyxnQkFBZ0IsQ0FBQyxhQUF1QjtJQUMvQyxNQUFNLEVBQUUsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3hDLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsRUFBRTtRQUNoQyxNQUFNLEVBQUUsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3hDLEVBQUUsQ0FBQyxTQUFTLEdBQUcsT0FBTyxDQUFDO1FBQ3ZCLEVBQUUsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDaEIsQ0FBQyxDQUFDLENBQUM7SUFFSCxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7SUFFN0IsVUFBVSxDQUFDLEdBQUcsRUFBRTtRQUNkLEVBQUUsQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUNkLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUNYLENBQUM7QUFFRCxTQUFTLE9BQU87SUFDZCxNQUFNLENBQUMsTUFBTSxFQUFFLFlBQVksQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3ZELENBQUM7QUFFRCxTQUFTLFlBQVksQ0FBQyxDQUFjO0lBQ2xDLENBQUMsQ0FBQyxjQUFjLEVBQUUsQ0FBQztJQUNuQixNQUFNLElBQUksR0FBRyxDQUFDLENBQUMsTUFBeUIsQ0FBQztJQUN6QyxNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBcUIsQ0FBQztJQUNwRSxNQUFNLEtBQUssR0FBRyxXQUFXLENBQUMsS0FBSyxDQUFDO0lBQ2hDLG1CQUFtQjtJQUNuQixhQUFhLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzdCLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUNmLENBQUM7QUFFRCxTQUFTLFlBQVksQ0FBQyxJQUFnQjtJQUNwQyxJQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFLENBQUM7UUFDdEIsT0FBTyxnREFBZ0QsQ0FBQztJQUMxRCxDQUFDO0lBQ0QsT0FBTztNQUNILElBQUk7U0FDSCxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRTtRQUNaLE9BQU8sT0FBTyxJQUFJLENBQUMsS0FBSyxFQUFFLG9EQUFvRCxDQUFDO0lBQ2pGLENBQUMsQ0FBQztTQUNELElBQUksQ0FBQyxFQUFFLENBQUM7O0tBRVYsQ0FBQztBQUNOLENBQUMifQ==