import styled from "styled-components";

export const ReplyComposer = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  background-color: rgba(0, 0, 0, 0.02);
  border-radius: 8px;
  border: 1px solid ${(props) => props.theme.borderColor || "#f0f0f0"};
`;

export const EditorInput = styled.textarea`
  width: 100%;
  min-height: 60px;
  padding: 10px;
  border: 1px solid #e1e4e8;
  border-radius: 6px;
  font-size: 0.9rem;
  line-height: 1.4;
  resize: none;
  background-color: #fff;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.mainColor};
    box-shadow: 0 0 0 2px ${(props) => props.theme.mainColor}22;
  }

  &::placeholder {
    color: #bfbfbf;
    font-size: 0.85rem;
  }
`;

export const ControlRow = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

export const SubmitButton = styled.button`
  background-color: ${(props) => props.theme.mainColor};
  color: #fff;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 6px 14px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    filter: brightness(1.05);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;
