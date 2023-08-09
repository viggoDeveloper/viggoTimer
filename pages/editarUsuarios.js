import React, { useEffect, useState, useContext } from 'react';

import Layout from "@/components/Layout/Layout";


export const EditUser = () => {



    useEffect(() => {
        const fetchUsers = async () => {
          try {
            const userRecords = await admin.auth().listUsers();
            setUsers(userRecords.users);
          } catch (error) {
            console.error('Error al obtener usuarios:', error);
          }
        };
    
        fetchUsers();
      }, []);



    return (
        <Layout>
            <div>
                <h1>Gestión de Usuarios</h1>
            </div>
        </Layout>
    );
}

export default EditUser;

