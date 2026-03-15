import styled from "styled-components";

// ===== PostInfo 래퍼 =====
export const PostInfoWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background-color: ${(props) => props.theme.activeColor};
  border-radius: 8px;
  border: 1px solid ${(props) => props.theme.borderColor};
  gap: 12px;

  @media (max-width: 768px) {
    padding: 10px 12px;
    gap: 8px;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: stretch;
    padding: 12px;
  }
`;

// ===== 메인 정보 (작성자, 제목) =====
export const PostMainInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  flex: 1;

  @media (max-width: 768px) {
    gap: 16px;
  }

  @media (max-width: 480px) {
    gap: 12px;
  }
`;

export const InfoLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: ${(props) => props.theme.textColor};

  i {
    font-size: 12px;
    color: ${(props) => props.theme.mainColor};
  }

  &.label-author {
    min-width: 60px;

    @media (max-width: 768px) {
      min-width: 50px;
    }
  }

  &.label-title {
    flex: 1;
  }

  @media (max-width: 480px) {
    font-size: 12px;

    &.label-author {
      min-width: auto;
    }
  }
`;

// ===== 메타 정보 (작성일, 추천, 조회) =====
export const PostMetaInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  @media (max-width: 768px) {
    gap: 12px;
  }

  @media (max-width: 480px) {
    justify-content: flex-end;
    gap: 16px;
  }
`;

export const MetaLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 600;
  color: ${(props) => props.theme.textColor};
  opacity: 0.8;

  i {
    font-size: 11px;
    color: ${(props) => props.theme.mainColor};
  }

  span {
    @media (max-width: 640px) {
      display: none;
    }
  }

  &.meta-date {
    min-width: 50px;

    @media (max-width: 640px) {
      min-width: auto;
    }
  }

  &.meta-like,
  &.meta-view {
    min-width: 40px;

    @media (max-width: 640px) {
      min-width: auto;
    }
  }

  @media (max-width: 480px) {
    font-size: 11px;
  }
`;
