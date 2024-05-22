import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { dataSourceOptions } from './typeorm.config';
import { SecretNote } from './secret-note/entity/secret-note.entity';
import { SecretNoteModule } from './secret-note/secret-note.module';

@Module({
	imports: [
		TypeOrmModule.forRootAsync({
			useFactory: () => ({
				...dataSourceOptions,
			}),
		}),
		TypeOrmModule.forFeature([SecretNote]),
		SecretNoteModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule { }
