import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService
{
  public users = [];

  async register(name: string, lastName: string, email: string, pass: string)
  {
      const userExist = this.users.find(user => user.email === email);

      if (userExist)
      {
        return { message: 'User with this email already exists' };
      }

      const hashedPassword = await bcrypt.hash(pass, 12);

      this.users.push({id:Date.now().toString(), name:name, lastName:lastName, email:email, password:hashedPassword});

      console.log(this.users);
      return { message: 'User registered successfully' };
  }

  async login(email: string, pass: string)
  {
      const userExist = this.users.find(user => user.email === email);
      if (!userExist)
      {
        return { message: 'User does not exist' };
      }

      const hashedPassword = await bcrypt.hash(pass, 12);

      const validUser = userExist.password === hashedPassword;

      if (validUser)
      {
        return { message: 'User logged successfully' };
      }

      return { message: 'Bad password' };
  }

}
