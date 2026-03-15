import React, {
  ChangeEvent,
  SyntheticEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import axios from "axios";
import { RootState } from "../../../reducer";
import { baseURL } from "../../../config";
import Spinner from "../../../components/ui/Spinner";
import useInput from "../../../hooks/useInput";
import {
  CHANGE_PASSWORD_REQUEST,
  MODIFY_NICKNAME,
} from "../../../reducer/user";

import * as MS from "./MyInfoStyles";

export const DEFAULT_PROFILE_IMAGE =
  "https://cdn.pixabay.com/photo/2023/04/12/01/47/cartoon-7918608_1280.png";

const MyInfo: React.FC = () => {
  const { me, changePasswordDone, changePasswordError, changePasswordLoading } =
    useSelector((state: RootState) => state.user);
  const imageInput = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [imageSrc, setImageSrc] = useState<string>(me?.Image?.src || "");
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [changePassword, setChangePassword] = useState<boolean>(false);

  const [prevPassword, handlePrevPasswordChange] = useInput();
  const [newPassword, handleNewPasswordChange] = useInput();
  const [newNickname, handleNewNicknameChange] = useInput();
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [passwordError, setPasswordError] = useState(false);

  const [modifyNickname, setModifyNickname] = useState<boolean>(false);
  const newNicknameRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (changePassword && passwordRef.current) {
      passwordRef.current.focus();
    }
  }, [changePassword]);

  const handlePasswordConfirmChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setPasswordConfirm(e.target.value);
      setPasswordError(e.target.value !== newPassword);
    },
    [newPassword],
  );

  const handleChangePassword = useCallback(
    (e: SyntheticEvent) => {
      e.preventDefault();
      if (!prevPassword || !newPassword || !passwordConfirm) {
        alert("빈 칸을 확인하세요");
        return;
      }
      if (newPassword !== passwordConfirm) {
        setPasswordError(true);
        return;
      }
      dispatch({
        type: CHANGE_PASSWORD_REQUEST,
        data: { prevPassword, newPassword },
      });
    },
    [dispatch, prevPassword, newPassword, passwordConfirm],
  );

  useEffect(() => {
    if (changePasswordDone) {
      alert("비밀번호가 변경되었습니다.");
      setChangePassword(false);
    }
    if (changePasswordError) alert("비밀번호가 다릅니다");
  }, [changePasswordDone, changePasswordError]);

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const response = await axios.get("/user/profileImage");
        setImageSrc(response.data);
      } catch (error) {
        console.error("Error fetching profile image:", error);
      }
    };
    fetchProfileImage();
  }, []);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  if (!me) {
    return <div>사용자 정보를 불러오는 중입니다...</div>;
  }

  const formattedDate = moment(me.createdAt).format("l");

  const handleClickFileUpload = () => {
    imageInput.current?.click();
  };

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleCancel = () => {
    setFile(null);
    setPreviewUrl("");
    if (imageInput.current) imageInput.current.value = "";
  };

  const handleRemoveImage = async () => {
    if (!window.confirm("정말 제거하시겠습니까?")) return;
    try {
      await axios.delete("/user/profileImage");
      setImageSrc(DEFAULT_PROFILE_IMAGE);
      dispatch({ type: "DELETE_USER_IMAGE", data: null });
      alert("프로필 사진이 제거되었습니다.");
    } catch (error) {
      console.error("Error removing profile image:", error);
    }
  };

  const handleProfileImageSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    if (!file || !me) return;
    const formData = new FormData();
    formData.append("profileImage", file);

    try {
      setIsLoading(true);
      const response = await axios.post("/user/profileImage", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const newImageUrl = response.data.src;
      dispatch({ type: "SET_USER_IMAGE", data: { src: newImageUrl } });
      setImageSrc(newImageUrl);
      handleCancel();
      alert("등록되었습니다.");
    } catch (err) {
      console.error("Error uploading image:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditNickname = async (e: SyntheticEvent) => {
    e.preventDefault();
    if (newNickname === me.nickname || newNickname === "") {
      setModifyNickname(false);
      return;
    }
    try {
      setIsLoading(true);
      await axios.post("/user/modifyNickname", { newNickname });
      setModifyNickname(false);
      dispatch({ type: MODIFY_NICKNAME, data: newNickname });
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {(isLoading || changePasswordLoading) && <Spinner />}

      <MS.ProfileHeader>
        <form encType="multipart/form-data" onSubmit={handleProfileImageSubmit}>
          <MS.ImageWrapper>
            {imageSrc && !file && imageSrc !== DEFAULT_PROFILE_IMAGE && (
              <MS.ImageDeleteBadge type="button" onClick={handleRemoveImage}>
                ✕
              </MS.ImageDeleteBadge>
            )}
            <MS.ProfileImg
              onClick={handleClickFileUpload}
              src={
                previewUrl ||
                (imageSrc ? `${baseURL}/${imageSrc}` : DEFAULT_PROFILE_IMAGE)
              }
              alt="User"
            />
          </MS.ImageWrapper>
          <input
            type="file"
            name="image"
            hidden
            ref={imageInput}
            onChange={handleImagesChange}
          />
          {file && (
            <MS.BtnGroup style={{ justifyContent: "center" }}>
              <MS.InternalBtn type="submit">등록</MS.InternalBtn>
              <MS.InternalBtn
                type="button"
                variant="outline"
                onClick={handleCancel}
              >
                취소
              </MS.InternalBtn>
            </MS.BtnGroup>
          )}
        </form>
      </MS.ProfileHeader>

      <MS.InfoField>
        <strong>닉네임</strong>
        {!modifyNickname ? (
          <>
            <span>{me.nickname}</span>
            <MS.InternalBtn
              variant="outline"
              onClick={() => setModifyNickname(true)}
            >
              수정
            </MS.InternalBtn>
          </>
        ) : (
          <form
            onSubmit={handleEditNickname}
            style={{ display: "flex", gap: "8px" }}
          >
            <MS.CustomInput
              ref={newNicknameRef}
              type="text"
              value={newNickname}
              onChange={handleNewNicknameChange}
              autoFocus
              style={{ margin: 0, width: "150px" }}
            />
            <MS.InternalBtn type="submit">확인</MS.InternalBtn>
            <MS.InternalBtn
              type="button"
              variant="outline"
              onClick={() => setModifyNickname(false)}
            >
              취소
            </MS.InternalBtn>
          </form>
        )}
      </MS.InfoField>

      <MS.InfoField>
        <strong>이메일</strong>
        <span>{me.email}</span>
      </MS.InfoField>

      <MS.InfoField>
        <strong>가입일</strong>
        <span>{formattedDate}</span>
      </MS.InfoField>

      <MS.BtnGroup>
        <MS.InternalBtn onClick={() => setChangePassword((prev) => !prev)}>
          비밀번호 변경
        </MS.InternalBtn>
      </MS.BtnGroup>

      {changePassword && (
        <MS.EditFormBox onSubmit={handleChangePassword}>
          <MS.CustomLabel>현재 비밀번호</MS.CustomLabel>
          <MS.CustomInput
            ref={passwordRef}
            type="password"
            value={prevPassword}
            onChange={handlePrevPasswordChange}
            placeholder="현재 비밀번호"
          />

          <MS.CustomLabel>새 비밀번호</MS.CustomLabel>
          <MS.CustomInput
            type="password"
            value={newPassword}
            onChange={handleNewPasswordChange}
            placeholder="새 비밀번호"
          />

          <MS.CustomLabel>새 비밀번호 확인</MS.CustomLabel>
          <MS.CustomInput
            type="password"
            value={passwordConfirm}
            onChange={handlePasswordConfirmChange}
            placeholder="새 비밀번호 확인"
          />

          {passwordError && (
            <MS.StatusMsg isError>비밀번호가 일치하지 않습니다.</MS.StatusMsg>
          )}

          <MS.InternalBtn
            type="submit"
            style={{ width: "100%", height: "45px", marginTop: "10px" }}
          >
            비밀번호 변경 완료
          </MS.InternalBtn>
        </MS.EditFormBox>
      )}
    </>
  );
};

export default MyInfo;
