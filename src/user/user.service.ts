import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  private users = [
    { id : 1, name: 'Jan', tags: ['tag1', 'tag2']},
    { id : 2, name: 'Kacper', tags: ['tag3', 'tag4']}
  ];

  getUser(name: string)
  {
    return this.users.find(user => user.name === name);
  }
}
