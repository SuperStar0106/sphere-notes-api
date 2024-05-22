import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { dataSourceOptions } from './typeorm.config';
import { SecretNote } from './secret-note/entity/secret-note.entity';
import { SecretNoteModule } from './secret-note/secret-note.module';
import { SecretNoteController } from './secret-note/secret-note.controller';

@Module({
	imports: [
		TypeOrmModule.forRootAsync({
			useFactory: () => ({
				...dataSourceOptions,
			}),
		}),
		SecretNoteModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule { }
