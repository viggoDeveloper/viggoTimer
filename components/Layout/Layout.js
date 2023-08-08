import React, { useContext } from "react";
import { Global, css } from "@emotion/react";
import Header from "./Header";
import Menu from "./Menu";

import { FirebaseContext } from '@/firebase';

const Layout = ({ children }) => {
  const { usuario } = useContext(FirebaseContext)
  return (
    <>
      <Global
        styles={css`
          :root {
            --gris: #3d3d3d;
            --gris2: #6f6f6f;
            --gris3: #e1e1e1;
            --naranja: #da552f;
          }

          html {
            font-size: 62.5%;
            box-sizing: border-box;
          }
          *,
          *:before,
          *:after {
            box-sizing: inherit;
          }
          body {
            font-size: 1.6rem;
            line-height: 1.5;
            font-family: "PT Sans", sans-serif;
          }
          h1,
          h2,
          h3 {
            margin: 0 0 2rem 0;
            line-height: 1.5;
          }
          // ul {
          //   list-style: none;
          //   margin: 0;
          //   padding: 0;
          // }
          // a {
          //   text-decoration: none;
          // }

          img {
            max-width: 100%;
          }

          table {
            position: absolute;
            left: 20%;
            width: 80%;
            display: block;
            overflow-x: auto;
            white-space: nowrap;
          }
          
          th,
          td {
            padding: 15px;
            background-color: rgba(255, 255, 255, 0.2);
            color: #000;
          }
          
          th {
            text-align: left;
          }
          
          thead {
            th {
              background-color: #55608f;
            }
          }
          
          tbody {
            tr {
              &:hover {
                background-color: rgba(255, 255, 255, 0.3);
              }
            }
          
            td {
              position: relative;
          
              &:hover {
                &:before {
                  content: "";
                  position: absolute;
                  left: 0;
                  right: 0;
                  top: -9999px;
                  bottom: -9999px;
                  background-color: rgba(255, 255, 255, 0.2);
                  z-index: -1;
                }
              }
            }
          }
        
        `}
      />
      <Header />
      {usuario ? (<Menu />) : null}

      <main>{children}</main>
    </>
  );
};

export default Layout;