import styled from "styled-components";

export const TabHeader = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 30px;
  border-bottom: 1px solid ${(props) => props.theme.borderColor};
  padding-bottom: 15px;
`;

export const TabButton = styled.button<{ active: boolean }>`
  padding: 10px 20px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 15px;
  transition: all 0.3s ease;
  background-color: ${(props) =>
    props.active ? props.theme.mainColor : props.theme.activeColor};
  color: ${(props) => (props.active ? "#fff" : props.theme.charColor)};

  &:hover {
    background-color: ${(props) =>
      props.active ? props.theme.hoverMainColor : props.theme.borderColor};
    transform: translateY(-2px);
  }
`;

export const CommentListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
