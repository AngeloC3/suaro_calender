import { YearCalendar } from "./YearCalender.js";
import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Year } from "../backend/Year.js";

export const AllYearsCalender = ({yearManager, mostRecentYear}) => {
    const [year, setYear] = useState(new Year(0, "DR", false));
    const [inputValue, setInputValue] = useState("");

    useEffect(() => {
        setYear(yearManager.getYear(mostRecentYear));
      }, [yearManager, mostRecentYear])

    const goToPreviousYear = () => {
        const previousYearNumber = year.yearNumber - 1;
        if (!yearManager.getYear(previousYearNumber)) {
            yearManager.addYear(previousYearNumber);
        }
        setYear(yearManager.getYear(previousYearNumber));
    };

    const goToNextYear = () => {
        const nextYearNumber = year.yearNumber + 1;
        if (!yearManager.getYear(nextYearNumber)) {
            yearManager.addYear(nextYearNumber);
        }
        setYear(yearManager.getYear(nextYearNumber));
    };

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleGoToYear = () => {
        const inputYear = parseInt(inputValue, 10);
        if (!isNaN(inputYear)) {
            if (!yearManager.getYear(inputYear)) {
                yearManager.addYear(inputYear);
            }
            setYear(yearManager.getYear(inputYear));
        }
    };

    return (
        <div className="container">
            <div className="d-flex align-items-center justify-content-between mb-3 mt-3">
                <button
                    className="btn btn-primary"
                    onClick={goToPreviousYear}
                >
                    Previous Year
                </button>
                <div className="input-group w-50">
                    <input
                        type="number"
                        className="form-control text-center me-1"
                        placeholder="Go to year"
                        value={inputValue}
                        onChange={handleInputChange}
                    />
                    <button
                        className="btn btn-secondary"
                        onClick={handleGoToYear}
                    >
                        Go
                    </button>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={goToNextYear}
                >
                    Next Year
                </button>
            </div>
            <YearCalendar year={year} setYear={setYear} yearManager={yearManager} />
        </div>
    );
};
