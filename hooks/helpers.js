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

// const guardarRegistrosEnFirebase = async (db, userId, registros) => {
//     try {
//         const userDetailsRef = db.collection('userDetails').doc(userId);
//         // Verificar si el documento userDetails ya existe
//         const userDetailsDoc = await userDetailsRef.get();

//         if (!userDetailsDoc.exists) {
//             // Si no existe, crear el documento userDetails
//             await userDetailsRef.set({ userId });

//             // Crear la subcolección 'registros' dentro de userDetails
//             await userDetailsRef.collection('registros').doc('placeholder').set({});
//         }
//         // Obtener la referencia a la subcolección 'registros' dentro de userDetails
//         const registrosCollectionRef = userDetailsRef.collection('registros');

//         const today = new Date();
//         const dayKey = today.toISOString().substring(0, 10); // Formato YYYY-MM-DD

//         //const existingRecord = await registrosCollectionRef.doc(dayKey).get();

//         // if (existingRecord.exists) {
//         //     // Si el registro ya existe, actualiza los datos
//         //     await registrosCollectionRef.doc(dayKey).update({ registros });
//         // } else {
//         //     // Si el registro no existe, crea uno nuevo
//         //     await registrosCollectionRef.doc(dayKey).set({ registros });
//         // }

//         console.log('Registros guardados exitosamente.');
//     } catch (error) {
//         console.error('Error al guardar registros:', error);
//     }
// };

//=======================================================================

// Obtener la lista de usuarios desde Firebase
// export const obtenerUsuarios = async (db) => {
//     try {
//         const usersCollection = db.collection('users');
//         const usersSnapshot = await usersCollection.get();

//         const usuarios = [];
//         usersSnapshot.forEach((doc) => {
//             const usuario = doc.data();
//             usuarios.push({ id: doc.id, ...usuario });
//         });

//         return usuarios;
//     } catch (error) {
//         console.error('Error al obtener usuarios:', error);
//         return [];
//     }
// };
// // Obtener los registros de un usuario desde Firebase
// export const obtenerRegistrosUsuario = async (db, userId) => {
//     try {
//         const userDetailsRef = db.collection('userDetails').doc(userId);
//         const registrosCollectionRef = userDetailsRef.collection('registros');

//         const registrosSnapshot = await registrosCollectionRef.get();

//         const registros = [];
//         registrosSnapshot.forEach((doc) => {
//             const registro = doc.data();
//             registros.push({ id: doc.id, ...registro });
//         });

//         return registros;
//     } catch (error) {
//         console.error('Error al obtener registros de usuario:', error);
//         return [];
//     }
// };
// // Guardar registros en Firebase para todos los usuarios
// export const guardarRegistrosParaTodosLosUsuarios = async (db) => {
//     const usuarios = await obtenerUsuarios(db);

//     for (const usuario of usuarios) {
//         const registros = await obtenerRegistrosUsuario(db, usuario.id);
//         await guardarRegistrosEnFirebase(db, usuario.id, registros);
//     }
// };


// // Guardar registros en Firebase para un usuario
// export const guardarRegistrosEnFirebase = async (db, userId, registros) => {
//     try {
//         const userDetailsRef = db.collection('userDetails').doc(userId);
//         const registrosCollectionRef = userDetailsRef.collection('registros');

//         const today = new Date();
//         const dayKey = today.toISOString().substring(0, 10); // Formato YYYY-MM-DD

//         const existingRecord = await registrosCollectionRef.doc(dayKey).get();

//         if (existingRecord.exists) {
//             // Si el registro ya existe, actualiza los datos
//             await registrosCollectionRef.doc(dayKey).update({ registros });
//         } else {
//             // Si el registro no existe, crea uno nuevo
//             await registrosCollectionRef.doc(dayKey).set({ registros });
//         }

//         console.log(`Registros guardados exitosamente para el usuario ${userId}`);
//     } catch (error) {
//         console.error('Error al guardar registros:', error);
//     }
// };

module.exports = {
    calculateDuration,
    calculateWorkHours,
    calculateOvertime,
    getSpanishDayOfWeek,
    formatTimeWithAmPm,
    //guardarRegistrosEnFirebase,
    // obtenerUsuarios,
    // obtenerRegistrosUsuario,
    // guardarRegistrosParaTodosLosUsuarios
}
