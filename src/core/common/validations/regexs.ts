export const numberRegex: RegExp = /^\d+$/;
export const numberTruncateRegex = /^\d{1,3}(,\d{3})*(\.\d{1,2})?$/;

export const emailRegex: RegExp =
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const webSiteRegex = new RegExp(
  '^(https?://)(www\\.)?([a-zA-Z0-9-]+\\.){1,}[a-zA-Z]{2,}(/\\S*)?$',
);

export const userRegex: RegExp = new RegExp(
  '^(?!.*\\.\\.)(?!.*\\.$)[^\\W][\\w.]{0,29}$',
);
