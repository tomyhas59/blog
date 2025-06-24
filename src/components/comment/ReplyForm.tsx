import React, {
  useEffect,
  useCallback,
  useRef,
  SyntheticEvent,
  ChangeEvent,
} from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { ADD_REPLY_REQUEST } from "../../reducer/post";
import useInput from "../../hooks/useInput";
import { CommentType, PostType, ReplyType } from "../../types";
import { RootState } from "../../reducer";

const ReplyForm = ({
  post,
  comment,
  reply,
  setAddReply,
}: {
  post: PostType;
  comment: CommentType;
  reply: ReplyType | null;
  setAddReply: React.Dispatch<React.SetStateAction<Record<number, boolean>>>;
}) => {
  const { addReplyDone } = useSelector((state: RootState) => state.post);
  const editReplyRef = useRef<HTMLTextAreaElement>(null);

  const [replyContent, , setContent] = useInput();

  const handleContentChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      setContent(e.target.value);
    },
    [setContent]
  );

  const dispatch = useDispatch();
  const id = useSelector((state: RootState) => state.user.me?.id);

  useEffect(() => {
    if (addReplyDone) {
      setContent("");
    }
    if (editReplyRef) {
      editReplyRef.current!.focus();
    }
  }, [addReplyDone, editReplyRef, setContent]);

  const handleAddReply = useCallback(
    (e: SyntheticEvent) => {
      e.preventDefault();
      if (replyContent === "") {
        alert("댓글을 입력하세요");
        return;
      }

      const content = reply
        ? `@${reply.User.nickname} ${replyContent}`
        : replyContent;

      const contentWithBreaks = content.replace(/\n/g, "<br>");
      dispatch({
        type: ADD_REPLY_REQUEST,
        data: {
          content: contentWithBreaks,
          postId: post.id,
          commentId: comment.id,
          reply: reply?.id,
          userId: id,
        },
      });
      setAddReply({ [comment.id]: false });
    },
    [replyContent, comment.id, reply, dispatch, post.id, id, setAddReply]
  );

  return (
    <Form onSubmit={handleAddReply}>
      <Textarea
        placeholder="내용을 입력해주세요"
        value={replyContent}
        onChange={handleContentChange}
        ref={editReplyRef}
      />
      <Button type="submit">등록</Button>
    </Form>
  );
};

export default ReplyForm;

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
