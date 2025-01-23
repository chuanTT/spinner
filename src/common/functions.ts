export const parseArray = (arr: string) => {
  try {
    const arrValue = JSON.parse(arr);
    return Array.isArray(arrValue) ? arrValue : [];
  } catch {
    return [];
  }
};
