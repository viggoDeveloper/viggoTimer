// hooks/useUserData.js

import { useEffect, useState } from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const useUserData = () => {
    const [userData, setUserData] = useState(null);
    const currentUser = firebase.auth().currentUser;

    useEffect(() => {
        if (currentUser) {
            // Obtener la referencia al documento del usuario en Firestore según su uid
            const userRef = firebase.firestore().collection('users').doc(currentUser.uid);

            // Escuchar los cambios en el documento del usuario
            const unsubscribe = userRef.onSnapshot((doc) => {
                if (doc.exists) {
                    // Si el documento existe, establecer los datos del usuario en el estado local
                    setUserData(doc.data());
                } else {
                    // Si el documento no existe, mostrar un mensaje o realizar alguna acción adicional
                    console.log('El documento del usuario no existe en Firestore.');
                }
            });

            // Limpiar el listener al desmontar el componente
            return () => unsubscribe();
        }
    }, [currentUser]);

    return userData;
};

export default useUserData;
