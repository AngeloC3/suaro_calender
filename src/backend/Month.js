import { possibleDays } from './variables.js';
import { Day } from './Day.js';

export class Month {
    constructor(name, numberOfDays, startDay, dayOffset = 0, initializeDays = true) {
        if (!name || typeof name !== 'string') {
            throw new Error("Month name must be a non-empty string.");
        }
        if (initializeDays && (!Number.isInteger(numberOfDays) || numberOfDays < 1)) {
            throw new Error("Number of days must be a positive integer.");
        }
    
        this.name = name;
        if (initializeDays) {
            this.days = this.#initializeDays(numberOfDays, startDay);
        } else {
            this.days = [];
        }
        this.dayOffset = dayOffset;
    }

    toString() {
        return `${this.name} - ${this.days.length} day(s)`;
    }
  
    #initializeDays(numberOfDays, startDay) {
        let dayIndex = possibleDays.findIndex(d => d.toLowerCase() === startDay.toLowerCase());
        if (dayIndex === -1) {
            throw new Error("Failure initializing days.");
        }
        const days = [];
        for (let i = 1; i <= numberOfDays; i++) {
            days.push(new Day(possibleDays[dayIndex]));
            dayIndex = (dayIndex + 1) % possibleDays.length;
        }
        return days;
    }
  
    getDay(index) {
        if (index < 1 || index > this.days.length) {
            throw new Error("Invalid day index.");
        }
        return this.days[index - 1];
    }
  
    getAllDays() {
        return this.days;
    }
  }