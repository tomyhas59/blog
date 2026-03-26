import styled from "styled-components";

export const SearchWrapper = styled.div<{ currentPath: string }>`
  width: 100%;
  max-width: 500px;
  display: flex;
  align-items: center;
  @media (max-width: 768px) {
    max-width: 100%;
    padding: 0 4px;
  }
`;

export const SearchContainer = styled.div`
  display: flex;
  width: 100%;
  height: 40px;
  background-color: ${(props) => props.theme.activeColor};
  border: 1px solid ${(props) => props.theme.borderColor};
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;

  &:focus-within {
    border-color: ${(props) => props.theme.mainColor};
    box-shadow: 0 0 0 3px ${(props) => props.theme.mainColor}20;
  }

  @media (max-width: 768px) {
    height: 36px;
    border-radius: 10px;
  }
`;

export const Select = styled.select`
  width: 80px;
  padding: 0 10px;
  border: none;
  background-color: transparent;
  color: ${(props) => props.theme.charColor};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  outline: none;
  border-right: 1px solid ${(props) => props.theme.borderColor};

  @media (max-width: 768px) {
    width: 70px;
    font-size: 13px;
  }
`;

export const InputWrapper = styled.div`
  display: flex;
  flex: 1;
  position: relative;
  align-items: center;
`;

export const Input = styled.input`
  width: 100%;
  padding: 0 70px 0 12px; /* X버튼과 돋보기 버튼 공간 확보 */
  border: none;
  background-color: transparent;
  color: ${(props) => props.theme.textColor};
  font-size: 14px;
  outline: none;

  &::placeholder {
    color: ${(props) => props.theme.textColor}80;
  }

  @media (max-width: 768px) {
    padding: 0 60px 0 10px;
    font-size: 13px;
  }
`;

/* X 클리어 버튼 추가 */
export const ClearButton = styled.button`
  position: absolute;
  right: 40px; /* 검색 버튼 왼쪽 옆에 위치 */
  background: transparent;
  border: none;
  color: ${(props) => props.theme.textColor}60;
  cursor: pointer;
  font-size: 16px;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;

  &:hover {
    color: ${(props) => props.theme.mainColor};
  }

  @media (max-width: 768px) {
    right: 35px;
    font-size: 14px;
  }
`;

export const SearchButton = styled.button`
  position: absolute;
  right: 5px;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
    135deg,
    ${(props) => props.theme.mainColor},
    ${(props) => props.theme.subColor}
  );
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    filter: brightness(1.1);
  }

  @media (max-width: 768px) {
    width: 26px;
    height: 26px;
  }
`;
