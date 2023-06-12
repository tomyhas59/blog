export const initialState = {
  posts: [],
  isLoading: false,
  isDone: false,
  isError: null,
};

export const REGISTER_POST = "REGISTER_POST";
export const MODIFY_POST = "MODIFY_POST";
export const DELETE_POST = "DELETE_POST";

const post = (state = initialState, action) => {
  switch (action.type) {
    case REGISTER_POST:
      return {
        ...state,
        posts: [...state.posts, action.payload],
      };
    case MODIFY_POST:
      const updatedPosts = state.posts.map((post) => {
        if (post.id === action.payload.id) {
          return {
            ...post,
            title: action.payload.title,
            content: action.payload.content,
          };
        }
        return post;
      });
      return {
        ...state,
        posts: updatedPosts,
      };
    case DELETE_POST:
      const filteredPosts = state.posts.filter(
        (post) => post.id !== action.payload
      );
      return {
        ...state,
        posts: filteredPosts,
      };
    default:
      return state;
  }
};

export default post;
