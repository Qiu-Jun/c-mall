export const notEmpty = (value, errorMsg) => {
  if (!value) return errorMsg
}

export const isMobile = (value, errorMsg) => {
  if (!/^1[3-9]\d{9}$/.test(value)) return errorMsg
}
