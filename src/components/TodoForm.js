import styled from "styled-components";
import useInput from "../hooks/useInput";
import { useRef } from "react";

const TodoForm = ({ addList, id }) => {
  const [text, onChangeText, setText] = useInput();
  const textInput = useRef(null);
  const onAddList = () => {
    addList(id + 1, text);
    setText("");
  };

  const Enter = (e) => {
    if (e.key === "Enter") {
      onAddList();
    }
  };

  const onResetList = () => {
    setText("");
    textInput.current.focus();
  };
  return (
    <div>
      <Input
        placeholder="할 일을 입력하시오"
        type="text"
        value={text}
        onChange={onChangeText}
        onKeyUp={Enter}
        ref={textInput}
      />
      <Button onClick={onAddList}>추가</Button>
      <Button onClick={onResetList}>초기화</Button>
    </div>
  );
};

export default TodoForm;

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
