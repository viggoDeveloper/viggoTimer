// Función para calcular las horas trabajadas y extras
function calculateWorkHours(entryTimestamp, exitTimestamp) {

    const totalWorkHours = 8; // Jornada habitual en horas
    const lunchDuration = { hours: 0, minutes: 30 }; // Tiempo de almuerzo en horas y minutos

    // Convertir el tiempo de almuerzo a minutos y luego a milisegundos
    const lunchMillis = (lunchDuration.hours * 60 + lunchDuration.minutes) * 60 * 1000;

    // Calcular la jornada laboral total en milisegundos
    const totalWorkMillis = totalWorkHours * 60 * 60 * 1000 + lunchMillis;

    // Calcular la duración del trabajo (hora de salida - hora de entrada) en milisegundos
    const durationInMillis = exitTimestamp - entryTimestamp;

    // Calcular las horas extras si la duración del trabajo es mayor que la jornada laboral total
    const overtimeMillis = Math.max(durationInMillis - totalWorkMillis, 0);

    // Convertir las horas extras en horas y minutos
    const overtimeHours = Math.floor(overtimeMillis / (1000 * 60 * 60));
    const overtimeMinutes = Math.floor((overtimeMillis / (1000 * 60)) % 60);

    const diffMillis = exitTimestamp - entryTimestamp;

    const workHoursMillis = Math.min(diffMillis, totalWorkMillis);
    const workHoursHours = Math.floor(workHoursMillis / (1000 * 60 * 60));
    const workHoursMinutes = Math.floor((workHoursMillis / (1000 * 60)) % 60);

    // Formatear las horas extras en un string legible
    const formattedOvertime = `${overtimeHours} hrs ${overtimeMinutes} mins`;
    return {
        workHours: `${workHoursHours} hrs ${workHoursMinutes} mins`,
        overtime: formattedOvertime,
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

// Función para calcular la duración entre dos marcas de tiempo
function calculateDuration(startTime, endTime) {
    const durationMillis = endTime - startTime;
    const hours = Math.floor(durationMillis / (1000 * 60 * 60));
    const minutes = (durationMillis / (1000 * 60)) % 60;

    return {
        hours,
        minutes,
    };
}

module.exports = {
    calculateDuration,
    calculateWorkHours,
    getSpanishDayOfWeek,
    formatTimeWithAmPm
}
