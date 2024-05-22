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
      return await this.secretNoteRepository.find();
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
        throw new NotFoundException(`Secret Note with ID ${id} not found`);
      }
      return secretNote;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
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
      const existingNote = await this.secretNoteRepository.findOne({
        where: { id },
      });

      if (!existingNote) {
        throw new NotFoundException(`Secret note with ID ${id} not found`);
      }

      const updatedNote = { ...existingNote, ...updateSecretNoteDto };
      await this.secretNoteRepository.upsert(updatedNote, ['id']);

      return await this.secretNoteRepository.findOne({ where: { id } });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
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
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Error removing secret note with ID ${id}`,
        error.message,
      );
    }
  }
}
