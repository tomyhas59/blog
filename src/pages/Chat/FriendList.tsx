// src/pages/Chat/FriendList.tsx
import React from "react";
import * as S from "./styles";
import FollowButton from "../../components/ui/FollowButton";

interface Props {
  meId?: number;
  mutualUsers: any[]; // User 타입이 있다면 적용해주세요
  activeUserOption: string | null;
  handleUserOptionClick: (nickname: string) => void;
  handleChatStart: (user: any) => void;
  userOptionRef: React.RefObject<HTMLDivElement>;
  setActiveUserOption: (nickname: string | null) => void;
}

const FriendList = ({
  meId,
  mutualUsers,
  activeUserOption,
  handleUserOptionClick,
  handleChatStart,
  userOptionRef,
  setActiveUserOption,
}: Props) => {
  return (
    <S.FollowList>
      <h1>친구 목록</h1>
      <ul>
        {mutualUsers.map((user) => (
          <li key={user.id}>
            <button onClick={() => handleUserOptionClick(user.nickname)}>
              {user.nickname.slice(0, 5)}
            </button>
            {user.id !== meId && activeUserOption === user.nickname && (
              <S.UserOption ref={userOptionRef}>
                <button onClick={() => handleChatStart(user)}>
                  1:1 채팅하기
                </button>
                <FollowButton
                  userId={user.id}
                  setActiveUserOption={setActiveUserOption}
                />
              </S.UserOption>
            )}
          </li>
        ))}
      </ul>
    </S.FollowList>
  );
};

export default FriendList;
