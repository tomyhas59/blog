import styled from "styled-components";

// ===== 채팅방 리스트 =====
export const RoomsList = styled.ul`
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

export const RoomItem = styled.li`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
  border-bottom: 1px solid ${(props) => props.theme.borderColor};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${(props) => props.theme.activeColor};
  }

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 768px) {
    padding: 12px 16px;
  }
`;

export const RoomAvatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(
    135deg,
    ${(props) => props.theme.mainColor},
    ${(props) => props.theme.subColor}
  );
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 700;
  color: white;
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 44px;
    height: 44px;
    font-size: 18px;
  }
`;

export const RoomInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

export const RoomName = styled.div`
  font-size: 15px;
  font-weight: 700;
  color: ${(props) => props.theme.charColor};
  margin-bottom: 3px;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

export const RoomPreview = styled.div`
  font-size: 13px;
  color: ${(props) => props.theme.textColor};
  opacity: 0.7;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

export const UnreadBadge = styled.div`
  min-width: 22px;
  height: 22px;
  padding: 0 7px;
  background: linear-gradient(135deg, #ff4757, #ff6348);
  border-radius: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  color: white;
  flex-shrink: 0;
`;
