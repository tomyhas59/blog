import React from "react";
import styled from "styled-components";
import Header from "./Header";
import Footer from "./Footer";
import MobileFooter from "./MobileFooter";
import Search from "../../components/Search";

const AppLayout = ({ children }: any) => {
  return (
    <LayoutWrapper>
      <Header />

      <ContentWrapper>{children}</ContentWrapper>
      <Footer />
      <MobileFooter />
    </LayoutWrapper>
  );
};

const LayoutWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  overflow: hidden;
`;

const ContentWrapper = styled.div`
  flex-grow: 1;
  margin-top: 70px;
  overflow-y: auto;
  @media (max-width: 480px) {
    transform: scale(0.9);
    margin-top: 0;
  }
`;

export default AppLayout;
