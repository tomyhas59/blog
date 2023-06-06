import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import styled from "styled-components";
const AppLayout = ({ children }) => {
  return (
    <div>
      <Header />
      <Middle>{children}</Middle>
      <Footer />
    </div>
  );
};

export default AppLayout;

const Middle = styled.div`

`;
