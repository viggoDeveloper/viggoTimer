import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { FirebaseContext } from '@/firebase';
import Link from 'next/link';
import Layout from '@/components/Layout/Layout';

const UserDetail = () => {
    const router = useRouter();
    const { id } = router.query;
    const [data, setData] = useState([]);
    const [userTimerData, setUserTimerData] = useState([]);

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
                        .where('timetype', 'in', ['Hora de Entrada', 'Hora De Salida'])
                        .orderBy('hour', 'desc')
                        .get();
                const userData = snapshot.docs.map((doc) => doc.data());
                setData(userData)

                const userTimerData = snapshot.docs.map((doc) => {
                    const {
                        brand,
                        campus,
                        city,
                        document,
                        email,
                        hour,
                        lastname,
                        name,
                        phone,
                        post,
                        reason,
                        timetype
                    } = doc.data();

                    const timestamp = hour;
                    const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
                    const day = date.getDate();
                    const month = date.getMonth() + 1; // Sumamos 1 porque los meses en JavaScript son base 0
                    const year = date.getFullYear();
                    const options = { weekday: 'long' };
                    const formattedDate = date.toLocaleDateString('es-ES', options);

                    const hours = date.getHours();
                    const minutes = date.getMinutes();
                    const ampm = hours >= 12 ? 'PM' : 'AM';
                    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
                    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
                    const formattedDateTime = `${formattedHours}:${formattedMinutes} ${ampm}`;

                    return {
                        brand,
                        campus,
                        city,
                        email,
                        lastname,
                        document,
                        name,
                        phone,
                        post,
                        reason,
                        formattedDate,
                        formattedDateTime,
                        timetype: timetype,
                        day: `${day}/${month}/${year}`,
                    };
                });
                setUserTimerData(userTimerData);
            } catch (error) {
                console.log('Error usuario no encontrado', error);
            }
        }
        fetchUserById()
    }, [id]);
    console.log('data', userTimerData)


    // Función para formatear la fecha y obtener el día de la semana
    // const formatDateAndDay = (timestamp) => {
    //     const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
    //     const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    //     //year: 'numeric', month: 'long', day: 'numeric'
    //     const formattedDate = date.toLocaleDateString('es-ES', options);
    //     return formattedDate;
    // };
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
                        <th>Fecha</th>
                        <th>Dia</th>
                        <th>Hora</th>
                    </tr>
                </thead>
                <tbody>
                    {userTimerData.map((user, i) => {

                        return (
                            <tr key={i}>
                                <td>{user.document}</td>
                                <td>{user.name}</td>
                                <td>{user.city}</td>
                                <td>{user.brand}</td>
                                <td>{user.campus}</td>
                                <td>{user.timetype}</td>
                                <td>{user.day}</td>
                                <td>{user.formattedDate}</td>
                                <td>{user.formattedDateTime}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </Layout>
    );
};

export default UserDetail;
