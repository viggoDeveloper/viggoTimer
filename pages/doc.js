// components/FirestoreTable.js

import React, { useState, useEffect } from 'react';
import { FaSearch, FaTimes, FaFilter } from 'react-icons/fa';
import firebase from 'firebase/app';
import 'firebase/firestore';

const FirestoreTable = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchCedula, setSearchCedula] = useState('');
  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const db = firebase.firestore();
        const snapshot = await db.collection('yourCollection').get();
        const items = snapshot.docs.map((doc) => doc.data());
        setData(items);
        setFilteredData(items);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleSearch = () => {
    if (searchCedula) {
      const filteredItems = data.filter((item) =>
        item.cedula.includes(searchCedula)
      );
      setFilteredData(filteredItems);
    } else {
      setFilteredData(data);
    }
  };

  const handleClearFilter = () => {
    setSearchCedula('');
    setFilteredData(data);
  };

  const handleToggleFilter = () => {
    setShowFilter(!showFilter);
    setSearchCedula('');
    setFilteredData(data);
  };

  return (
    <div>
      <h2>Tabla de Datos</h2>
      <button onClick={handleToggleFilter}>
        {showFilter ? <FaFilter /> : <FaSearch />}
      </button>
      {showFilter && (
        <div>
          <input
            type="text"
            placeholder="Buscar por Cédula"
            value={searchCedula}
            onChange={(e) => setSearchCedula(e.target.value)}
          />
          <button onClick={handleSearch}>
            <FaSearch />
          </button>
          <button onClick={handleClearFilter}>
            <FaTimes />
          </button>
          <button onClick={handleToggleFilter}>
            <FaTimes />
          </button>
        </div>
      )}
      {showFilter && (
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Cédula</th>
              <th>Edad</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <tr key={index}>
                <td>{item.nombre}</td>
                <td>{item.cedula}</td>
                <td>{item.edad}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';

const UserTimerData = ({ userId }) => {
  const [userTimerData, setUserTimerData] = useState([]);

  useEffect(() => {
    const fetchUserTimerData = async () => {
      try {
        const db = firebase.firestore();
        const userTimerRef = db.collection('userTimer');

        // Crea una referencia al documento de usuario con el ID recibido
        const userRef = db.collection('users').doc(userId);

        // Consulta y ordena los documentos en orden descendente según el campo hour, filtrando por timetype 'Hora de Entrada' y 'Hora de Salida'
        const snapshot = await userTimerRef
          .where('idUser', '==', userRef)
          .where('timetype', 'in', ['Hora de Entrada', 'Hora de Salida'])
          .orderBy('hour', 'desc')
          .get();

        const userTimerData = snapshot.docs.map((doc) => {
          const timestamp = doc.data().hour;
          const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
          const day = date.getDate();
          const month = date.getMonth() + 1; // Sumamos 1 porque los meses en JavaScript son base 0
          const year = date.getFullYear();
          const hours = date.getHours();
          const minutes = date.getMinutes();
          const ampm = hours >= 12 ? 'PM' : 'AM';
          const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
          const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
          const formattedDateTime = `${day}/${month}/${year} - ${formattedHours}:${formattedMinutes} ${ampm}`;
          return {
            timetype: doc.data().timetype,
            dateTime: formattedDateTime,
          };
        });
        setUserTimerData(userTimerData);
      } catch (error) {
        console.error('Error fetching userTimer data:', error);
      }
    };

    fetchUserTimerData();
  }, [userId]);

  return (
    <div>
      <h2>Datos de Tiempo del Usuario</h2>
      <ul>
        {userTimerData.map((data, index) => (
          <li key={index}>
            {data.dateTime} - {data.timetype}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserTimerData;

// ===============
import React, { useEffect, useState } from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';

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
          } else if (entryRecord) {
            calculatedData.push({
              day,
              entry: entryRecord.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              exit: 'No marcó salida',
              totalHours: 'N/A',
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

  // ... (return statement)
};
