import styled from "styled-components";

export const ChatContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 50px;
  @media (max-width: 768px) {
    width: 100%;
    flex-direction: column;
    align-items: stretch;
  }
`;

export const ListWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  gap: 40px;
  align-items: flex-start;
  padding: 10px;
  background-color: #f4f4f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  @media (max-width: 768px) {
    width: 50%;
    gap: 20px;
  }
`;

export const FollowList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  > h1 {
    color: #333;
    font-weight: bold;
    text-align: center;
  }
  ul {
    width: 100%;
    padding: 0;
    margin: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    > li {
      font-size: 18px;
      color: #333;
      position: relative;
      &:hover {
        color: ${(props) => props.theme.mainColor};
        cursor: pointer;
      }
      > button {
        width: 100%;
        text-align: left;
        background: none;
        border: none;
        padding: 10px;
      }
    }
  }
  @media (max-width: 768px) {
    width: 100%;
    ul {
      display: flex;
      > li {
        margin-left: 5px;
      }
    }
  }
`;

export const RoomList = styled.ul`
  padding: 10px;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: left;
  > h1 {
    color: #333;
    font-weight: bold;
    text-align: center;
  }
  @media (max-width: 768px) {
    width: 100%;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
  }
`;

export const RoomItem = styled.li`
  position: relative;
  padding: 10px;
  margin-bottom: 10px;
  text-align: center;
  background-color: ${(props) => props.theme.mainColor};
  border-radius: 8px;
  color: #fff;
  list-style: none;
  cursor: pointer;
  transition:
    transform 0.3s ease,
    color 0.3s ease;
  &:hover {
    transform: translateY(-2px);
    color: ${(props) => props.theme.charColor};
  }
  @media (max-width: 768px) {
    font-size: 12px;
    padding: 8px;
  }
`;

export const UnReadMessageCount = styled.div<{ count: number }>`
  position: absolute;
  background-color: red;
  color: #fff;
  right: -10px;
  top: -5px;
  width: ${(props) => `${8 + props.count.toString().length * 12}px`};
  height: 20px;
  border-radius: 50%;
  display: ${(props) => (props.count === 0 ? "none" : "flex")};
  align-items: center;
  justify-content: center;
`;

export const ContentWrapper = styled.div`
  width: 500px;
  @media (max-width: 768px) {
    position: absolute;
    width: 100%;
    top: 0;
    left: 0;
  }
`;

export const UserOption = styled.div`
  position: absolute;
  z-index: 999;
  top: 20px;
  left: 20px;
  width: 80px;
  display: flex;
  flex-direction: column;
  background-color: ${(props) => props.theme.mainColor};
  border-radius: 8px;
  padding: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  font-size: 12px;
  color: #fff;
  & button {
    margin: 5px 0;
    cursor: pointer;
    transition:
      transform 0.3s ease,
      color 0.3s ease;
    &:hover {
      transform: translateY(-2px);
      color: ${(props) => props.theme.charColor};
    }
  }
  @media (max-width: 768px) {
    z-index: 999;
    width: 70px;
    top: 30px;
    left: 40px;
    padding: 2px;
    & button {
      font-size: 10px;
    }
  }
`;

export const ChatPlaceholder = styled.div`
  color: #aaa;
  height: 200px;
  line-height: 200px;
  font-size: 24px;
  @media (max-width: 768px) {
    display: none;
  }
`;
