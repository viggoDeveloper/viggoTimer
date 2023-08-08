import styled from "@emotion/styled";


export const Boton = styled.button`
  display: block;
  font-weight: 700;
  text-transform: uppercase;
  border: 1px solid #d1d1d1;
  padding: 0.8rem 2rem;
  margin: 2rem auto;
  text-align: center;
  background-color: ${(props) => (props.bgColor ? "#DA552F" : "white")};
  color: ${(props) => (props.bgColor ? "white" : "#000")};

  &:last-of-type {
    margin-right: 0;
  }

  &:hover {
    cursor: pointer;
  }
`;

export const BotonSide = styled.button`
  display: block;
  font-weight: 700;
  height: 40px;
  width: 100%;
  text-transform: uppercase;
  border: 1px solid #d1d1d1;
  padding: 0.8rem 2rem;
  margin: 2rem auto;
  text-align: center;
  background-color: ${(props) => (props.bgColor ? "#DA552F" : "white")};
  color: ${(props) => (props.bgColor ? "white" : "#000")};

  &:last-of-type {
    margin-right: 0;
  }

  &:hover {
    cursor: pointer;
  }
`;

export const BotonDownload = styled.button`
  display: block;
  font-weight: 700;
  height: 40px;
  width: 10%;
  text-transform: uppercase;
  border: 1px solid #d1d1d1;
  // padding: 0.8rem 2rem;
  margin: 10px;
  text-align: center;
  background-color: ${(props) => (props.bgColor ? "#DA552F" : "white")};
  color: ${(props) => (props.bgColor ? "white" : "#000")};

  &:last-of-type {
    margin-right: 0;
  }

  &:hover {
    cursor: pointer;
  }
`;
