import styled from "styled-components";

// 1. 메타 정보 컨테이너 (날짜, 좋아요, 조회수 등)
export const PostMetaInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  color: ${(props) => props.theme.textColor || "#666"};
  font-size: 13px;

  @media (max-width: 768px) {
    gap: 8px;
    margin-top: 8px;
    width: 100%;
    justify-content: flex-start;
  }
`;

// 2. 날짜 표시
export const Date = styled.span`
  opacity: 0.8;
  position: relative;

  &:after {
    content: "|";
    margin-left: 12px;
    opacity: 0.3;
  }
`;

// 3. 조회수
export const ViewCount = styled.span`
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;

  &:before {
    content: "views";
    font-size: 10px;
    text-transform: uppercase;
    opacity: 0.6;
  }
`;

// 4. 왼쪽 섹션 레이아웃 (닉네임 + 타이틀 그룹)
export const PostHeaderLeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
  position: relative; /* AuthorMenu 팝업 기준점 */

  @media (max-width: 768px) {
    width: 100%;
    gap: 10px;
  }
`;

// 5. [추가] 공통 닉네임 버튼
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

// 6. [추가] 공통 닉네임 텍스트
export const Nickname = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: #4b5563;
`;

// 7. [추가] 작성자 메뉴 / 옵션 메뉴 드롭다운
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

// 8. 공통 버튼 베이스
export const StyledButton = styled.button`
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  text-align: left;
  transition: all 0.2s ease-in-out;
  background: transparent;
  color: #374151;

  &:hover {
    background-color: ${(props) => props.theme.mainColor || "#f5f5f5"};
    color: white;
  }
`;
