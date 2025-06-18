import React from "react";
import ClipLoader from "react-spinners/ClipLoader";
import styled from "styled-components";

const Spinner: React.FC = () => {
  return (
    <SpinnerContainer>
      <ClipLoader
        size={50}
        color={"#3498db"}
        loading={true}
        cssOverride={{ borderWidth: 6 }}
      />
    </SpinnerContainer>
  );
};

const SpinnerContainer = styled.div`
  z-index: 99999;
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`;

export default Spinner;
