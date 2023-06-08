import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram, faYoutube } from "@fortawesome/free-brands-svg-icons";
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
              <span>YH SNS</span>
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
  width: 100%;
  height: 140px;
  bottom: 0;
  z-index: 1000;
  position: fixed;
  background-color: ${(props) => props.theme.subColor};
`;

export const FooterTamplate = styled.div`
  width: 100%;
  margin: 0.5rem auto;
  min-width: 360px;
  padding: 0.5rem;
  display: flex;
  justify-content: space-between;
  flex-direction: auto;
  flex-wrap: auto;
`;

export const Footertxt = styled.div`
  width: 70%;
  color: #555;

  & p {
    width: 70%;
    font-weight: auto;
    font-size: 0.825rem;
    color: auto;
    margin-top: 5px;
  }
`;

export const FooterRight = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: auto;
  flex-direction: auto;
  flex-wrap: auto;

  & > ul {
    display: flex;
    justify-content: center;
    align-items: center;
    align-content: auto;
    flex-direction: auto;
    flex-wrap: auto;
    padding: 0 2rem;
    background-color: ${(props) => props.theme.mainColor};
    border-radius: 0.5rem;
  }

  & > ul > li {
    padding: 0.25rem 0.5rem;
    font-weight: 300;
    font-size: 1.3rem;
    color: #ffffff;

    & > span {
      font-weight: 500;
    }

    :first-child {
      padding-right: 2rem;
    }

    :hover {
      color: #555;
    }
  }
`;
