
export const optionTime = [
  { label: 'Last 15 minutes', value: 'STAT_15_MIN' },
  { label: 'Last 1 Hour', value: 'STAT_1_HOUR' },
  { label: 'Last 24 Hours', value: 'STAT_24_HOUR' },
  { label: 'Last 7 Days', value: 'STAT_7_DAY' },
  { label: 'Last 1 Month', value: 'STAT_1_MONTH' },
];


// 设置数据格式
export const setMillionValue = (value: string) => {
  if(!value) return
  console.log("value:", value);
  return value.length > 6 ? value.substring(0, value.length - 6) : value
}
// 数字没3位加上逗号
export const setNumberValue = (value: number) => {
  if(!value) return
  const reg = /(\d)(?=(?:\d{3})+$)/g;
  return value.toString().replace(reg, '$1,');
}

