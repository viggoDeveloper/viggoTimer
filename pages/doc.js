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

export default FirestoreTable;
