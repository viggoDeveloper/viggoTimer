import React, { useState, useEffect, useContext, useMemo } from "react";
import { useRouter } from 'next/router';
import Layout from "../components/Layout/Layout";
import Link from "next/link";
import { FirebaseContext } from '@/firebase';

function Usuarios() {
    const [data, setData] = useState([]);
    const [filterValue, setFilterValue] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10; // Número de registros por página
    const [unsubscribe, setUnsubscribe] = useState(null);

    const { usuario, firebase } = useContext(FirebaseContext);
    const router = useRouter();

    const fetchData = async () => {
        try {
            const collectionRef = firebase.queryCollection().collection('users')

            // Consulta paginada
            const snapshot = await collectionRef.get(); // Elimina el límite de 10 registros

            const newData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setData(newData);
        } catch (error) {
            console.error('Error al recuperar datos:', error);
        }
    };

    useEffect(() => {
        const unsubscribeFunction = fetchData();
        setUnsubscribe(() => unsubscribeFunction);

        if (!usuario) {
            router.push('/');
        }

        return () => {
            // Al desmontar el componente, cancela la suscripción si existe
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, [firebase, usuario, router]);

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
        setCurrentPage(1); // Reinicia la página actual al filtrar
    }, [filterValue, data]);

    // Usar useMemo para calcular los datos a mostrar en la página actual
    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        return filteredData.slice(startIndex, endIndex);
    }, [currentPage, filteredData]);

    const totalPages = Math.ceil(filteredData.length / pageSize);

    return (
        <div>
            <Layout>
                <h1>Desde usuarios</h1>
                <input
                    type="text"
                    placeholder="Filtrar por Documento o Apellido"
                    value={filterValue}
                    onChange={(e) => setFilterValue(e.target.value)}
                />
                <table>
                    <thead>
                        <tr>
                            <th>Documento</th>
                            <th>Nombre</th>
                            <th>Apellido</th>
                            <th>Correo</th>
                            <th>Ciudad</th>
                            <th>Marca</th>
                            <th>Sede</th>
                            <th>Ver</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.map((user) => {
                            return (
                                <tr key={user.id}>
                                    <td>{user.document}</td>
                                    <td>{user.name}</td>
                                    <td>{user.lastname}</td>
                                    <td>{user.email}</td>
                                    <td>{user.city}</td>
                                    <td>{user.brand}</td>
                                    <td>{user.campus}</td>
                                    <td>
                                        <Link href={`/userdetail?id=${user.id}`}>
                                            Ver
                                        </Link>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                {/* Controles de paginación */}
                <div className="pagination">
                    <button
                        onClick={() => setCurrentPage((prevPage) => prevPage - 1)}
                        disabled={currentPage === 1}
                    >
                        Anterior
                    </button>
                    <span>{currentPage} de {totalPages}</span>
                    <button
                        onClick={() => setCurrentPage((prevPage) => prevPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        Siguiente
                    </button>
                </div>
            </Layout>
        </div>
    )
};

export default Usuarios;
