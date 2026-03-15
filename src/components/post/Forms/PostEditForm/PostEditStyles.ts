import styled from "styled-components";

export const EditForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: #ffffff;
  padding: 24px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
`;

const InputBase = `
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 15px;
  transition: all 0.2s ease;
  outline: none;

  &:focus {
    border-color: ${(props: any) => props.theme.mainColor || "#3b82f6"};
    box-shadow: 0 0 0 3px ${(props: any) => (props.theme.mainColor ? `${props.theme.mainColor}33` : "#3b82f633")};
  }
`;

export const EditTitleInput = styled.input`
  ${InputBase}
  font-weight: 600;
  font-size: 16px;
`;

export const EditTextArea = styled.textarea`
  ${InputBase}
  min-height: 250px;
  resize: vertical;
  line-height: 1.6;
`;

export const EditHashtagInput = styled.input`
  ${InputBase}
  background: #f9fafb;
  font-size: 14px;
`;

export const EditImageWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 8px;
`;

export const EditImageItem = styled.div`
  position: relative;
  width: 90px;
  height: 90px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
`;

export const EditImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const EditRemoveButton = styled.button`
  position: absolute;
  top: 4px;
  right: 4px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  border-radius: 50%;
  width: 22px;
  height: 22px;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #ef4444;
  }
`;

export const EditButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #f3f4f6;
`;

export const ActionButton = styled.button<{
  variant?: "primary" | "secondary" | "danger";
}>`
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.2s;

  background: ${(props) => {
    if (props.variant === "primary") return props.theme.mainColor || "#3b82f6";
    if (props.variant === "danger") return "#ef4444";
    return "#f3f4f6";
  }};

  color: ${(props) => (props.variant ? "#ffffff" : "#374151")};

  &:hover {
    filter: brightness(0.95);
    transform: translateY(-1px);
  }
`;
