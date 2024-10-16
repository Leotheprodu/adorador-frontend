export const ErrorMessage = (error: string) => {
  return error.split('-')[1];
};

export const ErrorCode = (error: string) => {
  return parseInt(error.split('-')[0]);
};
