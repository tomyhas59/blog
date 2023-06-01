import styled from "styled-components";
import useInput from "../hooks/useInput";

const TodoForm = ({ addList, id }) => {
  const [text, onChangeText, setText] = useInput();

  const onAddList = () => {
    addList(id + 1, text);
    setText("");
  };

  const Enter = (e) => {
    if (e.key === "Enter") {
      onAddList();
    }
  };

  return (
    <div>
      <Input type="text" value={text} onChange={onChangeText} onKeyUp={Enter} />
      <Button onClick={onAddList}>추가</Button>
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
