import { calculateDuration, calculateOvertime, calculateWorkHours, getSpanishDayOfWeek, formatTimeWithAmPm } from "./helpers";

export const processUserTimerDataForDay = (day, records) => {
    const entryRecord = records.find((record) => record.timetype === 'Hora de Entrada');
    const exitRecord = records.find((record) => record.timetype === 'Hora De Salida');
    const lunchStartRecord = records.find((record) => record.timetype === 'Hora Salida Almuerzo');
    const lunchEndRecord = records.find((record) => record.timetype === 'Hora Fin Almuerzo');

    let totalHours = 'No calculado';
    let overtime = 'No calculado';
    let lunchTime = 'No calculado';
    let lunchDuration = {};
    let calculateWork = {};

    if (entryRecord || exitRecord) {
        if (lunchStartRecord && lunchEndRecord) {
            const lunchStart = lunchStartRecord.timestamp;
            const lunchEnd = lunchEndRecord.timestamp;

            lunchDuration = calculateDuration(lunchStart, lunchEnd);
            lunchTime = `${lunchDuration.hours} horas ${lunchDuration.minutes.toFixed(0)} minutos`;
        } else if (!lunchStartRecord && !lunchEndRecord) {
            lunchTime = 'No marcó tiempo de almuerzo';
        }

        if (entryRecord && exitRecord) {
            const entryTimestamp = entryRecord.timestamp;
            const exitTimestamp = exitRecord.timestamp;

            calculateWork = calculateWorkHours(entryTimestamp, exitTimestamp, lunchDuration);
            console.log('calculateWork', calculateWork)

            if (calculateWork.hours === 'No calculado') {
                totalHours = calculateWork.hours;
            } else {
                totalHours = `${calculateWork.hours} horas ${calculateWork.minutes.toFixed(0)} minutos`;
            }
            exitRecord.formattedTime = formatTimeWithAmPm(exitTimestamp);
        } else {
            if (!entryRecord) {
                totalHours = 'No marcó Hora de Entrada';
            }
            if (!exitRecord) {
                totalHours = 'No marcó Hora De Salida';
            }
        }

        let overtimer = calculateOvertime(calculateWork, lunchDuration);
        console.log('over', overtimer)
        overtime = `${overtimer.hours} horas ${overtimer.minutes.toFixed(0)} minutos`;

        const entryTimestamp = entryRecord ? entryRecord.timestamp : null;
        const exitTimestamp = exitRecord ? exitRecord.timestamp : null;

        const dayOfWeek = entryTimestamp ? getSpanishDayOfWeek(entryTimestamp) : exitTimestamp ? getSpanishDayOfWeek(exitTimestamp) : 'No disponible';
        const formattedTime = entryTimestamp ? formatTimeWithAmPm(entryTimestamp) : exitTimestamp ? formatTimeWithAmPm(exitTimestamp) : 'No disponible';

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
};
