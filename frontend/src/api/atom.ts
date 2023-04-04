import { atom, selector } from "recoil";
import { Socket } from "socket.io-client";
import {
  IChatLog,
  ICurrentNormalGame,
  IGameUserInfo,
  JoinnedUserDto,
} from "./interface";

export const myInfoState = atom({
  key: "myInfoState",
  default: {
    user_id: 15,
    intra_id: "yooh",
    profile: "",
    introduce: "",
    normal_win: 1000,
    normal_lose: 500,
    rank_win: 17,
    rank_lose: 2,
    join_game: null,
  },
});

export const myNameState = selector({
  key: "myNameState",
  get: ({ get }) => {
    const myInfo = get(myInfoState);
    return myInfo.intra_id;
  },
});

export const modalBackToggleState = atom({
  key: "modalBackToggleState",
  default: false,
});

export const rankWaitModalToggleState = atom({
  key: "rankWaitModalToggleState",
  default: false,
});

export const socketState = atom<Socket | null>({
  key: "socketState",
  default: null,
});

export const joinGameModalToggleState = atom({
  key: "joinGameModalToggleState",
  default: false,
});

export const currentNormalGameInfoState = atom<ICurrentNormalGame>({
  key: "currentNormalGameInfoState",
  default: {
    gameDto: {
      interrupt_mode: false,
      password: "",
      private_mode: false,
      title: "",
    },
    opponentDto: null,
    ownerDto: {
      id: 4,
      intra_id: "jpark2",
      introduce: "",
      join_type: 0,
      normal_lose: 0,
      normal_win: 0,
      profile: "",
      rank_lose: 0,
      rank_win: 0,
      user_id: 131546,
    },
    watchersDto: [],
  },
});

export const currentNormaGameUsersState = selector<JoinnedUserDto[]>({
  key: "currentNormaGameUsersState",
  get: ({ get }) => {
    const data = get(currentNormalGameInfoState);
    console.log(data);
    const result = [];
    result.push({ type: "owner", intra_id: data.ownerDto.intra_id });
    if (data.opponentDto)
      result.push({ type: "opponent", intra_id: data.opponentDto.intra_id });
    data.watchersDto.forEach((person) => {
      result.push({ type: "watcher", intra_id: person.intra_id });
    });
    return result;
  },
});

export const chatLogState = atom<IChatLog[]>({
  key: "chatLogState",
  default: [],
});

export const opponentInfoState = selector<IGameUserInfo | null>({
  key: "opponentInfoState",
  get: ({ get }) => {
    const { opponentDto, ownerDto } = get(currentNormalGameInfoState);
    const myName = get(myNameState);

    if (!opponentDto) return null;
    return opponentDto.intra_id === myName ? ownerDto : opponentDto;
  },
});

export const selectedNormalGameTitleState = atom({
  key: "selectedNormalGameTitleState",
  default: "",
});
