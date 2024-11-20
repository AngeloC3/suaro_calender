import { saveAs } from 'file-saver';
import { Year } from './Year.js';
import { Month } from './Month.js';
import { Day } from './Day.js';

export class YearManager {
    constructor() {
        this.years = new Map();
    }

    addPremadeYear(year, overwrite = false) {
        const key = year.yearNumber + " " + year.suffix
        if (!overwrite && this.years.has(key)) {
            throw new Error(`Year ${key} already exists.`);
        }
        this.years.set(key, year);
    }

    addYear(yearNumber, initalizeMonths = true, suffix = "DR") {
        const key = yearNumber + " " + suffix
        if (this.years.has(key)) {
            throw new Error(`Year ${key} already exists.`);
        }
        const year = new Year(yearNumber, suffix, initalizeMonths);
        this.years.set(key, year);
    }

    getYear(yearNumber, suffix="DR") {
        return this.years.get(yearNumber + " " + suffix);
    }

    removeYear(yearNumber, suffix="DR") {
        this.years.delete(yearNumber + " " + suffix);
    }

    setYear(yearNumber, year, suffix="DR") {
        this.years.set(yearNumber + " " + suffix, year);
    }

    saveYears() {
        const yearsData = Array.from(this.years.values()).map(year => {
            return {
                yearNumber: year.yearNumber,
                suffix: year.suffix,
                months: year.months.map(month => ({
                    name: month.name,
                    dayOffset: month.dayOffset,
                    days: month.days.map(day => ({
                        name: day.name,
                        events: day.events
                    }))
                }))
            };
        });

        const file = new Blob([JSON.stringify(yearsData)], { type: 'application/json' });
        saveAs(file, 'suaro-years-data.json');
    }

    loadYears() {
        return new Promise((resolve, reject) => {
            const inputFile = document.createElement('input');
            inputFile.type = 'file';
            inputFile.accept = '.json';
            inputFile.onchange = (event) => {
                const file = event.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = () => {
                        try {
                            const data = JSON.parse(reader.result);
                            data.forEach((yearData) => {
                                const newYear = new Year(yearData.yearNumber, "DR", false);
                                const months = [];
                                for (const month of yearData.months) {
                                    const newMonth = new Month(month.name, undefined, undefined, month.dayOffset, false);
                                    const days = [];
                                    for (const day of month.days) {
                                        const newDay = new Day(day.name);
                                        newDay.events = day.events;
                                        days.push(newDay);
                                    }
                                    newMonth.days = days;
                                    months.push(newMonth);
                                }
                                newYear.months = months;
                                this.addPremadeYear(newYear, true);
                            });
                            resolve();
                        } catch (error) {
                            reject(error);
                        }
                    };
                    reader.onerror = () => reject(new Error('Error reading file'));  // Reject on file reading error
                    reader.readAsText(file);
                } else {
                    reject(new Error('No file selected'));
                }
            };
            inputFile.click();
        });
    }
    
}
