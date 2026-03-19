import styled from "styled-components";

// ===== 폼 컨테이너 =====
export const FormContainer = styled.form`
  padding: 16px 20px;
  border-top: 1px solid ${(props) => props.theme.borderColor};
  background-color: ${(props) => props.theme.backgroundColor};

  @media (max-width: 768px) {
    padding: 14px 16px;
  }
`;

// ===== 입력 래퍼 =====
export const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  background-color: ${(props) => props.theme.activeColor};
  border: 1px solid ${(props) => props.theme.borderColor};
  border-radius: 24px;
  padding: 4px 4px 4px 16px;
  transition: all 0.2s ease;

  &:focus-within {
    border-color: ${(props) => props.theme.mainColor};
    box-shadow: 0 0 0 3px ${(props) => props.theme.mainColor}15;
  }

  @media (max-width: 768px) {
    padding: 3px 3px 3px 14px;
  }
`;

// ===== 입력 필드 =====
export const Input = styled.input`
  flex: 1;
  border: none;
  background: transparent;
  font-size: 14px;
  color: ${(props) => props.theme.textColor};
  outline: none;
  padding: 8px 0;

  &::placeholder {
    color: ${(props) => props.theme.textColor};
    opacity: 0.5;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  @media (max-width: 768px) {
    font-size: 13px;
    padding: 7px 0;
  }
`;

// ===== 전송 버튼 =====
export const SendButton = styled.button`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
    135deg,
    ${(props) => props.theme.mainColor},
    ${(props) => props.theme.subColor}
  );
  border: none;
  border-radius: 50%;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover:not(:disabled) {
    transform: scale(1.05);
  }

  &:active:not(:disabled) {
    transform: scale(0.95);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  i {
    margin-left: 2px;
  }

  @media (max-width: 768px) {
    width: 36px;
    height: 36px;
    font-size: 14px;
  }
`;
