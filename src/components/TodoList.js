import React, { useCallback } from "react";
import { Button } from "./TodoForm";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { REMOVE_LIST } from "../reducer/todo";
const TodoList = ({ state }) => {
  const dispatch = useDispatch();
  const onRemoveList = useCallback(() => {
    dispatch({
      type: REMOVE_LIST,
      id: state.id,
    });
  }, [state.id, dispatch]);

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
