import styled from "styled-components";

export const FormWrapper = styled.section`
  background: ${(props) => props.theme.backgroundColor};
  border: 1px solid ${(props) => props.theme.borderColor || "#e1e4e8"};
  border-radius: 12px;
  margin: 1.5rem 0;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
`;

export const InputComposeArea = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  position: relative;
`;

export const EditorField = styled.textarea`
  width: 100%;
  min-height: 80px;
  padding: 0.75rem;
  border: none;
  background-color: transparent;
  color: ${(props) => props.theme.textColor};
  font-size: 0.95rem;
  line-height: 1.5;
  resize: none;
  font-family: inherit;

  &::placeholder {
    color: #a0a0a0;
  }

  &:focus {
    outline: none;
  }

  &:disabled {
    cursor: not-allowed;
    background-color: rgba(0, 0, 0, 0.02);
  }
`;

export const ActionRow = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  border-top: 1px solid ${(props) => props.theme.borderColor || "#f0f0f0"};
  padding-top: 0.75rem;
`;

export const SubmitButton = styled.button`
  background-color: ${(props) => props.theme.mainColor};
  color: #fff;
  font-size: 0.85rem;
  font-weight: 600;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  cursor: pointer;
  border: none;
  transition: all 0.2s ease-in-out;

  &:hover:not(:disabled) {
    filter: brightness(1.1);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px ${(props) => props.theme.mainColor}44;
  }

  &:disabled {
    background-color: #d1d1d1;
    cursor: not-allowed;
  }
`;
