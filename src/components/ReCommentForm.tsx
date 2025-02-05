import React, {
  useEffect,
  useCallback,
  useRef,
  SyntheticEvent,
  ChangeEvent,
} from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { ADD_RECOMMENT_REQUEST } from "../reducer/post";
import useInput from "../hooks/useInput";
import { CommentType, PostType, ReCommentType } from "../types";
import { RootState } from "../reducer";

const ReCommentForm = ({
  post,
  comment,
  reComment,
  setAddReComment,
}: {
  post: PostType;
  comment: CommentType;
  reComment: ReCommentType | null;
  setAddReComment: React.Dispatch<
    React.SetStateAction<Record<number, boolean>>
  >;
}) => {
  const { addReCommentDone } = useSelector((state: RootState) => state.post);
  const editReCommentRef = useRef<HTMLTextAreaElement>(null);

  const [reCommentContent, , setContent] = useInput();

  const handleContentChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      setContent(e.target.value);
    },
    [setContent]
  );

  const dispatch = useDispatch();
  const id = useSelector((state: RootState) => state.user.me?.id);

  useEffect(() => {
    if (addReCommentDone) {
      setContent("");
    }
    if (editReCommentRef) {
      editReCommentRef.current!.focus();
    }
  }, [addReCommentDone, editReCommentRef, setContent]);

  const handleAddReComment = useCallback(
    (e: SyntheticEvent) => {
      e.preventDefault();
      if (reCommentContent === "") {
        alert("댓글을 입력하세요");
        return;
      }

      const content = reComment
        ? `@${reComment.User.nickname} ${reCommentContent}`
        : reCommentContent;

      const contentWithBreaks = content.replace(/\n/g, "<br>");
      dispatch({
        type: ADD_RECOMMENT_REQUEST,
        data: {
          content: contentWithBreaks,
          postId: post.id,
          commentId: comment.id,
          reComment: reComment?.id,
          userId: id,
        },
      });
      setAddReComment({ [comment.id]: false });
    },
    [
      reCommentContent,
      comment.id,
      reComment,
      dispatch,
      post.id,
      id,
      setAddReComment,
    ]
  );

  return (
    <Form onSubmit={handleAddReComment}>
      <Textarea
        placeholder="내용을 입력해주세요"
        value={reCommentContent}
        onChange={handleContentChange}
        ref={editReCommentRef}
      />
      <Button type="submit">등록</Button>
    </Form>
  );
};

export default ReCommentForm;

const Form = styled.form`
  width: 100%;
  text-align: center;
`;

const Textarea = styled.textarea`
  max-width: 90%;
  min-width: 90%;
`;

const Button = styled.button`
  background-color: ${(props) => props.theme.mainColor};
  font-size: 12px;
  margin: 2px;
  color: #fff;
  padding: 6px;
  border-radius: 6px;
  cursor: pointer;
  transition: transform 0.3s ease, color 0.3s ease;
  &:hover {
    transform: translateY(-2px);
    color: ${(props) => props.theme.charColor};
  }
`;
