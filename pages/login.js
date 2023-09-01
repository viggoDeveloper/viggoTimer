import React, { useState } from 'react';
import { css } from '@emotion/react';
import Router from 'next/router';
import Layout from "@/components/Layout/Layout";
import { Formulario, Campo, InputSubmit, Error } from '../components/ui/Formulario';
import firebase from '../firebase';
import useValidacion from '../hooks/useValidacion';
import validarIniciarSesion from '../validacion/validarIniciarSesion';

const STATE_INICIAL = {
    email: '',
    password: ''
}

const Login = () => {

    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { valores, errores, handleSubmit, handleChange, handleBlur } = useValidacion(STATE_INICIAL, validarIniciarSesion, iniciarSesion);

    const { email, password } = valores;

    async function iniciarSesion() {
        setIsLoading(true);
        try {
            const user = await firebase.login(email, password);

            const { uid } = user.user;
            const db = firebase.queryCollection();
            const userRefCollection = db.collection('users').doc(uid);
            const userDoc = await userRefCollection.get();
            const userData = userDoc.data();

            if (userData.userRol === "SuperAdmin") {
                Router.push('/viewuser');
            } else {
                setError("No tienes permisos para acceder.");
                setIsLoading(false);

            }
        } catch (error) {
            console.error('Hubo un error al autenticar el usuario', error.message);
            setError(error.message);
            setIsLoading(false);

            // Redirigir a la página de login en caso de error
            Router.push('/login');    
        }
        setIsLoading(false);
    }

    return (
        <div>
            <Layout>
                <>
                    <h1
                        css={css`
                            text-align: center;
                            margin-top: 5rem;
                    `}
                    >Iniciar Sesión</h1>
                    <Formulario
                        onSubmit={handleSubmit}
                        noValidate
                    >
                        <Campo>
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                placeholder="Tu Email"
                                name="email"
                                value={email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                        </Campo>
                        {errores.email && <Error>{errores.email}</Error>}

                        <Campo>
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                placeholder="Tu Password"
                                name="password"
                                value={password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                        </Campo>
                        {errores.password && <Error>{errores.password}</Error>}

                        {error && <Error>{error}</Error>}

                        <InputSubmit
                            type="submit"
                            value={isLoading ? "Cargando..." : "Iniciar Sesión"}
                            disabled={isLoading}
                        />
                    </Formulario>
                </>
            </Layout>
        </div>
    )
}

export default Login;
