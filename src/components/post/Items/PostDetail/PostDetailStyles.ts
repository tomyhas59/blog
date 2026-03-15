import styled from "styled-components";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// ===== 컨테이너 =====
export const DetailContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  background-color: ${(props) => props.theme.backgroundColor};

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

// ===== 헤더 =====
export const DetailHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid ${(props) => props.theme.borderColor};
  gap: 16px;

  @media (max-width: 768px) {
    padding: 16px;
    flex-wrap: wrap;
  }
`;

export const AuthorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;

  @media (max-width: 480px) {
    width: 100%;
  }
`;

export const AuthorWrapper = styled.div`
  position: relative;
  flex-shrink: 0;
`;

export const AuthorButton = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 12px;
  background: transparent;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${(props) => props.theme.activeColor};
  }
`;

export const ProfileImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid ${(props) => props.theme.borderColor};

  @media (max-width: 768px) {
    width: 36px;
    height: 36px;
  }
`;

export const AuthorName = styled.span`
  font-size: 15px;
  font-weight: 700;
  color: ${(props) => props.theme.charColor};

  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

export const PostDate = styled.div`
  font-size: 13px;
  color: ${(props) => props.theme.textColor};
  opacity: 0.7;

  @media (max-width: 480px) {
    font-size: 12px;
  }
`;

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  @media (max-width: 480px) {
    gap: 12px;
  }
`;

export const ViewCount = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: ${(props) => props.theme.textColor};

  i {
    font-size: 14px;
    color: ${(props) => props.theme.mainColor};
  }

  @media (max-width: 480px) {
    font-size: 12px;
  }
`;

export const OptionButton = styled.button`
  position: relative;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  color: ${(props) => props.theme.textColor};
  font-size: 18px;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${(props) => props.theme.activeColor};
    color: ${(props) => props.theme.mainColor};
  }
`;

// ===== 메뉴 =====
export const AuthorMenu = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  background-color: ${(props) => props.theme.backgroundColor};
  border: 1px solid ${(props) => props.theme.borderColor};
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 8px;
  min-width: 180px;
  z-index: 100;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const OptionsMenu = styled(AuthorMenu)`
  left: auto;
  right: 0;
  min-width: 140px;
`;

export const MenuButton = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 12px;
  background: transparent;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: ${(props) => props.theme.textColor};
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;

  i {
    font-size: 14px;
    width: 18px;
    color: ${(props) => props.theme.mainColor};
  }

  &:hover {
    background-color: ${(props) => props.theme.activeColor};
  }

  &.danger {
    color: #ff4757;

    i {
      color: #ff4757;
    }

    &:hover {
      background-color: #fff5f5;
    }
  }
`;

// ===== 제목 =====
export const TitleSection = styled.div`
  padding: 24px 24px 16px;
  border-bottom: 1px solid ${(props) => props.theme.borderColor};

  @media (max-width: 768px) {
    padding: 20px 16px 12px;
  }
`;

export const Title = styled.h1`
  font-size: 24px;
  font-weight: 800;
  color: ${(props) => props.theme.charColor};
  margin: 0;
  line-height: 1.4;
  word-break: break-word;

  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

// ===== 본문 =====
export const ContentArea = styled.div`
  padding: 24px;

  @media (max-width: 768px) {
    padding: 20px 16px;
  }
`;

export const ImageSection = styled.div`
  position: relative;
  margin-bottom: 24px;
  border-radius: 12px;
  overflow: hidden;
  background-color: ${(props) => props.theme.activeColor};

  @media (max-width: 768px) {
    margin-bottom: 20px;
    border-radius: 8px;
  }
`;

export const ImageCounter = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  z-index: 10;
  backdrop-filter: blur(4px);

  @media (max-width: 768px) {
    top: 12px;
    right: 12px;
    padding: 4px 10px;
    font-size: 12px;
  }
`;

export const StyledSlider = styled(Slider)`
  .slick-dots {
    bottom: 16px;

    li button:before {
      color: white;
      opacity: 0.5;
      font-size: 8px;
    }

    li.slick-active button:before {
      opacity: 1;
      color: ${(props) => props.theme.mainColor};
    }
  }

  .slick-prev,
  .slick-next {
    width: 40px;
    height: 40px;
    z-index: 10;

    &:before {
      font-size: 40px;
      opacity: 0.7;
    }

    &:hover:before {
      opacity: 1;
    }
  }

  .slick-prev {
    left: 16px;
  }

  .slick-next {
    right: 16px;
  }

  @media (max-width: 768px) {
    .slick-prev,
    .slick-next {
      width: 32px;
      height: 32px;

      &:before {
        font-size: 32px;
      }
    }

    .slick-prev {
      left: 8px;
    }

    .slick-next {
      right: 8px;
    }
  }
`;

export const PostImage = styled.img`
  width: 100%;
  max-height: 600px;
  object-fit: contain;
  display: block;

  @media (max-width: 768px) {
    max-height: 400px;
  }
`;

export const TextContent = styled.div`
  font-size: 15px;
  line-height: 1.7;
  color: ${(props) => props.theme.textColor};
  word-break: break-word;

  @media (max-width: 768px) {
    font-size: 14px;
    line-height: 1.6;
  }
`;

export const HashtagSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid ${(props) => props.theme.borderColor};

  @media (max-width: 768px) {
    margin-top: 20px;
    padding-top: 20px;
  }
`;

export const Hashtag = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 6px 14px;
  background-color: ${(props) => props.theme.activeColor};
  border: 1px solid ${(props) => props.theme.borderColor};
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  color: ${(props) => props.theme.mainColor};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${(props) => props.theme.mainColor};
    color: white;
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    padding: 5px 12px;
    font-size: 12px;
  }
`;

// ===== 댓글 =====
export const CommentSection = styled.div`
  padding: 24px;
  border-top: 8px solid ${(props) => props.theme.activeColor};

  @media (max-width: 768px) {
    padding: 20px 16px;
    border-top-width: 6px;
  }
`;

export const CommentHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
  font-size: 18px;
  font-weight: 800;
  color: ${(props) => props.theme.charColor};

  i {
    font-size: 20px;
    color: ${(props) => props.theme.mainColor};
  }

  @media (max-width: 768px) {
    font-size: 16px;
    margin-bottom: 16px;

    i {
      font-size: 18px;
    }
  }
`;

export const CommentCount = styled.span`
  color: ${(props) => props.theme.mainColor};
`;
