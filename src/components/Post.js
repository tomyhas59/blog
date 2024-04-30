import React, { useCallback, useEffect, useRef, useState } from "react";
import CommentForm from "./CommentForm";
import Comment from "./Comment";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import {
  LIKE_POST_REQUEST,
  REMOVE_POST_REQUEST,
  UPDATE_POST_REQUEST,
  UNLIKE_POST_REQUEST,
  SEARCH_NICKNAME_REQUEST,
  DELETE_IMAGE_REQUEST,
  UPLOAD_IMAGES_REQUEST,
  REMOVE_IMAGE_REQUEST,
} from "../reducer/post";
import useInput from "../hooks/useInput";
import moment from "moment";
import "moment/locale/ko";
import { Form, SubmitButton, TextArea, FileButton } from "./PostForm";

const Post = ({ post, imagePaths }) => {
  const [addComment, setAddComment] = useState({});
  const dispatch = useDispatch();
  const [editPost, setEditPost] = useState(false);
  const [content, contentOnChane, setContent] = useInput("");
  const editPostRef = useRef(null);
  const editCommentRef = useRef(null);
  const id = useSelector((state) => state.user.me?.id);
  const nickname = useSelector((state) => state.user.me?.nickname);
  const liked = post.Likers?.find((v) => v.id === id);
  const imageInput = useRef(null);

  //----------팝업-------------------------------------
  const [showPopup, setShowPopup] = useState(false);
  const handlePopupToggle = useCallback(() => {
    setShowPopup((prevShowPopup) => !prevShowPopup);
  }, []);
  //----------------------------------------------
  const popupRef = useRef(null);
  const nicknameButtonRef = useRef(null);
  const handleOutsideClick = useCallback((event) => {
    if (
      popupRef.current &&
      !popupRef.current.contains(event.target) &&
      event.target !== nicknameButtonRef.current
    ) {
      setShowPopup(false);
    }
  }, []);
  useEffect(() => {
    // Attach the event listener when the component mounts
    document.addEventListener("click", handleOutsideClick);

    // Remove the event listener when the component unmounts
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [handleOutsideClick]);

  //-----게시글 수정-------------------------
  const onEditPostHandler = useCallback(() => {
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
  //---------------------------------------------
  const onLike = useCallback(() => {
    if (!id) {
      return alert("로그인이 필요합니다");
    }
    return dispatch({
      type: LIKE_POST_REQUEST,
      data: post.id,
    });
  }, [dispatch, id, post.id]);

  const onUnLike = useCallback(() => {
    if (!id) {
      return alert("로그인이 필요합니다");
    }
    return dispatch({
      type: UNLIKE_POST_REQUEST,
      data: post.id,
    });
  }, [dispatch, id, post.id]);

  useEffect(() => {
    if (editPost) {
      editPostRef.current.focus();
    }
  }, [editPost]);

  //-----기존 폼 닫고 새로운 폼 엶--------------
  const onAddCommentHandler = useCallback(
    (postId) => {
      if (!id) {
        alert("로그인이 필요합니다");
      } else
        setAddComment((prev) => ({
          ...prev,
          [postId]: !prev[postId], //참이면 거짓, 거짓이면 참이 됨
        }));
    },
    [id]
  );

  const handleDeletePost = useCallback(() => {
    if (!window.confirm("삭제하시겠습니까?")) return false;
    dispatch({
      type: REMOVE_POST_REQUEST,
      data: post.id,
    });
  }, [dispatch, post.id]);

  const createdAtDate = moment(post.createdAt);
  const formattedDate = createdAtDate.format("l");

  const handleSearch = useCallback(() => {
    const nickname = post?.User.nickname;
    dispatch({
      type: SEARCH_NICKNAME_REQUEST,
      query: nickname,
    });
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [dispatch, nickname]);

  const onRemoveImage = useCallback(
    (filename) => () => {
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
    (filename) => () => {
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
    imageInput.current.click();
  }, []);

  const onChangeImages = useCallback(
    (e) => {
      console.log("images", e.target.files);
      const imageFormData = new FormData();

      // 중복된 이미지 파일명을 방지하기 위해 Set 사용
      const addedImageNames = new Set();

      [].forEach.call(e.target.files /*선택한 파일들 */, (f) => {
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

  const handleModifyPost = useCallback(
    (e, postId) => {
      e.preventDefault();

      dispatch({
        type: UPDATE_POST_REQUEST,
        data: {
          postId: postId,
          content: content,
          imagePaths: imagePaths, //서버 데이터 req.body. key값
        },
      });

      setEditPost(false);
    },
    [content, dispatch, imagePaths]
  );

  return (
    <>
      <FormWrapper>
        <PostWrapper>
          <PostHeaderFlex>
            <PostHeader>
              <NicknameButton
                onClick={handlePopupToggle}
                ref={nicknameButtonRef}
              >
                {/*   {post.User.nickname} */}
              </NicknameButton>
              {showPopup && (
                <PopupMenu ref={popupRef}>
                  <Button onClick={handleSearch}>작성 글 보기</Button>
                </PopupMenu>
              )}
              <Span>{formattedDate}</Span>
            </PostHeader>
            <div>
              <Liked>좋아요 {post.Likers.length}개</Liked>
              {id === post.User.id ? null : liked ? (
                <Button onClick={onUnLike}>♥</Button>
              ) : (
                <Button onClick={onLike}>♡</Button>
              )}
            </div>
          </PostHeaderFlex>
          <InPostWrapper>
            {editPost ? (
              <>
                <Form
                  encType="multipart/form-data"
                  onSubmit={(e) => handleModifyPost(e, post.id)}
                >
                  <TextArea
                    placeholder="Content"
                    value={content}
                    onChange={contentOnChane}
                    ref={editPostRef}
                  ></TextArea>
                  <input
                    type="file"
                    name="image"
                    multiple
                    hidden
                    ref={imageInput}
                    onChange={onChangeImages}
                  />
                  <FileButton onClick={onClickFileUpload}>파일 첨부</FileButton>

                  <ImageGrid>
                    {/**기존 이미지 */}
                    {post.Images.map((image, index) => (
                      <ImageContainer key={index}>
                        <ModifyImage
                          src={`http://localhost:3075/${image.src}`}
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
                        <ModifyImage
                          src={`http://localhost:3075/${filename}`}
                          alt="img"
                        />
                        <RemoveButton
                          type="button"
                          onClick={onRemoveImage(filename)}
                        >
                          x
                        </RemoveButton>
                      </ImageContainer>
                    ))}
                  </ImageGrid>
                  <SubmitButton type="submit">적용</SubmitButton>
                </Form>
                <EndFlex></EndFlex>
              </>
            ) : (
              <ContentWrapper>
                <div>{post.content}</div>
                <ContentImgWrapper>
                  {post.Images.map((image) => (
                    <ContentImg
                      key={image.id}
                      src={`http://localhost:3075/${image.src}`}
                      alt={image.src}
                      onClick={() => {
                        window.open(
                          `http://localhost:3075/${image.src}`,
                          "_blank"
                        );
                      }}
                    />
                  ))}
                </ContentImgWrapper>
              </ContentWrapper>
            )}
          </InPostWrapper>
          {id === post.User.id || nickname === "admin" ? (
            <EditDeleteForm>
              {editPost ? (
                <>
                  <Button onClick={onEditPostHandler}>취소</Button>
                </>
              ) : (
                <>
                  <Button onClick={onEditPostHandler}>수정</Button>
                  <Button onClick={handleDeletePost}>삭제</Button>
                </>
              )}
            </EditDeleteForm>
          ) : null}
        </PostWrapper>
        <CommentContainer>
          <PostHeaderFlex>
            <Span>댓글 {post?.Comments.length}개</Span>
            <Info onClick={() => onAddCommentHandler(post.id)}>댓글 달기</Info>
          </PostHeaderFlex>
          {addComment[post.id] ? (
            <div>
              <CommentForm
                post={post}
                editCommentRef={editCommentRef}
                setEditPost={setEditPost}
              />
            </div>
          ) : null}
          <Comment post={post} />
        </CommentContainer>
      </FormWrapper>
    </>
  );
};

export default Post;

const FormWrapper = styled.div`
  max-width: 800px;
  border: 1px solid silver;
  border-radius: 5px;
  margin: 10px auto;
  padding: 20px;
`;

const PostWrapper = styled.div`
  width: 100%;
  border-radius: 5px;
  margin: 10px auto;
  padding: 20px;
`;

const InPostWrapper = styled.div`
  width: 100%;
  border: 1px solid silver;
  border-radius: 5px;
  margin: 10px auto;
  padding: 20px;
`;

const Button = styled.span`
  width: 50px;
  background-color: ${(props) => props.theme.mainColor};

  margin: 2px;
  color: #fff;
  padding: 6px;
  border-radius: 6px;
  text-align: center;
  cursor: pointer;
  :hover {
    opacity: 0.7;
  }
`;

const Liked = styled.span`
  width: 50px;
  margin: 2px;
  padding: 6px;
  border-radius: 6px;
  text-align: center;
`;

const Info = styled.span`
  width: 100px;
  background-color: ${(props) => props.theme.mainColor};
  margin: 2px;
  color: #fff;
  padding: 6px;
  border-radius: 6px;
  text-align: center;
  cursor: pointer;
`;

const PostHeaderFlex = styled.div`
  display: flex;
  justify-content: space-between;
`;

const EndFlex = styled.div`
  display: flex;
  justify-content: end;
`;
const ContentWrapper = styled.div`
  width: 100%;
  overflow: hidden;
  border-radius: 5px;
  margin: 0 auto;
  padding: 5px;
  //줄바꿈 유지
  white-space: pre-wrap;
`;

const Span = styled.span`
  width: 100px;
  margin: 2px;
  color: #000;
  padding: 6px;
  font-weight: bold;
`;

const CommentContainer = styled.div`
  margin: 0 auto;
  padding: 20px;
  border-radius: 4px;
`;

const EditDeleteForm = styled.div`
  float: right;
`;

const ContentImg = styled.img`
  width: 300px;
  height: 300px;
  border-radius: 4px;
  margin: 1px;
  cursor: pointer;
`;

const ContentImgWrapper = styled.div`
  margin-top: 15px;
  display: flex;
  flex-wrap: wrap;
`;
const NicknameButton = styled.button`
  display: inline-block;
  background-color: ${(props) => props.theme.mainColor};
  border-radius: 30%;
  width: 50px;
  text-align: center;
  color: #fff;
`;

const PostHeader = styled.div`
  position: relative;
`;
const PopupMenu = styled.div`
  position: absolute;
  top: 30px;
  left: 0;
`;
const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
`;

const ImageContainer = styled.div`
  position: relative;
  display: inline-block;
  margin: 2px;
`;

const ModifyImage = styled.img`
  width: 200px;
  height: 200px;
  border-radius: 8px;
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 0;
  right: 8px;
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
