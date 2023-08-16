import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { FirebaseContext } from '@/firebase';
import Link from 'next/link';
import Layout from '@/components/Layout/Layout';

import { calculateDuration, calculateWorkHours, getSpanishDayOfWeek, formatTimeWithAmPm } from '@/hooks/helpers';

const UserDetail = () => {
    const router = useRouter();
    const { id } = router.query;
    const [userData, setUserData] = useState({});
    const [userTimerData, setUserTimerData] = useState([]);
    const [groupedData, setGroupedData] = useState({});

    const { usuario, firebase } = useContext(FirebaseContext);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const db = firebase.queryCollection();
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
                const snapshot =
                    await userRefCollection
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

                const userTimerData = Object.entries(newGroupedData).map(([day, records]) => {
                    const entryRecord = records.find((record) => record.timetype === 'Hora de Entrada');
                    const exitRecord = records.find((record) => record.timetype === 'Hora De Salida');

                    let totalHours = 'No calculado';
                    let overtime = 'No calculado';

                    if (entryRecord || exitRecord) {
                        if (entryRecord && exitRecord) {

                            const entryTimestamp = entryRecord.timestamp;
                            const exitTimestamp = exitRecord.timestamp;

                            const { workHours, overtime: overtimeHours } = calculateWorkHours(entryTimestamp, exitTimestamp);
                            totalHours = workHours;
                            overtime = overtimeHours;
                            // Formatear fechas y horas en formato deseado
                            entryRecord.formattedTime = formatTimeWithAmPm(entryTimestamp);
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

                            const lunchDuration = calculateDuration(lunchStart, lunchEnd);
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
                });
                setUserTimerData(userTimerData);
            } catch (error) {
                console.error('Error fetching userTimer data:', error);
            }
        };
        fetchUserData();
        fetchUserTimerData();
    }, [id, firebase]);
    console.log('data', userTimerData)

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
