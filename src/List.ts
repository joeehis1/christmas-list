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
  };
}

// const eventMixin =
class BaseClassList {
  #nextId = 1;
  #items = [
    new ListItem(1, "My christmas list"),
    new ListItem(2, "A christmas list"),
  ];
  constructor() {}
  getAll() {
    return this.#items;
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
    (this as any).trigger("updated");
  }
  getItem(id: number) {
    return this.#items.find((item) => {
      return item.id === id;
    });
  }
}

export const List = NotificationMixin(EventMixin(BaseClassList));
// Object.assign(List.prototype, eventMixin);
