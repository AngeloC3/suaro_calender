import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AiOutlinePlus } from 'react-icons/ai';
import { possibleDays } from '../backend/variables.js';
import { copyYear } from '../backend/Year.js';

export const YearCalendar = ({ year, setYear, yearManager }) => {
    const [showModal, setShowModal] = useState(false);
    const [currentEvent, setCurrentEvent] = useState('');
    const [currentMonthIndex, setCurrentMonthIndex] = useState(null);
    const [currentDayIndex, setCurrentDayIndex] = useState(null);
    const [currentEventIndex, setCurrentEventIndex] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const handleAddEvent = (monthIndex, dayIndex) => {
        setIsEditing(false);
        setCurrentMonthIndex(monthIndex);
        setCurrentDayIndex(dayIndex);
        setCurrentEvent('');
        setShowModal(true);
    };

    const handleEditEvent = (monthIndex, dayIndex, eventIndex) => {
        setIsEditing(true);
        setCurrentMonthIndex(monthIndex);
        setCurrentDayIndex(dayIndex);
        setCurrentEventIndex(eventIndex);
        setCurrentEvent(year.getMonthByIndex(monthIndex + 1).getDay(dayIndex + 1).getEvent(eventIndex));
        setShowModal(true);
    };

    const handleSaveEvent = () => {
        const updatedEvent = currentEvent;
        if (updatedEvent) {
            if (isEditing) {
                year.getMonthByIndex(currentMonthIndex + 1).getDay(currentDayIndex + 1).setEvent(currentEventIndex, updatedEvent);
            } else {
                year.getMonthByIndex(currentMonthIndex + 1).getDay(currentDayIndex + 1).getEvents().push(updatedEvent);
            }
            const copiedYear = copyYear(year);
            yearManager.setYear(copiedYear.yearNumber, copiedYear);
            setYear(copiedYear);
            setShowModal(false);
        }
    };

    const handleDeleteEvent = () => {
        if (currentEventIndex !== null) {
            year.getMonthByIndex(currentMonthIndex + 1)
                .getDay(currentDayIndex + 1)
                .deleteEvent(currentEventIndex);
            const copiedYear = copyYear(year);
            yearManager.setYear(copiedYear.yearNumber, copiedYear);
            setYear(copiedYear);
            setShowModal(false);
        }
    };

    return (
        <div className="container my-5">
            <h1 className="text-center mb-4">{year.yearNumber} {year.suffix} Calendar</h1>
            <div className="row g-4">
                {year.months.map((month, monthIndex) => (
                    <div key={monthIndex} className="col-12 mb-4">
                        <div className="card shadow">
                            <div className="card-header bg-primary text-white text-center">
                                <h5 className="card-title">{month.name}</h5>
                                <p className="card-subtitle">{month.days.length} day(s)</p>
                            </div>
                            <div className="card-body">
                                <div className="table-responsive">
                                    <table className="table table-bordered">
                                        <thead>
                                            <tr>
                                                {possibleDays.map((day, index) => (
                                                    <th key={monthIndex + "." + index} className="text-center">{day}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {generateCalendar(month, monthIndex, handleAddEvent, handleEditEvent)}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="modal show" style={{ display: 'block' }} tabIndex="-1" role="dialog">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{isEditing ? 'Edit Event' : 'Add Event'}</h5>
                            <button type="button" className="close ms-auto" onClick={() => setShowModal(false)}>
                                <span>&times;</span>
                            </button>
                        </div>
                            <div className="modal-body">
                                <textarea
                                    className="form-control"
                                    value={currentEvent}
                                    onChange={(e) => setCurrentEvent(e.target.value)}
                                />
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setShowModal(false)}
                                >
                                    Cancel
                                </button>
                                {isEditing ? (
                                    <>
                                        <button
                                            type="button"
                                            className="btn btn-danger"
                                            onClick={handleDeleteEvent}
                                        >
                                            Delete Event
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-primary"
                                            onClick={handleSaveEvent}
                                        >
                                            Save Changes
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={handleSaveEvent}
                                    >
                                        Add Event
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const generateCalendar = (month, monthIndex, handleAddEvent, handleEditEvent) => {
    const totalDays = month.days.length;
    const weeks = [];

    let dayCounter = 0;
    let emptyCounter = 1;
    while (dayCounter < totalDays) {
        const week = [];

        let numWeekDays = possibleDays.length;
        // offset the start of the month
        if (dayCounter === 0) {
            const startDayOffset = possibleDays.findIndex(d => d === month.getDay(1).name);
            for (let i = 0; i < startDayOffset; i++) {
                week.push(<td key={`emptyoffset-${monthIndex}-${i}`}></td>);
            }
            numWeekDays -= startDayOffset;
        }
        for (let i = 0; i < numWeekDays; i++) {
            if (dayCounter < totalDays) {
                const day = month.days[dayCounter];
                const dayIndex = dayCounter;
                week.push(
                    <td key={`day-${monthIndex}-${dayCounter}`} className="text-center position-relative">
                        <div className="fw-bold">
                            {dayCounter + 1 + month.dayOffset}. {day.name}
                            <button
                                onClick={() => handleAddEvent(monthIndex, dayIndex)}
                                className="btn btn-sm btn-success position-absolute top-0 end-0 m-1 p-1 d-flex justify-content-center align-items-center"
                                style={{ fontSize: '0.8rem', height: '24px', width: '24px' }}
                            >
                                <AiOutlinePlus />
                            </button>
                        </div>
                        <div className="bg-light p-2">
                            <ul className="list-unstyled">
                                {day.events.length > 0 ? (
                                    day.events.map((event, idx) => (
                                        <li
                                            key={`event-${monthIndex}-${idx}`}
                                            className="text-dark"
                                            onDoubleClick={() => handleEditEvent(monthIndex, dayIndex, idx)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            • {event}
                                        </li>
                                    ))
                                ) : (
                                    <></> // no events
                                )}
                            </ul>
                        </div>
                    </td>
                );
                dayCounter++;
            } else {
                week.push(<td key={`empty-${monthIndex}-${dayCounter + emptyCounter}`}></td>);
                emptyCounter++;
            }
        }
        weeks.push(<tr key={`week-${monthIndex}-${weeks.length}`}>{week}</tr>);
    }

    return weeks;
};
