import { AllYearsCalender } from './AllYearsCalender.js';
import { YearManager } from '../backend/YearManager.js';
import { useState } from 'react';

export const Home = () => {
    const [yearManager, setYearManager] = useState(new YearManager());

    const handleSave = () => {
        yearManager.saveYears();
        alert('Data saved!');
    };
    const handleLoad = () => {
        const newYearManager = new YearManager();
        newYearManager.loadYears()
        .then(() => {
            setYearManager(newYearManager);
            alert('Data loaded!');
        })
        .catch((error) => {
            console.error("Error loading years:", error);
        });
    };

    if (yearManager.years.size === 0) {
        yearManager.addYear(2748);
    }

    return (
        <div>
            <div className="dropdown p-2">
                <button className="btn btn-primary dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                    Manage Data
                </button>
                <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    <li>
                        <button className="dropdown-item border mb-1" onClick={handleSave}>Save Data</button>
                    </li>
                    <li>
                        <button className="dropdown-item border" onClick={handleLoad}>Load Data</button>
                    </li>
                </ul>
            </div>
            <AllYearsCalender yearManager={yearManager} mostRecentYear={2748} />
        </div>
    )

};