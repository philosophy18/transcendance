import {
  IChatDetail,
  IChatRoom,
  IFriendDto,
  IFriendRequest,
  IJoinnedChat,
} from "../interface";

export const listenFriendRequestList = ({
  socket,
  setFriendRequestList,
}: {
  socket: any;
  setFriendRequestList: any;
}) => {
  socket.on("friend-request-list", (request: IFriendRequest[]) => {
    setFriendRequestList([...request]);
  });
};

export const listenAllChatList = ({
  socket,
  setChatList,
}: {
  socket: any;
  setChatList: any;
}) => {
  socket.on("all-chat", (chats: IChatRoom[]) => {
    setChatList([...chats]);
  });
};

export const listenFriendList = ({
  socket,
  setFriendList,
  setRequestFriendListFlag,
}: {
  socket: any;
  setFriendList: any;
  setRequestFriendListFlag: any;
}) => {
  socket.on("friend-list", (friends: IFriendDto[]) => {
    setFriendList([...friends]);
    setRequestFriendListFlag(true);
  });
};

export const listenFirstConnection = ({ socket }: { socket: any }) => {
  socket.on("first-connection", () => {
    socket.emit("friend-request-list");
    socket.emit("friend-list");
    socket.emit("all-chat");

  });
};

export const listenCancelFriend = ({
  socket,
  setFriendRequestList,
  friendRequestList,
}: {
  socket: any;
  setFriendRequestList: any;
  friendRequestList: any;
}) => {
  socket.on("cancel-friend", (userName: string) => {
    setFriendRequestList(
      friendRequestList.filter(
        (friend: IFriendRequest) => friend.intra_id !== userName
      )
    );
  });
};

export const listenNewFriend = ({
  socket,
  setFriendList,
  friendList,
  setFriendRequestList,
  friendRequestList,
}: {
  socket: any;
  setFriendList: any;
  friendList: any;
  setFriendRequestList: any;
  friendRequestList: any;
}) => {
  socket.on(
    "new-friend",
    ({ username, profile }: { username: string; profile: string }) => {
      setFriendList([...friendList, { intra_id: username, profile }]);
      setFriendRequestList(
        friendRequestList.filter(
          (friend: IFriendRequest) => friend.intra_id !== username
        )
      );
    }
  );
  socket.on("cancel-friend", (userName: string) => {
    setFriendRequestList(
      friendRequestList.filter(
        (friend: IFriendRequest) => friend.intra_id !== userName
      )
    );
  });
};

export const listenDeleteFriend = ({
  socket,
  setFriendList,
  friendList,
}: {
  socket: any;
  setFriendList: any;
  friendList: any;
}) => {
  socket.on("delete-friend", ({ username }: { username: string }) => {
    setFriendList(
      friendList.filter((friend: IFriendDto) => friend.intra_id !== username)
    );
  });
};

export const listenFriendResult = ({
  socket,
  setFriendRequestList,
  setFriendList,
  friendRequestList,
  friendList,
}: {
  socket: any;
  setFriendRequestList: any;
  setFriendList: any;
  friendRequestList: any;
  friendList: any;
}) => {
  socket.on(
    "friend-result",
    ({
      username,
      type,
      profile,
    }: {
      username: string;
      type: boolean;
      profile: string;
    }) => {
      setFriendRequestList(
        friendRequestList.filter(
          (request: IFriendRequest) => request.intra_id !== username
        )
      );
      if (type) {
        setFriendList([
          ...friendList,
          { intra_id: username, profile: profile },
        ]);
      }
    }
  );
};

export const listenResponseFriend = ({
  socket,
  setFriendRequestList,
  setFriendList,
  friendRequestList,
  friendList,
}: {
  socket: any;
  setFriendRequestList: any;
  setFriendList: any;
  friendRequestList: any;
  friendList: any;
}) => {
  socket.on(
    "response-friend",
    ({
      username,
      type,
      profile,
    }: {
      username: string;
      type: boolean;
      profile: string;
    }) => {
      setFriendRequestList(
        friendRequestList.filter(
          (request: IFriendRequest) => request.intra_id !== username
        )
      );
      if (type) {
        setFriendList([
          ...friendList,
          { intra_id: username, profile: profile },
        ]);
      }
    }
  );
};

export const listenFriendFail = ({
  socket,
  setAlertInfo,
}: {
  socket: any;
  setAlertInfo: any;
}) => {
  socket.on("friend-fail", (message: string) => {
    setAlertInfo({
      type: "failure",
      header: "",
      msg: message,
      toggle: true,
    });
  });
};

export const listenMessage = ({
  socket,
  joinnedChatList,
  setJoinnedChatList,
}: {
  socket: any;
  joinnedChatList: any;
  setJoinnedChatList: any;
}) => {
  socket.on(
    "message",
    ({
      roomName,
      userName,
      message,
    }: {
      roomName: string;
      userName: string;
      message: string;
    }) => {
      setJoinnedChatList({
        ...joinnedChatList,
        [roomName]: {
          ...joinnedChatList[roomName],
          chatLogs: [
            ...joinnedChatList[roomName].chatLogs,
            {
              sender: userName,
              msg: message,
              time: new Date(),
            },
          ],
        },
      });
    }
  );
};

export const listenCreateChat = ({
  socket,
  myName,
  setCurrentChat,
  chatList,
  setChatList,
  joinnedChatList,
  setJoinnedChatList,
}: {
  socket: any;
  myName: any;
  setCurrentChat: any;
  chatList: any;
  setChatList: any;
  joinnedChatList: any;
  setJoinnedChatList: any;
}) => {
  socket.on(
    "create-chat",
    ({
      roomName,
      type,
      operator,
    }: {
      roomName: string;
      type: number;
      operator: string;
    }) => {
      const temp: IChatRoom = {
        title: roomName,
        type,
        operator,
        count: 1,
      };
      setChatList([...chatList, temp]);
      const detailTemp: IChatDetail = {
        title: roomName,
        type,
        operator,
        userList: [myName],
        chatLogs: [],
        banUsers: [],
        newMsg: false,
      };
      if (operator === myName) {
        setCurrentChat(roomName);
        setJoinnedChatList({
          ...joinnedChatList,
          [roomName]: { ...detailTemp },
        });
      }
    }
  );
};

export const listenRequestAllChat = ({
  socket,
  setChatList,
}: {
  socket: any;
  setChatList: any;
}) => {
  socket.on("all-chat", ({ chats }: { chats: IChatRoom[] }) => {
    setChatList([...chats]);
  });
};

export const listenSomeoneJoinned = ({
  socket,
  myName,
  currentChat,
  chatList,
  setChatList,
  joinnedChatList,
  setJoinnedChatList,
}: {
  socket: any;
  myName: string;
  currentChat: string;
  chatList: IChatRoom[];
  setChatList: any;
  joinnedChatList: IJoinnedChat;
  setJoinnedChatList: any;
}) => {
  socket.on(
    "join-chat",
    ({
      message,
      username,
      roomName,
    }: {
      message: string;
      username: string;
      roomName: string;
    }) => {
      setChatList(
        chatList.map((chat: IChatRoom) => ({
          ...chat,
          count: chat.title === roomName ? chat.count + 1 : chat.count,
        }))
      );
      if (joinnedChatList[roomName] !== undefined) {
        setJoinnedChatList({
          ...joinnedChatList,
          [roomName]: {
            ...joinnedChatList[roomName],
            userList: [...joinnedChatList[roomName].userList, username],
            chatLogs:
              currentChat === roomName
                ? [
                    ...joinnedChatList[roomName].chatLogs,
                    {
                      sender: "admin",
                      msg: message,
                      time: new Date(),
                    },
                  ]
                : [...joinnedChatList[roomName].chatLogs],
          },
        });
      }
    }
  );
};

export const listenJoinSucces = ({
  myName,
  socket,
  setCurrentChat,
  chatList,
  setChatList,
  joinnedChatList,
  setJoinnedChatList,
}: {
  myName: string;
  socket: any;
  setCurrentChat: any;
  chatList: IChatRoom[];
  setChatList: any;
  joinnedChatList: IJoinnedChat;
  setJoinnedChatList: any;
}) => {
  socket.on(
    "join-chat-success",
    ({
      roomName,
      type,
      operator,
      users,
    }: {
      roomName: string;
      type: number;
      operator: string;
      users: string[];
    }) => {
      const temp: IChatDetail = {
        title: roomName,
        type,
        operator,
        userList: [...users, myName],
        chatLogs: [],
        banUsers: [],
        newMsg: false,
      };
      setJoinnedChatList({ ...joinnedChatList, [roomName]: temp });
      setCurrentChat(roomName);
      setChatList(
        chatList.map((chat) => ({
          ...chat,
          count: chat.title === roomName ? chat.count + 1 : chat.count,
        }))
      );
    }
  );
};

export const listenSomeoneLeave = ({
  socket,
  chatList,
  setChatList,
  joinnedChatList,
  setJoinnedChatList,
}: {
  socket: any;
  chatList: IChatRoom[];
  setChatList: any;
  joinnedChatList: IJoinnedChat;
  setJoinnedChatList: any;
}) => {
  socket.on(
    "leave-chat",
    ({
      message,
      username,
      roomName,
    }: {
      message: string;
      username: string;
      roomName: string;
    }) => {
      setChatList(
        chatList
          .map((chat) => ({
            ...chat,
            count: chat.title === roomName ? chat.count - 1 : chat.count,
          }))
          .filter((chat) => chat.count !== 0)
      );
      if (joinnedChatList[roomName]) {
        setJoinnedChatList({
          ...joinnedChatList,
          [roomName]: {
            ...joinnedChatList[roomName],
            userList: joinnedChatList[roomName].userList.filter(
              (name) => name != username
            ),
            chatLogs: [
              ...joinnedChatList[roomName].chatLogs,
              {
                sender: "admin",
                msg: message,
                time: new Date(),
              },
            ],
          },
        });
      }
    }
  );
};

export const listenLeaveSuccess = ({
  socket,
  currentChat,
  setCurrentChat,
  chatList,
  setChatList,
  joinnedChatList,
  setJoinnedChatList,
}: {
  socket: any;
  currentChat: string;
  setCurrentChat: any;
  chatList: IChatRoom[];
  setChatList: any;
  joinnedChatList: IJoinnedChat;
  setJoinnedChatList: any;
}) => {
  socket.on("leave-chat-success", (roomName: string) => {
    setChatList(
      chatList
        .map((chat) => ({
          ...chat,
          count: chat.title === roomName ? chat.count - 1 : chat.count,
        }))
        .filter((chat) => chat.count !== 0)
    );
    const temp = { ...joinnedChatList };
    if (currentChat === roomName) {
      setCurrentChat("");
    }
    if (temp[roomName]) delete temp[roomName];
    setJoinnedChatList({ ...temp });
  });
};

export const listenAlert = ({
  socket,
  setAlertInfo,
}: {
  socket: any;
  setAlertInfo: any;
}) => {
  socket.on("chat-fail", (message: string) => {
    setAlertInfo({
      type: "failure",
      header: "",
      msg: message,
      toggle: true,
    });
  });
};

export const listenKickUser = ({
  socket,
  myName,
  currentChat,
  setCurrentChat,
  chatList,
  setChatList,
  joinnedChatList,
  setJoinnedChatList,
}: {
  socket: any;
  myName: string;
  currentChat: string;
  setCurrentChat: any;
  chatList: IChatRoom[];
  setChatList: any;
  joinnedChatList: IJoinnedChat;
  setJoinnedChatList: any;
}) => {
  socket.on(
    "kick-user",
    ({ userName, roomName }: { userName: string; roomName: string }) => {
      if (userName === myName) {
        if (currentChat === roomName) {
          setCurrentChat("");
        }
        const temp: IJoinnedChat = {
          ...joinnedChatList,
        };
        delete temp[roomName];

        setJoinnedChatList({ ...temp });
      }
      if (userName !== myName) {
        setJoinnedChatList({
          ...joinnedChatList,
          [roomName]: {
            ...joinnedChatList[roomName],
            userList: joinnedChatList[roomName].userList.filter(
              (name) => name !== userName
            ),
            chatLogs: [
              ...joinnedChatList[roomName].chatLogs,
              {
                sender: "admin",
                msg: `${userName}님이 추방 되었습니다.`,
                time: new Date(),
              },
            ],
          },
        });
      }
      setChatList(
        chatList.map((chat) => ({
          ...chat,
          count: chat.title === roomName ? chat.count - 1 : chat.count,
        }))
      );
    }
  );
};

export const listenBanUser = ({
  socket,
  myName,
  currentChat,
  setCurrentChat,
  chatList,
  setChatList,
  joinnedChatList,
  setJoinnedChatList,
}: {
  socket: any;
  myName: string;
  currentChat: string;
  setCurrentChat: any;
  chatList: IChatRoom[];
  setChatList: any;
  joinnedChatList: IJoinnedChat;
  setJoinnedChatList: any;
}) => {
  socket.on(
    "ban-user",
    ({ userName, roomName }: { userName: string; roomName: string }) => {
      if (userName === myName) {
        if (currentChat === roomName) {
          setCurrentChat(null);
        }
        const temp: IJoinnedChat = {
          ...joinnedChatList,
        };
        delete temp[roomName];
        setJoinnedChatList({ ...temp });
      }
      if (userName !== myName) {
        if (currentChat === roomName) {
          setJoinnedChatList({
            ...joinnedChatList,
            [roomName]: {
              ...joinnedChatList[roomName],
              userList: joinnedChatList[roomName].userList.filter(
                (name) => name !== userName
              ),
              banUsers: joinnedChatList[roomName].banUsers.filter(
                (name) => name !== userName
              ),
              chatLogs: [
                ...joinnedChatList[roomName].chatLogs,
                {
                  sender: "admin",
                  msg: `${userName}님의 입장이 금지 되었습니다.`,
                  time: new Date(),
                },
              ],
            },
          });
        }
      }
      setChatList(
        chatList.map((chat) => ({
          ...chat,
          count: chat.title === roomName ? chat.count - 1 : chat.count,
        }))
      );
    }
  );
};

export const listenChangeOperator = ({
  socket,
  joinnedChatList,
  setJoinnedChatList,
}: {
  socket: any;
  joinnedChatList: IJoinnedChat;
  setJoinnedChatList: any;
}) => {
  socket.on(
    "chat-operator",
    ({ roomName, operator }: { roomName: string; operator: string }) => {
      setJoinnedChatList({
        ...joinnedChatList,
        [roomName]: {
          ...joinnedChatList[roomName],
          operator: operator,
          chatLogs: [
            ...joinnedChatList[roomName].chatLogs,
            {
              sender: "admin",
              msg: `${operator}님이 관리자가 되었습니다.`,
              time: new Date(),
            },
          ],
        },
      });
    }
  );
};

export function chatSocketOff(socket: any, ...rest: string[]) {
  for (let api of rest) {
    socket.off(api);
  }
}
