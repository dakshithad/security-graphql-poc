export class User {
  username: string;
  email: string;
  roles: string[];
  token: string;
  name: string;

  constructor(
    username: string,
    email: string,
    roles: string[],
    name: string,
    token: string,
  ) {
    (this.username = username),
      (this.email = email),
      (this.roles = roles),
      (this.name = name),
      (this.token = token);
  }
}
