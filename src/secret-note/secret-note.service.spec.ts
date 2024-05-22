import { Test, TestingModule } from '@nestjs/testing';
import { SecretNoteService } from './secret-note.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SecretNote } from './entity/secret-note.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

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

jest.mock('../utils/crypto.utils', () => ({
	encrypt: jest.fn((text: string) => `encrypted-${text}`),
	decrypt: jest.fn((text: string) => text.replace('encrypted-', '')),
}));

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
			note: 'encrypted-some note',
		});
		expect(repository.save).toHaveBeenCalledWith(mockSecretNote);
	});

	it('should return all secret notes', async () => {
		const result = await service.findAll();
		expect(result).toEqual([mockSecretNote]);
		expect(repository.find).toHaveBeenCalled();
	});

	it('should throw NotFoundException if no secret notes found', async () => {
		jest.spyOn(repository, 'find').mockResolvedValue([]);
		await expect(service.findAll()).rejects.toThrow(NotFoundException);
	});

	it('should return a secret note by id', async () => {
		const result = await service.findById('some-uuid');
		expect(result).toEqual(mockSecretNote);
		expect(repository.findOne).toHaveBeenCalledWith({
			where: { id: 'some-uuid' },
		});
	});

	it('should return a decrypted secret note by id', async () => {
		const result = await service.findByIdDecrypted('some-uuid');
		expect(result.note).toBe('note');
		expect(repository.findOne).toHaveBeenCalledWith({
			where: { id: 'some-uuid' },
		});
	});

	it('should update a secret note', async () => {
		const updateNoteDto = { note: 'updated note' };
		const result = await service.update('some-uuid', updateNoteDto);
		expect(result).toEqual(mockSecretNote);
		expect(repository.upsert).toHaveBeenCalledWith(
			{ id: 'some-uuid', note: 'encrypted-updated note' },
			['id'],
		);
	});

	it('should remove a secret note', async () => {
		const result = await service.remove('some-uuid');
		expect(result).toEqual(mockSecretNote);
		expect(repository.softDelete).toHaveBeenCalledWith('some-uuid');
	});

	it('should throw NotFoundException if secret note not found during update', async () => {
		jest.spyOn(repository, 'findOne').mockResolvedValue(null);
		const updateNoteDto = { note: 'updated note' };
		await expect(service.update('some-uuid', updateNoteDto)).rejects.toThrow(
			NotFoundException,
		);
	});

	it('should throw NotFoundException if secret note not found by id', async () => {
		jest.spyOn(repository, 'findOne').mockResolvedValue(null);
		await expect(service.findById('some-uuid')).rejects.toThrow(
			NotFoundException,
		);
	});
});
