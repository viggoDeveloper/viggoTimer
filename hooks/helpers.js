// Función para calcular las horas y minutos trabajados
function calculateWorkHours(entryTimestamp, exitTimestamp, lunchDuration) {
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

// Función para obtener el día de la semana en español
function getSpanishDayOfWeek(timestamp) {
    const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const dayIndex = timestamp.getDay();
    return daysOfWeek[dayIndex];
}

// Función para formatear la hora con AM/PM si es necesario
const formatTimeWithAmPm = (timestamp) => {
    const hours = timestamp.getHours();
    const minutes = timestamp.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    return `${hours}:${minutes < 10 ? `0${minutes}` : minutes} ${ampm}`;
};

// Función para calcular la duración entre dos marcas de tiempo
function calculateDuration(startTime, endTime) {
    const durationMillis = endTime - startTime;
    const hours = Math.floor(durationMillis / (1000 * 60 * 60));
    const totalMinutes = durationMillis / (1000 * 60);
    const minutes = Math.floor(totalMinutes) % 60;

    return {
        hours,
        minutes,
    };
};

function calculateOvertime(totalWorkHours, lunchDuration) {
    const standardWorkHours = 8; // Jornada laboral habitual de 8 horas

    const totalMinutesWorked = totalWorkHours.hours * 60 + totalWorkHours.minutes;
    const adjustedTotalMinutesWorked = totalMinutesWorked - (standardWorkHours * 60 - (lunchDuration.hours * 60 + lunchDuration.minutes));

    if (adjustedTotalMinutesWorked <= 0) {
        return {
            hours: 0,
            minutes: 0,
        };
    }

    const hours = Math.floor(adjustedTotalMinutesWorked / 60);
    const minutes = Math.round(adjustedTotalMinutesWorked % 60);

    return {
        hours,
        minutes,
    };
};

module.exports = {
    calculateDuration,
    calculateWorkHours,
    calculateOvertime,
    getSpanishDayOfWeek,
    formatTimeWithAmPm,
}
