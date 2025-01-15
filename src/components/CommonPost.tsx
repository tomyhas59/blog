import styled from "styled-components";
import { useParams } from "react-router-dom";
import React, {
  ChangeEvent,
  SyntheticEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import CommentForm from "../components/CommentForm";
import Comment from "../components/Comment";
import { useDispatch, useSelector } from "react-redux";
import {
  REMOVE_POST_REQUEST,
  UPDATE_POST_REQUEST,
  DELETE_IMAGE_REQUEST,
  UPLOAD_IMAGES_REQUEST,
  REMOVE_IMAGE_REQUEST,
  SEARCH_POSTS_REQUEST,
  GET_POST_REQUEST,
} from "../reducer/post";
import moment from "moment";
import "moment/locale/ko";
import { RootState } from "../reducer";
import { baseURL } from "../config";
import ContentRenderer from "../components/renderer/ContentRenderer";
import useOutsideClick from "../hooks/useOutsideClick";
import useTextareaAutoHeight from "../hooks/useTextareaAutoHeight";
import FollowButton from "../components/FollowButton";
import { DEFAULT_PROFILE_IMAGE } from "../pages/Info/MyInfo";
import { FileButton } from "../components/PostForm";
import { useNavigate } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import { usePagination } from "../hooks/PaginationProvider";
import { Date, PostInfo, ViewCount, PostHeaderFlex, Button } from "./Post";
import Like from "./Like";

const CommonPost = () => {
  const socket = useRef<Socket | null>(null);
  const me = useSelector((state: RootState) => state.user.me);
  const dispatch = useDispatch();

  const { setSearchedCurrentPage } = usePagination();

  const { postId } = useParams();

  const { post, imagePaths, comments, totalComments } = useSelector(
    (state: RootState) => state.post
  );

  useEffect(() => {
    if (postId) {
      dispatch({
        type: GET_POST_REQUEST,
        postId: postId,
      });
    }
  }, [dispatch, postId]);

  useEffect(() => {
    socket.current =
      process.env.NODE_ENV === "production"
        ? io("https://patient-marina-tomyhas59-8c3582f9.koyeb.app")
        : io("http://localhost:3075");

    return () => {
      socket.current?.disconnect();
    };
  }, [me]);

  const [editPost, setEditPost] = useState(false);
  const [content, setContent] = useState("");
  const navigator = useNavigate();
  const onChangeContent = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      setContent(e.target.value);
    },
    [setContent]
  );

  const id = me?.id;
  const nickname = useSelector((state: RootState) => state.user.me?.nickname);

  const imageInput = useRef<HTMLInputElement>(null);
  const editPostRef = useRef<HTMLTextAreaElement>(null);

  //---닉네임 클릭 정보 보기-------------------------------------
  const [showInfo, setShowInfo] = useState<boolean | {}>(false);
  const toggleShowInfo = useCallback(() => {
    setShowInfo((prevShowInfo) => !prevShowInfo);
  }, []);

  //---게시글 수정, 삭제 토글-------------------------------------
  const [showOptions, setShowOptions] = useState(false);
  const toggleShowOptions = useCallback(() => {
    setShowOptions((prevShowOptions) => !prevShowOptions);
  }, []);

  //수정 시 높이 조정
  useTextareaAutoHeight(editPostRef, editPost);

  //OutsideClick----------------------------------------------
  const infoMenuRef = useRef<HTMLDivElement>(null);
  const popupMenuRef = useRef<HTMLDivElement>(null);
  const commentFormRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useOutsideClick([infoMenuRef, popupMenuRef, formRef, commentFormRef], () => {
    setShowOptions(false);
    setShowInfo(false);
    setAddComment({});
    setEditPost(false);
  });

  //-----게시글 수정 및 취소-------------------------
  const toggleEditPostForm = useCallback(() => {
    setEditPost((prev) => {
      if (!prev) {
        setContent(post.content);
      } else {
        dispatch({
          type: "CANCEL_MODIFY",
        });
      }
      return !prev;
    });
  }, [dispatch, post.content, setContent]);

  //댓글 창, 기존 폼 닫고 새로운 폼 열고 닫기--------------
  const [addComment, setAddComment] = useState<Record<number, boolean>>({});

  const toggleAddCommentForm = useCallback(() => {
    if (!id) {
      alert("로그인이 필요합니다");
    } else
      setAddComment((prev) => {
        const newCommentState: Record<string, boolean> = {};
        Object.keys(prev).forEach((key) => {
          newCommentState[key] = false;
        });
        newCommentState[post.id] = !prev[post.id];
        return newCommentState;
      });
  }, [id, post.id]);

  const onDeletePost = useCallback(() => {
    if (!window.confirm("삭제하시겠습니까?")) return false;
    dispatch({
      type: REMOVE_POST_REQUEST,
      data: post.id,
    });
    navigator("/");
  }, [dispatch, navigator, post.id]);

  const setParams = useCallback(() => {
    const params = new URLSearchParams();
    params.set("searchText", post.User?.nickname);
    params.set("searchOption", "author");
    params.set("page", "1");

    navigator({
      pathname: `/search`,
      search: params.toString(),
    });
  }, [navigator, post.User?.nickname]);

  const onSearch = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      dispatch({
        type: SEARCH_POSTS_REQUEST,
        searchText: post.User.nickname,
        searchOption: "author",
      });
      setSearchedCurrentPage(1);
      setParams();
      window.scrollTo({ top: 0, behavior: "auto" });
    },
    [dispatch, post.User?.nickname, setSearchedCurrentPage, setParams]
  );

  const onRemoveImage = useCallback(
    (filename: string) => () => {
      if (filename) {
        dispatch({
          type: REMOVE_IMAGE_REQUEST,
          data: filename,
        });
      }
    },
    [dispatch]
  );

  const onDeleteImage = useCallback(
    (filename: string) => () => {
      if (filename) {
        dispatch({
          type: DELETE_IMAGE_REQUEST,
          data: {
            postId: post.id,
            filename,
          },
        });
      }
    },
    [dispatch, post.id]
  );

  const onClickFileUpload = useCallback(() => {
    imageInput.current!.click();
  }, []);

  const onChangeImages = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      console.log("images", e.target.files);

      const imageFormData = new FormData();
      // 중복된 이미지 파일명을 방지하기 위해 Set 사용
      const addedImageNames = new Set();

      const files = e.target.files as FileList;
      [].forEach.call(files /*선택한 파일들 */, (f: File) => {
        // 이미 추가된 이미지인지 확인하고 추가되지 않은 경우에만 처리
        if (!addedImageNames.has(f.name)) {
          addedImageNames.add(f.name);
          imageFormData.append("image" /*키값 */, f);
        }
      });

      dispatch({
        type: UPLOAD_IMAGES_REQUEST,
        data: imageFormData,
      });
    },

    [dispatch]
  );

  const onModifyPost = useCallback(
    (e: SyntheticEvent) => {
      e.preventDefault();

      const contentWithBreaks = content.replace(/\n/g, "<br>");
      dispatch({
        type: UPDATE_POST_REQUEST,
        data: {
          postId: post.id,
          content: contentWithBreaks,
          imagePaths: imagePaths,
        },
      });

      setEditPost(false);
    },
    [content, dispatch, imagePaths, post.id]
  );

  const prevContent = content.replace(/<br\s*\/?>/gi, "\n");

  const totalReComments = comments.reduce(
    (total, comment) => total + comment.ReComments.length,
    0
  );

  useEffect(() => {
    if (post.userIdx === me?.id) {
      socket.current?.emit("readComment", [Number(postId), me?.id]);
    }
  }, [me?.id, post.userIdx, postId]);

  return (
    <FullPostWrapper>
      <PostWrapper>
        <PostHeader>
          <PostHeaderFlex>
            <NicknameButton onClick={toggleShowInfo}>
              <img
                src={
                  post.User?.Image
                    ? `${baseURL}/${post.User.Image.src}`
                    : `${DEFAULT_PROFILE_IMAGE}`
                }
                alt="유저 이미지"
              />
              {post.User?.nickname.slice(0, 5)}
            </NicknameButton>
            {showInfo && (
              <InfoMenu ref={infoMenuRef}>
                <Button onClick={onSearch}>작성 글 보기</Button>
                {id !== post.User.id && (
                  <FollowButton
                    userId={post.User.id}
                    setShowInfo={setShowInfo}
                  />
                )}
              </InfoMenu>
            )}
            <PostTitle>{post.title}</PostTitle>
          </PostHeaderFlex>
          <PostInfo>
            <Date>{moment(post.createdAt).format("l")}</Date>
            <Like itemType="post" item={post} />
            <ViewCount>조회 수 {post.viewCount}</ViewCount>
          </PostInfo>
        </PostHeader>
        <InPostWrapper>
          {editPost ? (
            <>
              <Form
                encType="multipart/form-data"
                onSubmit={(e) => onModifyPost(e)}
                ref={formRef}
              >
                <TextArea
                  placeholder="입력해주세요"
                  value={prevContent}
                  onChange={onChangeContent}
                  ref={editPostRef}
                />
                <>
                  <input
                    type="file"
                    name="image"
                    multiple
                    hidden
                    ref={imageInput}
                    onChange={onChangeImages}
                  />
                  <FileButton type="button" onClick={onClickFileUpload}>
                    파일 첨부
                  </FileButton>
                </>
                <ImageGrid>
                  {/**기존 이미지 */}
                  {post.Images?.map((image, index) => (
                    <ImageContainer key={index}>
                      <ModifyImage
                        src={`${baseURL}/${image.src}`}
                        alt={image.src}
                      />
                      <RemoveButton
                        type="button"
                        onClick={onDeleteImage(image.src)}
                      >
                        x
                      </RemoveButton>
                    </ImageContainer>
                  ))}
                  {/**파일 첨부 시 이미지 */}
                  {imagePaths.map((filename, index) => (
                    <ImageContainer key={index}>
                      <ModifyImage src={`${baseURL}/${filename}`} alt="img" />
                      <RemoveButton
                        type="button"
                        onClick={onRemoveImage(filename)}
                      >
                        x
                      </RemoveButton>
                    </ImageContainer>
                  ))}
                </ImageGrid>
                <Button type="submit">적용</Button>
                <Button onClick={toggleEditPostForm}>취소</Button>
              </Form>
            </>
          ) : (
            <ContentWrapper>
              <ContentRenderer content={post.content} />
              <ContentImgWrapper>
                {post.Images?.map((image) => (
                  <ContentImg
                    key={image.id}
                    src={`${baseURL}/${image.src}`}
                    alt={image.src}
                    onClick={() => {
                      window.open(`${baseURL}/${image.src}`, "_blank");
                    }}
                  />
                ))}
              </ContentImgWrapper>
            </ContentWrapper>
          )}
          {id === post.User?.id || nickname === "admin" ? (
            <div>
              {!editPost && (
                <EditToggle onClick={toggleShowOptions}>
                  ⋮
                  {showOptions && (
                    <PopupMenu ref={popupMenuRef}>
                      <Button onClick={toggleEditPostForm}>수정</Button>
                      <Button onClick={onDeletePost}>삭제</Button>
                    </PopupMenu>
                  )}
                </EditToggle>
              )}
            </div>
          ) : null}
        </InPostWrapper>
      </PostWrapper>

      <CommentContainer>
        <CommentHeader>
          <CommentNum>
            댓글 {totalComments && totalComments + totalReComments}개
          </CommentNum>
          <Button onClick={toggleAddCommentForm}>댓글 달기</Button>
        </CommentHeader>
        {addComment[post.id] && (
          <div ref={commentFormRef}>
            <CommentForm post={post} setAddComment={setAddComment} />
          </div>
        )}
        <Comment post={post} />
      </CommentContainer>
    </FullPostWrapper>
  );
};

export default CommonPost;
const FullPostWrapper = styled.div`
  max-width: 800px;
  border-top: 1px solid silver;
  border-bottom: 1px solid silver;
  margin: 10px auto;
`;

const PostWrapper = styled.div`
  margin: 10px auto;
`;

const PostHeader = styled.div`
  display: flex;
  justify-content: space-between;
  position: relative;
  align-items: center;
  border-bottom: 1px solid silver;
  padding: 10px;
  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const PostTitle = styled.div`
  flex: 1;
  font-size: 15px;
  font-weight: bold;
  color: #333;
  transition: color 0.3s ease;
  display: flex;
  align-items: center;
  gap: 2px;
`;

const InPostWrapper = styled.div`
  border-radius: 5px;
  margin: 10px auto;
  padding: 10px;
  display: flex;
  justify-content: space-between;
`;

const TextArea = styled.textarea`
  max-width: 100%;
  min-width: 100%;
  padding: 12px;
  font-size: 16px;
  border: 2px solid #ccc;
  border-radius: 8px;
  margin-bottom: 10px;
`;
const ContentWrapper = styled.div`
  width: 97%;
`;

const CommentNum = styled.span`
  font-size: 15px;
  font-weight: bold;
  margin: 5px;
  color: "#000";
`;

const CommentContainer = styled.div`
  padding: 10px;
  background-color: #f9f9f9;
`;

const CommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 5px;
  margin-bottom: 10px;
  color: #333;
`;

const ContentImg = styled.img`
  width: 200px;
  height: 200px;
  border-radius: 4px;
  margin: 1px;
  cursor: pointer;
  @media (max-width: 480px) {
    width: 100px;
    height: 100px;
  }
`;

const ContentImgWrapper = styled.div`
  margin-top: 15px;
  display: flex;
  flex-wrap: wrap;
`;
const NicknameButton = styled.button`
  display: flex;
  justify-content: space-around;
  border-radius: 30%;
  align-items: center;
  min-width: 70px;
  color: ${(props) => props.theme.mainColor};
  font-weight: bold;
  transition: transform 0.3s ease, color 0.3s ease;
  img {
    display: inline;
    border-radius: 50%;
    width: 30px;
    height: 30px;
  }
  &:hover {
    transform: translateY(-2px);
    color: ${(props) => props.theme.charColor};
  }
`;

const InfoMenu = styled.div`
  position: absolute;
  top: 30px;
  left: 50px;
  display: flex;
  flex-direction: column;
`;

const PopupMenu = styled.div`
  position: absolute;
  top: 20px;
  left: -30px;
  width: 40px;
  display: flex;
  flex-direction: column;
`;
const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
`;

const ImageContainer = styled.div`
  position: relative;
  display: inline-block;
  width: 200px;
  height: 200px;
  margin: 2px;
`;

const ModifyImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 8px;
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 0;
  right: 0px;
  padding: 5px 10px;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #c0392b;
  }
`;

const EditToggle = styled.div`
  position: relative;
  font-size: 19px;
  cursor: pointer;
`;

const Form = styled.form`
  width: 100%;
  text-align: center;
`;
