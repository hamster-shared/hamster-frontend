
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
