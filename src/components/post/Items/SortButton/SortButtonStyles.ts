import styled from "styled-components";

export const SortContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 4px;
  margin-bottom: 12px;
  padding-right: 8px;

  @media (max-width: 768px) {
    justify-content: center;
    gap: 2px;
    margin-bottom: 16px;
  }
`;

export const SortOption = styled.label<{ checked: boolean }>`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: ${(props) => (props.checked ? "700" : "500")};
  color: ${(props) => (props.checked ? props.theme.mainColor : "#6b7280")};
  background-color: ${(props) => (props.checked ? "#eff6ff" : "transparent")};
  transition: all 0.2s ease;

  &:hover {
    background-color: ${(props) => (props.checked ? "#eff6ff" : "#f3f4f6")};
    color: ${(props) => (props.checked ? props.theme.mainColor : "#374151")};
  }

  span {
    user-select: none;
  }

  @media (max-width: 768px) {
    padding: 4px 10px;
    font-size: 12px;
  }
`;

export const HiddenRadio = styled.input`
  display: none; /* 완전히 숨김 */
`;

export const Divider = styled.span`
  width: 1px;
  height: 10px;
  background-color: #e5e7eb;
  margin: 0 2px;

  @media (max-width: 768px) {
    display: none; /* 모바일에서는 여백을 위해 숨김 */
  }
`;
