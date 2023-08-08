import React, { useState, useEffect } from 'react';
import App from 'next/app';
import firebase, { FirebaseContext } from '../firebase';
import useAutenticacion from '@/hooks/useAutenticacion';
import useUserData from '@/hooks/useCurrentUser';

const MyApp = props => {

    const usuario = useAutenticacion();
    const userData = useUserData();

    const { Component, pageProps } = props;

    return (
        <FirebaseContext.Provider
            value={{
                firebase,
                usuario,
                userData
            }}
        >
            <Component {...pageProps} />
        </FirebaseContext.Provider>
    )
}

export default MyApp;
