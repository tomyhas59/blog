import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  from { opacity: 0; transform: translate(-50%, -45%); }
  to { opacity: 1; transform: translate(-50%, -40%); }
`;

export const FormContainer = styled.div`
  position: fixed;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -40%);
  width: 90%;
  max-width: 700px;
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  z-index: 1000;
  animation: ${fadeIn} 0.3s ease-out;

  @media (max-width: 768px) {
    padding: 20px;
    top: 50%;
    transform: translate(-50%, -50%);
  }
`;

export const CloseFormButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: #f3f4f6;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background: #e5e7eb;
    color: #ef4444;
  }
`;

export const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 24px;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const InputBase = `
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 15px;
  transition: all 0.2s;
  outline: none;

  &:focus {
    border-color: ${(props: any) => props.theme.mainColor || "#3b82f6"};
    box-shadow: 0 0 0 3px ${(props: any) => (props.theme.mainColor ? `${props.theme.mainColor}33` : "#3b82f633")};
  }
`;

export const TitleInput = styled.input`
  ${InputBase}
  font-weight: 600;
`;

export const TextArea = styled.textarea`
  ${InputBase}
  min-height: 200px;
  resize: none;
  line-height: 1.6;
`;

export const HashtagInput = styled.input`
  ${InputBase}
  background: #f9fafb;
`;

export const ImageWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin: 8px 0;
  max-height: 200px;
  overflow-y: auto;
`;

export const ImageItem = styled.div`
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
`;

export const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const RemoveButton = styled.button`
  position: absolute;
  top: 4px;
  right: 4px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-size: 10px;

  &:hover {
    background: #ef4444;
  }
`;

export const ButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
`;

export const FileUploadButton = styled.button`
  color: ${(props) => props.theme.mainColor || "#3b82f6"};
  font-weight: 600;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 6px;

  &:hover {
    opacity: 0.8;
  }
`;

export const SubmitButton = styled.button`
  background: ${(props) => props.theme.mainColor || "#3b82f6"};
  color: white;
  padding: 10px 24px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.2s;

  &:hover {
    filter: brightness(1.1);
    transform: translateY(-1px);
  }
`;
