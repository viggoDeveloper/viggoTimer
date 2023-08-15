const userTimerData = Object.entries(groupedData).map(([day, records]) => {
    const entryRecord = records.find((record) => record.timetype === 'Hora de Entrada');
    const exitRecord = records.find((record) => record.timetype === 'Hora De Salida');

    let totalHours = 'No calculado';
    let overtime = 'No calculado';

    if (entryRecord || exitRecord) {
        if (entryRecord && exitRecord) {
            const entryTimestamp = entryRecord.timestamp;
            const exitTimestamp = exitRecord.timestamp;

            const { workHours, overtime: overtimeHours } = calculateWorkHours(entryTimestamp, exitTimestamp);
            totalHours = workHours;
            overtime = overtimeHours;
        } else {
            if (!entryRecord) {
                totalHours = 'No marcó Hora de Entrada';
            }
            if (!exitRecord) {
                totalHours = 'No marcó Hora De Salida';
            }
        }

        // Calcula formattedDate, dayOfWeek y formattedTime
        const entryTimestamp = entryRecord ? entryRecord.timestamp : null;
        const exitTimestamp = exitRecord ? exitRecord.timestamp : null;

        const formattedDate = entryTimestamp ? formatDate(entryTimestamp) : exitTimestamp ? formatDate(exitTimestamp) : 'No disponible';
        const dayOfWeek = entryTimestamp ? getSpanishDayOfWeek(entryTimestamp) : exitTimestamp ? getSpanishDayOfWeek(exitTimestamp) : 'No disponible';
        const formattedTime = entryTimestamp ? formatTimeWithAmPm(entryTimestamp) : exitTimestamp ? formatTimeWithAmPm(exitTimestamp) : 'No disponible';

        return {
            day,
            entry: entryRecord ? entryRecord.formattedTime : 'No marcada',
            exit: exitRecord ? exitRecord.formattedTime : 'No marcada',
            totalHours,
            overtime,
            formattedDate,
            dayOfWeek,
            formattedTime,
        };
    } else {
        return {
            day,
            entry: 'No marcada',
            exit: 'No marcada',
            totalHours,
            overtime,
            formattedDate: 'No disponible',
            dayOfWeek: 'No disponible',
            formattedTime: 'No disponible',
        };
    }
});

// ...

function formatDate(timestamp) {
    const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
    return date.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

function getSpanishDayOfWeek(timestamp) {
    const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const dayIndex = timestamp.getDay();
    return daysOfWeek[dayIndex];
}

function formatTimeWithAmPm(timestamp) {
    const hours = timestamp.getHours();
    const minutes = timestamp.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
}
