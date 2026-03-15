// src/pages/Chat/RoomList.tsx
import React from "react";
import * as S from "./styles";
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
    <S.RoomList>
      <h1>채팅방 목록</h1>
      {userRoomList.map((userRoom) => {
        const selectedUserId =
          userRoom.User1.id === meId ? userRoom.User2.id : userRoom.User1.id;

        const count = Array.isArray(userRoom.UnReadMessages)
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
            <S.UnReadMessageCount count={count}>{count}</S.UnReadMessageCount>
            {userRoom.User1.id === meId
              ? userRoom.User2.nickname
              : userRoom.User1.nickname}
            님과 채팅
          </S.RoomItem>
        );
      })}
    </S.RoomList>
  );
};

export default RoomList;
