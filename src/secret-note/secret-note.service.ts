import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SecretNote } from 'src/secret-note/entity/secret-note.entity';
import { CreateUpdateSecretNoteDto } from './dto/secret-note.dto';

@Injectable()
export class SecretNoteService {
	constructor(
		@InjectRepository(SecretNote)
		private secretNoteRepository: Repository<SecretNote>
	) {}

	async create(
		createSecretNoteDto: CreateUpdateSecretNoteDto
	): Promise<SecretNote> {
		const secretNote = this.secretNoteRepository.create(createSecretNoteDto);
		return await this.secretNoteRepository.save(secretNote);
	}

	async findAll(): Promise<SecretNote[]> {
		const secretNotes = await this.secretNoteRepository.find();
		if (!secretNotes || !secretNotes.length)
			throw new NotFoundException(`No Secret Note`);
		return secretNotes;
	}

	async findById(id: string): Promise<SecretNote> {
		const secretNote = await this.secretNoteRepository.findOne({
			where: { id },
		});
		if (!secretNote)
			throw new NotFoundException(`Secret Note with ID ${id} not found `);
		return secretNote;
	}

	async update(
		id: string,
		updateSecretNoteDto: CreateUpdateSecretNoteDto
	): Promise<SecretNote> {
		const updatedNote = await this.secretNoteRepository.findOne({
			where: { id },
		});

		if (!updatedNote) {
			throw new NotFoundException(`Secret note with ID ${id} not found`);
		}

		await this.secretNoteRepository.upsert({ id: id, ...updateSecretNoteDto }, [
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
