import styled from "styled-components";

export const PageContainer = styled.section`
  background-color: ${(props) => props.theme.backgroundColor};
  color: ${(props) => props.theme.textColor};
  padding: 30px;
  max-width: 850px;
  margin: 30px auto;
  border-radius: 16px;
  box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: 15px;
    margin: 10px;
  }
`;

export const ProfileSection = styled.header`
  display: flex;
  align-items: center;
  gap: 20px;
  border-bottom: 2px solid ${(props) => props.theme.borderColor};
  padding-bottom: 25px;
  margin-bottom: 25px;
`;

export const MainAvatar = styled.img`
  width: 90px;
  height: 90px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid ${(props) => props.theme.mainColor};
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.05);
  }
`;

export const UserDetail = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

export const NicknameTitle = styled.h1`
  color: ${(props) => props.theme.charColor};
  font-size: 22px;
  font-weight: 800;
  margin-bottom: 8px;
`;

export const CountRow = styled.div`
  display: flex;
  gap: 15px;
  font-size: 15px;

  span {
    font-weight: 700;
    color: ${(props) => props.theme.mainColor};
  }
`;

export const SectionLabel = styled.h2`
  font-size: 17px;
  font-weight: 700;
  margin: 20px 0 12px;
  color: ${(props) => props.theme.charColor};
  display: flex;
  align-items: center;

  &::before {
    content: "";
    width: 4px;
    height: 16px;
    background-color: ${(props) => props.theme.mainColor};
    margin-right: 8px;
    border-radius: 2px;
  }
`;

// 가로 스크롤 팔로우 리스트
export const HorizontalList = styled.div`
  width: 100%;
  overflow-x: auto;
  display: flex;
  gap: 12px;
  padding-bottom: 10px;
  margin-bottom: 25px;

  &::-webkit-scrollbar {
    height: 5px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: ${(props) => props.theme.borderColor};
    border-radius: 10px;
  }
`;

export const FollowItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 70px;
  cursor: pointer;

  img {
    width: 55px;
    height: 55px;
    border-radius: 50%;
    margin-bottom: 5px;
    border: 2px solid transparent;
    transition: border-color 0.2s;
  }

  &:hover img {
    border-color: ${(props) => props.theme.mainColor};
  }
`;

// 게시글 그리드 레이아웃
export const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-top: 15px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

export const PostItemCard = styled.article`
  background-color: ${(props) => props.theme.top3Color || "#fff"};
  border: 1px solid ${(props) => props.theme.borderColor};
  border-radius: 14px;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    border-color: ${(props) => props.theme.mainColor};
  }
`;

export const CardImg = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

export const CardBody = styled.div`
  padding: 15px;
`;

export const CardTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: ${(props) => props.theme.charColor};
  line-height: 1.4;
`;
