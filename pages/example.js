export const calculateWorkHours = (entryTimestamp, exitTimestamp, lunchDuration) => {
    if (!entryTimestamp || !exitTimestamp) {
        return {
            hours: NaN,
            minutes: NaN,
        };
    }

    let workMinutes;

    if (lunchDuration) {
        const diffMillis = exitTimestamp - entryTimestamp;
        const totalMinutes = diffMillis / (1000 * 60);

        workMinutes = totalMinutes - (lunchDuration.hours * 60 + lunchDuration.minutes);
    } else {
        workMinutes = (exitTimestamp - entryTimestamp) / (1000 * 60);
    }

    const workHours = Math.floor(workMinutes / 60);
    const workMinutesRemaining = Math.round(workMinutes % 60);

    return {
        hours: workHours,
        minutes: workMinutesRemaining,
    };
};

export const calculateOvertime = (workHours, lunchDuration) => {
    const standardWorkHours = 8; // Jornada laboral estándar en horas

    if (isNaN(workHours) || isNaN(lunchDuration.hours) || isNaN(lunchDuration.minutes)) {
        return {
            hours: NaN,
            minutes: NaN,
        };
    }

    const totalWorkMinutes = workHours * 60 + lunchDuration.hours * 60 + lunchDuration.minutes;
    const overtimeMinutes = totalWorkMinutes - standardWorkHours * 60;

    if (overtimeMinutes < 0) {
        return {
            hours: 0,
            minutes: 0,
        };
    }

    const overtimeHours = Math.floor(overtimeMinutes / 60);
    const overtimeMinutesRemaining = Math.round(overtimeMinutes % 60);

    return {
        hours: overtimeHours,
        minutes: overtimeMinutesRemaining,
    };
};
