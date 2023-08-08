import styled from "@emotion/styled";

export const Select = styled.select`
    height: 40px;
    width: 30%;
    display: block;
    font-weight: 700;
    text-transform: uppercase;
    border: 1px solid #d1d1d1;
    padding: 0.8rem 0rem;
    margin: 0rem ;

    &:last-of-type {
        margin-right: 0;
    }

    &:hover {
        cursor: pointer;
    }
`;