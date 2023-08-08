// components/UserProfile.js

import React, { useEffect, useState } from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        // Asegurarse de que el usuario esté autenticado antes de acceder a su información
        const unsubscribeAuth = firebase.auth().onAuthStateChanged((authenticatedUser) => {
            if (authenticatedUser) {
                setUser(authenticatedUser);
                fetchUserData(authenticatedUser.uid); // Obtener los datos del usuario desde Firestore
            } else {
                setUser(null);
                setUserData(null);
            }
        });

        // Importante: no olvides cancelar la suscripción cuando el componente se desmonte
        return () => {
            unsubscribeAuth();
        };
    }, []);

    const fetchUserData = (userId) => {
        // Obtiene la referencia al documento del usuario en Firestore
        const userRef = firebase.firestore().collection('users').doc(userId);

        // Realiza la consulta para obtener los datos del usuario
        userRef
            .get()
            .then((doc) => {
                if (doc.exists) {
                    setUserData(doc.data());
                } else {
                    console.log('El documento del usuario no existe en Firestore.');
                }
            })
            .catch((error) => {
                console.error('Error al obtener los datos del usuario:', error);
            });
    };

    return (
        <div>
            <h1>Información del Usuario</h1>
            {user ? (
                userData ? (
                    <div>
                        <p>Nombre de usuario: {userData.username}</p>
                        <p>Email: {userData.email}</p>
                        {/* Muestra otros datos del usuario si están disponibles */}
                    </div>
                ) : (
                    <p>Cargando la información del usuario...</p>
                )
            ) : (
                <p>No hay usuario autenticado</p>
            )}
        </div>
    );
};

export default UserProfile;
