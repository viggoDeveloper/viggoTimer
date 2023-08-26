// Obtener la lista de usuarios desde Firebase
export const obtenerUsuarios = async (db) => {
    try {
        const usersCollection = db.collection('users');
        const usersSnapshot = await usersCollection.get();

        const usuarios = [];
        usersSnapshot.forEach((doc) => {
            const usuario = doc.data();
            usuarios.push({ id: doc.id, ...usuario });
        });

        return usuarios;
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        return [];
    }
};
// Obtener los registros de un usuario desde Firebase
export const obtenerRegistrosUsuario = async (db, userId) => {
    try {
        const userDetailsRef = db.collection('userDetails').doc(userId);
        const registrosCollectionRef = userDetailsRef.collection('registros');

        const registrosSnapshot = await registrosCollectionRef.get();

        const registros = [];
        registrosSnapshot.forEach((doc) => {
            const registro = doc.data();
            registros.push({ id: doc.id, ...registro });
        });

        return registros;
    } catch (error) {
        console.error('Error al obtener registros de usuario:', error);
        return [];
    }
};
// Guardar registros en Firebase para todos los usuarios
export const guardarRegistrosParaTodosLosUsuarios = async (db) => {
    const usuarios = await obtenerUsuarios(db);

    for (const usuario of usuarios) {
        const registros = await obtenerRegistrosUsuario(db, usuario.id);
        await guardarRegistrosEnFirebase(db, usuario.id, registros);
    }
};


// Guardar registros en Firebase para un usuario
export const guardarRegistrosEnFirebase = async (db, userId, registros) => {
    try {
        const userDetailsRef = db.collection('userDetails').doc(userId);
        const registrosCollectionRef = userDetailsRef.collection('registros');

        const today = new Date();
        const dayKey = today.toISOString().substring(0, 10); // Formato YYYY-MM-DD

        const existingRecord = await registrosCollectionRef.doc(dayKey).get();

        if (existingRecord.exists) {
            // Si el registro ya existe, actualiza los datos
            await registrosCollectionRef.doc(dayKey).update({ registros });
        } else {
            // Si el registro no existe, crea uno nuevo
            await registrosCollectionRef.doc(dayKey).set({ registros });
        }

        console.log(`Registros guardados exitosamente para el usuario ${userId}`);
    } catch (error) {
        console.error('Error al guardar registros:', error);
    }
};

import React, { useState, useEffect, useContext } from 'react';
import { FirebaseContext } from '@/firebase';
import Link from 'next/link';
import Layout from '@/components/Layout/Layout';
import { processUserTimerDataForDay } from '@/hooks/useUserTimerData';
import { guardarRegistrosParaTodosLosUsuarios } from '@/hooks/helpers';

const UserDetail = () => {
    const { firebase } = useContext(FirebaseContext);
    const router = useRouter();
    const { id } = router.query;
    const [userData, setUserData] = useState({});
    const [userTimerData, setUserTimerData] = useState([]);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const db = firebase.firestore();
                const userRefCollection = db.collection('users').doc(id);
                const userDoc = await userRefCollection.get();
                if (userDoc.exists) {
                    setUserData(userDoc.data());
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        const fetchUserTimerData = async () => {
            // ... (tu código existente para obtener registros de usuario)
        };

        const guardarRegistrosUsuario = async () => {
            const db = firebase.firestore();
            const registros = await obtenerRegistrosUsuario(db, id);
            await guardarRegistrosEnFirebase(db, id, registros);
        };

        // Automatizar el proceso de guardar registros para todos los usuarios cada 20 segundos
        const intervalId = setInterval(async () => {
            await guardarRegistrosParaTodosLosUsuarios(firebase.firestore());
            console.log('Registros guardados para todos los usuarios.');
        }, 20000); // 20 segundos

        // Detener el intervalo al desmontar el componente
        return () => clearInterval(intervalId);

        fetchUserData();
        fetchUserTimerData();
    }, [id, firebase]);

    // ... (código para renderizar la interfaz del usuario)

    return (
        <Layout>
            <Link href="/usuarios">Volver</Link>
            <h1>Detalles del Usuario: {id}</h1>
            <span>{userData.name}</span>
            {/* ... (código para renderizar la tabla de registros) */}
        </Layout>
    );
};

export default UserDetail;


    // guardarRegistrosEnFirebase(db, id, processedData);
                // Intervalo para automatizar el guardado cada 5 minutos
                // const saveInterval = setInterval(() => {
                //     guardarRegistrosEnFirebase(db, id, processedData);
                // }, 2 * 60 * 1000); // 5 minutos

                // return () => {
                //     clearInterval(saveInterval); // Limpiar intervalo al desmontar componente
                // };