import {getFileCoinContent, initializeFileCoinContent} from './fileCoinUtil';

describe('getFileCoinContent', () => {
  it('should return an array of lines from the file', async () => {
    const content = initializeFileCoinContent();

    const lines = await getFileCoinContent(content);
    console.log(lines)
  });
});
