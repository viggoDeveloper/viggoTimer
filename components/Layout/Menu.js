import React from "react";
import Link from "next/link";
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { Boton, BotonSide } from "../ui/Boton";

const ContenedorIzq = styled.div`
    max-width: 300px;
    width: 95%;
    max-height: 100%;
    height: 89vh;
    margin: 10px auto;
    float: left;
    border-right: 2px solid var(--gris3);

    @media (min-width:768px) {
        display: flex;
        justify-content: space-between;
    }
`;

const Menu = () => {

    return (
        <ContenedorIzq>
            <nav>
                <ul>
                    <Link href="/usuarios"
                        css={css`
                            text-decoration: none;
                        `}
                    >
                        <BotonSide>
                            Asistencia
                        </BotonSide>
                    </Link>

                    <Link href="/crearCuenta"
                        css={css`
                                text-decoration: none;
                            `}
                    >
                        <BotonSide>Crear Cuenta</BotonSide>
                    </Link>

                    <Link href="/"
                        css={css`
                        text-decoration: none;
                    `}
                    >
                        <BotonSide >
                            Ver usuario
                        </BotonSide>
                    </Link>
                </ul>
            </nav>
        </ContenedorIzq>
    )
}

export default Menu;
