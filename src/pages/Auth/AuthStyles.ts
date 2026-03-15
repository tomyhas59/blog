import styled, { keyframes } from "styled-components";

// ===== 애니메이션 =====
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`;

// ===== 컨테이너 =====
export const AuthContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: linear-gradient(
    135deg,
    ${(props) => props.theme.backgroundColor} 0%,
    ${(props) => props.theme.activeColor} 100%
  );
  position: relative;

  /* 배경 패턴 */
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: radial-gradient(
      circle at 20px 20px,
      ${(props) => props.theme.borderColor} 1px,
      transparent 0
    );
    background-size: 40px 40px;
    opacity: 0.3;
    pointer-events: none;
  }
`;

// ===== 카드 =====
export const AuthCard = styled.div`
  width: 100%;
  max-width: 450px;
  background-color: ${(props) => props.theme.backgroundColor};
  border-radius: 24px;
  box-shadow:
    0 10px 40px rgba(0, 0, 0, 0.1),
    0 2px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  animation: ${fadeIn} 0.5s ease;
  position: relative;
  z-index: 1;
  border: 1px solid ${(props) => props.theme.borderColor};

  @media (max-width: 480px) {
    border-radius: 16px;
  }
`;

// ===== 로고 섹션 =====
export const LogoSection = styled.div`
  padding: 40px 20px 30px;
  text-align: center;
  background: linear-gradient(
    135deg,
    ${(props) => props.theme.mainColor},
    ${(props) => props.theme.subColor}
  );
  position: relative;
  overflow: hidden;

  /* 반짝이는 효과 */
  &::after {
    content: "";
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.1) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    transform: rotate(45deg);
    animation: ${shimmer} 3s infinite;
  }
`;

export const LogoIcon = styled.div`
  width: 70px;
  height: 70px;
  margin: 0 auto 16px;
  background-color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  color: ${(props) => props.theme.mainColor};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  position: relative;
  z-index: 1;
  animation: ${pulse} 2s ease-in-out infinite;
`;

export const LogoText = styled.h1`
  font-size: 36px;
  font-weight: 900;
  color: white;
  margin: 0 0 8px;
  letter-spacing: -1px;
  font-family:
    "Poppins",
    -apple-system,
    BlinkMacSystemFont,
    sans-serif;
  position: relative;
  z-index: 1;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const LogoSubtext = styled.p`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  font-weight: 500;
  position: relative;
  z-index: 1;
`;

// ===== 폼 =====
export const AuthForm = styled.form`
  padding: 40px 32px;

  @media (max-width: 480px) {
    padding: 32px 24px;
  }
`;

export const Title = styled.h2`
  font-size: 28px;
  font-weight: 800;
  color: ${(props) => props.theme.charColor};
  margin: 0 0 8px;
  text-align: center;
  animation: ${slideIn} 0.5s ease;
`;

export const Subtitle = styled.p`
  font-size: 14px;
  color: ${(props) => props.theme.textColor};
  opacity: 0.7;
  text-align: center;
  margin: 0 0 32px;
  animation: ${slideIn} 0.5s ease 0.1s backwards;
`;

export const FormGroup = styled.div`
  margin-bottom: 20px;
  animation: ${slideIn} 0.5s ease 0.2s backwards;
`;

export const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: ${(props) => props.theme.textColor};
  margin-bottom: 8px;
`;

export const InputWrapper = styled.div<{ hasError?: boolean }>`
  position: relative;
  display: flex;
  align-items: center;

  ${(props) =>
    props.hasError &&
    `
    input {
      border-color: #ff4757;
      
      &:focus {
        border-color: #ff4757;
        box-shadow: 0 0 0 4px rgba(255, 71, 87, 0.15);
      }
    }
  `}
`;

export const InputIcon = styled.div`
  position: absolute;
  left: 16px;
  color: ${(props) => props.theme.textColor};
  opacity: 0.5;
  font-size: 16px;
  pointer-events: none;
  transition: all 0.3s ease;
  z-index: 1;
`;

export const Input = styled.input<{ hasError?: boolean }>`
  width: 100%;
  padding: 14px 16px 14px 48px;
  font-size: 15px;
  border: 2px solid ${(props) => props.theme.borderColor};
  border-radius: 12px;
  background-color: ${(props) => props.theme.backgroundColor};
  color: ${(props) => props.theme.textColor};
  transition: all 0.3s ease;
  font-family: inherit;

  &::placeholder {
    color: ${(props) => props.theme.textColor};
    opacity: 0.4;
  }

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.mainColor};
    background-color: ${(props) => props.theme.activeColor};
    box-shadow: 0 0 0 4px ${(props) => props.theme.mainColor}15;

    & ~ ${InputIcon} {
      color: ${(props) => props.theme.mainColor};
      opacity: 1;
    }
  }

  &:hover {
    border-color: ${(props) => props.theme.subColor};
  }
`;

export const SuccessIcon = styled.div`
  position: absolute;
  right: 16px;
  color: #2ecc71;
  font-size: 18px;
  animation: ${slideIn} 0.3s ease;

  i {
    filter: drop-shadow(0 1px 2px rgba(46, 204, 113, 0.3));
  }
`;

export const ErrorMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #ff4757;
  margin-top: 8px;
  animation: ${slideIn} 0.3s ease;
  font-weight: 500;

  i {
    font-size: 14px;
  }
`;

export const ForgotPassword = styled.a`
  display: block;
  text-align: right;
  font-size: 13px;
  color: ${(props) => props.theme.mainColor};
  text-decoration: none;
  margin: -8px 0 24px;
  font-weight: 600;
  transition: all 0.2s ease;
  animation: ${slideIn} 0.5s ease 0.3s backwards;

  &:hover {
    color: ${(props) => props.theme.hoverMainColor};
    text-decoration: underline;
  }
`;

export const SubmitButton = styled.button`
  width: 100%;
  padding: 16px;
  font-size: 16px;
  font-weight: 700;
  color: white;
  background: linear-gradient(
    135deg,
    ${(props) => props.theme.mainColor},
    ${(props) => props.theme.subColor}
  );
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 4px 12px ${(props) => props.theme.mainColor}40;
  animation: ${slideIn} 0.5s ease 0.4s backwards;
  font-family: inherit;

  i {
    font-size: 16px;
  }

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px ${(props) => props.theme.mainColor}50;
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

export const Divider = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  margin: 32px 0;
  animation: ${slideIn} 0.5s ease 0.5s backwards;

  &::before,
  &::after {
    content: "";
    flex: 1;
    border-bottom: 1px solid ${(props) => props.theme.borderColor};
  }

  span {
    padding: 0 16px;
    font-size: 13px;
    color: ${(props) => props.theme.textColor};
    opacity: 0.6;
    font-weight: 500;
  }
`;

export const SignupPrompt = styled.div`
  text-align: center;
  font-size: 14px;
  color: ${(props) => props.theme.textColor};
  animation: ${slideIn} 0.5s ease 0.6s backwards;
`;

export const SignupLink = styled.span`
  color: ${(props) => props.theme.mainColor};
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    color: ${(props) => props.theme.hoverMainColor};
    text-decoration: underline;
  }
`;
