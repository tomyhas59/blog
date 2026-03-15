import styled, { keyframes } from "styled-components";

// ===== 애니메이션 =====
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// ===== 메인 컨테이너 =====
export const MainContainer = styled.div`
  width: 100%;
  max-width: 680px;
  margin: 0 auto;

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

// ===== 상단 헤더 (정렬 버튼) =====
export const MainHeader = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 12px;

  @media (max-width: 768px) {
    margin-bottom: 10px;
  }
`;

export const SortButtonWrapper = styled.div`
  /* SortButton 자체에 스타일이 있으므로 래퍼는 최소화 */
`;

// ===== PostInfo 래퍼 =====
export const PostInfoWrapper = styled.div`
  margin-bottom: 16px;

  @media (max-width: 768px) {
    margin-bottom: 12px;
  }
`;

// ===== 게시글 섹션 =====
export const PostsSection = styled.div`
  /* 별도 마진 불필요 */
`;

export const PostsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  @media (max-width: 768px) {
    gap: 10px;
  }
`;

// ===== 로딩 상태 =====
export const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
`;

// ===== 빈 상태 =====
export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 500px;
  padding: 40px 20px;

  @media (max-width: 768px) {
    min-height: 400px;
    padding: 32px 16px;
  }
`;

export const EmptyIcon = styled.div`
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
    135deg,
    ${(props) => props.theme.activeColor},
    ${(props) => props.theme.borderColor}
  );
  border-radius: 50%;
  margin-bottom: 24px;

  i {
    font-size: 48px;
    color: ${(props) => props.theme.textColor};
    opacity: 0.4;
  }

  @media (max-width: 768px) {
    width: 100px;
    height: 100px;

    i {
      font-size: 40px;
    }
  }
`;

export const EmptyTitle = styled.h3`
  font-size: 24px;
  font-weight: 700;
  color: ${(props) => props.theme.charColor};
  margin: 0 0 12px;

  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

export const EmptyDescription = styled.p`
  font-size: 15px;
  color: ${(props) => props.theme.textColor};
  opacity: 0.7;
  margin: 0;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

// ===== 페이지네이션 래퍼 =====
export const PaginationWrapper = styled.div`
  margin-top: 32px;
  margin-bottom: 32px;

  @media (max-width: 768px) {
    margin-top: 24px;
    margin-bottom: 24px;
  }
`;
