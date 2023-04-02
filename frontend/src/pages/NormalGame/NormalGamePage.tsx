import styled from "@emotion/styled";
import { useState } from "react";
import { NormalGameUserDto } from "../../api/interface";
import ChatBox from "../../components/Chat/ChatBox";
import CurrentUserInfo from "./CurrentUserInfo";
import WaitRoom from "./WaitRoom";

const NormalGamePage = () => {
  const [start, setStart] = useState(false);
  return (
    <NormalGamePageContainer>
      <GameContainer>
        <h1>Normal Game</h1>
        <h2>yooh의 일반 게임</h2>
        {!start ? <WaitRoom /> : <GameBox />}
      </GameContainer>
      <SubContainer>
        <Options>
          <Button className="active">시작하기</Button>
          <Button className="active">나가기</Button>
        </Options>
        <CurrentUserInfo data={createDummyData()} />
        <ChatBox height={350} />
      </SubContainer>
    </NormalGamePageContainer>
  );
};

function createDummyData() {
  const result: NormalGameUserDto[] = [];

  result.push({ name: "yooh", type: "owner" });
  result.push({ name: "jpark2", type: "opponent" });

  for (let i = 0; i < 50; i < i++) {
    let temp: NormalGameUserDto = {
      name: "User " + (i + 1),
      type: "watcher",
    };
    result.push(temp);
  }
  return result;
}

const Button = styled.div`
  border-radius: 5px;
  padding: 5px 10px;
  margin: 0 10px;
  &.active {
    border: 1px solid white;
    cursor: pointer;
  }
  &.notActive {
    border: 1px solid var(--gray-color);
    color: var(--gray-color);
    cursor: not-allowed;
  }
`;

const Options = styled.div`
  width: 100%;
  height: 60px;
  background: var(--sub-bg-color);
  border-radius: 10px;
  margin-bottom: 95px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const GameBox = styled.div`
  width: 530px;
  height: 510px;
  background: var(--sub-bg-color);
  border-radius: 20px;
  margin: 0 auto;
`;

const GameContainer = styled.div`
  width: 550px;
  height: 100%;
  margin: 0 25px;
  & > h1,
  h2 {
    margin-left: 30px;
    height: 45px;
  }
`;

const SubContainer = styled.div`
  width: 300px;
  height: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: space-between;
`;

const NormalGamePageContainer = styled.div`
  height: 95%;
  display: flex;
  color: white;
  width: 90%;
`;

export default NormalGamePage;
