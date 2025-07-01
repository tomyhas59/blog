import React from "react";
import ClipLoader from "react-spinners/ClipLoader";
import styled, { useTheme } from "styled-components";

const Spinner: React.FC = () => {
  const theme = useTheme();

  return (
    <SpinnerContainer>
      <ClipLoader
        size={50}
        loading={true}
        color={theme.subColor}
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
