import React from "react";
import styled from "styled-components";
import Header from "./Header";
import Footer from "./Footer";

const AppLayout = ({ children }: any) => {
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
  overflow: hidden;
`;

const ContentWrapper = styled.div`
  flex-grow: 1;
  margin-top: 100px;
  overflow-y: auto;
  @media (max-width: 480px) {
    margin-top: 0;
    transform: scale(0.9);
  }
`;

export default AppLayout;
