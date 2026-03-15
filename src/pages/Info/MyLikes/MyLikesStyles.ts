import styled from "styled-components";

export const LikesWrapper = styled.div`
  max-width: 850px;
  margin: 0 auto;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 20px;

  @media (max-width: 768px) {
    padding: 5px;
    width: 100%;
  }
`;

export const LikesHeader = styled.h2`
  font-size: 22px;
  font-weight: 800;
  color: ${(props) => props.theme.charColor};
  padding-bottom: 15px;
  border-bottom: 2px solid ${(props) => props.theme.mainColor};
  margin-bottom: 10px;

  @media (max-width: 768px) {
    font-size: 18px;
    padding-left: 10px;
  }
`;

export const ListSection = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export const FetchButton = styled.button`
  width: 100%;
  padding: 15px;
  margin-top: 20px;
  background-color: ${(props) => props.theme.backgroundColor};
  color: ${(props) => props.theme.mainColor};
  border: 1px solid ${(props) => props.theme.mainColor};
  border-radius: 10px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: ${(props) => props.theme.mainColor};
    color: #ffffff;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    border-color: ${(props) => props.theme.borderColor};
    color: ${(props) => props.theme.borderColor};
    cursor: not-allowed;
  }
`;
