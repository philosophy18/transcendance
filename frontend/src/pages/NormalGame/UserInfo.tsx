import styled from "@emotion/styled";

const UserInfo = ({
  profile,
  intra_id,
  normal_win,
  normal_lose,
  rank_win,
  rank_lose,
  introduce,
}: {
  profile: string;
  intra_id: string;
  normal_win: number;
  normal_lose: number;
  rank_win: number;
  rank_lose: number;
  introduce: string;
}) => {
  const normalRate = (normal_win / (normal_lose + normal_win)) * 100;
  const rankRate = (rank_win / (rank_lose + rank_win)) * 100;
  return (
    <UserInfoContainer>
      <Profile profile={profile} />
      <Info>
        <div>{intra_id}</div>
        <div>
          <div>일반 게임</div>
          <div>
            {normal_win}승 {normal_lose}패 {normalRate.toFixed(1)}%
          </div>
        </div>
        <div>
          <div>랭크 게임</div>
          <div>
            {rank_win}승 {rank_lose}패 {rankRate.toFixed(1)}%
          </div>
        </div>
      </Info>
      <IntroduceContainer>
        <div>인삿말</div>
        <Introduce>{introduce || "안녕하세요~"}</Introduce>
      </IntroduceContainer>
    </UserInfoContainer>
  );
};

const IntroduceContainer = styled.div`
  width: 140px;
  height: 140px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Introduce = styled.div`
  padding: 10px;
  background: var(--main-bg-color);
  width: 80%;
  height: 65%;
  margin-top: 20px;
  border-radius: 10px;
  overflow-y: auto;
  &::-webkit-scrollbar {
    border-radius: 5px;
    width: 5px;
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

const Info = styled.div`
  width: 140px;
  height: 140px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`;

const Profile = styled.div<{ profile: string }>`
  width: 140px;
  height: 140px;
  border-radius: 10px;
  background-image: ${({ profile }) =>
    profile ? `url(${profile})` : 'url("/src/assets/defaultProfile.png")'};
  background-size: 100% 100%;
  margin-left: 10px;
`;

const UserInfoContainer = styled.div`
  width: 500px;
  height: 180px;
  background: var(--dark-bg-color);
  border-radius: 10px;
  display: flex;
  justify-content: space-around;
  align-items: center;
`;

export default UserInfo;
