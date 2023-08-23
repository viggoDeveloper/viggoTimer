import React, { useEffect, useState } from 'react';
import firebase from 'firebase/app';

function useAutenticacion() {
    const [usuarioAutenticado, guardarUsuarioAutenticado] = useState(null);

    useEffect(() => {
        const unsuscribe = firebase.auth().onAuthStateChanged(async user => {

            if (user) {
                const db = firebase.firestore();
                const userRefCollection = db.collection('users').doc(user.uid);
                const userDoc = await userRefCollection.get();
                const userData = userDoc.data();

                console.log('======useAutenticacion=========')
                console.log(userData)

                const tieneRolSuperAdmin = userData.userRol === "SuperAdmin";
                guardarUsuarioAutenticado({
                    usuario: user,
                    esSuperAdmin: tieneRolSuperAdmin,
                    userData: userData
                });
            } else {
                guardarUsuarioAutenticado(null);
            }
        })
        return () => unsuscribe();
    }, []);

    return usuarioAutenticado
}

export default useAutenticacion;
