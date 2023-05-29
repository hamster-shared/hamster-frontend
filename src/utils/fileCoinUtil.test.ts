import { getFileCoinContent } from './fileCoinUtil';
import type { fileCoinContent } from './fileCoinUtil';


describe('getFileCoinContent', () => {
  it('should return an array of lines from the file', async () => {
    const content: fileCoinContent = {
      name: 'yourfilepath',
      makeDeal: true,
      getDeal: true,
      handleFileCoin: true,
      updateActivationStatus: true,
      balance: false,
    };
    const lines = await getFileCoinContent(content);
    console.log("lines", lines)
  });
});
