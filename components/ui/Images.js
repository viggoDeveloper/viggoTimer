// components/ImageZoom.js

import React, { useState } from 'react';
import Image from 'next/image';

const ImageZoom = ({ imageUrl, alt }) => {
    const [zoomed, setZoomed] = useState(false);

    const handleImageClick = () => {
        setZoomed(!zoomed);
    };

    return (
        <Image
            src={imageUrl}
            width={20}
            height={20}
            
            alt={alt}
            onClick={handleImageClick}
            className={zoomed ? 'zoomed-image' : 'normal-image'}
        />
    );
};

export default ImageZoom;
