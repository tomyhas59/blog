import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram, faYoutube } from "@fortawesome/free-brands-svg-icons";
import React from "react";

const Footer = () => {
  return (
    <FooterWrapper>
      <FooterTamplate>
        <Footertxt>
          <p>
            YH
            <br />
            (우) 00000 대한민국 서울특별시
            <br />
            010.1234.1234
            <br />
            yh9035926@naver.com
            <br />
            Copyright 2023, Ltd. All rights reserved.
          </p>
        </Footertxt>
        <FooterRight>
          <ul>
            <li>
              <span>
                <a href="https://tmshop.vercel.app" target="blank">
                  TMShop
                </a>
              </span>
            </li>
            <li>
              <FontAwesomeIcon icon={faInstagram} />
            </li>
            <li>
              <FontAwesomeIcon icon={faYoutube} />
            </li>
          </ul>
        </FooterRight>
      </FooterTamplate>
    </FooterWrapper>
  );
};
export default Footer;

export const FooterWrapper = styled.footer`
  height: 120px;
  background-color: ${(props) => props.theme.subColor};
`;

export const FooterTamplate = styled.div`
  padding: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Footertxt = styled.div`
  width: 30%;
  color: #fff;
  p {
    font-weight: auto;
    color: auto;
    font-size: 0.7rem;
    margin-top: 5px;
  }
  @media (max-width: 480px) {
    width: 50%;

    p {
      font-size: 9px;
    }
  }
`;

export const FooterRight = styled.div`
  display: flex;
  align-items: center;
  & > ul {
    display: flex;
    align-items: center;
    padding: 3px 10px;
    background-color: ${(props) => props.theme.mainColor};
    border-radius: 0.5rem;
    list-style: none;
  }

  & > ul > li {
    padding: 0.5rem;
    font-weight: 300;
    font-size: 1.3rem;
    color: #ffffff;
    cursor: pointer;
    transition: transform 0.3s ease, color 0.3s ease;
    &:hover {
      transform: translateY(-2px);
      color: ${(props) => props.theme.charColor};
    }
  }
`;
