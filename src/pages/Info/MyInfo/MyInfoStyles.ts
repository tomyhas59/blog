import styled from "styled-components";

// 프로필 전용 섹션
export const ProfileHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 30px;
  border-bottom: 2px solid ${(props) => props.theme.borderColor};
  margin-bottom: 30px;
`;

export const ImageWrapper = styled.div`
  position: relative;
  width: 130px;
  height: 130px;
`;

export const ProfileImg = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid ${(props) => props.theme.mainColor};
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.03);
  }
`;

export const ImageDeleteBadge = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
  width: 28px;
  height: 28px;
  background-color: #ffffff;
  color: #ff4d4f;
  border: 1px solid ${(props) => props.theme.borderColor};
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: #ff4d4f;
    color: #fff;
  }
`;

// 정보 리스트 스타일
export const InfoField = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px 0;
  font-size: 16px;

  strong {
    min-width: 90px;
    color: ${(props) => props.theme.mainColor};
    font-weight: 700;
  }

  span {
    color: ${(props) => props.theme.charColor};
  }
`;

// 비밀번호 변경 및 닉네임 수정을 위한 전용 폼 요소 (새로 제작)
export const EditFormBox = styled.form`
  margin-top: 20px;
  padding: 25px;
  background-color: ${(props) => props.theme.backgroundColor};
  border-radius: 12px;
  border: 1px solid ${(props) => props.theme.borderColor};
`;

export const CustomLabel = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
  color: ${(props) => props.theme.charColor};
`;

export const CustomInput = styled.input`
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid ${(props) => props.theme.borderColor};
  background-color: #fff;
  font-size: 15px;
  margin-bottom: 15px;
  outline: none;

  &:focus {
    border-color: ${(props) => props.theme.mainColor};
    box-shadow: 0 0 0 2px ${(props) => props.theme.activeColor};
  }
`;

export const StatusMsg = styled.p<{ isError?: boolean }>`
  font-size: 13px;
  color: ${(props) => (props.isError ? "#ff4d4f" : props.theme.mainColor)};
  margin-bottom: 10px;
`;

// 버튼 세트
export const BtnGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
`;

export const InternalBtn = styled.button<{
  variant?: "primary" | "danger" | "outline";
}>`
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.2s;

  ${(props) => {
    if (props.variant === "danger") return `background: #ff4d4f; color: white;`;
    if (props.variant === "outline")
      return `background: transparent; border: 1px solid ${props.theme.borderColor}; color: ${props.theme.charColor};`;
    return `background: ${props.theme.mainColor}; color: white;`;
  }}

  &:hover {
    opacity: 0.8;
  }
`;
