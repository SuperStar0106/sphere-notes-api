import { Test, TestingModule } from '@nestjs/testing';
import { SecretNoteService } from './secret-note.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SecretNote } from './entity/secret-note.entity';
import { Repository } from 'typeorm';
import {
	NotFoundException,
	InternalServerErrorException,
} from '@nestjs/common';

const mockSecretNote = {
	id: 'some-uuid',
	note: 'encrypted-note',
	createdAt: new Date(),
	updatedAt: new Date(),
	deletedAt: null,
};

const mockSecretNoteRepository = {
	findOne: jest.fn().mockResolvedValue(mockSecretNote),
	create: jest.fn().mockReturnValue(mockSecretNote),
	save: jest.fn().mockResolvedValue(mockSecretNote),
	find: jest.fn().mockResolvedValue([mockSecretNote]),
	upsert: jest.fn().mockResolvedValue(mockSecretNote),
	softDelete: jest.fn().mockResolvedValue(mockSecretNote),
};

describe('SecretNoteService', () => {
	let service: SecretNoteService;
	let repository: Repository<SecretNote>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				SecretNoteService,
				{
					provide: getRepositoryToken(SecretNote),
					useValue: mockSecretNoteRepository,
				},
			],
		}).compile();

		service = module.get<SecretNoteService>(SecretNoteService);
		repository = module.get<Repository<SecretNote>>(
			getRepositoryToken(SecretNote),
		);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('should create a secret note', async () => {
		const createNoteDto = { note: 'some note' };
		const result = await service.create(createNoteDto);
		expect(result).toEqual(mockSecretNote);
		expect(repository.create).toHaveBeenCalledWith({
			note: 'some note',
		});
		expect(repository.save).toHaveBeenCalledWith(mockSecretNote);
	});

	it('should return all secret notes', async () => {
		const result = await service.findAll();
		expect(result).toEqual([mockSecretNote]);
		expect(repository.find).toHaveBeenCalled();
	});

	it('should return a secret note by id', async () => {
		const result = await service.findById('some-uuid');
		expect(result).toEqual(mockSecretNote);
		expect(repository.findOne).toHaveBeenCalledWith({
			where: { id: 'some-uuid' },
		});
	});

	it('should throw NotFoundException if secret note not found by id', async () => {
		jest.spyOn(repository, 'findOne').mockResolvedValue(null);
		await expect(service.findById('some-uuid')).rejects.toThrow(
			new NotFoundException(`Secret Note with ID some-uuid not found`),
		);
	});

	it('should update a secret note', async () => {
		const updateNoteDto = { note: 'updated note' };
		jest.spyOn(repository, 'findOne').mockResolvedValueOnce(mockSecretNote);
		await service.update('some-uuid', updateNoteDto);

		expect(repository.upsert).toHaveBeenCalledWith(
			{
				id: 'some-uuid',
				note: 'updated note',
				createdAt: mockSecretNote.createdAt,
				updatedAt: mockSecretNote.updatedAt,
				deletedAt: null,
			},
			['id'],
		);
	});

	it('should throw NotFoundException if secret note not found during update', async () => {
		jest.spyOn(repository, 'findOne').mockResolvedValue(null);
		const updateNoteDto = { note: 'updated note' };
		await expect(service.update('some-uuid', updateNoteDto)).rejects.toThrow(
			new NotFoundException(`Secret note with ID some-uuid not found`),
		);
	});

	it('should remove a secret note', async () => {
		jest.spyOn(repository, 'findOne').mockResolvedValueOnce(mockSecretNote); // Ensure findOne returns the mock note
		const result = await service.remove('some-uuid');
		expect(result).toEqual(mockSecretNote);
		expect(repository.softDelete).toHaveBeenCalledWith('some-uuid');
	});

	it('should throw NotFoundException if secret note not found during remove', async () => {
		jest.spyOn(repository, 'findOne').mockResolvedValue(null);
		await expect(service.remove('some-uuid')).rejects.toThrow(
			new NotFoundException('Secret note with ID some-uuid not found'),
		);
	});

	it('should throw InternalServerErrorException when creating note fails', async () => {
		jest.spyOn(repository, 'save').mockRejectedValue(new Error('DB Error'));
		const createNoteDto = { note: 'some note' };
		await expect(service.create(createNoteDto)).rejects.toThrow(
			new InternalServerErrorException(
				'Error creating secret note',
				'DB Error',
			),
		);
	});

	it('should throw InternalServerErrorException when retrieving notes fails', async () => {
		jest.spyOn(repository, 'find').mockRejectedValue(new Error('DB Error'));
		await expect(service.findAll()).rejects.toThrow(
			new InternalServerErrorException(
				'Error retrieving secret notes',
				'DB Error',
			),
		);
	});

	it('should throw InternalServerErrorException when retrieving a note by id fails', async () => {
		jest.spyOn(repository, 'findOne').mockRejectedValue(new Error('DB Error'));
		await expect(service.findById('some-uuid')).rejects.toThrow(
			new InternalServerErrorException(
				`Error retrieving secret note with ID some-uuid`,
				'DB Error',
			),
		);
	});

	it('should throw InternalServerErrorException when updating note fails', async () => {
		jest.spyOn(repository, 'upsert').mockRejectedValue(new Error('DB Error'));
		const updateNoteDto = { note: 'updated note' };
		await expect(service.update('some-uuid', updateNoteDto)).rejects.toThrow(
			new InternalServerErrorException(
				`Error updating secret note with ID some-uuid`,
				'DB Error',
			),
		);
	});

	it('should throw InternalServerErrorException when removing note fails', async () => {
		jest
			.spyOn(repository, 'softDelete')
			.mockRejectedValue(new Error('DB Error'));
		await expect(service.remove('some-uuid')).rejects.toThrow(
			new InternalServerErrorException(
				`Error removing secret note with ID some-uuid`,
				'DB Error',
			),
		);
	});
});
