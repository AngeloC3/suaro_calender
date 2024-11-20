import { Year } from './Year.js';

const createYear = () => {
    const year2024 = new Year(2024, "DR");
  
    console.log(year2024.toString());
  
    year2024.getAllMonths().forEach(month => {
      console.log(`\nMonth: ${month.toString()}`);
      console.log('----------------------------');
      month.getAllDays().forEach((day, index) => {
        console.log(`\t${index+1+month.dayOffset}: ${day.toString()}`);
      });      
    });
  };
  
  createYear();