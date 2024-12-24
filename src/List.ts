export class ListItem {
  id: number;
  name: string;
  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }
  print() {
    return `${this.name}`;
  }
}

type Constructor = new (...args: any[]) => {};

function EventMixin<TBase extends Constructor>(BaseClass: TBase) {
  return class EventMixer extends BaseClass {
    _listeners: Map<string, ((obj?: { payload: any }) => void)[]> = new Map();

    listen(eventName: string, cb: (obj?: { payload: any }) => void) {
      if (!this._listeners.has(eventName)) {
        this._listeners.set(eventName, []);
      }
      console.log(`Now listening to ${eventName} events`);
      this._listeners.get(eventName).push(cb);
    }
    trigger<T>(eventName: string, payload?: T) {
      if (this._listeners.has(eventName)) {
        this._listeners.get(eventName).forEach((cb) => {
          cb({ payload: payload as T });
        });
      }
    }
  };
}

function NotificationMixin<TBase extends Constructor>(BaseClass: TBase) {
  return class extends BaseClass {
    _notifications: Set<string> = new Set();

    addMessage(message: string) {
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
    const items: ListItem[] = JSON.parse(
      localStorage.getItem("saved-xmas-list")
    );
    return items;
  }

  #trimSpaces(word: string) {
    const trimmedWord = word.split(" ").filter(Boolean).join(" ");
    return trimmedWord;
  }
  #testString(object: string, testStr: string) {
    const re = new RegExp(`${object}`, "ig");
    // console.log(re);
    return re.test(testStr);
  }
  #isDuplicate(item: string) {
    return this.#items.some((listItem) => {
      return this.#testString(listItem.name, item);
    });
    // if (hasWord) return false;
  }
  additem(item: string) {
    const trimmedWord = this.#trimSpaces(item);
    let instance = this as any;
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

  editItem(id: number, newValue: string) {
    const item = this.getItem(id);
    let oldValue = item.name;
    // let message = `The item ${item.name} has been changed to ${newValue}`;
    item.name = newValue;
    let message =
      oldValue === newValue
        ? `The item name ${oldValue} has remained unchanged`
        : `The item ${item.name} has been changed to ${newValue}`;
    (this as any).addMessage(message);
    (this as any).trigger("modified", {
      messages: (this as any).getMessages(),
    });
    this.#saveItems();
  }

  getItem(id: number) {
    return this.#items.find((item) => {
      return item.id === id;
    });
  }

  deleteItem(id: number) {
    console.log(id);
    let deletedItem: ListItem;
    for (let i = 0; i <= this.#items.length; i++) {
      let currentItem = this.#items[i];
      if (currentItem.id === id) {
        deletedItem = this.#items.splice(i, 1)[0];
        break;
      }
    }
    let message = `${deletedItem.name} has been removed from the list`;
    (this as any).addMessage(message);
    (this as any).trigger("listitemdeleted", {
      messages: (this as any).getMessages(),
    });

    console.log(deletedItem);
    this.#saveItems();
  }
}

export const List = NotificationMixin(EventMixin(BaseClassList));
// Object.assign(List.prototype, eventMixin);
