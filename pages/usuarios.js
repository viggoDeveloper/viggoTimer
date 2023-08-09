import React, { useState, useEffect, useContext } from "react";
import Layout from "../components/Layout/Layout";
import { FirebaseContext } from '@/firebase';
import Router, { useRouter } from 'next/router';
import FirebaseExcelDownloadButton from "./descargarInforme";
import ImageZoom from "@/components/ui/Images";
import { compress } from "@/next.config";

const Usuarios = () => {

    const [data, setData] = useState([]);
    const [filterValue, setFilterValue] = useState('');
    const [filteredData, setFilteredData] = useState([]);

    const { usuario, firebase } = useContext(FirebaseContext);

    const router = useRouter();

    useEffect(() => {
        const getDataUser = firebase.queryCollection();
        const collectionRef = getDataUser.collection('timeUser')

        const unsubscribe = collectionRef.orderBy('hour', 'desc').onSnapshot((snapshot) => {
            const newData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setData(newData);
            setFilteredData(newData);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        // Filtrar los datos en función del valor ingresado por el usuario
        const filtered = data.filter((item) => {
            // Modifica esto para que coincida con los campos en tu colección que deseas filtrar
            return (
                item.document.toLowerCase().includes(filterValue.toLowerCase()) ||
                item.lastname.toLowerCase().includes(filterValue.toLowerCase())
            );
        });

        setFilteredData(filtered);
    }, [filterValue, data]);


    if (!usuario) {
        return router.push('/');
    }

    return (
        <div>
            <Layout>
                <h1>Desde usuarios</h1>

                <FirebaseExcelDownloadButton />

                <input
                    type="text"
                    placeholder="Filtrar por Documento o Apellido"
                    value={filterValue}
                    onChange={(e) => setFilterValue(e.target.value)}
                />
                <table>
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Apellido</th>
                            <th>Documento</th>
                            <th>Correo</th>
                            <th>Ciudad</th>
                            <th>Marca</th>
                            <th>Sede</th>
                            <th>Motivo</th>
                            <th>Telefono</th>
                            <th>Horario</th>
                            <th>Hora - Fecha</th>
                            <th>Foto</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map((item) => {

                            const seconds = item.hour.seconds;
                            const nanoseconds = item.hour.nanoseconds;

                            const createdTime = new Date(seconds * 1000 + nanoseconds / 1000000);

                            //console.log('createdTime', createdTime)

                            return (
                                <tr key={item.id}>
                                    <td>{item.name}</td>
                                    <td>{item.lastname}</td>
                                    <td>{item.document}</td>
                                    <td>{item.email}</td>
                                    <td>{item.city}</td>
                                    <td>{item.brand}</td>
                                    <td>{item.campus}</td>
                                    <td>{item.reason}</td>
                                    <td>{item.phone}</td>
                                    <td>{item.timetype}</td>
                                    <td>{createdTime.toLocaleString()}</td>
                                    <td>

                                        {/* <ImageZoom imageUrl={item.photoCheck} alt="Imagen 1" /> */}
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>

            </Layout>
        </div>
    )
};

export default Usuarios;
