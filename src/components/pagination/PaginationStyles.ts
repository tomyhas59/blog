import styled from "styled-components";

export const PaginationNav = styled.nav`
  display: flex;
  justify-content: center;
  margin: 25px 0;

  ul {
    list-style: none;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 0;
  }
`;

export const PageStepButton = styled.li<{ disabled?: boolean }>`
  cursor: ${(props) => (props.disabled ? "default" : "pointer")};
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: #fff;
  border: 1px solid #e5e7eb;
  color: #6b7280;
  font-size: 11px;
  opacity: ${(props) => (props.disabled ? 0.3 : 1)};
  transition: all 0.2s ease;

  &:hover {
    ${(props) =>
      !props.disabled &&
      `
      border-color: ${props.theme.mainColor || "#3b82f6"};
      color: ${props.theme.mainColor || "#3b82f6"};
      background-color: #f0f7ff;
    `}
  }
`;

export const PageNumberItem = styled.li<{ isActive: boolean }>`
  button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: ${(props) => (props.isActive ? "700" : "500")};
    cursor: pointer;
    transition: all 0.2s ease;

    background-color: ${(props) =>
      props.isActive ? props.theme.mainColor : "#fff"};
    color: ${(props) => (props.isActive ? "#fff" : "#4b5563")};
    border: 1px solid
      ${(props) => (props.isActive ? props.theme.mainColor : "#e5e7eb")};

    &:hover {
      ${(props) =>
        !props.isActive &&
        `
        border-color: ${props.theme.mainColor};
        color: ${props.theme.mainColor};
        background-color: #f0f7ff;
      `}
    }
  }
`;
