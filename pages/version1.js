import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { FirebaseContext } from '@/firebase';
import Link from 'next/link';
import Layout from '@/components/Layout/Layout';

// Importa las funciones aquí
//import { formatDate, getSpanishDayOfWeek, formatTimeWithAmPm } from './path-hacia-tus-funciones';

const UserDetail = () => {
    const router = useRouter();
    const { id } = router.query;
    const [userData, setUserData] = useState({});
    const [userTimerData, setUserTimerData] = useState([]);

    const { usuario, firebase } = useContext(FirebaseContext);

    useEffect(() => {
        const fetchUserData = async () => {
            // ... (resto del código)
        };

        const fetchUserTimerData = async () => {
            // ... (resto del código)
        };

        fetchUserData();
        fetchUserTimerData();
    }, [id]);

    return (
        <Layout>
            {/* ... (resto del código) */}
        </Layout>
    );
};

export default UserDetail;
