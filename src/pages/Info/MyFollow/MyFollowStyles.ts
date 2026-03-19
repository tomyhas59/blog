import styled from "styled-components";

// ===== 컨테이너 =====
export const Container = styled.div`
  max-width: 935px;
  margin: 0 auto;
  padding: 24px 20px;

  @media (max-width: 768px) {
    padding: 20px 16px;
  }
`;

// ===== 섹션 =====
export const Section = styled.section`
  margin-bottom: 48px;

  &:last-child {
    margin-bottom: 0;
  }

  @media (max-width: 768px) {
    margin-bottom: 40px;
  }
`;

export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid ${(props) => props.theme.borderColor};

  @media (max-width: 768px) {
    margin-bottom: 20px;
    padding-bottom: 14px;
  }
`;

export const SectionTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: ${(props) => props.theme.charColor};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;

  i {
    font-size: 26px;
    color: ${(props) => props.theme.mainColor};
  }

  @media (max-width: 768px) {
    font-size: 20px;

    i {
      font-size: 22px;
    }
  }
`;

export const Count = styled.span`
  font-size: 18px;
  font-weight: 700;
  color: ${(props) => props.theme.mainColor};
  padding: 6px 14px;
  background-color: ${(props) => props.theme.activeColor};
  border-radius: 20px;

  @media (max-width: 768px) {
    font-size: 16px;
    padding: 5px 12px;
  }
`;

// ===== 유저 그리드 =====
export const UserGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 12px;
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
`;

export const UserCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 20px;
  background-color: ${(props) => props.theme.backgroundColor};
  border: 1px solid ${(props) => props.theme.borderColor};
  border-radius: 12px;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${(props) => props.theme.mainColor};
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 768px) {
    padding: 16px;
    gap: 10px;
  }
`;

export const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  width: 100%;
`;

export const Avatar = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid ${(props) => props.theme.borderColor};
  transition: all 0.2s ease;

  ${UserCard}:hover & {
    border-color: ${(props) => props.theme.mainColor};
  }

  @media (max-width: 768px) {
    width: 70px;
    height: 70px;
    border-width: 2px;
  }
`;

export const Nickname = styled.span`
  font-size: 15px;
  font-weight: 600;
  color: ${(props) => props.theme.textColor};
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
  max-width: 140px;

  @media (max-width: 768px) {
    font-size: 14px;
    max-width: 120px;
  }
`;

export const ButtonWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

// ===== 빈 상태 =====
export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;

  @media (max-width: 768px) {
    padding: 60px 20px;
  }
`;

export const EmptyIcon = styled.div`
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
    135deg,
    ${(props) => props.theme.activeColor},
    ${(props) => props.theme.borderColor}
  );
  border-radius: 50%;
  margin-bottom: 20px;

  i {
    font-size: 44px;
    color: ${(props) => props.theme.textColor};
    opacity: 0.4;
  }

  @media (max-width: 768px) {
    width: 80px;
    height: 80px;

    i {
      font-size: 36px;
    }
  }
`;

export const EmptyText = styled.p`
  font-size: 15px;
  color: ${(props) => props.theme.textColor};
  opacity: 0.7;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;
