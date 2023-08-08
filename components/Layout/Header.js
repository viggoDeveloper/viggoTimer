import React, { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { Boton } from '../ui/Boton';
import { FirebaseContext } from '@/firebase';
import Router, { useRouter } from 'next/router';

const ContenedorHeader = styled.div`
    max-width: 1200px;
    width: 95%;
    margin: 0 auto;
    @media (min-width:768px) {
        display: flex;
        justify-content: space-between;
    }
`;

const Logo = styled.p`
    color: var(--naranja);
    font-size: 4rem;
    line-height: 0;
    font-weight: 700;
    font-family: 'Roboto Slab', serif;
    margin-right: 2rem;
`;

const Header = () => {

    const router = useRouter();
    const { usuario, firebase, userData } = useContext(FirebaseContext);

    function handleClick() {
        firebase.cerrarSesion()
        router.push("/")
    }

    return (
        <header
            css={css`
                border-bottom: 2px solid var(--gris3);
                padding: 1rem 0;
            `}
        >
            <ContenedorHeader>
                <div
                    css={css`
                        display:flex;
                        align-items: center;
                    `}
                >
                    <Link href="/"
                        css={css`
                            text-decoration: none;
                        `}
                    >
                        <Logo>ViggoTimer</Logo>
                    </Link>
                </div>

                <div
                    css={css`
                        display: flex;
                        align-items: center;
                    `}
                >
                    {usuario ? (
                        <>
                            <p
                                css={css`
                                    margin-right: 2rem;
                                `}
                            >
                                Hola: {userData?.name} </p>
                            <Boton
                                bgColor="true"
                                onClick={handleClick}
                            >Cerrar Sesión</Boton>
                        </>
                    ) : (
                        <>
                            <Link href="/login"
                                css={css`
                                text-decoration: none;
                            `}
                            >
                                <Boton
                                    bgColor="true"
                                >Login</Boton>
                            </Link>

                        </>
                    )}
                </div>
            </ContenedorHeader>
        </header>
    );
}

export default Header;
