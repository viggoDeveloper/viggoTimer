import React, { useEffect } from 'react';
import App from 'next/app';
import Router from 'next/router';
import firebase, { FirebaseContext } from '../firebase';
import useAutenticacion from '@/hooks/useAutenticacion';
import useUserData from '@/hooks/useCurrentUser';

const MyApp = props => {
    const usuarioInfo = useAutenticacion();
    const userData = useUserData();

    const { Component, pageProps } = props;

    // Verificar si el usuario es SuperAdmin
    const esSuperAdmin = usuarioInfo?.esSuperAdmin;

    useEffect(() => {
        if (usuarioInfo === null) {
            // El usuario no está autenticado, redirigir a la página de inicio de sesión
            Router.push('/');
        }
    }, [usuarioInfo]);

    if (!esSuperAdmin) {
        // El usuario no tiene permisos de SuperAdmin, mostrar mensaje de error
        return <p>No tienes permisos para acceder a esta aplicación.</p>;
    }

    return (
        <FirebaseContext.Provider
            value={{
                firebase,
                usuario: usuarioInfo?.usuario,
                userData
            }}
        >
            <Component {...pageProps} />
        </FirebaseContext.Provider>
    );
}

export default MyApp;
