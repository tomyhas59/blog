import styled from "styled-components";

export const PostContainer = styled.div<{ isActive: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 800px;
  padding: 16px 20px;
  margin: 0 auto;
  background-color: ${(props) =>
    props.isActive ? props.theme.activeColor : "white"};
  border-bottom: 1px solid #f0f0f0;
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    background-color: #f8f9fa;
    border-left: 4px solid ${(props) => props.theme.mainColor};
    padding-left: 16px; /* border-left 두께만큼 보정 */
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
`;

export const PostTitle = styled.div<{ isViewed: boolean }>`
  flex: 1;
  font-size: 15px;
  font-weight: 600;
  color: ${(props) => (props.isViewed ? "#9ca3af" : "#1f2937")};
  display: flex;
  align-items: center;
  gap: 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  .comment-count {
    font-size: 12px;
    color: ${(props) => props.theme.mainColor};
    font-weight: 700;
  }

  .icon-preview {
    color: #9ca3af;
    font-size: 13px;
  }
`;

export const NicknameButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
  border-radius: 20px;
  transition: background 0.2s;

  img {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    object-fit: cover;
    border: 1px solid #e5e7eb;
  }

  &:hover {
    background: #f3f4f6;
  }
`;

export const Nickname = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: #4b5563;
  width: auto;
  max-width: 80px;
`;

export const AuthorMenu = styled.div`
  position: absolute;
  top: 40px;
  left: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
  background: white;
  padding: 8px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 100;
  min-width: 120px;
`;

export const Liked = styled.span`
  display: flex;
  align-items: center;
  gap: 3px;
  color: #ef4444;
  font-weight: 600;

  &:before {
    content: "♥";
    font-size: 14px;
  }
`;
