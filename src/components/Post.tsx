import React, {
  ChangeEvent,
  SyntheticEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
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
import moment from "moment";
import "moment/locale/ko";
import { Form, TextArea, FileButton } from "./PostForm";
import { PostType } from "../types";
import { RootState } from "../reducer";
import { baseURL } from "../config";

const Post = ({
  post,
  imagePaths,
}: {
  post: PostType;
  imagePaths: string[];
}) => {
  const dispatch = useDispatch();
  const [editPost, setEditPost] = useState(false);
  const [content, setContent] = useState("");

  const onChanegeContent = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      setContent(e.target.value);
    },
    [setContent]
  );

  const editPostRef = useRef<HTMLTextAreaElement>(null);
  const editCommentRef = useRef<HTMLInputElement>(null);
  const id = useSelector((state: RootState) => state.user.me?.id);
  const nickname = useSelector((state: RootState) => state.user.me?.nickname);
  const liked = post.Likers.find((v) => v.id === id);
  const imageInput = useRef<HTMLInputElement>(null);

  //---닉네임 클릭 정보 보기-------------------------------------
  const [showInfo, setShowInfo] = useState(false);
  const toggleShowInfo = useCallback(() => {
    setShowInfo((prevShowInfo) => !prevShowInfo);
  }, []);

  //---게시글 수정, 삭제 토글-------------------------------------
  const [showOptions, setShowOptions] = useState(false);
  const toggleShowOptions = useCallback(() => {
    setShowOptions((prevShowOptions) => !prevShowOptions);
  }, []);

  //OutsideClick----------------------------------------------
  const infoMenuRef = useRef<HTMLDivElement>(null);
  const popupMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      if (
        infoMenuRef.current &&
        !infoMenuRef.current.contains(event.target as Node)
      )
        setShowInfo(false);

      if (
        popupMenuRef.current &&
        !popupMenuRef.current.contains(event.target as Node)
      )
        setShowOptions(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, []);

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
      editPostRef.current!.focus();
    }
  }, [editPost]);

  //댓글 창, 기존 폼 닫고 새로운 폼 열고 닫기--------------
  const [addComment, setAddComment] = useState<Record<number, boolean>>({});
  const toggleAddCommentForm = useCallback(
    (postId: number) => {
      if (!id) {
        alert("로그인이 필요합니다");
      } else
        setAddComment((prev) => {
          const newCommentState: Record<string, boolean> = {};
          Object.keys(prev).forEach((key) => {
            newCommentState[key] = false;
          });
          newCommentState[postId] = !prev[postId];
          return newCommentState;
        });
    },
    [id]
  );

  const onDeletePost = useCallback(() => {
    if (!window.confirm("삭제하시겠습니까?")) return false;
    dispatch({
      type: REMOVE_POST_REQUEST,
      data: post.id,
    });
  }, [dispatch, post.id]);

  const createdAtDate = moment(post.createdAt);
  const formattedDate = createdAtDate.format("l");

  const onSearch = useCallback(() => {
    dispatch({
      type: SEARCH_NICKNAME_REQUEST,
      query: post.User.nickname,
    });
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [dispatch, post.User.nickname]);

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
    (e: SyntheticEvent, postId: number) => {
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
              <NicknameButton onClick={toggleShowInfo}>
                {post.User.nickname.slice(0, 5)}
              </NicknameButton>
              {showInfo && (
                <InfoMenu ref={infoMenuRef}>
                  <Button onClick={onSearch}>작성 글 보기</Button>
                </InfoMenu>
              )}
              <Date>{formattedDate}</Date>
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
                  onSubmit={(e) => onModifyPost(e, post.id)}
                >
                  <TextArea
                    placeholder="Content"
                    value={content}
                    onChange={onChanegeContent}
                    ref={editPostRef}
                  ></TextArea>
                  {/*     <input
                    type="file"
                    name="image"
                    multiple
                    hidden
                    ref={imageInput}
                    onChange={onChangeImages}
                  />
                  <FileButton onClick={onClickFileUpload}>파일 첨부</FileButton>
 */}
                  <ImageGrid>
                    {/**기존 이미지 */}
                    {post.Images.map((image, index) => (
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
                <EndFlex></EndFlex>
              </>
            ) : (
              <ContentWrapper>
                <div>{post.content}</div>
                <ContentImgWrapper>
                  {post.Images.map((image) => (
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
            {id === post.User.id || nickname === "admin" ? (
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
          <PostHeaderFlex>
            <CommentNum>댓글 {post.Comments.length}개</CommentNum>
            <Button onClick={() => toggleAddCommentForm(post.id)}>
              댓글 달기
            </Button>
          </PostHeaderFlex>
          {addComment[post.id] ? (
            <div>
              <CommentForm
                post={post}
                editCommentRef={editCommentRef}
                setAddComment={setAddComment}
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
  border-radius: 5px;
  margin: 10px auto;
`;

const InPostWrapper = styled.div`
  border-radius: 5px;
  margin: 10px auto;
  padding: 10px;
  display: flex;
  justify-content: space-between;
`;

const Button = styled.button`
  background-color: ${(props) => props.theme.mainColor};
  height: 30px;
  font-size: 12px;
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

const PostHeaderFlex = styled.div`
  display: flex;
  justify-content: space-between;
`;

const EndFlex = styled.div`
  display: flex;
  justify-content: end;
`;
const ContentWrapper = styled.div`
  width: 97%;
`;

const Date = styled.span`
  width: 100px;
  margin: 5px;
  color: silver;
`;

const CommentNum = styled.span`
  font-size: 12px;
  margin: 5px;
  color: "#000";
`;

const CommentContainer = styled.div`
  padding: 10px;
  border-top: 1px solid silver;
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
const InfoMenu = styled.div`
  position: absolute;
  top: 30px;
  left: 0;
`;

const PopupMenu = styled.div`
  position: absolute;
  top: 20px;
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

const EditToggle = styled.div`
  position: relative;
  font-size: 19px;
  cursor: pointer;
`;
