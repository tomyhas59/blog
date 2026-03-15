import styled from "styled-components";

export const PostsWrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  /* 스크롤바 디자인이 필요한 경우 여기서 커스텀 가능 */
  overflow-y: auto;

  @media (max-width: 768px) {
    padding: 10px;
    width: 100%;
  }
`;

export const PostsHeading = styled.h2`
  font-size: 24px;
  color: white;
  margin-bottom: 20px;
  padding: 10px 20px;
  border-radius: 12px;
  background-color: ${(props) => props.theme.mainColor};
  width: fit-content;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    font-size: 18px;
    margin-bottom: 12px;
    padding: 8px 16px;
  }
`;

export const LoadMoreBtn = styled.button`
  display: block;
  margin: 30px auto 0;
  padding: 12px 30px;
  color: white;
  background-color: ${(props) => props.theme.mainColor};
  border: none;
  border-radius: 50px;
  font-weight: 600;
  font-size: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${(props) => props.theme.hoverMainColor};
    transform: translateY(-3px);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(-1px);
  }

  &:disabled {
    background-color: ${(props) => props.theme.borderColor};
    cursor: not-allowed;
  }
`;
