import React from "react";
import styled from "styled-components";

const Divider = () => {
  return <StyledDivider />;
};

export default Divider;

const StyledDivider = styled.div`
  width: 100%;
  height: 3px;
  margin: 30px 0;
  background-color: #a2d5a2;
  box-shadow: 0px 3px 6px rgba(1, 1, 1, 0.1);
`;
