export class Day {
    constructor(name) {
        if (!name || typeof name !== 'string') {
            throw new Error("Day name must be a non-empty string.");
          }
        this.name = name;
        this.events = [];
    }

    toString() {
        return `${this.name}: ${this.events.length} event(s)`;
    }
  
    addEvent(event) {
        if (event && typeof event === 'string') {
            this.events.push(event);
        } else {
            throw new Error("Event must be a non-empty string.");
        }
    }

    setEvent(index, newEvent) {
        if (index < 0 || index >= this.events.length) {
            throw new Error("Invalid day index.");
        }
        this.events[index] = newEvent;
    }

    getEvent(index) {
        if (index < 0 || index >= this.events.length) {
            throw new Error("Invalid day index.");
        }
        return this.events[index];
    }

    deleteEvent(index) {
        if (index < 0 || index >= this.events.length) {
            throw new Error("Invalid day index.");
        }
        this.events.splice(index, 1);
    }
  
    getEvents() {
        return this.events;
    }
  }