import React, {
  useEffect,
  useCallback,
  useRef,
  SyntheticEvent,
  ChangeEvent,
} from "react";
import { useDispatch, useSelector } from "react-redux";

// Reducer & Types
import { ADD_REPLY_REQUEST } from "../../../reducer/post";
import { CommentType, PostType, ReplyType } from "../../../types";
import { RootState } from "../../../reducer";

// Hooks
import useInput from "../../../hooks/useInput";

// Styles
import * as S from "./ReplyFormStyles";

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
  const dispatch = useDispatch();

  // --- Global State ---
  const id = useSelector((state: RootState) => state.user.me?.id);
  const { addReplyDone } = useSelector((state: RootState) => state.post);

  // --- Local State & Refs ---
  const [replyContent, , setContent] = useInput();
  const editorRef = useRef<HTMLTextAreaElement>(null);

  // --- Handlers ---
  const onContentChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      setContent(e.target.value);
    },
    [setContent],
  );

  const onReplySubmit = useCallback(
    (e: SyntheticEvent) => {
      e.preventDefault();
      if (!replyContent.trim()) {
        alert("댓글을 입력하세요");
        return;
      }

      // 기존 멘션 결합 로직 유지
      const finalContent = reply
        ? `@${reply.User.nickname} ${replyContent}`
        : replyContent;

      const contentWithBreaks = finalContent.replace(/\n/g, "<br>");

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

      // 폼 닫기 로직 유지
      setAddReply({ [comment.id]: false });
    },
    [replyContent, comment.id, reply, dispatch, post.id, id, setAddReply],
  );

  // --- Life Cycle (기존 로직 보존) ---
  useEffect(() => {
    if (addReplyDone) {
      setContent("");
    }
    // 마운트 시 자동 포커스 유지
    if (editorRef.current) {
      editorRef.current.focus();
    }
  }, [addReplyDone, setContent]);

  return (
    <S.ReplyComposer onSubmit={onReplySubmit}>
      <S.EditorInput
        placeholder="답글 내용을 입력해주세요..."
        value={replyContent}
        onChange={onContentChange}
        ref={editorRef}
      />
      <S.ControlRow>
        <S.SubmitButton type="submit">답글 등록</S.SubmitButton>
      </S.ControlRow>
    </S.ReplyComposer>
  );
};

export default ReplyForm;
