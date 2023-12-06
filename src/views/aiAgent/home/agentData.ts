
import { v4 as uuidv4 } from 'uuid';

const userInfo = JSON.parse(localStorage.getItem('userInfo'))
export const agentList = [
  {
    chatId: uuidv4(),//uuid
    userId: userInfo.id,
    nickname: userInfo.username,
    recordType: 0,// 0:NFT；1:Developer
    logo: 'NFT-Expert.png',
    position: 'NFT Expert',
    description: 'NFT design、Contract development、NFT minting、Ethereum、Solana…',
  },
  {
    chatId: uuidv4(),//uuid
    userId: userInfo.id,
    nickname: userInfo.username,
    recordType: 1,// 0:NFT；1:Developer
    logo: 'Dapp-Developer.png',
    position: 'Dapp Developer',
    description: 'Dapp development、Smart contract development、Front-end integration、token creation、Deployment、Testing and debugging',
  }
];