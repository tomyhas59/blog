// src/pages/Chat/RoomList.tsx
import React from "react";
import * as S from "./RoomListStyles";
import { UserRoomList } from "./index";

interface Props {
  meId?: number;
  userRoomList: UserRoomList[];
  setRoom: (room: UserRoomList) => void;
  setActiveRoom: (room: UserRoomList) => void;
  setSelectedUserId: (id: number) => void;
}

const RoomList = ({
  meId,
  userRoomList,
  setRoom,
  setActiveRoom,
  setSelectedUserId,
}: Props) => {
  return (
    <S.RoomsList>
      {userRoomList.length === 0 ? (
        <S.EmptyMessage>
          <i className="fas fa-comments"></i>
          <p>채팅방이 없습니다</p>
        </S.EmptyMessage>
      ) : (
        userRoomList.map((userRoom) => {
          const selectedUserId =
            userRoom.User1.id === meId ? userRoom.User2.id : userRoom.User1.id;

          const partnerName =
            userRoom.User1.id === meId
              ? userRoom.User2.nickname
              : userRoom.User1.nickname;

          const unreadCount = Array.isArray(userRoom.UnReadMessages)
            ? userRoom.UnReadMessages.filter((m) => m.UserId !== meId).length
            : 0;

          return (
            <S.RoomItem
              key={userRoom.id}
              onClick={() => {
                setSelectedUserId(selectedUserId);
                setRoom(userRoom);
                setActiveRoom(userRoom);
              }}
            >
              <S.RoomAvatar>{partnerName.charAt(0).toUpperCase()}</S.RoomAvatar>
              <S.RoomInfo>
                <S.RoomName>{partnerName}</S.RoomName>
                <S.RoomPreview>님과의 채팅</S.RoomPreview>
              </S.RoomInfo>
              {unreadCount > 0 && <S.UnreadBadge>{unreadCount}</S.UnreadBadge>}
            </S.RoomItem>
          );
        })
      )}
    </S.RoomsList>
  );
};

export default RoomList;
