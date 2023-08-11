import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { FirebaseContext } from '@/firebase';
import Link from 'next/link';
import Layout from '@/components/Layout/Layout';

const UserDetail = () => {
    const router = useRouter();
    const { id } = router.query;
    const [data, setData] = useState([]);

    const { usuario, firebase } = useContext(FirebaseContext);

    useEffect(() => {
        const fetchUserById = async () => {
            try {
                const db = firebase.queryCollection();
                const userRefCollection = db.collection('timeUser');
                const userRef = db.collection('users').doc(id);
                const snapshot =
                    await userRefCollection
                        .where('idUser', '==', userRef)
                        .where('timetype', 'in', ['Hora de Entrada', 'Hora De Salida'], 'desc')
                        .get();
                const userData = snapshot.docs.map((doc) => doc.data());
                setData(userData)
            } catch (error) {
                console.log('Error usuario no encontrado', error);
            }
        }
        fetchUserById()
    }, [id]);
    console.log('data', data)


    // Función para formatear la fecha y obtener el día de la semana
    const formatDateAndDay = (timestamp) => {
        const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        //year: 'numeric', month: 'long', day: 'numeric'
        const formattedDate = date.toLocaleDateString('es-ES', options);
        return formattedDate;
    };
    return (
        <Layout>
            <Link href="/usuarios">
                Volver
            </Link>
            <h1>Detalles del Usuario: {id}</h1>
            <table>
                <thead>
                    <tr>
                        <th>Documento</th>
                        <th>Nombre</th>
                        <th>Ciudad</th>
                        <th>Marca</th>
                        <th>Sede</th>
                        <th>Horario</th>
                        <th>Dia</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((user, i) => {

                        return (
                            <tr key={i}>
                                <td>{user.document}</td>
                                <td>{user.name}</td>
                                <td>{user.city}</td>
                                <td>{user.brand}</td>
                                <td>{user.campus}</td>
                                <td>{user.timetype}</td>
                                <td>
                                    {formatDateAndDay(user.hour)}
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </Layout>
    );
};

export default UserDetail;
