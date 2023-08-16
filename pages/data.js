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
          if (groupedData[day].length === 2) {
            const entryTimestamp = groupedData[day][0].timestamp;
            const exitTimestamp = groupedData[day][1].timestamp;
            const diffMillis = exitTimestamp - entryTimestamp;
            const diffHours = diffMillis / 1000 / 60 / 60;
            calculatedData.push({
              day,
              entry: entryTimestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              exit: exitTimestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              totalHours: diffHours.toFixed(2),
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
            <th>Total horas</th>
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};



// ... (import statements and component declaration)


const UserTimerDataa = ({ userId }) => {
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
            
            const diffMillis = exitTimestamp - entryTimestamp;
            const diffHours = Math.floor(diffMillis / (1000 * 60 * 60));
            const diffMinutes = Math.floor((diffMillis % (1000 * 60 * 60)) / (1000 * 60));
            
            calculatedData.push({
              day,
              entry: entryTimestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              exit: exitTimestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              totalHours: `${diffHours} hrs ${diffMinutes} mins`,
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
            <th>Total horas</th>
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ==========================================

const UserTimerDatae = ({ userId }) => {
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

            const diffMillis = exitTimestamp - entryTimestamp;
            const diffHours = diffMillis / (1000 * 60 * 60);
            const totalHours = Math.min(diffHours, 8); // Considering an 8-hour workday
            const overtimeHours = Math.max(0, diffHours - 8); // Calculate overtime hours
            const overtimeMinutes = (overtimeHours - Math.floor(overtimeHours)) * 60;

            calculatedData.push({
              day,
              entry: entryTimestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              exit: exitTimestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              totalHours: `${totalHours.toFixed(2)} hrs`,
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

export default UserTimerDatae;
