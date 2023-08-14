import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { FirebaseContext } from '@/firebase';
import Link from 'next/link';
import Layout from '@/components/Layout/Layout';

const UserDetail = () => {
    const router = useRouter();
    const { id } = router.query;
    const [userData, setUserData] = useState({});
    const [userTimerData, setUserTimerData] = useState([]);

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

                const groupedData = {};
                snapshot.docs.forEach((doc) => {
                    const timestamp = doc.data().hour;
                    const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
                    const day = date.toDateString();

                    const days = date.getDate();
                    const month = date.getMonth() + 1; // Sumamos 1 porque los meses en JavaScript son base 0
                    const year = date.getFullYear();
                    const options = { weekday: 'long' };
                    const formattedDate = date.toLocaleDateString('es-ES', options);

                    const hours = date.getHours();
                    const minutes = date.getMinutes();
                    const ampm = hours >= 12 ? 'PM' : 'AM';
                    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
                    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
                    const formattedDateTime = `${formattedHours}:${formattedMinutes} ${ampm}`;


                    if (!groupedData[day]) {
                        groupedData[day] = [];
                    }

                    groupedData[day].push({
                        timetype: doc.data().timetype,
                        timestamp: date,
                        formattedDate,
                        formattedDateTime,
                        day: `${days}/${month}/${year}`,
                    });

                });

                const calculatedData = [];
                for (const day in groupedData) {
                    if (groupedData[day].length === 2) {

                        const entryRecord = groupedData[day].find(record => {
                            return record.timetype === 'Hora de Entrada';
                        });
                        const exitRecord = groupedData[day].find(record => {
                            return record.timetype === 'Hora De Salida';
                        });


                        if (entryRecord && exitRecord) {
                            const entryTimestamp = entryRecord.timestamp;
                            const exitTimestamp = exitRecord.timestamp;

                            const diffMillis = exitTimestamp - entryTimestamp;
                            const diffHours = Math.floor(diffMillis / (1000 * 60 * 60));
                            const diffMinutes = Math.floor((diffMillis % (1000 * 60 * 60)) / (1000 * 60));
                            const overtimeHours = Math.max(0, diffHours - 8); // Calculate overtime hours
                            const overtimeMinutes = (overtimeHours - Math.floor(overtimeHours)) * 60;


                            calculatedData.push({
                                day,
                                entry: entryTimestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                                exit: exitTimestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                                totalHours: `${diffHours} hrs ${diffMinutes} mins`,
                                overtime: `${Math.floor(overtimeHours)} hrs ${overtimeMinutes.toFixed(0)} mins`,
                            });
                        } else {
                            if (entryRecord) {
                                calculatedData.push({
                                    day,
                                    entry: entryRecord.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                                    exit: 'No marcó hora de salida',
                                    totalHours: 'N/A',
                                });
                            } else if (exitRecord) {
                                calculatedData.push({
                                    day,
                                    entry: 'No marcó hora de entrada',
                                    exit: exitRecord.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                                    totalHours: 'N/A',
                                });
                            } else {
                                calculatedData.push({
                                    day,
                                    entry: 'No marcó hora de entrada',
                                    exit: 'No marcó hora de salida',
                                    totalHours: 'N/A',
                                });
                            }
                        }
                    }
                }
                setUserTimerData(calculatedData);
            } catch (error) {
                console.error('Error fetching userTimer data:', error);
            }
        };
        fetchUserData();
        fetchUserTimerData();
    }, [id]);
    console.log('data', userTimerData)

    return (
        <Layout>
            <Link href="/usuarios">
                Volver
            </Link>
            <h1>Detalles del Usuario: {id}</h1>
            <table>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Apellido</th>
                        <th>Email</th>
                        <th>Fecha</th>
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
                            <td>{data.entry}</td>
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
