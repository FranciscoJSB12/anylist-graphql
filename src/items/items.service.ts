import { Injectable, NotFoundException } from '@nestjs/common';
import { Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateItemInput, UpdateItemInput } from './dto/inputs';
import { Item } from './entities/item.entity';
import { User } from '../users/entities/user.entity';
import { PaginationArgs, SearchArgs } from '../common/dto/args';

@Injectable()
export class ItemsService {

  constructor(
    @InjectRepository(Item) // este decorador injectrepositorio es necesario para que pueda funcionar item repository
    private readonly itemsRepository: Repository<Item>
  ){}

  async create(createItemInput: CreateItemInput, user: User): Promise<Item> {
    const newItem = this.itemsRepository.create({...createItemInput, user });
    return await this.itemsRepository.save(newItem);
  }

  async findAll(user: User, paginationArgs: PaginationArgs, searchArgs: SearchArgs): Promise<Item[]> {

    const { limit, offset } = paginationArgs;

    const { search } = searchArgs;

    const queryBuilder = this.itemsRepository.createQueryBuilder()
      .take(limit)
      .skip(offset)
      .where(`"userId" = :userId`, { userId: user.id });
      //Las comillas dobles indican que se quiere el campo userId y no el objeto usuario, luego con :userId se manda el argumento
    
    if (search) {
      queryBuilder.andWhere('LOWER(name) like :name', { name: `%${search.toLowerCase()}%`});
    }

    return queryBuilder.getMany(); 

    /*return await this.itemsRepository.find({
      take: limit,
      skip: offset,
      where: {
        user: {
          id: user.id
        },
        name: Like(`%${search}%`),
      }
    });
    Esta es una forma de hacerlo, pero tiene ventajas como el hecho de que va a distinguir mayuculas de minúsculas en la búsqueda
    */
  }

  async findOne(id: string, user: User) {
    const item = await this.itemsRepository.findOneBy({ id, user: {
        id: user.id,
      }
    });//Al aplicar la intsrucción de esta forma es como decir where id sea tal y user sea tal

    if (!item) throw new NotFoundException(`Item with id ${id} not found`);

    return item;
  }

  async update(id: string, updateItemInput: UpdateItemInput, user: User):Promise<Item> {
    await this.findOne(id, user);

    //const item = await this.itemsRepository.preload({...updateItemInput, user}); lo podemos hacer así también en vez de colocar el lazy en el item entity
    const item = await this.itemsRepository.preload(updateItemInput);

    if (!item) throw new NotFoundException(`Item with id ${updateItemInput.id} not found`);
    
    return await this.itemsRepository.save(item);
  }

  async remove(id: string, user: User): Promise<Item> {
    const item = await this.findOne(id, user);

    await this.itemsRepository.remove(item);

    return { ...item, id };
  }

  async itemCountByUser(user: User): Promise<number> {
    return this.itemsRepository.count({
      where: {
        user: {
          id: user.id
        }
      }
    });
  }
}
