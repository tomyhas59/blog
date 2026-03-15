import styled from "styled-components";

// ===== 포스트 컨테이너 =====
export const PostContainer = styled.div<{ isActive?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 16px;
  background-color: ${(props) => props.theme.backgroundColor};
  border: 1px solid
    ${(props) =>
      props.isActive ? props.theme.mainColor : props.theme.borderColor};
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${(props) => props.theme.mainColor};
    background-color: ${(props) => props.theme.activeColor};
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    padding: 14px 12px;
    gap: 10px;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
`;

// ===== 메인 섹션 (작성자 + 제목) =====
export const PostMain = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  flex: 1;
  min-width: 0;

  @media (max-width: 768px) {
    gap: 16px;
  }

  @media (max-width: 480px) {
    gap: 12px;
  }
`;

// ===== 작성자 섹션 =====
export const AuthorSection = styled.div`
  position: relative;
  flex-shrink: 0;
`;

export const NicknameButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  background: transparent;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 60px;

  &:hover {
    background-color: ${(props) => props.theme.activeColor};
  }

  @media (max-width: 768px) {
    min-width: 50px;
    padding: 4px 8px;
    gap: 6px;
  }

  @media (max-width: 480px) {
    min-width: auto;
  }
`;

export const ProfileImage = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid ${(props) => props.theme.borderColor};

  @media (max-width: 768px) {
    width: 28px;
    height: 28px;
  }
`;

export const Nickname = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: ${(props) => props.theme.textColor};

  @media (max-width: 640px) {
    display: none;
  }
`;

// ===== 작성자 메뉴 =====
export const AuthorMenu = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  background-color: ${(props) => props.theme.backgroundColor};
  border: 1px solid ${(props) => props.theme.borderColor};
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 8px;
  min-width: 180px;
  z-index: 100;
  display: flex;
  flex-direction: column;
  gap: 4px;

  @media (max-width: 480px) {
    left: 50%;
    transform: translateX(-50%);
    min-width: 160px;
  }
`;

export const MenuButton = styled.button`
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

// ===== 제목 섹션 =====
export const TitleSection = styled.div`
  flex: 1;
  min-width: 0;
`;

export const PostTitle = styled.div<{ isViewed: boolean }>`
  font-size: 15px;
  font-weight: 600;
  color: ${(props) =>
    props.isViewed ? props.theme.textColor + "80" : props.theme.charColor};
  display: flex;
  align-items: center;
  gap: 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

export const CommentCount = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: ${(props) => props.theme.mainColor};
  flex-shrink: 0;

  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

export const ImageIcon = styled.span`
  font-size: 12px;
  color: ${(props) => props.theme.mainColor};
  flex-shrink: 0;

  @media (max-width: 768px) {
    font-size: 11px;
  }
`;

// ===== 메타 정보 (작성일, 추천, 조회) =====
export const PostMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;

  @media (max-width: 768px) {
    gap: 12px;
  }

  @media (max-width: 480px) {
    justify-content: flex-end;
    gap: 16px;
  }
`;

const MetaBase = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 500;
  color: ${(props) => props.theme.textColor};
  opacity: 0.8;

  i {
    font-size: 11px;
  }

  span {
    @media (max-width: 640px) {
      display: none;
    }
  }

  @media (max-width: 480px) {
    font-size: 11px;
  }
`;

export const MetaDate = styled(MetaBase)`
  min-width: 50px;

  i {
    color: ${(props) => props.theme.textColor};
  }

  @media (max-width: 640px) {
    min-width: auto;
  }
`;

export const MetaLike = styled(MetaBase)<{ hasLikes: boolean }>`
  min-width: 40px;
  color: ${(props) =>
    props.hasLikes ? props.theme.mainColor : props.theme.textColor};
  opacity: ${(props) => (props.hasLikes ? 1 : 0.8)};

  i {
    color: ${(props) =>
      props.hasLikes ? props.theme.mainColor : props.theme.textColor};
  }

  @media (max-width: 640px) {
    min-width: auto;
  }
`;

export const MetaView = styled(MetaBase)`
  min-width: 40px;

  i {
    color: ${(props) => props.theme.textColor};
  }

  @media (max-width: 640px) {
    min-width: auto;
  }
`;
