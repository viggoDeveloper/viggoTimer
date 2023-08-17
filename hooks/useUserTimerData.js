import { calculateDuration, calculateWorkHours, getSpanishDayOfWeek, formatTimeWithAmPm } from "./helpers";

export const processUserTimerDataForDay = (day, records) => {
    const entryRecord = records.find((record) => record.timetype === 'Hora de Entrada');
    const exitRecord = records.find((record) => record.timetype === 'Hora De Salida');

    let totalHours = 'No calculado';
    let overtime = 'No calculado';
    let lunchDuration = {};

    if (entryRecord || exitRecord) {
        if (entryRecord && exitRecord) {
            const entryTimestamp = entryRecord.timestamp;
            const exitTimestamp = exitRecord.timestamp;

            const { workHours } = calculateWorkHours(entryTimestamp, exitTimestamp);
            totalHours = workHours;
            // console.log({workHours})
            //overtime = overtimeHours;
            exitRecord.formattedTime = formatTimeWithAmPm(exitTimestamp);
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

        const dayOfWeek = entryTimestamp ? getSpanishDayOfWeek(entryTimestamp) : exitTimestamp ? getSpanishDayOfWeek(exitTimestamp) : 'No disponible';
        const formattedTime = entryTimestamp ? formatTimeWithAmPm(entryTimestamp) : exitTimestamp ? formatTimeWithAmPm(exitTimestamp) : 'No disponible';

        const lunchRecords = records.filter(
            (record) => record.timetype === 'Hora Salida Almuerzo' || record.timetype === 'Hora Fin Almuerzo'
        );

        let lunchTime = 'No calculado';

        if (lunchRecords.length === 2) {
            const lunchStart = lunchRecords.find((record) => record.timetype === 'Hora Salida Almuerzo').timestamp;
            const lunchEnd = lunchRecords.find((record) => record.timetype === 'Hora Fin Almuerzo').timestamp;

            lunchDuration = calculateDuration(lunchStart, lunchEnd);

            console.log({lunchDuration})

            // Formatea el tiempo de almuerzo en horas y minutos
            lunchTime = `${lunchDuration.hours} horas ${lunchDuration.minutes.toFixed(0)} minutos`;
        } else if (lunchRecords.length === 1) {
            const lunchRecord = lunchRecords[0];
            lunchTime = lunchRecord.timetype === 'Hora Salida Almuerzo' ? 'No marcó Hora Fin Almuerzo' : 'No marcó Hora Salida Almuerzo';
        }
        return {
            day,
            entry: entryRecord ? entryRecord.formattedTime : 'No marcada',
            exit: exitRecord ? exitRecord.formattedTime : 'No marcada',
            totalHours,
            overtime,
            dayOfWeek,
            formattedTime,
            lunchTime
        };
    } else {
        return {
            day,
            entry: 'No marcada',
            exit: 'No marcada',
            totalHours,
            overtime,
            dayOfWeek: 'No disponible',
            formattedTime: 'No disponible',
            lunchTime
        };
    }
}
