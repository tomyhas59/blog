import React, {
  ChangeEvent,
  SyntheticEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../reducer";
import moment from "moment";
import styled from "styled-components";
import axios from "axios";
import { baseURL } from "../../config";
import { useDispatch } from "react-redux";
import Spinner from "../../components/Spinner";
import useInput from "../../hooks/useInput";
import { FormGroup, Label, Button, CheckMessage, Input } from "../Sign";
import { CHANGE_PASSWORD_REQUESE, MODIFY_NICKNAME } from "../../reducer/user";

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

  const [prevPassword, onChangePrevPassword] = useInput();
  const [newPassword, onChangeNewPassword] = useInput();
  const [newNickname, onChangeNewNickname] = useInput();
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [passwordError, setPasswordError] = useState(false);

  const [modifyNickname, setModifyNickname] = useState<boolean>(false);
  const newNicknameRef = useRef<HTMLInputElement | null>(null);

  const handlePasswordConfirmChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setPasswordConfirm(e.target.value);
      setPasswordError(e.target.value !== newPassword);
    },
    [newPassword]
  );

  const changePasswordSubmit = useCallback(
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
        type: CHANGE_PASSWORD_REQUESE,
        data: { prevPassword, newPassword },
      });
    },
    [dispatch, prevPassword, newPassword, passwordConfirm]
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
  }, [imageSrc]);

  if (!me) {
    return <div>사용자 정보를 불러오는 중입니다...</div>;
  }

  const createdAt = me.createdAt;
  const createdAtDate = moment(createdAt);
  const formattedDate = createdAtDate.format("l");

  const onClickFileUpload = () => {
    if (imageInput.current) {
      imageInput.current.click();
    }
  };

  const onChangeImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const onCancel = () => {
    setFile(null);
    setPreviewUrl("");
    if (imageInput.current) {
      imageInput.current.value = "";
    }
  };

  const onRemoveImage = async () => {
    const confirmRemoval = window.confirm("정말 제거하시겠습니까?");
    if (!confirmRemoval) {
      return;
    }
    try {
      await axios.delete("/user/profileImage");
      setImageSrc(DEFAULT_PROFILE_IMAGE);
      dispatch({
        type: "DELETE_USER_IMAGE",
        data: null,
      });
      alert("프로필 사진이 제거되었습니다.");
    } catch (error) {
      console.error("Error removing profile image:", error);
    }
  };

  const profileImageSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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

      dispatch({
        type: "SET_USER_IMAGE",
        data: { src: newImageUrl },
      });

      setImageSrc(newImageUrl);
      setFile(null);
      setPreviewUrl("");
      alert("등록되었습니다.");

      if (imageInput.current) {
        imageInput.current.value = "";
      }
    } catch (err) {
      console.error("Error uploading image:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const modifyNicknameSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    try {
      if (newNickname === me.nickname || newNickname === "") return;

      setIsLoading(true);
      await axios.post("/user/modifyNickname", { newNickname });
      setModifyNickname(false);

      dispatch({
        type: MODIFY_NICKNAME,
        data: newNickname,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <InfoContainer>
      {isLoading || (changePasswordLoading && <Spinner />)}
      <ProfileSection>
        <form encType="multipart/form-data" onSubmit={profileImageSubmit}>
          {imageSrc && !file && (
            <RemoveButton type="button" onClick={onRemoveImage}>
              ✖
            </RemoveButton>
          )}
          <ProfileImage
            onClick={onClickFileUpload}
            src={
              previewUrl ||
              (imageSrc ? `${baseURL}/${imageSrc}` : DEFAULT_PROFILE_IMAGE)
            }
            alt="userImage"
          />
          <input
            type="file"
            name="image"
            hidden
            ref={imageInput}
            onChange={onChangeImages}
          />
          {file && (
            <ButtonContainer>
              <SubmitButton type="submit">등록</SubmitButton>
              <CancelButton type="button" onClick={onCancel}>
                취소
              </CancelButton>
            </ButtonContainer>
          )}
        </form>
        <InfoText>
          <h1>내 정보</h1>
          <UserInfo>
            <strong>사용자명:</strong> {!modifyNickname && me?.nickname}
            {modifyNickname ? (
              <ModifyNicknameForm onSubmit={modifyNicknameSubmit}>
                <input
                  ref={newNicknameRef}
                  type="text"
                  value={newNickname}
                  onChange={onChangeNewNickname}
                />
                <SubmitButton type="submit">등록</SubmitButton>
                <CancelButton onClick={() => setModifyNickname(false)}>
                  취소
                </CancelButton>
              </ModifyNicknameForm>
            ) : (
              <ModifyNicknameButton onClick={() => setModifyNickname(true)}>
                수정
              </ModifyNicknameButton>
            )}
          </UserInfo>
          <UserInfo>
            <strong>이메일:</strong> {me.email}
          </UserInfo>
          <UserInfo>
            <strong>가입일:</strong> {formattedDate}
          </UserInfo>
          <UserInfo>
            <ChangePasswordButton
              onClick={() => setChangePassword((prev) => !prev)}
            >
              비밀번호 변경
            </ChangePasswordButton>
          </UserInfo>
        </InfoText>
      </ProfileSection>
      {changePassword && (
        <ChangePasswordForm onSubmit={changePasswordSubmit}>
          <FormGroup>
            <Label>현재 비밀번호</Label>
            <Input
              type="password"
              value={prevPassword}
              onChange={onChangePrevPassword}
              placeholder="현재 비밀번호"
            />
          </FormGroup>
          <FormGroup>
            <Label>비밀번호</Label>
            <Input
              type="password"
              value={newPassword}
              onChange={onChangeNewPassword}
              placeholder="비밀번호"
            />
          </FormGroup>
          <FormGroup>
            <Label>비밀번호 확인</Label>
            <Input
              type="password"
              value={passwordConfirm}
              onChange={handlePasswordConfirmChange}
              placeholder="비밀번호 확인"
            />
          </FormGroup>
          {passwordError && (
            <CheckMessage>비밀번호가 일치하지 않습니다</CheckMessage>
          )}
          <Button type="submit">등록</Button>
        </ChangePasswordForm>
      )}
    </InfoContainer>
  );
};

export default MyInfo;

const InfoContainer = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 30px;
  margin-bottom: 30px;
  transition: all 0.3s ease-in-out;

  &:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }

  @media (max-width: 480px) {
    padding: 15px;
    margin-bottom: 15px;
  }
`;

const ProfileSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  > form {
    position: relative;
  }
`;

const ProfileImage = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #cccccc;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  display: block;
  margin: 0 auto;

  &:hover {
    transform: scale(1.1);
    border-color: #888888;
  }

  @media (max-width: 480px) {
    width: 80px;
    height: 80px;
  }
`;

const ModifyNicknameForm = styled.form`
  input {
    width: 150px;
  }
  button {
  }
`;
const ModifyNicknameButton = styled.button`
  background-color: ${(props) => props.theme.mainColor};
  color: #ffffff;
  padding: 8px;
  border-radius: 10px;
  &:hover {
    background-color: ${(props) => props.theme.subColor};
    color: ${(props) => props.theme.charColor};
  }
`;
const InfoText = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
  > h1 {
    font-size: 1.5em;
    font-weight: bold;
    color: ${(props) => props.theme.charColor};
    margin-bottom: 15px;
  }

  @media (max-width: 480px) {
    > h1 {
      font-size: 1.2em;
      margin-bottom: 10px;
    }
  }
`;

const UserInfo = styled.p`
  font-size: 1em;
  color: ${(props) => props.theme.charColor};
  margin: 5px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
  > strong {
    font-weight: 600;
    color: ${(props) => props.theme.charColor};
  }

  @media (max-width: 480px) {
    font-size: 0.9em;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  align-items: flex-start;
  margin-top: 20px;
`;

const SubmitButton = styled.button`
  background-color: ${(props) => props.theme.mainColor};
  color: white;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-right: 2px;

  &:hover {
    background-color: ${(props) => props.theme.subColor};
  }

  @media (max-width: 480px) {
    padding: 8px 16px;
    font-size: 0.9em;
    margin-right: 0;
    margin-bottom: 10px;
  }
`;

const CancelButton = styled.button`
  background-color: #f44336;
  color: white;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #d32f2f;
  }

  @media (max-width: 480px) {
    padding: 8px 16px;
    font-size: 0.9em;
  }
`;
const RemoveButton = styled.button`
  position: absolute;
  top: -10px;
  right: -10px;
  width: 20px;
  height: 20px;
  color: #888888;
  border: none;
  line-height: 100%;
  text-align: center;
  font-size: 1.2em;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
  &:hover {
    transform: scale(1.1);
    font-weight: bold;
  }
  @media (max-width: 480px) {
    width: 15px;
    height: 15px;
    font-size: 1em;
  }
`;

const ChangePasswordButton = styled.button`
  background-color: ${(props) => props.theme.mainColor};
  color: #ffffff;
  padding: 8px;
  border-radius: 10px;
  &:hover {
    color: ${(props) => props.theme.charColor};
    background-color: ${(props) => props.theme.subColor};
  }
`;

const ChangePasswordForm = styled.form`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
