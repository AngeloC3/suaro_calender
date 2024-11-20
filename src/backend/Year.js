import { possibleDays } from './variables.js';
import { Month } from './Month.js';

export class Year {
    constructor(yearNumber, suffix, initalizeMonths = true) {
        if (!Number.isInteger(yearNumber)) {
            throw new Error("Year number must be an integer.");
        }
        if (!suffix || suffix !== "DR") {
            throw new Error("Suffix must be either 'DR' or nothing.");
        }
    
        this.yearNumber = yearNumber;
        this.suffix = suffix;
        if (initalizeMonths) {
            this.months = this.#initializeMonths();
        } else {
            this.months = [];
        }
    }

    toString() {
        return `${this.yearNumber} ${this.suffix} - ${this.months.length} month(s)`;
    }
  
    #initializeMonths() {
        let dayIndex = possibleDays.findIndex(d => d.toLowerCase() === "soumday");
        const months = []
        const monthParams = [
            ["The Navis", 1],
            ["Keras", 60],
            ["Lorsan", 60],
            ["Ceres", 60],
            ["Creta (1/2)", 30],
            ["Saighead", 1],
            ["Creta (2/2)", 30, 30],
            ["Amara", 60],
            ["Allaidh", 60],
            ["Currio", 60],
        ]
        for (const monthParam of monthParams) {
            const offset = monthParam[2] ? monthParam[2] : 0;
            const month = new Month(monthParam[0], monthParam[1], possibleDays[dayIndex], offset);
            months.push(month);
            dayIndex = (dayIndex + monthParam[1]) % possibleDays.length;
        }
        return months;
    }
  
    getMonthByName(name) {
        const month = this.months.find(m => m.name.toLowerCase() === name.toLowerCase());
        if (!month) {
            throw new Error(`Month "${name}" not found in the year ${this.yearNumber} ${this.suffix}.`);
        }
        return month;
    }

    getMonthByIndex(index) {
        if (index < 1 || index > this.months.length) {
            throw new Error("Invalid month index.");
          }
          return this.months[index - 1];
    }
  
    getAllMonths() {
        return this.months;
    }
  }
  

export const copyYear = (oldYear) => {
    const newYear = new Year(oldYear.yearNumber, oldYear.suffix, false);
    newYear.months = oldYear.months;
    return newYear;
}