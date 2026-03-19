// src/pages/Chat/FriendList.tsx
import React from "react";
import * as S from "./FriendListStyles";
import FollowButton from "../../components/ui/FollowButton";

interface Props {
  meId?: number;
  mutualUsers: any[];
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
    <S.FriendsList>
      {mutualUsers.length === 0 ? (
        <S.EmptyMessage>
          <i className="fas fa-user-friends"></i>
          <p>서로 팔로우한 친구가 없습니다</p>
        </S.EmptyMessage>
      ) : (
        mutualUsers.map((user) => (
          <S.FriendItem key={user.id}>
            <S.FriendButton
              onClick={() => handleUserOptionClick(user.nickname)}
            >
              <S.FriendAvatar>
                {user.nickname.charAt(0).toUpperCase()}
              </S.FriendAvatar>
              <S.FriendName>{user.nickname.slice(0, 10)}</S.FriendName>
              <S.ExpandIcon active={activeUserOption === user.nickname}>
                <i className="fas fa-chevron-down"></i>
              </S.ExpandIcon>
            </S.FriendButton>

            {user.id !== meId && activeUserOption === user.nickname && (
              <S.OptionPanel ref={userOptionRef}>
                <S.MenuButton onClick={() => handleChatStart(user)}>
                  <i className="fas fa-comment"></i>
                  <span>1:1 채팅하기</span>
                </S.MenuButton>
                <FollowButton
                  userId={user.id}
                  setActiveUserOption={setActiveUserOption}
                />
              </S.OptionPanel>
            )}
          </S.FriendItem>
        ))
      )}
    </S.FriendsList>
  );
};

export default FriendList;
