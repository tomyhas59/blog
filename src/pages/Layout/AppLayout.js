import React from "react";
import styled from "styled-components";
import Header from "./Header";
import Footer from "./Footer";

const AppLayout = ({ children }) => {
  return (
    <LayoutWrapper>
      <Header />
      <ContentWrapper>{children}</ContentWrapper>
      <Footer />
    </LayoutWrapper>
  );
};

const LayoutWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  margin-top: 3rem;
`;

const ContentWrapper = styled.div`
  flex-grow: 1;
  padding-top: 50px;
  overflow-y: auto;
`;

export default AppLayout;
