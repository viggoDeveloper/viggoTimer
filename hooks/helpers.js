// Función para calcular las horas trabajadas y extras
function calculateWorkHours(entryTimestamp, exitTimestamp) {
    const workHours = 8; // Jornada laboral de 8 horas
    const totalWorkMillis = workHours * 60 * 60 * 1000;

    const diffMillis = exitTimestamp - entryTimestamp;
    const overtimeMillis = Math.max(diffMillis - totalWorkMillis, 0);

    const workHoursMillis = Math.min(diffMillis, totalWorkMillis);
    const workHoursHours = Math.floor(workHoursMillis / (1000 * 60 * 60));
    const workHoursMinutes = Math.floor((workHoursMillis / (1000 * 60)) % 60);

    const overtimeHours = Math.floor(overtimeMillis / (1000 * 60 * 60));
    const overtimeMinutes = Math.floor((overtimeMillis / (1000 * 60)) % 60);

    return {
        workHours: `${workHoursHours} hrs ${workHoursMinutes} mins`,
        overtime: `${overtimeHours} hrs ${overtimeMinutes} mins`,
    };
}

// Función para obtener el día de la semana en español
function getSpanishDayOfWeek(timestamp) {
    const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const dayIndex = timestamp.getDay();
    return daysOfWeek[dayIndex];
}

// Función para formatear la hora en formato AM/PM
function formatTimeWithAmPm(timestamp) {
    const hours = timestamp.getHours();
    const minutes = timestamp.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
}


module.exports = {
    calculateWorkHours,
    getSpanishDayOfWeek,
    formatTimeWithAmPm
}