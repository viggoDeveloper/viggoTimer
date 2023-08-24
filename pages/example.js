import React from 'react';
import ExcelJS from 'exceljs';

const generateExcelReport = async (userData, userTimerData) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Report');

    // Agrega los datos del usuario en la primera fila
    worksheet.addRow(['Nombre', 'Apellido', 'Email']);
    worksheet.addRow([userData.name, userData.lastname, userData.email]);
    worksheet.addRow([]); // Agrega una fila vacía

    // Agrega los encabezados de las columnas de datos del reporte
    worksheet.addRow(['Fecha', 'Día', 'Hora de Entrada', 'Hora de Salida', 'Tiempo de Almuerzo', 'Total horas', 'Horas extras']);

    // Agrega los datos de cada día
    userTimerData.forEach(data => {
        worksheet.addRow([
            data.day,
            data.dayOfWeek,
            data.entry,
            data.exit,
            data.lunchTime,
            data.totalHours,
            data.overtime
        ]);
    });

    // Genera el archivo Excel
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'reporte.xlsx';
    a.click();
    window.URL.revokeObjectURL(url);
};

const ReportButton = ({ userData, userTimerData }) => {
    return (
        <Button onClick={() => generateExcelReport(userData, userTimerData)}>
            Generar Reporte Excel
        </Button>
    );
};

//export default ReportButton;


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

//export default FirebaseExcelDownloadButton;

