export default interface Admin {
  id?: string;
  username: string;
  email: string;
  password?: Password;
}

interface Password {
  hash: string;
}
