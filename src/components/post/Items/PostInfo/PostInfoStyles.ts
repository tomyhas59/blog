import styled from "styled-components";

export const PostInfoWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 800px;
  margin: 0 auto;
  padding: 12px 20px;
  background-color: #f9fafb; /* 연한 그레이 배경 */
  border-bottom: 2px solid #e5e7eb;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;

  @media (max-width: 768px) {
    display: none; /* 모바일에서는 리스트가 세로로 나열되므로 헤더를 숨기는 것이 깔끔합니다 */
  }
`;

export const PostMainInfo = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  gap: 16px; /* PostItem의 NicknameButton + gap과 일치 */

  span.label-author {
    width: 88px; /* PostItem의 이미지(28) + 닉네임(약 52) + gap(8) 합산값 */
    text-align: center;
    color: #6b7280;
    font-weight: 700;
    font-size: 13px;
  }

  strong.label-title {
    color: #6b7280;
    font-weight: 700;
    font-size: 13px;
    margin-left: 6px;
  }
`;

export const PostMetaInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  color: #6b7280;
  font-weight: 700;
  font-size: 13px;

  .meta-date {
    width: 80px; /* 날짜 포맷 길이에 맞춤 */
    text-align: center;
  }

  .meta-like {
    width: 30px;
    text-align: center;
  }

  .meta-view {
    width: 40px;
    text-align: center;
  }
`;
