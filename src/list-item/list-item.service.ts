import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateListItemInput } from './dto/create-list-item.input';
import { UpdateListItemInput } from './dto/update-list-item.input';
import { ListItem } from './entities/list-item.entity';
import { List } from '../lists/entities/list.entity';
import { PaginationArgs, SearchArgs } from '../common/dto/args';

@Injectable()
export class ListItemService {

  constructor(
    @InjectRepository(ListItem)
    private readonly listItemsRepository: Repository<ListItem>
  ){}

  async create(createListItemInput: CreateListItemInput): Promise<ListItem> {
    const { itemId, listId, ...rest } = createListItemInput;


    const newListItem = this.listItemsRepository.create({
      ...rest,
      item: { id: itemId},
      list: { id: listId }
    });

    await this.listItemsRepository.save(newListItem);

    return this.findOne(newListItem.id);
  }

  async findAll(
    list: List,
    paginationArgs: PaginationArgs,
    searchArgs: SearchArgs
  ): Promise<ListItem[]> {
    const { limit, offset } = paginationArgs;

    const { search } = searchArgs;

    const queryBuilder = this.listItemsRepository.createQueryBuilder('listItem')
      .innerJoin('listItem.item', 'item')
      .take(limit)
      .skip(offset)
      .where(`"listId" = :listId`, { listId: list.id });
    
    if (search) {
      queryBuilder.andWhere('LOWER(item.name) like :name', { name: `%${search.toLowerCase()}%`});
    }

    return queryBuilder.getMany(); 
  }

  async findOne(id: string): Promise<ListItem> {
    const listItem = this.listItemsRepository.findOneBy({ id });

    if(!listItem) throw new NotFoundException(`List item with id ${id} not found`);

    return listItem;
  }

  async update(
    id: string, updateListItemInput: UpdateListItemInput
  ): Promise<ListItem> {
    const { listId, itemId, ...rest } = updateListItemInput;

    const queryBuilder = this.listItemsRepository.createQueryBuilder()
      .update() //.update permite encadenar en el querybuilder
      .set(rest) //.set actualiza los campos que necesitamos
      .where('id = :id', { id })

    if (listId) queryBuilder.set({ list: { id: listId }});
    if (itemId) queryBuilder.set({ item: { id: itemId }});

    await queryBuilder.execute();

    return this.findOne(id);

    /*const listItem = await this.listItemsRepository.preload({
      ...rest,
      list: { id: listId },
      item: { id: itemId }
    });

    if (!listItem) throw new NotFoundException(`List item with id ${id} not found`);

    return this.listItemsRepository.save(listItem);*/
  }

  async countListItemsByList(list: List): Promise<number> {
    return this.listItemsRepository.count({
      where: {
        list: {
          id: list.id
        }
      }
    });
  }
}
