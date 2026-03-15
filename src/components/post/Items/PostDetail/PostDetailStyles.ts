import styled from "styled-components";
import Slider from "react-slick";

export const DetailContainer = styled.div`
  max-width: 850px;
  margin: 20px auto;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  overflow: hidden;
`;

export const DetailHeader = styled.div`
  padding: 24px;
  border-bottom: 1px solid #f3f4f6;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
  }
`;

export const DetailTitle = styled.h1`
  font-size: 24px;
  font-weight: 800;
  color: #111827;
  line-height: 1.4;
  margin-top: 8px;
`;

export const DetailContentArea = styled.div`
  padding: 30px 24px;
  position: relative;
`;

export const ImageSection = styled.div`
  position: relative;
  margin-bottom: 30px;
  border-radius: 12px;
  overflow: hidden;
`;

export const ImageCountBadge = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  z-index: 5;
`;

export const StyledSlider = styled(Slider)`
  .slick-dots {
    bottom: -30px;
  }
  .slick-prev:before,
  .slick-next:before {
    color: ${(props) => props.theme.mainColor};
    font-size: 35px;
  }
`;

export const FullImage = styled.img`
  width: 100%;
  max-height: 600px;
  object-fit: contain;
  background: #f9fafb;
`;

export const HashtagGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #f3f4f6;
`;

export const HashtagBadge = styled.span`
  background: #eff6ff;
  color: #3b82f6;
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #3b82f6;
    color: white;
  }
`;

export const OptionToggle = styled.div`
  position: relative;
  cursor: pointer;
  padding: 8px;
  font-size: 20px;
  color: #9ca3af;
  &:hover {
    color: #4b5563;
  }
`;

export const CommentSection = styled.div`
  background: #f9fafb;
  padding: 30px 24px;
  border-top: 1px solid #f3f4f6;
`;
