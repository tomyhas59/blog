import styled from "styled-components";

// ===== 공통 버튼 스타일 =====
export const StyledButton = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 12px;
  background: transparent;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: ${(props) => props.theme.textColor};
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;

  i {
    font-size: 14px;
    width: 18px;
    color: ${(props) => props.theme.mainColor};
  }

  &:hover {
    background-color: ${(props) => props.theme.activeColor};
  }
`;

// ===== 공통 포스트 헤더 =====
export const PostHeaderLeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  flex: 1;
  min-width: 0;

  @media (max-width: 768px) {
    gap: 16px;
  }
`;

// ===== 공통 메타 정보 =====
export const PostMetaInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;

  @media (max-width: 768px) {
    gap: 12px;
  }
`;

export const Date = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 500;
  color: ${(props) => props.theme.textColor};
  opacity: 0.8;
  min-width: 50px;

  @media (max-width: 640px) {
    min-width: auto;
  }
`;

export const ViewCount = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 500;
  color: ${(props) => props.theme.textColor};
  opacity: 0.8;
  min-width: 40px;

  @media (max-width: 640px) {
    min-width: auto;
  }
`;
