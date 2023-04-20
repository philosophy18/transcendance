import styled from "@emotion/styled";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Menu from "../components/Menu";
import GamePage from "./GamePage";
import ChatPage from "./ChatPage/ChatPage";
import { useCookies } from "react-cookie";
import { useContext, useEffect } from "react";
import GameLobbyContainer from "./GameLobby/Con_GameLobby";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  alertModalState,
  chatListState,
  createChatModalToggleState,
  currentChatState,
  currentChatUserListState,
  friendListState,
  friendRequestListState,
  getMyInfoFlagState,
  joinChatToggleState,
  joinGameModalToggleState,
  joinnedChatState,
  myInfoState,
  myNameState,
  operatorModalToggleState,
  rankWaitModalToggleState,
  requestFriendListFlagState,
  settingModalState,
} from "../api/atom";
import RankWaitModal from "../components/Modals/RankWaitModal";
import NormalGamePage from "./NormalGame/NormalGamePage";
import { WebsocketContext } from "../api/WebsocketContext";
import JoinGameModal from "../components/Modals/JoinGameModal";
import HistoryPage from "./HistoryPage/HistoryPage";
import AlertModal from "../components/Modals/AlertModal";
import OperatorModal from "../components/Modals/OperatorModal/OperatorModal";
import SettingModal from "../components/Modals/SettingModal/SettingModal";
import { axiosGetMyInfo } from "../api/request";
import CreateChatModal from "../components/Modals/CreateChatModal";
import JoinChatModal from "../components/Modals/JoinChatModal";
import { IFriendDto, IFriendRequest } from "../api/interface";
import {
  chatSocketOff,
  listenAlert,
  listenBanUser,
  listenCancelFriend,
  listenChangeOperator,
  listenCreateChat,
  listenDeleteFriend,
  listenFirstConnection,
  listenFriendFail,
  listenFriendList,
  listenFriendRequestList,
  listenFriendResult,
  listenJoinSucces,
  listenKickUser,
  listenLeaveSuccess,
  listenMessage,
  listenRequestAllChat,
  listenSomeoneJoinned,
  listenSomeoneLeave,
} from "../api/socket/chat-socket";

const MainPage = () => {
  const [token, _] = useCookies(["access_token"]);
  const rankWaitModalToggle = useRecoilValue(rankWaitModalToggleState);
  const joinGameModalToggle = useRecoilValue(joinGameModalToggleState);
  const [alertModalToggle, setAlertInfo] = useRecoilState(alertModalState);
  const operatorModalToggle = useRecoilValue(operatorModalToggleState);
  const settingModalToggle = useRecoilValue(settingModalState);
  const createChatModalToggle = useRecoilValue(createChatModalToggleState);
  const joinChatToggle = useRecoilValue(joinChatToggleState);
  const [myInfo, setMyInfo] = useRecoilState(myInfoState);
  const socket = useContext(WebsocketContext);
  const [friendRequestList, setFriendRequestList] = useRecoilState(
    friendRequestListState
  );
  const [friendList, setFriendList] = useRecoilState(friendListState);
  const [requestFriendListFlag, setRequestFriendListFlag] = useRecoilState(
    requestFriendListFlagState
  );
  const [joinnedChatList, setJoinnedChatList] =
    useRecoilState(joinnedChatState);
  const [getMyInfoFlag, setGetMyInfoFlag] = useRecoilState(getMyInfoFlagState);

  const navigate = useNavigate();

  const myName = useRecoilValue(myNameState);
  const setJoinChatToggle = useSetRecoilState(joinChatToggleState);
  const [currentChat, setCurrentChat] = useRecoilState(currentChatState);
  const [chatList, setChatList] = useRecoilState(chatListState);

  const hooks: any = {
    socket,
    myName,
    setAlertInfo,
    setJoinChatToggle,
    currentChat,
    setCurrentChat,
    chatList,
    setChatList,
    joinnedChatList,
    setJoinnedChatList,
    setFriendRequestList,
    setFriendList,
    setRequestFriendListFlag,
    friendRequestList,
    friendList,
  };

  useEffect(() => {
    if (!token.access_token) navigate("/no_auth");
    if (!getMyInfoFlag) {
      getMyInfo();
      setGetMyInfoFlag(true);
    }
    if (!requestFriendListFlag) {
      socket.emit("friend-list");
    }

    listenFirstConnection(hooks);
    listenFriendRequestList(hooks);
    listenFriendList(hooks);
    listenCancelFriend(hooks);
    listenDeleteFriend(hooks);
    listenFriendResult(hooks);
    listenFriendFail(hooks);

    listenMessage(hooks);
    listenCreateChat(hooks);
    listenRequestAllChat(hooks);
    listenSomeoneJoinned(hooks);
    listenJoinSucces(hooks);
    listenSomeoneLeave(hooks);
    listenLeaveSuccess(hooks);
    listenAlert(hooks);
    listenKickUser(hooks);
    listenBanUser(hooks);
    listenChangeOperator(hooks);

    async function getMyInfo() {
      const myInfo = await axiosGetMyInfo();
      setMyInfo({ ...myInfo });
      console.log(myInfo);

      socket.emit("first-connection", myInfo.intra_id);
    }

    return () => {
      chatSocketOff(
        socket,
        "chat-list",
        "create-chat",
        "join-chat",
        "chat-success",
        "leave-chat",
        "chat-fail",
        "leave-chat-success",
        "join-chat-success",
        "kick-user",
        "ban-user",
        "chat-operator",
        "first-connection",
        "friend-request-list",
        "cancel-friend",
        "delete-friend",
        "friend-fail",
        "friend-list",
        "message"
      );
    };
  }, [myInfo, joinnedChatList, chatList]);
  return (
    token.access_token && (
      <MainPageContainer>
        <Menu />
        <Routes>
          <Route path="lobby" element={<GameLobbyContainer />} />
          <Route path="/game" element={<GamePage />} />
          <Route path="/game/normal" element={<NormalGamePage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="*" element={<Navigate to="/not_found" />} />
        </Routes>
        {rankWaitModalToggle && <RankWaitModal />}
        {joinGameModalToggle.toggle && <JoinGameModal />}
        {alertModalToggle.toggle && <AlertModal />}
        {operatorModalToggle && <OperatorModal />}
        {settingModalToggle && <SettingModal />}
        {createChatModalToggle && <CreateChatModal />}
        {joinChatToggle.toggle && <JoinChatModal />}
      </MainPageContainer>
    )
  );
};

const MainPageContainer = styled.div`
  width: 1000px;
  height: 700px;
  background: var(--main-bg-color);
  border-radius: 20px;
  display: flex;
  align-items: center;
`;

export default MainPage;
