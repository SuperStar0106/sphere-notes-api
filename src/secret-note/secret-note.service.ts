import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SecretNote } from './entity/secret-note.entity';
import { CreateUpdateSecretNoteDto } from './dto/secret-note.dto';

@Injectable()
export class SecretNoteService {
  constructor(
    @InjectRepository(SecretNote)
    private secretNoteRepository: Repository<SecretNote>,
  ) { }

  async create(
    createSecretNoteDto: CreateUpdateSecretNoteDto,
  ): Promise<SecretNote> {
    try {
      const secretNote = this.secretNoteRepository.create({
        note: createSecretNoteDto.note,
      });
      return await this.secretNoteRepository.save(secretNote);
    } catch (error) {
      throw new InternalServerErrorException(
        'Error creating secret note',
        error.message,
      );
    }
  }

  async findAll(): Promise<SecretNote[]> {
    try {
      const secretNotes = await this.secretNoteRepository.find();
      if (!secretNotes || !secretNotes.length) {
        throw new NotFoundException(`No Secret Note`);
      }
      return secretNotes;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error retrieving secret notes',
        error.message,
      );
    }
  }

  async findById(id: string): Promise<SecretNote> {
    try {
      const secretNote = await this.secretNoteRepository.findOne({
        where: { id },
      });
      if (!secretNote) {
        throw new NotFoundException(`Secret Note with ID ${id} not found `);
      }
      return secretNote;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error retrieving secret note with ID ${id}`,
        error.message,
      );
    }
  }

  async update(
    id: string,
    updateSecretNoteDto: CreateUpdateSecretNoteDto,
  ): Promise<SecretNote> {
    try {
      const updatedNote = await this.secretNoteRepository.findOne({
        where: { id },
      });

      if (!updatedNote) {
        throw new NotFoundException(`Secret note with ID ${id} not found`);
      }

      await this.secretNoteRepository.upsert(
        { id: id, note: updateSecretNoteDto.note },
        ['id'],
      );
      return updatedNote;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error updating secret note with ID ${id}`,
        error.message,
      );
    }
  }

  async remove(id: string): Promise<SecretNote> {
    try {
      const secretNote = await this.secretNoteRepository.findOne({
        where: { id },
      });

      if (!secretNote) {
        throw new NotFoundException(`Secret note with ID ${id} not found`);
      }

      await this.secretNoteRepository.softDelete(id);
      return secretNote;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error removing secret note with ID ${id}`,
        error.message,
      );
    }
  }
}
