import styled from "styled-components";

// ===== 친구 리스트 =====
export const FriendsList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

export const EmptyMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  color: ${(props) => props.theme.textColor};
  opacity: 0.6;

  i {
    font-size: 48px;
    margin-bottom: 16px;
  }

  p {
    font-size: 14px;
    margin: 0;
  }
`;

export const FriendItem = styled.li`
  border-bottom: 1px solid ${(props) => props.theme.borderColor};

  &:last-child {
    border-bottom: none;
  }
`;

export const FriendButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;

  &:hover {
    background-color: ${(props) => props.theme.activeColor};
  }

  @media (max-width: 768px) {
    padding: 12px 16px;
  }
`;

export const FriendAvatar = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: linear-gradient(
    135deg,
    ${(props) => props.theme.mainColor},
    ${(props) => props.theme.subColor}
  );
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 700;
  color: white;
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    font-size: 16px;
  }
`;

export const FriendName = styled.span`
  flex: 1;
  font-size: 15px;
  font-weight: 600;
  color: ${(props) => props.theme.textColor};

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

export const ExpandIcon = styled.div<{ active: boolean }>`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.theme.textColor};
  opacity: 0.5;
  transition: all 0.2s ease;
  transform: ${(props) => (props.active ? "rotate(180deg)" : "rotate(0deg)")};

  i {
    font-size: 12px;
  }
`;

// ===== 옵션 패널 (아코디언) =====
export const OptionPanel = styled.div`
  padding: 8px 20px 16px;
  background-color: ${(props) => props.theme.activeColor};
  display: flex;
  flex-direction: column;
  gap: 8px;
  border-top: 1px solid ${(props) => props.theme.borderColor};

  @media (max-width: 768px) {
    padding: 8px 16px 14px;
  }
`;

export const MenuButton = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 12px 16px;
  background-color: ${(props) => props.theme.backgroundColor};
  border: 1px solid ${(props) => props.theme.borderColor};
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  color: ${(props) => props.theme.textColor};
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;

  i {
    font-size: 16px;
    width: 20px;
    color: ${(props) => props.theme.mainColor};
  }

  &:hover {
    background-color: ${(props) => props.theme.mainColor};
    border-color: ${(props) => props.theme.mainColor};
    color: white;

    i {
      color: white;
    }
  }
`;
