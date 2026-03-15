import styled from "styled-components";

export const AuthContainer = styled.div`
  max-width: 400px;
  width: 100%;
  margin: 5% auto;
  padding: 30px;
  border: 1px solid #ddd;
  border-radius: 10px;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  @media (max-width: 768px) {
    padding: 20px;
    transform: scale(0.9);
    margin-top: 10vh;
  }
`;

export const AuthForm = styled.form`
  display: flex;
  flex-direction: column;
`;

export const Title = styled.h2`
  margin-bottom: 20px;
  font-size: 1.8rem;
  text-align: center;
  color: ${(props) => props.theme.mainColor};
`;

export const FormGroup = styled.div`
  margin-bottom: 15px;
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: ${(props) => props.theme.mainColor};
`;

export const Input = styled.input`
  width: 100%;
  padding: 12px;
  font-size: 14px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-sizing: border-box;
  transition: border-color 0.3s ease;
  color: ${(props) => props.theme.mainColor};
  &:focus {
    border-color: ${(props) => props.theme.mainColor};
    outline: none;
  }
`;

export const SubmitButton = styled.button`
  padding: 12px;
  font-size: 16px;
  background-color: ${(props) => props.theme.mainColor};
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition:
    background-color 0.3s ease,
    transform 0.3s ease;
  margin-top: 10px;

  &:hover {
    background-color: ${(props) => props.theme.hoverMainColor};
    transform: translateY(-2px);
  }
`;

export const ErrorMessage = styled.div`
  color: red;
  margin-top: 10px;
  text-align: center;
  font-size: 14px;
`;
