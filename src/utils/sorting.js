export const sortByTime = (inputObj) => {
  inputObj = Object.keys(inputObj || []).map((key) => {
    return { key, ...inputObj[key] }
  })

  if (inputObj.length) {
    return inputObj.sort((a, b) => {
      const timeA = a.time;
      const timeB = b.time;
      const valueA = timeA && parseInt(`${timeA.replace(':', '')}`);
      const valueB = timeB && parseInt(`${timeB.replace(':', '')}`);

      if (valueA && valueB) {
        return valueA - valueB
      } else if (!valueA && !valueB) {
        return 0;
      } else if (!valueA && valueB) {
        return 1;
      } else if (valueA && !valueB) {
        return -1;
      }
    })
  }
}