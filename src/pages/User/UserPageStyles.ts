import styled from "styled-components";

// ===== 페이지 컨테이너 =====
export const PageContainer = styled.div`
  max-width: 935px;
  margin: 0 auto;
  padding: 30px 20px;

  @media (max-width: 768px) {
    padding: 20px 16px;
  }
`;

// ===== 프로필 헤더 =====
export const ProfileHeader = styled.div`
  display: flex;
  gap: 40px;
  margin-bottom: 44px;
  padding-bottom: 44px;
  border-bottom: 1px solid ${(props) => props.theme.borderColor};

  @media (max-width: 768px) {
    gap: 24px;
    margin-bottom: 32px;
    padding-bottom: 32px;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
`;

export const AvatarSection = styled.div`
  flex-shrink: 0;
`;

export const Avatar = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid ${(props) => props.theme.borderColor};

  @media (max-width: 768px) {
    width: 120px;
    height: 120px;
  }

  @media (max-width: 480px) {
    width: 100px;
    height: 100px;
  }
`;

export const ProfileInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;

  @media (max-width: 480px) {
    align-items: center;
    width: 100%;
  }
`;

export const ProfileTop = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 12px;
  }
`;

export const Nickname = styled.h1`
  font-size: 28px;
  font-weight: 300;
  color: ${(props) => props.theme.charColor};
  margin: 0;

  @media (max-width: 768px) {
    font-size: 24px;
  }

  @media (max-width: 480px) {
    font-size: 20px;
  }
`;

export const FollowButtonWrapper = styled.div`
  /* FollowButton 컴포넌트 자체에 스타일이 있으므로 래퍼는 최소화 */
`;

export const StatsRow = styled.div`
  display: flex;
  gap: 40px;

  @media (max-width: 768px) {
    gap: 28px;
  }

  @media (max-width: 480px) {
    justify-content: center;
    gap: 24px;
  }
`;

export const Stat = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
`;

export const StatNumber = styled.span`
  font-size: 18px;
  font-weight: 700;
  color: ${(props) => props.theme.charColor};

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

export const StatLabel = styled.span`
  font-size: 14px;
  color: ${(props) => props.theme.textColor};
  opacity: 0.8;

  @media (max-width: 768px) {
    font-size: 13px;
  }
`;

// ===== 섹션 =====
export const Section = styled.section`
  margin-bottom: 40px;

  @media (max-width: 768px) {
    margin-bottom: 32px;
  }
`;

export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  padding: 0 4px;
`;

export const SectionTitle = styled.h2`
  font-size: 16px;
  font-weight: 700;
  color: ${(props) => props.theme.charColor};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;

  i {
    font-size: 18px;
    color: ${(props) => props.theme.mainColor};
  }

  @media (max-width: 768px) {
    font-size: 15px;

    i {
      font-size: 16px;
    }
  }
`;

export const SectionCount = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${(props) => props.theme.textColor};
  opacity: 0.6;
`;

// ===== 스크롤 컨테이너 (팔로워/팔로잉) =====
export const ScrollContainer = styled.div`
  display: flex;
  gap: 16px;
  overflow-x: auto;
  padding: 16px 4px;
  margin: 0 -4px;

  /* 스크롤바 스타일 */
  &::-webkit-scrollbar {
    height: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${(props) => props.theme.borderColor};
    border-radius: 3px;
  }

  &::-webkit-scrollbar-track {
    background-color: ${(props) => props.theme.activeColor};
  }

  @media (max-width: 768px) {
    gap: 12px;
    padding: 12px 4px;
  }
`;

export const UserCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background-color: ${(props) => props.theme.backgroundColor};
  border: 1px solid ${(props) => props.theme.borderColor};
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
  width: 90px;

  &:hover {
    background-color: ${(props) => props.theme.activeColor};
    border-color: ${(props) => props.theme.mainColor};
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    width: 80px;
    padding: 10px;
  }
`;

export const UserAvatar = styled.img`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid ${(props) => props.theme.borderColor};

  @media (max-width: 768px) {
    width: 48px;
    height: 48px;
  }
`;

export const UserName = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: ${(props) => props.theme.textColor};
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;

  @media (max-width: 768px) {
    font-size: 11px;
  }
`;

// ===== 게시글 그리드 =====
export const PostGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;

  @media (max-width: 768px) {
    gap: 8px;
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 6px;
  }
`;

export const PostCard = styled.div`
  position: relative;
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  background-color: ${(props) => props.theme.activeColor};
  border: 1px solid ${(props) => props.theme.borderColor};
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.02);

    > div {
      opacity: 1;
    }
  }
`;

export const PostImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const NoImagePlaceholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
    135deg,
    ${(props) => props.theme.activeColor},
    ${(props) => props.theme.borderColor}
  );

  i {
    font-size: 48px;
    color: ${(props) => props.theme.textColor};
    opacity: 0.3;
  }

  @media (max-width: 768px) {
    i {
      font-size: 36px;
    }
  }
`;

export const PostOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.1) 0%,
    rgba(0, 0, 0, 0.7) 100%
  );
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 16px;
  opacity: 0;
  transition: opacity 0.2s ease;

  @media (max-width: 768px) {
    padding: 12px;
  }

  @media (max-width: 480px) {
    opacity: 1;
    background: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0) 0%,
      rgba(0, 0, 0, 0.6) 100%
    );
  }
`;

export const PostTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: white;
  margin: 0 0 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (max-width: 768px) {
    font-size: 13px;
    margin-bottom: 6px;
  }
`;

export const PostStats = styled.div`
  display: flex;
  gap: 12px;
  font-size: 13px;
  color: white;
  font-weight: 600;

  span {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  i {
    font-size: 14px;
  }

  @media (max-width: 768px) {
    font-size: 12px;
    gap: 10px;

    i {
      font-size: 13px;
    }
  }
`;

// ===== 메시지 =====
export const EmptyMessage = styled.div`
  padding: 40px 20px;
  text-align: center;
  font-size: 14px;
  color: ${(props) => props.theme.textColor};
  opacity: 0.6;

  @media (max-width: 768px) {
    padding: 32px 16px;
    font-size: 13px;
  }
`;

export const LoadingMessage = styled.div`
  text-align: center;
  padding: 20px;
  font-size: 14px;
  color: ${(props) => props.theme.textColor};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  i {
    font-size: 16px;
    color: ${(props) => props.theme.mainColor};
  }
`;

export const EndMessage = styled.div`
  text-align: center;
  padding: 24px;
  font-size: 13px;
  color: ${(props) => props.theme.textColor};
  opacity: 0.6;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  i {
    font-size: 14px;
    color: ${(props) => props.theme.mainColor};
  }
`;
