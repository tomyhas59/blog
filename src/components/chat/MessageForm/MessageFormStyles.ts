import styled from "styled-components";

export const FormContainer = styled.form`
  display: flex;
  gap: 8px;
  height: 48px;
  margin-top: 15px;
  padding: 5px;
  background: #fff;

  @media (max-width: 768px) {
    height: 42px;
  }
`;

export const InputField = styled.input`
  flex: 1;
  padding: 0 15px;
  font-size: 1rem;
  border: 1px solid #e1e1e1;
  border-radius: 8px;
  outline: none;
  color: ${(props) => props.theme.textColor};
  transition: border-color 0.2s;

  &:focus {
    border-color: ${(props) => props.theme.mainColor};
  }

  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
    &::placeholder {
      color: #bbb;
    }
  }

  @media (max-width: 768px) {
    padding: 0 10px;
    font-size: 0.9rem;
  }
`;

export const SubmitBtn = styled.button`
  padding: 0 20px;
  background-color: ${(props) => props.theme.mainColor};
  color: #fff;
  font-weight: 600;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    filter: brightness(1.1);
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    padding: 0 15px;
    font-size: 0.85rem;
  }
`;
