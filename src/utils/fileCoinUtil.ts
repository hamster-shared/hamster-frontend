import * as fs from 'fs';
import * as path from 'path';


export interface fileCoinContent {
  name: string;
  makeDeal?:boolean;
  getDeal?:boolean;
  handleFileCoin?:boolean;
  updateActivationStatus?:boolean;
  balance?:boolean;
}

const filePath = 'DealClient.sol';

function initializeFileCoinContent(): fileCoinContent {
  return {
    name: "DealClient",
    makeDeal: false,
    getDeal: false,
    handleFileCoin: false,
    updateActivationStatus: false,
    balance: false
  };
}

export function getFileCoinContent(fileCoinContent: fileCoinContent): string {
  if (!fileCoinContent) {
    fileCoinContent = initializeFileCoinContent();
  }
  let lineNumbers = getLineNumbers(fileCoinContent);
  return readLinesFromFile(fileCoinContent.name, lineNumbers);
}

function getFileContentInWebEnv(url: string): string {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', url, false); // 同步请求
  xhr.send();
  if (xhr.status === 200) {
    return xhr.responseText;
  } else {
    throw new Error(`Failed to load file: ${url}`);
  }
}

function getFileContentInNodeEnv(path: string): string {
  try {
    const data = fs.readFileSync(path, 'utf8');
    return data;
  } catch (err) {
    throw new Error(`Failed to load file: ${path}`);
  }
}

function getLineNumbers(fileCoinContent: fileCoinContent): number[] {
  const numbers: number[] = [];
  if (fileCoinContent.updateActivationStatus && fileCoinContent.handleFileCoin && fileCoinContent.balance && fileCoinContent.makeDeal && fileCoinContent.getDeal) {
    //全部需要
    return numbers;
  }
  if (!fileCoinContent.updateActivationStatus && !fileCoinContent.handleFileCoin && !fileCoinContent.balance && !fileCoinContent.getDeal && !fileCoinContent.makeDeal) {
    //default
    return fileCoinMethod.default;
  }
  if (fileCoinContent.makeDeal){
    numbers.push(...fileCoinMethod.makeDeal)
  }
  if (fileCoinContent.getDeal){
    numbers.push(...fileCoinMethod.getDeal)
  }
  if (fileCoinContent.handleFileCoin){
    numbers.push(...fileCoinMethod.handleFileCoin)
  }
  if (fileCoinContent.balance){
    numbers.push(...fileCoinMethod.balance)
  }
  if (fileCoinContent.updateActivationStatus){
    numbers.push(...fileCoinMethod.updateActivationStatus)
  }
  //排序
  numbers.sort((a, b) => a - b);
  // 去重
  const uniqueNumbers: number[] = Array.from(new Set(numbers));
  return uniqueNumbers;
}

function readLinesFromFile(name :string, lineNumbers: number[]): string {
    let content: string = "";
  let fileContent: string;
  try {
    if (typeof __dirname !== 'undefined') {
      const nodeEnvFilePath = path.resolve(__dirname, '../../public/DealClient.sol');
      fileContent = getFileContentInNodeEnv(nodeEnvFilePath);
    } else {
      const fileUrl = new URL(filePath, window.location.origin).href;
      fileContent = getFileContentInWebEnv(fileUrl);
    }
  } catch (err) {
    throw err;
  }

  if (lineNumbers.length < 1) {
    if (name) {
      content = fileContent.replace("contract DealClient", "contract " + name);
    } else {
      content = fileContent;
    }
  } else {
    let currentLine = 1;
    const splitLines = fileContent.split('\n');

    splitLines.forEach((line: string) => {
      if (lineNumbers.includes(currentLine)) {
        if (line.includes("contract DealClient") && name) {
          line = line.replace("DealClient", name)
        }
        if (currentLine == 1) {
          content = line + '\n';
        } else {
          content = content + line + '\n';
        }
      }
      currentLine++;
    });
  }
  return content;
}



const fileCoinMethod = {
      default: [1, 2, 3, 66, 103, 104, 105, 106, 107, 108, 323],
      makeDeal:[1, 2, 3, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 66, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 323],
      getDeal:[1, 2, 3, 5, 7, 9, 11, 12, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 66, 68, 69, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 103, 104, 105, 106, 107, 108, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 323],
      handleFileCoin:[1, 2, 3, 5, 6, 8, 9, 11, 12, 13, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 66, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 102, 103, 104, 105, 106, 107, 108, 130, 162, 163, 164, 165, 166, 167, 168, 169, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252, 253, 254, 255, 256, 257, 258, 259, 260, 261, 262, 263, 264, 265, 266, 267, 268, 269, 270, 271, 272, 273, 274, 275, 276, 277, 278, 279, 280, 281, 282, 283, 284, 285, 286, 287, 288, 323],
      updateActivationStatus:[1, 2, 3, 4, 5, 7, 15, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 66, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 289, 290, 291, 292, 293, 294, 295, 296, 297, 298, 299, 323],
      balance:[1, 2, 3, 4, 5, 7, 11, 14, 15, 66, 103, 104, 105, 106, 107, 108, 300, 301, 302, 303, 304, 305, 306, 307, 308, 309, 310, 311, 312, 313, 314, 315, 316, 317, 318, 319, 320, 321, 322, 323],
};
