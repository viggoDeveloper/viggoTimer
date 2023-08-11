import React, { useState, useEffect, useContext } from "react";
import Layout from "../components/Layout/Layout";
import Link from "next/link";
import { FirebaseContext } from '@/firebase';
import Router, { useRouter } from 'next/router';
import FirebaseExcelDownloadButton from "./descargarInforme";
import { FaSearch, FaTimes, FaFilter } from 'react-icons/fa'

const Usuarios = () => {

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
        return () => unsubscribe();
    }, []);
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
    }, [filterValue, data]);

    if (!usuario) {
        return router.push('/');
    }

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


// {filteredData.map((item) => {

//     const seconds = item.hour.seconds;
//     const nanoseconds = item.hour.nanoseconds;

//     const createdTime = new Date(seconds * 1000 + nanoseconds / 1000000);

//     //console.log('createdTime', createdTime)

//     return (
//         <tr key={item.id}>
//             <td>{item.name}</td>
//             <td>{item.lastname}</td>
//             <td>{item.document}</td>
//             <td>{item.email}</td>
//             <td>{item.city}</td>
//             <td>{item.brand}</td>
//             <td>{item.campus}</td>
//             <td>{item.reason}</td>
//             <td>{item.phone}</td>
//             <td>{item.timetype}</td>
//             <td>{createdTime.toLocaleString()}</td>
//             <td>

//                 {/* <ImageZoom imageUrl={item.photoCheck} alt="Imagen 1" /> */}
//             </td>
//         </tr>
//     )
// })}