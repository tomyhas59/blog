import styled from "styled-components";

// 전체 컨테이너
export const FollowContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
`;

// 섹션 (팔로워 / 팔로잉 영역)
export const FollowSection = styled.section`
  display: flex;
  flex-direction: column;
`;

export const SectionHeader = styled.h2`
  font-size: 20px;
  font-weight: 800;
  color: ${(props) => props.theme.charColor};
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;

  span {
    color: ${(props) => props.theme.mainColor};
    font-size: 18px;
  }
`;

// 그리드 레이아웃
export const FollowGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 15px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

// 유저 카드
export const UserCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px;
  background-color: ${(props) => props.theme.top3Color || "#fff"};
  border: 1px solid ${(props) => props.theme.borderColor};
  border-radius: 12px;
  transition:
    transform 0.2s,
    box-shadow 0.2s;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  }
`;

// 유저 정보 영역 (클릭 시 이동)
export const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  flex: 1;
`;

// [중요] User에서 가져오지 않고 새로 만든 Avatar 스타일
export const InternalAvatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid ${(props) => props.theme.mainColor};
`;

export const Nickname = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: ${(props) => props.theme.charColor};

  &:hover {
    color: ${(props) => props.theme.mainColor};
  }
`;
