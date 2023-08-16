function calculateWorkHours(entryTimestamp, exitTimestamp, lunchDuration) {
    const workHours = 8; // Jornada laboral de 8 horas
    const totalWorkMillis = workHours * 60 * 60 * 1000;

    const diffMillis = exitTimestamp - entryTimestamp;
    const overtimeMillis = Math.max(diffMillis - totalWorkMillis, 0);

    // Calcula las horas extras sin considerar el almuerzo
    const overtimeHours = Math.floor(overtimeMillis / (1000 * 60 * 60));
    const overtimeMinutes = Math.floor((overtimeMillis / (1000 * 60)) % 60);

    // Resta el tiempo del almuerzo de las horas extras
    const adjustedOvertimeHours = overtimeHours - lunchDuration.hours;
    const adjustedOvertimeMinutes = overtimeMinutes - lunchDuration.minutes;

    // Asegura que los minutos no sean negativos
    if (adjustedOvertimeMinutes < 0) {
        adjustedOvertimeHours--;
        adjustedOvertimeMinutes += 60;
    }

    return {
        workHours: `${workHours} hrs 0 mins`, // Trabajo normal de 8 horas
        overtime: `${adjustedOvertimeHours} hrs ${adjustedOvertimeMinutes} mins`,
    };
}

/**************************/

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


/***************************** */
// Calcular la jornada laboral total (jornada habitual + tiempo de descanso)
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

// Formatear las horas extras en un string legible
const formattedOvertime = `${overtimeHours} hrs ${overtimeMinutes} mins`;

