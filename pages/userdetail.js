import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { FirebaseContext } from '@/firebase';
import Link from 'next/link';
import Layout from '@/components/Layout/Layout';

import { calculateWorkHours, getSpanishDayOfWeek, formatTimeWithAmPm } from '@/hooks/helpers';

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
                        .where('timetype', 'in', ['Hora de Entrada', 'Hora De Salida'])
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

                        return {
                            day,
                            entry: entryRecord ? entryRecord.formattedTime : 'No marcada',
                            exit: exitRecord ? exitRecord.formattedTime : 'No marcada',
                            totalHours,
                            overtime,
                            dayOfWeek,
                            formattedTime,
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
    // console.log('data', userTimerData)

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
                        <th>Email</th>
                        <th>Fecha</th>
                        <th>Dia</th>
                        <th>Hora de Entrada</th>
                        <th>Hora de Salida</th>
                        <th>Total horas</th>
                        <th>Horas extras</th>
                    </tr>
                </thead>
                <tbody>
                    {userTimerData.map((data, index) => (
                        <tr key={index}>
                            <td>{userData.name}</td>
                            <td>{userData.lastname}</td>
                            <td>{userData.email}</td>
                            <td>{data.day}</td>
                            <td>{data.dayOfWeek}</td>
                            <td>{data.formattedTime}</td>
                            <td>{data.exit}</td>
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
