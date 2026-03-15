import styled, { keyframes } from "styled-components";

export const blink = keyframes`
  0% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(1.1); }
  100% { opacity: 1; transform: scale(1); }
`;

export const InfoContainer = styled.div`
  width: 90%;
  max-width: 1100px;
  margin: 40px auto;
  display: flex;
  background-color: ${(props) => props.theme.top3Color};
  border: 1px solid ${(props) => props.theme.borderColor};
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);

  @media (max-width: 768px) {
    margin: 10vh 0 0 0;
    flex-direction: column;
    width: 100%;
    border-radius: 0;
    border: none;
  }
`;

export const MenuSideBar = styled.nav`
  flex: 1;
  background-color: ${(props) => props.theme.backgroundColor};
  border-right: 1px solid ${(props) => props.theme.borderColor};
  padding: 30px 15px;

  @media (max-width: 768px) {
    padding: 10px;
    border-right: none;
    border-bottom: 1px solid ${(props) => props.theme.borderColor};
    display: flex;
    align-items: center;
  }
`;

export const MenuList = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;

  @media (max-width: 768px) {
    flex-direction: row;
    overflow-x: auto;
    width: 100%;
    gap: 15px;
    &::-webkit-scrollbar {
      display: none;
    }
  }
`;

export const MenuButton = styled.button<{ active: boolean }>`
  position: relative;
  width: 100%;
  padding: 12px 20px;
  text-align: left;
  font-size: 15px;
  font-weight: 600;
  border-radius: 8px;
  transition: all 0.3s ease;
  color: ${(props) =>
    props.active ? props.theme.mainColor : props.theme.charColor};
  background-color: ${(props) =>
    props.active ? props.theme.activeColor : "transparent"};

  &:hover {
    background-color: ${(props) => props.theme.activeColor};
    color: ${(props) => props.theme.mainColor};
  }

  @media (max-width: 768px) {
    white-space: nowrap;
    padding: 8px 12px;
  }
`;

export const Badge = styled.span`
  position: absolute;
  top: 8px;
  right: 10px;
  background-color: #ff4d4f;
  color: white;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 10px;
  animation: ${blink} 1.5s infinite ease-in-out;
`;

export const ContentWrapper = styled.main`
  flex: 3.5;
  padding: 40px;
  min-height: 600px;
  background-color: ${(props) => props.theme.top3Color};

  @media (max-width: 768px) {
    padding: 20px;
    min-height: auto;
  }
`;

/* ... 기존 코드 하단에 추가 ... */

// 게시글이나 댓글 리스트의 개별 항목 카드
export const ContentCard = styled.div`
  background-color: ${(props) => props.theme.top3Color};
  border: 1px solid ${(props) => props.theme.borderColor};
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
  transition: all 0.2s ease-in-out;
  cursor: pointer;

  &:hover {
    border-color: ${(props) => props.theme.hoverMainColor};
    background-color: ${(props) => props.theme.activeColor};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }
`;

export const ActionButton = styled.button`
  width: 100%;
  padding: 14px;
  background-color: ${(props) => props.theme.mainColor};
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;

  &:hover {
    background-color: ${(props) => props.theme.hoverMainColor};
    transform: translateY(-1px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background-color: ${(props) => props.theme.borderColor};
    cursor: not-allowed;
    transform: none;
  }
`;

export const FormGroup = styled.div`
  margin-bottom: 20px;

  label {
    display: block;
    font-weight: 700;
    margin-bottom: 8px;
    color: ${(props) => props.theme.mainColor};
    font-size: 14px;
  }

  input {
    width: 100%;
    padding: 12px 16px;
    border-radius: 8px;
    border: 1px solid ${(props) => props.theme.borderColor};
    background-color: ${(props) => props.theme.backgroundColor};
    color: ${(props) => props.theme.charColor};
    font-size: 15px;
    transition: all 0.2s;

    &:focus {
      outline: none;
      border-color: ${(props) => props.theme.mainColor};
      background-color: #fff;
      box-shadow: 0 0 0 3px ${(props) => props.theme.activeColor};
    }
  }
`;
