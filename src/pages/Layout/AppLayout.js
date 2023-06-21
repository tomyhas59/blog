import React from "react";
import Header from "./Header";
import Footer from "./Footer";

const AppLayout = ({ children }) => {
  return (
    <div>
      <Header />
      <div style={{ height: "1080px", marginTop: "50px" }}>{children}</div>
      <Footer />
    </div>
  );
};

export default AppLayout;
