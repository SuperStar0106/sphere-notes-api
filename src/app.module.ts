import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SecretNoteModule } from './secret-note/secret-note.module';

@Module({
	imports: [SecretNoteModule],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule { }
