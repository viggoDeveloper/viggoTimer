function calculateWorkHoursMinusLunch(totalWorkHours, lunchDuration) {
    const totalMillis = totalWorkHours.hours * 60 * 60 * 1000 + totalWorkHours.minutes * 60 * 1000;
    const lunchMillis = lunchDuration.hours * 60 * 60 * 1000 + lunchDuration.minutes * 60 * 1000;

    const netMillis = totalMillis - lunchMillis;

    const netHours = Math.floor(netMillis / (60 * 60 * 1000));
    const netMinutes = Math.floor((netMillis % (60 * 60 * 1000)) / (60 * 1000));

    return { hours: netHours, minutes: netMinutes };
}

// Ejemplo de uso
const totalWorkHours = { hours: 8, minutes: 30 }; // Por ejemplo, 8 horas y 30 minutos
const lunchDuration = { hours: 1, minutes: 0 }; // Por ejemplo, 1 hora de almuerzo

const netWorkHours = calculateWorkHoursMinusLunch(totalWorkHours, lunchDuration);
console.log(netWorkHours); // Mostrará el tiempo neto de trabajo restando el almuerzo
