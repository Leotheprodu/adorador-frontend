export const errorMessage = (error: string) => {
  return error.split("-")[1];
};

export const errorCode = (error: string) => {
  return parseInt(error.split("-")[0]);
};
