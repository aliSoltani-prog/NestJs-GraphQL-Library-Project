import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAuthorInput } from './dto/create-author.input';
import { UpdateAuthorInput } from './dto/update-author.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Author } from './entities/author.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthorsService {
  constructor(@InjectRepository(Author) private readonly authorrepo:Repository<Author>){}
  
    create(createAuthorInput: CreateAuthorInput) {
    const newAuthor = this.authorrepo.create(createAuthorInput)
    return this.authorrepo.save(newAuthor)
    }
  
    findAll() {
      return this.authorrepo.find({relations : ['Books']});
    }
  
    async findOne(id: number) {
      const isExist = await this.authorrepo.findOne({where : { id } , relations:['Books']})
      if(!isExist) {throw new HttpException("Author did not found",HttpStatus.BAD_REQUEST)}
      return isExist
    }
  
    async update(id: number, updateAuthorInput: UpdateAuthorInput) {
      const isExist = await this.authorrepo.findOneBy({id : updateAuthorInput.id})
      if(!isExist) {throw new HttpException("Author did not found",HttpStatus.BAD_REQUEST)}
      Object.assign(isExist, updateAuthorInput);
      return this.authorrepo.save(isExist);
    }
  
    async remove(id: number) {
      const isExist = await this.authorrepo.findOneBy({id})
      if(!isExist) {throw new HttpException("Author did not found",HttpStatus.BAD_REQUEST)}
      await this.authorrepo.delete(id)
      return isExist
    }
}
