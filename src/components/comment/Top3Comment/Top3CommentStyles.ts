import styled from "styled-components";

export const BestCommentContainer = styled.section`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px dashed ${(props) => props.theme.borderColor || "#eee"};
`;

export const BestCard = styled.article`
  position: relative;
  padding: 1.25rem;
  border-radius: 12px;
  background-color: ${(props) => props.theme.top3Color || "#fff9f8"};
  border: 1px solid ${(props) => props.theme.mainColor}22;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }
`;

export const CardHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
`;

export const RankBadge = styled.span`
  background-color: ${(props) => props.theme.mainColor};
  color: #fff;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  margin-left: 10px;

  img {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    object-fit: cover;
  }

  span {
    font-weight: 700;
    font-size: 0.9rem;
    color: ${(props) => props.theme.textColor};
  }
`;

export const Timestamp = styled.time`
  font-size: 0.75rem;
  color: #a0a0a0;
  margin-right: 12px;
`;

export const ContentArea = styled.div`
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
  line-height: 1.5;
`;

export const NavigationLink = styled.button`
  position: absolute;
  bottom: 12px;
  right: 16px;
  background: none;
  border: none;
  color: ${(props) => props.theme.mainColor};
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;

  &:hover {
    background-color: ${(props) => props.theme.mainColor}11;
    text-decoration: underline;
  }
`;
