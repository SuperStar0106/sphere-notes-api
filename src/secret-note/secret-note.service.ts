import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SecretNote } from './entity/secret-note.entity';
import { CreateUpdateSecretNoteDto } from './dto/secret-note.dto';
import { encrypt, decrypt } from '../utils/crypto.utils';

@Injectable()
export class SecretNoteService {
  constructor(
    @InjectRepository(SecretNote)
    private secretNoteRepository: Repository<SecretNote>,
  ) { }

  async create(
    createSecretNoteDto: CreateUpdateSecretNoteDto,
  ): Promise<SecretNote> {
    const encryptedNote = encrypt(createSecretNoteDto.note);
    const secretNote = this.secretNoteRepository.create({
      note: encryptedNote,
    });
    return await this.secretNoteRepository.save(secretNote);
  }

  async findAll(): Promise<SecretNote[]> {
    const secretNotes = await this.secretNoteRepository.find();
    if (!secretNotes || !secretNotes.length) {
      throw new NotFoundException(`No Secret Note`);
    }
    return secretNotes;
  }

  async findById(id: string): Promise<SecretNote> {
    const secretNote = await this.secretNoteRepository.findOne({
      where: { id },
    });
    if (!secretNote) {
      throw new NotFoundException(`Secret Note with ID ${id} not found `);
    }
    return secretNote;
  }

  async findByIdDecrypted(id: string): Promise<SecretNote> {
    const secretNote = await this.secretNoteRepository.findOne({
      where: { id },
    });
    if (!secretNote) {
      throw new NotFoundException(`Secret Note with ID ${id} not found `);
    }

    const decryptedNote = decrypt(secretNote.note);
    const decryptedSecretNote = { ...secretNote, note: decryptedNote };

    return decryptedSecretNote;
  }

  async update(
    id: string,
    updateSecretNoteDto: CreateUpdateSecretNoteDto,
  ): Promise<SecretNote> {
    const encryptedNote = encrypt(updateSecretNoteDto.note);
    const updatedNote = await this.secretNoteRepository.findOne({
      where: { id },
    });

    if (!updatedNote) {
      throw new NotFoundException(`Secret note with ID ${id} not found`);
    }

    await this.secretNoteRepository.upsert({ id: id, note: encryptedNote }, [
      'id',
    ]);
    return updatedNote;
  }

  async remove(id: string): Promise<SecretNote> {
    const secretNote = await this.secretNoteRepository.findOne({
      where: { id },
    });

    await this.secretNoteRepository.softDelete(id);
    return secretNote;
  }
}
