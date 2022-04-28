/**
 * @return {string}
 */
export function DateFormat (date) {
  if (date == null) {
    return ""
  }
  const time = new Date(date)
  const year = time.getFullYear()
  const month = time.getMonth() + 1
  const day = time.getDate()
  const hours = time.getHours() - 8 < 0 ? time.getHours() + 16:time.getHours() - 8 // 时区的坑，默认+8,当时间为16时，时区+8变成24也就是0
  const minutes = time.getMinutes()
  const seconds = time.getSeconds()
  return `${year}-${addZero(month)}-${addZero(day)} ${addZero(hours)}:${addZero(minutes)}:${addZero(seconds)}`;
}


function addZero(num){
 return num < 10 ? '0' + num : num
 }

