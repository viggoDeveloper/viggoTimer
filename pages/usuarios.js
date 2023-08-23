import React, { useState, useEffect, useContext } from "react";
import { useRouter } from 'next/router';
import Layout from "../components/Layout/Layout";
import Link from "next/link";
import { FirebaseContext } from '@/firebase';
import FirebaseExcelDownloadButton from "./descargarInforme";
//import { FaSearch, FaTimes, FaFilter } from 'react-icons/fa'

function Usuarios() {
    const [data, setData] = useState([]);
    const [filterValue, setFilterValue] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [searchCedula, setSearchCedula] = useState('');
    const [showFilter, setShowFilter] = useState(false);

    const [selectedUserId, setSelectedUserId] = useState(null);

    const handleUserClick = (userId) => {
        setSelectedUserId(userId);
    };

    const { usuario, firebase } = useContext(FirebaseContext);


    const router = useRouter();

    useEffect(() => {
        const getDataUser = firebase.queryCollection();
        const collectionRef = getDataUser.collection('users')

        const unsubscribe = collectionRef.onSnapshot((snapshot) => {
            const newData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setData(newData);
            setFilteredData(newData);
        });

        if (!usuario) {
            router.push('/');
        }

        return () => unsubscribe();
    }, [firebase, usuario]);
    //console.log(data)

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
    }, [filterValue, data, firebase]);

    return (
        <div>
            <Layout>
                <h1>Desde usuarios</h1>
                <FirebaseExcelDownloadButton />

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
                        {data.map((user) => {

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

            </Layout>
        </div>
    )
};

export default Usuarios;
