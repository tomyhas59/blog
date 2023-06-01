import React from "react";
import { Button } from "./TodoForm";
import styled from "styled-components";
const TodoList = ({ state, removeList }) => {
  const onRemoveList = () => {
    removeList(state.id);
  };

  return (
    <div>
      <Wrap>
        {state.id}. {state.data}
      </Wrap>
      <Button onClick={onRemoveList}>완료</Button>
    </div>
  );
};

export default TodoList;

const Wrap = styled.div`
  display: inline-block;
  border-radius: 5px;
  border: 1px solid;
  width: 500px;
  padding-left: 20px;
  margin-top: 5px;
`;
