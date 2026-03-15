import styled from "styled-components";

export const SearchedPostContainer = styled.div<{ isActive: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 800px;
  padding: 16px 20px;
  margin: 0 auto;
  background-color: ${(props) =>
    props.isActive ? props.theme.activeColor : "white"};
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background-color: #f8f9fa;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
`;

export const ContentPreview = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 12px 20px 20px 60px; /* 작성자 위치만큼 들여쓰기 */
  background-color: #fcfcfc;
  border-bottom: 1px solid #eee;
  font-size: 14px;
  color: #4b5563;
  line-height: 1.6;
`;

export const MatchItem = styled.div`
  margin-top: 8px;
  padding: 8px 12px;
  background: white;
  border-radius: 6px;
  border: 1px dashed #e5e7eb;

  .match-nickname {
    font-weight: 700;
    color: ${(props) => props.theme.mainColor};
    margin-right: 6px;
  }
`;

export const HighlightedText = styled.span`
  background-color: ${(props) => props.theme.highlightColor || "#fff3bf"};
  font-weight: 700;
  color: #d9480f; /* 가독성을 위한 강조색 */
  padding: 0 2px;
  border-radius: 2px;
`;

// PostItemStyles에서 정의했던 스타일 재사용 (필요시 동일하게 정의)
export const NicknameButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  img {
    width: 24px;
    height: 24px;
    border-radius: 50%;
  }
`;

export const Nickname = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: #4b5563;
`;
