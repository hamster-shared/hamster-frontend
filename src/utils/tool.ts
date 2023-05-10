
function dispatchEventStroage() {
  const signSetItem = localStorage.setItem;
  localStorage.setItem = function (key, val) {
    let setEvent = new Event("setItemEvent");
    setEvent.key = key;
    setEvent.newValue = val;
    window.dispatchEvent(setEvent);
    signSetItem.apply(this, arguments);
  };
}

export default dispatchEventStroage;


export function sleep(millseconds: number) : Promise<void> {
  return new Promise<void>((resolve) => setTimeout(resolve,millseconds))
}

// 下载 str:下载的内容  name:下载文件的名称  format:下载文件的格式
export const downloadRequest = (str:string,name:string,format:string)=>{
  const url = `data:,${str}`;
  const a = document.createElement('a');
  a.href = url;
  a.download = `${name}.${format}`;
  a.click();
  a.remove();
}
