import React, { useState, useEffect } from "react";
import {
    isBusinessDay,
    getBusinessDatesBetween,
    formatDateForBackend,
} from "../utils/utilities";

type Props = {
    onChange: (dates: string[]) => void;
};

export const BusinessDateRangePicker: React.FC<Props> = ({ onChange }) => {
    const [fromDate, setFromDate] = useState<Date | null>(
        new Date(new Date().setDate(new Date().getDate() - 30))
    );
    const [toDate, setToDate] = useState<Date | null>(new Date());

    useEffect(() => {
        if (!fromDate || !toDate || fromDate > toDate) return;
        const datesArr = getBusinessDatesBetween(fromDate, toDate);
        onChange(datesArr.map(formatDateForBackend));
    }, [fromDate, toDate, onChange]);

    const navigateRange = (direction: "prev" | "next") => {
        if (!fromDate || !toDate) return;

        const datesInRange = getBusinessDatesBetween(fromDate, toDate);
        const length = datesInRange.length;

        const moveDate = (date: Date, steps: number) => {
            const d = new Date(date);
            let moved = 0;
            const step = steps > 0 ? 1 : -1;
            while (moved < Math.abs(steps)) {
                d.setDate(d.getDate() + step);
                if (isBusinessDay(d)) {
                    moved++;
                }
            }
            return d;
        };

        setFromDate(moveDate(fromDate, direction === "next" ? length : -length));
        setToDate(moveDate(toDate, direction === "next" ? length : -length));
    };

    return (
        <div>
            <label>
                From:{" "}
                <input
                    type="date"
                    value={fromDate?.toISOString().slice(0, 10) || ""}
                    onChange={(e) => setFromDate(new Date(e.target.value))}
                />
            </label>{" "}
            <label>
                To:{" "}
                <input
                    type="date"
                    value={toDate?.toISOString().slice(0, 10) || ""}
                    onChange={(e) => setToDate(new Date(e.target.value))}
                />
            </label>{" "}
            <button onClick={() => navigateRange("prev")}>Previous</button>{" "}
            <button onClick={() => navigateRange("next")}>Next</button>
        </div>
    );
};
