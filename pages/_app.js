import React, { useState, useEffect } from 'react';
import App from 'next/app';
import firebase, { FirebaseContext } from '../firebase';
import useAutenticacion from '@/hooks/useAutenticacion';
import Router from 'next/router';

const MyApp = props => {

    const usuario = useAutenticacion();

    const { Component, pageProps } = props;

    const esSuperAdmin = usuario?.esSuperAdmin;

    useEffect(() => {
        if (usuario === null) {
            Router.push('/');
        }
    }, [usuario]);

    useEffect(() => {
        if (!esSuperAdmin) {
            Router.push('/');
        }
    }, [esSuperAdmin])

    return (
        <FirebaseContext.Provider
            value={{
                firebase,
                usuario: esSuperAdmin ? usuario?.usuario : null,
                userData: usuario?.userData
            }}
        >
            <Component {...pageProps} />
        </FirebaseContext.Provider>
    )
}

export default MyApp;
