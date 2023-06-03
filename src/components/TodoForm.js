import styled from "styled-components";
import useInput from "../hooks/useInput";
import { useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ADD_LIST } from "../reducer/todo";

const TodoForm = () => {
  const [text, onChangeText, setText] = useInput();
  const textInput = useRef(null);
  const dispatch = useDispatch();
  const state = useSelector((state) => state.todo);

  const onAddList = useCallback(() => {
    dispatch({
      type: ADD_LIST,
      data: {
        id: state[state.length - 1].id + 1,
        data: text,
      },
    });
    setText("");
  }, [state, text, dispatch, setText]);

  const Enter = useCallback(
    (e) => {
      if (e.key === "Enter") {
        onAddList();
      }
    },
    [onAddList]
  );

  const onResetList = useCallback(() => {
    setText("");
    textInput.current.focus();
  }, [setText, textInput]);

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
