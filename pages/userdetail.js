import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { FirebaseContext } from '@/firebase';
import Link from 'next/link';
import Layout from '@/components/Layout/Layout';
import { processUserTimerDataForDay } from '@/hooks/useUserTimerData';
// import { guardarRegistrosEnFirebase } from '@/hooks/helpers';
// import { guardarRegistrosParaTodosLosUsuarios } from '@/hooks/helpers';

const UserDetail = () => {
    const router = useRouter();
    const { id } = router.query;
    const [userData, setUserData] = useState({});
    const [userTimerData, setUserTimerData] = useState([]);
    const [groupedData, setGroupedData] = useState({});

    const { usuario, firebase } = useContext(FirebaseContext);
    const db = firebase.queryCollection();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
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
            try {
                const db = firebase.queryCollection();
                const userRefCollection = db.collection('timeUser');
                const userRef = db.collection('users').doc(id);
                const snapshot = await userRefCollection
                    .where('idUser', '==', userRef)
                    .where('timetype', 'in', ['Hora de Entrada', 'Hora De Salida', 'Hora Salida Almuerzo', 'Hora Fin Almuerzo'])
                    .orderBy('hour', 'desc')
                    .get();

                //const groupedData = {};
                const newGroupedData = {};

                snapshot.docs.forEach((doc) => {
                    const data = doc.data();
                    const timestamp = data.hour;
                    const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
                    const day = date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });

                    if (!newGroupedData[day]) {
                        newGroupedData[day] = [];
                    }

                    newGroupedData[day].push({
                        timetype: data.timetype,
                        timestamp: date,
                        formattedTime: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    });
                });
                setGroupedData(newGroupedData)
                //console.log('groupedData', groupedData)
                const processedData = Object.entries(newGroupedData).map(([day, records]) =>
                    processUserTimerDataForDay(day, records)
                );

                setUserTimerData(processedData);

                // guardarRegistrosEnFirebase(db, id, processedData);
                // Intervalo para automatizar el guardado cada 5 minutos
                // const saveInterval = setInterval(() => {
                //     guardarRegistrosEnFirebase(db, id, processedData);
                // }, 2 * 60 * 1000); // 5 minutos

                // return () => {
                //     clearInterval(saveInterval); // Limpiar intervalo al desmontar componente
                // };
            } catch (error) {
                console.error('Error fetching userTimer data:', error);
            }
        };
        fetchUserData();
        fetchUserTimerData();

        // Automatizar el proceso de guardar registros para todos los usuarios cada 20 segundos
        // const intervalId = setInterval(async () => {
        //     await guardarRegistrosParaTodosLosUsuarios(db);
        //     console.log('Registros guardados para todos los usuarios.');
        // }, 20000); // 20 segundos

        // // Detener el intervalo al desmontar el componente
        // return () => clearInterval(intervalId);

    }, [id, firebase, userTimerData]);

    return (
        <Layout>
            <Link href="/usuarios">
                Volver
            </Link>
            <h1>Detalles del Usuario: {id}</h1>
            <span>{userData.name}</span>
            <td>{userData.lastname}</td>
            <td>{userData.email}</td>
            <table>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Apellido</th>
                        <th>Fecha</th>
                        <th>Dia</th>
                        <th>Hora de Entrada</th>
                        <th>Hora de Salida</th>
                        <th>Tiempo de Almuerzo</th>
                        <th>Total horas</th>
                        <th>Horas extras</th>
                    </tr>
                </thead>
                <tbody>
                    {userTimerData.map((data, index) => (
                        <tr key={index}>
                            <td>{userData.name}</td>
                            <td>{userData.lastname}</td>
                            <td>{data.day}</td>
                            <td>{data.dayOfWeek}</td>
                            <td>{data.formattedTime}</td>
                            <td>{data.exit}</td>
                            <td>{data.lunchTime}</td>
                            <td>{data.totalHours}</td>
                            <td>{data.overtime}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Layout>
    );
};

export default UserDetail;
