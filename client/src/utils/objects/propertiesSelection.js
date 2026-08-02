export const propertiesSelection = (obj, keys) => {
  const temp = {};
  for (const key of keys) {
    if (!Object.hasOwn(obj, key)) continue;
    temp[key] = obj[key];
  }
  return temp;
};
export default propertiesSelection