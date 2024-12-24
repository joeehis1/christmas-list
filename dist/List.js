export class ListItem {
    id;
    name;
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
    print() {
        return `${this.name}`;
    }
}
function EventMixin(BaseClass) {
    return class EventMixer extends BaseClass {
        _listeners = new Map();
        listen(eventName, cb) {
            if (!this._listeners.has(eventName)) {
                this._listeners.set(eventName, []);
            }
            console.log(`Now listening to ${eventName} events`);
            this._listeners.get(eventName).push(cb);
        }
        trigger(eventName, payload) {
            if (this._listeners.has(eventName)) {
                this._listeners.get(eventName).forEach((cb) => {
                    cb({ payload: payload });
                });
            }
        }
    };
}
function NotificationMixin(BaseClass) {
    return class extends BaseClass {
        _notifications = new Set();
        addMessage(message) {
            console.log(message + "added");
            this._notifications.add(message);
        }
        getMessages() {
            return [...this._notifications.values()];
        }
        clearNotifications() {
            this._notifications.clear();
        }
    };
}
// const eventMixin =
class BaseClassList {
    #nextId = 1;
    #items = [];
    constructor() {
        const saved = this.#getSavedItems();
        if (saved) {
            this.#items.push(...saved);
        }
        console.log(this.#items);
    }
    getAll() {
        return this.#items;
    }
    #getSavedItems() {
        const items = JSON.parse(localStorage.getItem("saved-xmas-list"));
        return items;
    }
    #trimSpaces(word) {
        const trimmedWord = word.split(" ").filter(Boolean).join(" ");
        return trimmedWord;
    }
    #testString(object, testStr) {
        const re = new RegExp(`${object}`, "ig");
        // console.log(re);
        return re.test(testStr);
    }
    #isDuplicate(item) {
        return this.#items.some((listItem) => {
            return this.#testString(listItem.name, item);
        });
        // if (hasWord) return false;
    }
    additem(item) {
        const trimmedWord = this.#trimSpaces(item);
        let instance = this;
        console.log(this.#isDuplicate(trimmedWord));
        if (this.#isDuplicate(item)) {
            let message = `"${trimmedWord.toLowerCase()}" has already been included`;
            instance.addMessage(message);
            instance.trigger("duplicateitemerror", {
                messages: instance.getMessages(),
            });
            return false;
        }
        while (this.getItem(this.#nextId)) {
            this.#nextId++;
        }
        const newItem = new ListItem(this.#nextId, item);
        this.#items.push(newItem);
        console.log(this.#items);
        instance.trigger("newitemadded");
        this.#saveItems();
    }
    #saveItems() {
        localStorage.setItem("saved-xmas-list", JSON.stringify(this.#items));
    }
    editItem(id, newValue) {
        const item = this.getItem(id);
        let oldValue = item.name;
        // let message = `The item ${item.name} has been changed to ${newValue}`;
        item.name = newValue;
        let message = oldValue === newValue
            ? `The item name ${oldValue} has remained unchanged`
            : `The item ${item.name} has been changed to ${newValue}`;
        this.addMessage(message);
        this.trigger("modified", {
            messages: this.getMessages(),
        });
        this.#saveItems();
    }
    getItem(id) {
        return this.#items.find((item) => {
            return item.id === id;
        });
    }
    deleteItem(id) {
        console.log(id);
        let deletedItem;
        for (let i = 0; i <= this.#items.length; i++) {
            let currentItem = this.#items[i];
            if (currentItem.id === id) {
                deletedItem = this.#items.splice(i, 1)[0];
                break;
            }
        }
        let message = `${deletedItem.name} has been removed from the list`;
        this.addMessage(message);
        this.trigger("listitemdeleted", {
            messages: this.getMessages(),
        });
        console.log(deletedItem);
        this.#saveItems();
    }
}
export const List = NotificationMixin(EventMixin(BaseClassList));
// Object.assign(List.prototype, eventMixin);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTGlzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9MaXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE1BQU0sT0FBTyxRQUFRO0lBQ25CLEVBQUUsQ0FBUztJQUNYLElBQUksQ0FBUztJQUNiLFlBQVksRUFBVSxFQUFFLElBQVk7UUFDbEMsSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUM7UUFDYixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztJQUNuQixDQUFDO0lBQ0QsS0FBSztRQUNILE9BQU8sR0FBRyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDeEIsQ0FBQztDQUNGO0FBSUQsU0FBUyxVQUFVLENBQTRCLFNBQWdCO0lBQzdELE9BQU8sTUFBTSxVQUFXLFNBQVEsU0FBUztRQUN2QyxVQUFVLEdBQXNELElBQUksR0FBRyxFQUFFLENBQUM7UUFFMUUsTUFBTSxDQUFDLFNBQWlCLEVBQUUsRUFBb0M7WUFDNUQsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUM7Z0JBQ3BDLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUNyQyxDQUFDO1lBQ0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsU0FBUyxTQUFTLENBQUMsQ0FBQztZQUNwRCxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDMUMsQ0FBQztRQUNELE9BQU8sQ0FBSSxTQUFpQixFQUFFLE9BQVc7WUFDdkMsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDO2dCQUNuQyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFB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