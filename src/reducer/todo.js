const initialState = [
  { id: 1, data: "리액트 공부하기" },
  { id: 2, data: "밥 먹기" },
];

export const ADD_LIST = "ADD_LIST";
export const REMOVE_LIST = "REMOVE_LIST";

const todo = (state = initialState, action) => {
  switch (action.type) {
    case ADD_LIST:
      return [...state, { id: action.data.id, data: action.data.data }];
    case REMOVE_LIST:
      return state.filter((v) => v.id !== action.id);

    default:
      return state;
  }
};
export default todo;
