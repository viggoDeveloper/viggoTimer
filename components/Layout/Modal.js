import React, { useState } from "react";
import { Button, Modal, ModalBody, ModalFooter } from "reactstrap";
import { css } from '@emotion/react';
import Image from "next/image";

const ModalPopup = (item) => {
    const [info, setInfo] = useState(null);


    const [modalOpen, setModalOpen] = useState(false);



    return (
        <>
            <Button
                color="primary"
                type="button"
                onClick={() => setModalOpen(!modalOpen)}
            >
                Ver Foto
            </Button>
            <Modal toggle={() => setModalOpen(!modalOpen)} isOpen={modalOpen} >
                <div
                    css={css`
                    background-color: #FFF;
                    position: relative;
                    display: flex;
                    left: 10%;
                    align-items: center;
                    justify-content: center;
                    width: 50%;
                    height: 100px;
                    border: 1px solid black;
                    border-radius: 10px
                `}
                >
                    <button
                        aria-label="Close"
                        className=" close"
                        type="button"
                        onClick={() => setModalOpen(!modalOpen)}
                    >
                        <span aria-hidden={true}>×</span>
                    </button>
                    <Image src={item} width={20} height={20} decoding="async" alt="person" loading="lazy" />
                    <ModalBody>
                        {/* <Image src={person[1]}  width={20} height={20} /> */}
                        <h1>Hola</h1>





                    </ModalBody>
                    <ModalFooter>
                        <Button
                            color="secondary"
                            type="button"
                            onClick={() => setModalOpen(!modalOpen)}
                        >
                            Close
                        </Button>
                    </ModalFooter>

                </div>
            </Modal>
        </>
    )
}

export default ModalPopup;
