import styled from "styled-components";

// ===== 정렬 컨테이너 =====
export const SortContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: ${(props) => props.theme.backgroundColor};
  border: 1px solid ${(props) => props.theme.borderColor};
  border-radius: 8px;
  padding: 4px;
  gap: 4px;

  @media (max-width: 768px) {
    padding: 3px;
    gap: 3px;
  }

  @media (max-width: 480px) {
    width: 100%;
    justify-content: space-between;
  }
`;

// ===== 숨겨진 라디오 버튼 =====
export const HiddenRadio = styled.input`
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
  pointer-events: none;
`;

// ===== 정렬 옵션 =====
export const SortOption = styled.label<{ checked: boolean }>`
  display: flex;
  align-items: center;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  color: ${(props) => (props.checked ? "white" : props.theme.textColor)};
  background-color: ${(props) =>
    props.checked ? props.theme.mainColor : "transparent"};
  transition: all 0.2s ease;
  user-select: none;

  &:hover {
    background-color: ${(props) =>
      props.checked ? props.theme.hoverMainColor : props.theme.activeColor};
  }

  &:active {
    transform: scale(0.98);
  }

  @media (max-width: 768px) {
    padding: 7px 12px;
    font-size: 12px;
  }

  @media (max-width: 480px) {
    flex: 1;
    justify-content: center;
    padding: 8px 8px;
  }
`;

export const SortLabel = styled.span`
  display: flex;
  align-items: center;
  gap: 6px;

  i {
    font-size: 12px;

    @media (max-width: 480px) {
      font-size: 14px;
    }
  }

  span {
    @media (max-width: 640px) {
      display: none;
    }
  }

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 2px;
    font-size: 10px;

    span {
      display: block;
    }
  }
`;

// ===== 구분선 (사용 안함) =====
export const Divider = styled.div`
  display: none;
`;
