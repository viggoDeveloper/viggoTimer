import React, { useState, useEffect, useContext, useMemo } from "react";
import Layout from "../components/Layout/Layout";
import { FirebaseContext } from '@/firebase';
import Router, { useRouter } from 'next/router';
import FirebaseExcelDownloadButton from "./descargarInforme";
import { FaSearch, FaTimes, FaFilter } from 'react-icons/fa'

const PAGE_SIZE = 10;

const Usuarios = () => {
    const [data, setData] = useState([]);
    const [filterValue, setFilterValue] = useState('');
    const [searchCedula, setSearchCedula] = useState('');
    const [showFilter, setShowFilter] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const { usuario, firebase } = useContext(FirebaseContext);

    const router = useRouter();

    const fetchData = async () => {
        try {
            const collectionRef = firebase
                .queryCollection()
                .collection('timeUser')
                .orderBy('hour', 'desc');

            const snapshot = await collectionRef.get();

            const newData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setData(newData);
        } catch (error) {
            console.error('Error al recuperar datos:', error);
        }
    };

    useEffect(() => {
        if (!usuario) {
            return router.push('/');
        }
        fetchData();
    }, [firebase, router, usuario]);

    // Filtrar los datos en función del valor ingresado por el usuario
    const filteredData = useMemo(() => {
        return data.filter((item) => {
            // Modifica esto para que coincida con los campos en tu colección que deseas filtrar
            return (
                item.document.toLowerCase().includes(filterValue.toLowerCase()) ||
                item.lastname.toLowerCase().includes(filterValue.toLowerCase())
            );
        });
    }, [data, filterValue]);

    // Datos paginados
    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * PAGE_SIZE;
        const endIndex = startIndex + PAGE_SIZE;
        return filteredData.slice(startIndex, endIndex);
    }, [filteredData, currentPage]);

    const handleSearch = () => {
        if (searchCedula) {
            const filteredItems = data.filter((item) => item.document.includes(searchCedula));
            setData(filteredItems);
        }
    };

    const handleClearFilter = () => {
        setSearchCedula('');
        setFilterValue('');
    };

    const handleToggleFilter = () => {
        setShowFilter(!showFilter);
    };

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
                            <th>Fecha - Hora</th>
                            <th>Horario</th>
                            <th>Nombre</th>
                            <th>Apellido</th>
                            <th>Documento</th>
                            <th>Ciudad</th>
                            <th>Marca</th>
                            <th>Motivo</th>
                            {/* <th>Foto</th> */}
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.map((item) => {
                            const seconds = item.hour.seconds;
                            const nanoseconds = item.hour.nanoseconds;
                            const createdTime = new Date(seconds * 1000 + nanoseconds / 1000000);

                            return (
                                <tr key={item.id}>
                                    <td>{createdTime.toLocaleString()}</td>
                                    <td>{item.timetype}</td>
                                    <td>{item.name}</td>
                                    <td>{item.lastname}</td>
                                    <td>{item.document}</td>
                                    <td>{item.city}</td>
                                    <td>{item.brand}</td>
                                    <td>{item.reason}</td>
                                    {/* <td>
                                        <img src={item.photoCheck} width={30} height={30} />
                                    </td> */}
                                </tr>
                            )
                        })}
                    </tbody>

                </table>

                <div className="pagination">
                    <button onClick={() => setCurrentPage((prevPage) => prevPage - 1)} disabled={currentPage === 1}>Anterior</button>
                    <button onClick={() => setCurrentPage((prevPage) => prevPage + 1)} disabled={paginatedData.length < PAGE_SIZE}>Siguiente</button>
                </div>

            </Layout>
        </div>
    )
};

export default Usuarios;
