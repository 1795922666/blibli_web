/**
 *
 * @param isoDate ISO 8601 格式的日期字符串
 * @returns
 */
export function formatDate(dateString): string {
  const inputDate = new Date(dateString)
  const currentDate = new Date()

  const year = inputDate.getFullYear()
  const month = String(inputDate.getMonth() + 1).padStart(2, '0')
  const day = String(inputDate.getDate()).padStart(2, '0')

  if (year === currentDate.getFullYear()) {
    return `${month}-${day}`
  } else {
    return `${year}-${month}-${day}`
  }
}

/**
 * 将秒数转换为时分秒格式（00:00:00）
 * @param {number} seconds - 总秒数
 * @returns {string} 格式化后的时间字符串（HH:mm:ss）
 */
export function formatSecondsToTime(seconds): string {
  const hours = Math.floor(seconds / 3600)
  const remainingSeconds = seconds % 3600
  const minutes = Math.floor(remainingSeconds / 60)
  const sec = remainingSeconds % 60

  // 补零函数
  const padZero = (n): string => n.toString().padStart(2, '0')

  return `${padZero(hours)}:${padZero(minutes)}:${padZero(sec)}`
}

/**
 * 比较两个时间并根据差异返回不同格式的时间显示
 * @param timeA - 第一个时间，可以是日期对象或时间戳
 * @param timeB - 第二个时间，可以是日期对象或时间戳，默认为当前时间
 * @returns 格式化的时间差字符串
 */
export function formatTimeDifference(timeA: Date | string, timeB: Date = new Date()): string {
  if (typeof timeA === 'string') {
    timeA = new Date(timeA)
  }

  // 将输入转换为毫秒时间戳
  const a = typeof timeA === 'number' ? timeA : timeA.getTime()
  const b = typeof timeB === 'number' ? timeB : timeB.getTime()

  // 计算差值（绝对值，不考虑先后顺序）
  const diffMs = Math.abs(a - b)

  // 转换为更易读的单位
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffMinutes = Math.floor(diffMs / (1000 * 60))

  // 根据差值范围返回不同格式
  if (diffHours < 1) {
    return diffMinutes < 1 ? '1分钟' : `${diffMinutes}分钟`
  } else if (diffHours < 24) {
    return `${diffHours}小时`
  } else {
    const dateA = new Date(a)
    const dateB = new Date(b)

    // 计算年份差
    const yearDiff = Math.abs(dateA.getFullYear() - dateB.getFullYear())

    // 如果年份差大于等于1，且日期差超过365天，显示完整日期（含年份）
    if (yearDiff >= 1 && diffMs > 365 * 24 * 60 * 60 * 1000) {
      return `${dateA.getFullYear()}-${(dateA.getMonth() + 1).toString().padStart(2, '0')}-${dateA.getDate().toString().padStart(2, '0')}`
    } else {
      // 否则只显示月-日
      return `${(dateA.getMonth() + 1).toString().padStart(2, '0')}-${dateA.getDate().toString().padStart(2, '0')}`
    }
  }
}
