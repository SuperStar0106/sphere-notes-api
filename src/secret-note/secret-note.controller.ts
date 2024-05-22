import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  ParseUUIDPipe,
} from '@nestjs/common';
import { SecretNoteService } from './secret-note.service';
import { CreateUpdateSecretNoteDto } from './dto/secret-note.dto';
import { SecretNote } from './entity/secret-note.entity';
import { encrypt, decrypt } from '../utils/crypto.utils';

@Controller('secret-notes')
export class SecretNoteController {
  constructor(private readonly secretNoteService: SecretNoteService) { }

  @Post()
  async create(
    @Body() createSecretNotDto: CreateUpdateSecretNoteDto,
  ): Promise<SecretNote> {
    const encryptedNoteDto = {
      ...createSecretNotDto,
      note: encrypt(createSecretNotDto.note),
    };
    return this.secretNoteService.create(encryptedNoteDto);
  }

  @Get('/')
  async findAll(): Promise<SecretNote[]> {
    return this.secretNoteService.findAll();
  }

  @Get('/:id')
  async findById(@Param('id', ParseUUIDPipe) id: string): Promise<SecretNote> {
    return await this.secretNoteService.findById(id);
  }

  @Get('/:id/decrypted')
  async findByIdDecrypted(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<SecretNote> {
    const secretNote = await this.secretNoteService.findById(id);
    return { ...secretNote, note: decrypt(secretNote.note) };
  }

  @Put('/:id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateSecretNoteDto: CreateUpdateSecretNoteDto,
  ): Promise<SecretNote> {
    const encryptedNoteDto = {
      ...updateSecretNoteDto,
      note: encrypt(updateSecretNoteDto.note),
    };
    return await this.secretNoteService.update(id, encryptedNoteDto);
  }

  @Delete('/:id')
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<SecretNote> {
    return this.secretNoteService.remove(id);
  }
}
