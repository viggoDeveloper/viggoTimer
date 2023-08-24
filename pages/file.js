const guardarRegistrosEnFirebase = async (db, userId, registros) => {
    console.log('userId', userId);
    console.log('registros', registros);
    console.log('db', db);

    try {
        const userDetailsRef = db.collection('userDetails').doc(userId);

        // Verificar si el documento userDetails ya existe
        const userDetailsDoc = await userDetailsRef.get();

        if (!userDetailsDoc.exists) {
            // Si no existe, crear el documento userDetails
            await userDetailsRef.set({ userId });

            // Crear la subcolección 'registros' dentro de userDetails
            await userDetailsRef.collection('registros').doc('placeholder').set({});
        }

        // Obtener la referencia a la subcolección 'registros' dentro de userDetails
        const registrosCollectionRef = userDetailsRef.collection('registros');

        const today = new Date();
        const dayKey = today.toISOString().substring(0, 10); // Formato YYYY-MM-DD

        const existingRecord = await registrosCollectionRef.doc(dayKey).get();

        // Agregar tiempo de espera de 20 segundos
        await new Promise(resolve => setTimeout(resolve, 40000));

        if (existingRecord.exists) {
            // Si el registro ya existe, actualiza los datos
            await registrosCollectionRef.doc(dayKey).update({ registros });
        } else {
            // Si el registro no existe, crea uno nuevo
            await registrosCollectionRef.doc(dayKey).set({ registros });
        }

        console.log('Registros guardados exitosamente.');
    } catch (error) {
        console.error('Error al guardar registros:', error);
    }
};
