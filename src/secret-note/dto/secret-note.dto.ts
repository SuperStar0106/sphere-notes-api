import { IsString, IsNotEmpty } from 'class-validator';

export class CreateUpdateSecretNoteDto {
  @IsString()
  @IsNotEmpty()
  note: string;
}
