import styled, { keyframes } from "styled-components";

export const HeaderContainer = styled.header`
  width: 100%;
  background-color: ${(props) => props.theme.subColor};
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  padding: 8px;
  @media (max-width: 768px) {
    position: fixed;
    display: grid;
    grid-template-areas:
      "a b c"
      "d d d";
    top: 0;
    left: 0;
    z-index: 98;
    gap: 2px;
  }
`;

export const HeaderLogoBtn = styled.button`
  cursor: pointer;
  font-size: 1.5rem;
  color: #ffffff;
  background-color: ${(props) => props.theme.mainColor};
  border-radius: 8px;
  border: 1px solid;
  padding: 5px 15px;
  transition:
    transform 0.3s ease,
    color 0.3s ease;
  &:hover {
    transform: translateY(-2px);
    color: ${(props) => props.theme.charColor};
  }
  @media (max-width: 768px) {
    grid-area: a;
    font-size: 14px;
    font-weight: bold;
    background: none;
    text-align: center;
  }
`;

export const SignList = styled.ul`
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  gap: 10px;
  @media (max-width: 768px) {
    grid-area: b;
  }
`;

export const ListItem = styled.li`
  position: relative;
  background-color: ${(props) => props.theme.mainColor};
  text-align: center;
  padding: 5px 15px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  transition:
    transform 0.3s ease,
    color 0.3s ease;
  &:hover {
    transform: translateY(-2px);
    background-color: ${(props) => props.theme.hoverMainColor};
    color: ${(props) => props.theme.charColor};
  }
  z-index: 0;
  @media (max-width: 768px) {
    font-size: 14px;
    background: none;
    position: relative;
    border: 1px solid;
    &:hover {
      transform: translateY(-2px);
      color: ${(props) => props.theme.charColor};
    }
  }
`;

const blinkBackground = keyframes`
  0% { background-color: red; }
  50% { background-color: darkred; }
  100% { background-color: red; }
`;

export const Notification = styled.span`
  position: absolute;
  top: -5px;
  right: -5px;
  font-size: 0.7rem;
  color: #fff;
  background-color: red;
  padding: 2px;
  border-radius: 50%;
  z-index: 999;
  animation: ${blinkBackground} 1s infinite;
`;

export const ProfileImageWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
`;

export const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 2px solid #cccccc;
  cursor: pointer;
  transition:
    transform 0.3s ease,
    border-color 0.3s ease;
  &:hover {
    transform: scale(1.1);
    border-color: gray;
  }
  @media (max-width: 768px) {
    &:hover {
      color: ${(props) => props.theme.charColor};
    }
  }
`;

export const DarkModeButton = styled.button`
  font-size: 20px;
  transition:
    transform 0.3s ease,
    border-color 0.3s ease;
  &:hover {
    transform: scale(1.3);
  }
  @media (max-width: 768px) {
    grid-area: c;
  }
`;
