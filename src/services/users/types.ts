export interface InputUserLogin {
  uname: string;
  upass: string;
  remember: boolean;
}

export interface User {
  uname: string;
  ufirstname: string;
  ulastname: string;
  uperm: number;
}