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

@Controller('secret-notes')
export class SecretNoteController {
  constructor(private readonly secretNoteService: SecretNoteService) { }

  @Post()
  async create(
    @Body() createSecretNotDto: CreateUpdateSecretNoteDto,
  ): Promise<SecretNote> {
    return this.secretNoteService.create(createSecretNotDto);
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
    return await this.secretNoteService.findByIdDecrypted(id);
  }

  @Put('/:id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateSecretNoteDto: CreateUpdateSecretNoteDto,
  ): Promise<SecretNote> {
    return await this.secretNoteService.update(id, updateSecretNoteDto);
  }

  @Delete('/:id')
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<SecretNote> {
    return this.secretNoteService.remove(id);
  }
}
