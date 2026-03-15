import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram, faYoutube } from "@fortawesome/free-brands-svg-icons";
import styled, { keyframes } from "styled-components";

const Footer = () => {
  return (
    <FooterContainer>
      <FooterInner>
        {/* 왼쪽: 회사 정보 */}
        <FooterLeft>
          <CompanyName>TMS</CompanyName>
          <CompanyInfo>
            <InfoItem>
              <i className="fas fa-map-marker-alt"></i>
              <span>서울특별시, 대한민국 (우) 00000</span>
            </InfoItem>
            <InfoItem>
              <i className="fas fa-phone"></i>
              <span>010-1234-1234</span>
            </InfoItem>
            <InfoItem>
              <i className="fas fa-envelope"></i>
              <span>yh9035926@naver.com</span>
            </InfoItem>
          </CompanyInfo>
          <Copyright>© 2023 TM All rights reserved.</Copyright>
        </FooterLeft>

        {/* 오른쪽: 소셜 미디어 */}
        <FooterRight>
          <SocialTitle>Connect</SocialTitle>
          <SocialList>
            <SocialItem
              href="https://tmshop.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fas fa-shopping-bag"></i>
              <SocialTooltip>TMShop</SocialTooltip>
            </SocialItem>
            <SocialItem href="#" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faInstagram} />
              <SocialTooltip>Instagram</SocialTooltip>
            </SocialItem>
            <SocialItem href="#" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faYoutube} />
              <SocialTooltip>YouTube</SocialTooltip>
            </SocialItem>
          </SocialList>
        </FooterRight>
      </FooterInner>
    </FooterContainer>
  );
};

export default Footer;

// ===== 애니메이션 =====
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-3px);
  }
`;

// ===== 푸터 컨테이너 =====
export const FooterContainer = styled.footer`
  width: 100%;
  background: linear-gradient(
    180deg,
    ${(props) => props.theme.backgroundColor} 0%,
    ${(props) => props.theme.activeColor} 100%
  );
  border-top: 1px solid ${(props) => props.theme.borderColor};
  margin-top: auto;

  @media (max-width: 768px) {
    display: none;
  }
`;

export const FooterInner = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 50px 40px 30px;
  display: flex;
  justify-content: space-around;
  animation: ${fadeInUp} 0.6s ease;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 30px;
    text-align: center;
  }
`;

// ===== 왼쪽: 회사 정보 =====
export const FooterLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const CompanyName = styled.h3`
  font-size: 24px;
  font-weight: 800;
  color: ${(props) => props.theme.mainColor};
  margin: 0;
  font-family:
    "Poppins",
    -apple-system,
    BlinkMacSystemFont,
    sans-serif;
  letter-spacing: -0.5px;
`;

export const CompanyInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  color: ${(props) => props.theme.textColor};
  opacity: 0.8;

  i {
    width: 16px;
    font-size: 12px;
    color: ${(props) => props.theme.mainColor};
  }

  @media (max-width: 1024px) {
    justify-content: center;
  }
`;

export const Copyright = styled.p`
  font-size: 12px;
  color: ${(props) => props.theme.textColor};
  opacity: 0.6;
  margin: 8px 0 0;
  font-weight: 500;
`;

// ===== 오른쪽: 소셜 미디어 =====
export const FooterRight = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (max-width: 1024px) {
    align-items: center;
  }
`;

export const SocialTitle = styled.h4`
  font-size: 14px;
  font-weight: 700;
  color: ${(props) => props.theme.textColor};
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

export const SocialList = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

export const SocialItem = styled.a`
  position: relative;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: linear-gradient(
    135deg,
    ${(props) => props.theme.mainColor},
    ${(props) => props.theme.subColor}
  );
  color: white;
  font-size: 18px;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(29, 161, 242, 0.2);

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 16px rgba(29, 161, 242, 0.4);
    animation: ${float} 1s ease-in-out infinite;

    div {
      opacity: 1;
      visibility: visible;
      transform: translateY(-100%) translateX(-50%) scale(1);
    }
  }

  &:active {
    transform: translateY(-2px);
  }
`;

export const SocialTooltip = styled.div`
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateY(-100%) translateX(-50%) scale(0.9);
  margin-bottom: 8px;
  padding: 6px 12px;
  background-color: ${(props) => props.theme.charColor};
  color: white;
  font-size: 12px;
  font-weight: 600;
  border-radius: 6px;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s ease;
  pointer-events: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);

  &::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 5px solid transparent;
    border-top-color: ${(props) => props.theme.charColor};
  }
`;
