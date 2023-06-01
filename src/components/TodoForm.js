import styled from "styled-components";
import useInput from "../hooks/useInput";

const Input = styled.input`
  border-radius: 5px;
  width: 500px;
  font-size: 32px;
  padding-left: 20px;
  position: relative;
`;

export const Button = styled.button`
  border-radius: 5px;
  background-color: green;
  color: #fff;
  height: 40px;
  cursor: pointer;
`;

const TodoForm = () => {
  const [text, onChangeText, setText] = useInput();
  return (
    <div>
      <Input type="text" value={text} onChange={onChangeText} />
      <Button onClick={""}>추가</Button>
    </div>
  );
};

export default TodoForm;
