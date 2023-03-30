import { createVNode } from 'vue';
import { Popover } from 'ant-design-vue';

// check字节数
export const chkstrlen = (str: string) => {
    let strlen = 0;
    for (let i = 0; i < str.length; i++) {
        if (str.charCodeAt(i) > 255) {
            strlen += 2;
        } else {
            strlen++;
        }
    }
    return strlen;
};

/**
 * 超过指定字符长度后...
 * @param {Number} len 需要限制的字符长度
 */
export const renderTableText: any = (len: number) => {
    return ({ text: str }: { text: string }) => {
        if (typeof str !== 'string') return '';
        if (chkstrlen(str) <= len) {
            return str;
        } else {
            return createVNode(Popover, { content: str }, () => [`${handleStr(str, len)}`]);
        }
    };
};
export const handleStr = (str: string, len: number) => {
    if (typeof str !== 'string') return '';

    if (chkstrlen(str) <= len) {
        return str;
    }
    const strList = str.split('');
    let curStrLen = 0;
    let returnStr = '';
    for (let i = 0, l = strList.length; i < l; i++) {
        curStrLen += chkstrlen(strList[i]);
        if (curStrLen == len) {
            returnStr = str.slice(0, i + 1);
            return `${returnStr}...`;
        }
        if (curStrLen == len - 1) {
            if (chkstrlen(strList[i + 1]) == 1) {
                returnStr = str.slice(0, i + 2);
            } else {
                returnStr = str.slice(0, i + 1);
            }
            return `${returnStr}...`;
        }
    }
};