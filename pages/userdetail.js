
import React from 'react';
import { useRouter } from 'next/router';

const UserDetail = () => {

    const router = useRouter();
    const { id } = router.query;
    console.log('idUser', id)

    return (
        <div>
            <h1>Detalles del Usuario</h1>

        </div>
    );
};

export default UserDetail;



