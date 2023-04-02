import styled from "@emotion/styled";
import { GameDto } from "../../api/interface";
import RoomInfo from "./RoomInfo";

const GameList = ({ data }: { data: GameDto[] }) => {
  return (
    <GameListContainer>
      {data.length ? (
        <ListContainer>
          {data.map(({ title, players, private_mode }, idx) => (
            <RoomInfo
              title={title}
              cur={players.length}
              private_mode={private_mode}
              key={idx}
            />
          ))}
        </ListContainer>
      ) : (
        <NoGame>열려 있는 게임이 없습니다.</NoGame>
      )}
    </GameListContainer>
  );
};

const ListContainer = styled.div`
  width: 97%;
  height: 95%;
  overflow-y: auto;
  &::-webkit-scrollbar {
    border-radius: 10px;
    width: 10px;
  }
  &::-webkit-scrollbar-track {
    background: white;
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb {
    background: var(--gray-color);
    width: 2px;
    border-radius: 10px;
  }
`;

const NoGame = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.6);
`;

const GameListContainer = styled.div`
  width: 530px;
  height: 510px;
  background: var(--sub-bg-color);
  border-radius: 10px;
  display: flex;
  overflow: hidden;
  justify-content: center;
  align-items: center;
`;

export default GameList;
