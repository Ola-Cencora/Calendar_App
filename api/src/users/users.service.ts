import { Injectable } from '@nestjs/common';

export type User = {
  userId: number;
  username: string;
  password: string;
};

//mockData
const users: User[] = [
  {
    userId: 1,
    username: 'user1',
    password: 'password1',
  },
  {
    userId: 2,
    username: 'user2',
    password: 'password2',
  },
];

@Injectable()
export class UsersService {
  async findUserByName(username: string): Promise<User | undefined> {
    return users.find((user) => user.username === username);
  }
}
