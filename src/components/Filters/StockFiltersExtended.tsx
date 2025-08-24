import React, { useState, useEffect } from "react";
import { BusinessDateRangePicker } from "../BusinessDateRangePicker";

type FiltersProps = {
    onChange: (filters: {
        dates: string[];
        volumeBreakout: boolean;
        deliveryBreakout: boolean;
        deliveryMultiplier: number;
    }) => void;
};

const defaultMultipliers = [1.2, 1.5, 2, 2.5, 3];

export const StockFiltersExtended: React.FC<FiltersProps> = ({ onChange }) => {
    const [dates, setDates] = useState<string[]>([]);
    const [volumeBreakout, setVolumeBreakout] = useState(false);
    const [deliveryBreakout, setDeliveryBreakout] = useState(false);
    const [deliveryMultiplier, setDeliveryMultiplier] = useState(1.5);
    const [customMultiplier, setCustomMultiplier] = useState("");

    useEffect(() => {
        let multiplier = deliveryMultiplier;
        if (customMultiplier) {
            const val = parseFloat(customMultiplier);
            if (!isNaN(val) && val > 0) multiplier = val;
        }
        onChange({ dates, volumeBreakout, deliveryBreakout, deliveryMultiplier: multiplier });
    }, [dates, volumeBreakout, deliveryBreakout, deliveryMultiplier, customMultiplier, onChange]);

    return (
        <div>
            <div>
                <label>Date Range:</label>
                <BusinessDateRangePicker onChange={setDates} />
            </div>

            <div style={{ marginTop: 8 }}>
                <label>
                    <input
                        type="checkbox"
                        checked={volumeBreakout}
                        onChange={() => setVolumeBreakout(!volumeBreakout)}
                    />
                    &nbsp;Volume Breakouts (volume higher than previous date)
                </label>
            </div>

            <div>
                <label>
                    <input
                        type="checkbox"
                        checked={deliveryBreakout}
                        onChange={() => setDeliveryBreakout(!deliveryBreakout)}
                    />
                    &nbsp;Delivery Breakouts (compared to previous date × multiplier)
                </label>
            </div>

            {deliveryBreakout && (
                <div style={{ marginTop: 8 }}>
                    <label>
                        Multiplier:&nbsp;
                        <select
                            value={customMultiplier ? "custom" : deliveryMultiplier.toString()}
                            onChange={(e) => {
                                if (e.target.value === "custom") {
                                    setCustomMultiplier("");
                                } else {
                                    setDeliveryMultiplier(parseFloat(e.target.value));
                                    setCustomMultiplier("");
                                }
                            }}
                        >
                            {defaultMultipliers.map((v) => (
                                <option key={v} value={v.toString()}>
                                    {v.toFixed(1)}x
                                </option>
                            ))}
                            <option value="custom">Custom</option>
                        </select>
                    </label>
                    {customMultiplier !== "" || (deliveryBreakout && !defaultMultipliers.includes(deliveryMultiplier)) && (
                        <input
                            type="number"
                            min="1"
                            step="0.1"
                            value={customMultiplier}
                            onChange={(e) => setCustomMultiplier(e.target.value)}
                            style={{ width: 80, marginLeft: 10 }}
                        />
                    )}
                </div>
            )}
        </div>
    );
};
