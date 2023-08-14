const fetchUserById = async () => {
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
        const userData = snapshot.docs.map((doc) => doc.data());
        setData(userData)

        const userTimerData = snapshot.docs.map((doc) => {
            const {
                brand,
                campus,
                city,
                document,
                email,
                hour,
                lastname,
                name,
                phone,
                post,
                reason,
                timetype
            } = doc.data();

            const timestamp = hour;
            const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
            const day = date.getDate();
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

            return {
                brand,
                campus,
                city,
                email,
                lastname,
                document,
                name,
                phone,
                post,
                reason,
                formattedDate,
                formattedDateTime,
                timetype: timetype,
                day: `${day}/${month}/${year}`,
            };
        });
        //setUserTimerData(userTimerData);
    } catch (error) {
        console.log('Error usuario no encontrado', error);
    }
}


// ================================

import React, { useEffect, useState } from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';

const UserTimerData = ({ userId }) => {
    const [userData, setUserData] = useState({});
    const [userTimerData, setUserTimerData] = useState([]);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const db = firebase.firestore();
                const userRef = db.collection('users').doc(userId);
                const userDoc = await userRef.get();
                if (userDoc.exists) {
                    setUserData(userDoc.data());
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        const fetchUserTimerData = async () => {
            try {
                const db = firebase.firestore();
                const userTimerRef = db.collection('userTimer');

                const userRef = db.collection('users').doc(userId);

                const snapshot = await userTimerRef
                    .where('idUser', '==', userRef)
                    .where('timetype', 'in', ['Hora de Entrada', 'Hora de Salida'])
                    .orderBy('hour')
                    .get();

                const groupedData = {};
                snapshot.docs.forEach((doc) => {
                    const timestamp = doc.data().hour;
                    const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
                    const day = date.toDateString();

                    if (!groupedData[day]) {
                        groupedData[day] = [];
                    }

                    groupedData[day].push({
                        timetype: doc.data().timetype,
                        timestamp: date,
                    });
                });

                const calculatedData = [];
                for (const day in groupedData) {
                    const entryRecord = groupedData[day].find(record => record.timetype === 'Hora de Entrada');
                    const exitRecord = groupedData[day].find(record => record.timetype === 'Hora de Salida');

                    if (entryRecord && exitRecord) {
                        const entryTimestamp = entryRecord.timestamp;
                        const exitTimestamp = exitRecord.timestamp;

                        const workHours = 8; // Jornada laboral de 8 horas
                        const totalWorkMillis = workHours * 60 * 60 * 1000;

                        const diffMillis = exitTimestamp - entryTimestamp;
                        const overtimeMillis = Math.max(diffMillis - totalWorkMillis, 0);
                        const overtimeHours = overtimeMillis / (1000 * 60 * 60);
                        const overtimeMinutes = (overtimeHours - Math.floor(overtimeHours)) * 60;

                        calculatedData.push({
                            day,
                            entry: entryTimestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                            exit: exitTimestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                            totalHours: `${workHours.toFixed(2)} hrs`,
                            overtime: `${Math.floor(overtimeHours)} hrs ${overtimeMinutes.toFixed(0)} mins`,
                        });
                    } else {
                        // Handle cases where there's no entry or exit record
                        calculatedData.push({
                            day,
                            entry: entryRecord ? entryRecord.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'No marcó hora de entrada',
                            exit: exitRecord ? exitRecord.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'No marcó hora de salida',
                            totalHours: 'N/A',
                            overtime: 'N/A',
                        });
                    }
                }

                setUserTimerData(calculatedData);
            } catch (error) {
                console.error('Error fetching userTimer data:', error);
            }
        };

        fetchUserData();
        fetchUserTimerData();
    }, [userId]);

    return (
        <div>
            <h2>Datos del Usuario y Horas Trabajadas</h2>
            <table>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Apellido</th>
                        <th>Email</th>
                        <th>Fecha</th>
                        <th>Hora de Entrada</th>
                        <th>Hora de Salida</th>
                        <th>Horas laborales</th>
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
        </div>
    );
};

export default UserTimerData;
