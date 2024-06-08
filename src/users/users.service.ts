import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { SignupInput } from '../auth/dto/inputs/signup.input';
import { ValidRoles } from '../auth/enums/valid-roles.enum';
import { UpdateUserInput } from './dto/update-user.input';


@Injectable()
export class UsersService {

  private logger = new Logger('UsersService');

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>
  ){}
  
  //Este método hay que exponerlo para usarlo en el auth, eso se hace en el user.module por medio de los exports como se muestra
  async create(signupInput: SignupInput): Promise<User> {
    try {
      const newUser = this.usersRepository.create({
        ...signupInput,
        password: bcrypt.hashSync(signupInput.password, 10)
      });

      return await this.usersRepository.save(newUser);

    } catch (err) {
      this.handleDBErrors(err);
    }
  }

  async findAll(roles: ValidRoles[]): Promise<User[]> {
    if (roles.length === 0) return this.usersRepository.find({
      /*relations: {
        lastUpdateBy: true  esto carga ese campo, pero no se hizo de esa forma,
        revise el paso 6 en el user.entity del manyToOne
      }*/
    });

    return this.usersRepository.createQueryBuilder()
      .andWhere('ARRAY[roles] && ARRAY[:...roles]')
      //ARRAY[roles] esto busca en el arreglo de roles
      //&& significa que tiene que estar en el array de
      //ARRAY[: quiere decir que se manda un parámetro
      //...roles está diciendo que se esparce y que busque alguno
      .setParameter('roles', roles)
      //setParameter es para mandar el parámetro
      .getMany();
  }

  async findOneByEmail(email: string): Promise<User> {
    try {
      return await this.usersRepository.findOneByOrFail({ email });
    } catch (err) {
      throw new NotFoundException(`${email} not found`);
    }
  }

  async findOneById(id: string): Promise<User> {
    try {
      return await this.usersRepository.findOneByOrFail({ id });
    } catch (err) {
      throw new NotFoundException(`${id} not found`);
    }
  }

  async block(id: string, adminUser: User): Promise<User> {
    const userToBlock = await this.findOneById(id);

    userToBlock.isActive = false;
    userToBlock.lastUpdateBy = adminUser;

    return await this.usersRepository.save(userToBlock);
  }

  async update(id: string, updateUserInput: UpdateUserInput, updateBy: User): Promise<User> {
    try {
      const user = await this.usersRepository.preload({
        ...updateUserInput,
        id
      });

      user.lastUpdateBy = updateBy;

      return await this.usersRepository.save(user);

    } catch (err) {
      this.handleDBErrors(err);
    }
  }

  private handleDBErrors(err: any): never {
    //never indica que una vez que entra no regresa nada, todos los caminos generan una excepción

    this.logger.error(err);
    
    if (err.code  === '23505') {
      throw new BadRequestException(err.detail.replace('Key ', ''));
    }

    throw new InternalServerErrorException('Please check server logs');
  }
}
