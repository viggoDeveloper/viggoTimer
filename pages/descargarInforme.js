// components/FirebaseExcelDownloadButton.js

import React, { useState } from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { saveAs } from 'file-saver';
import { BotonDownload } from '@/components/ui/Boton';

const FirebaseExcelDownloadButton = () => {
    const [data, setData] = useState([]);

    const downloadExcel = async () => {
        const collectionRef = firebase.firestore().collection('timeUser');

        try {
            const snapshot = await collectionRef.get();
            const data = snapshot.docs.map((doc) => doc.data());
            setData(data);

            // Crear el contenido del archivo CSV
            const csvContent = [
                'documento,nombre,apellido,correo,cargo,telefono,sede,marca,ciudad', // Primera fila fija con los nombres de columna
                ...data.map((row) => `${row.document},${row.name},${row.lastname},${row.email},${row.post},${row.phone},${row.campus},${row.brand},${row.city}`), // Datos de cada fila
            ].join('\n');

            // Crear y descargar el archivo CSV
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
            saveAs(blob, 'datos_de_la_coleccion.csv');
        } catch (error) {
            console.error('Error al descargar los datos:', error);
        }
    };

    return (
        <div>
            <BotonDownload onClick={downloadExcel}>Descargar Excel</BotonDownload>
        </div>
    );
};

export default FirebaseExcelDownloadButton;
