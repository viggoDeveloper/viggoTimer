// Función para calcular las horas y minutos trabajados
const calculateWorkHours = (entryTimestamp, exitTimestamp) => {

    const diffMillis = exitTimestamp - entryTimestamp;
    const workHours = Math.floor(diffMillis / (1000 * 60 * 60));
    const workMinutes = Math.floor((diffMillis % (1000 * 60 * 60)) / (1000 * 60));

    return {
        workHours: `${workHours} Horas ${workMinutes} mins`,
    }
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
