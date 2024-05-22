import { Test, TestingModule } from '@nestjs/testing';
import { SecretNoteController } from './secret-note.controller';
import { SecretNoteService } from './secret-note.service';
import { CreateUpdateSecretNoteDto } from './dto/secret-note.dto';
import { SecretNote } from './entity/secret-note.entity';
import { NotFoundException } from '@nestjs/common';

const mockSecretNote: SecretNote = {
	id: '1',
	note: 'test note',
	createdAt: new Date(),
	updatedAt: new Date(),
	deletedAt: undefined,
};

const mockSecretNoteService = {
	create: jest.fn(),
	findAll: jest.fn(),
	findById: jest.fn(),
	findByIdDecrypted: jest.fn(),
	update: jest.fn(),
	remove: jest.fn(),
};

describe('SecretNoteController', () => {
	let controller: SecretNoteController;
	let service: SecretNoteService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [SecretNoteController],
			providers: [
				{
					provide: SecretNoteService,
					useValue: mockSecretNoteService,
				},
			],
		}).compile();

		controller = module.get<SecretNoteController>(SecretNoteController);
		service = module.get<SecretNoteService>(SecretNoteService);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});

	describe('create', () => {
		it('should create a secret note', async () => {
			const dto: CreateUpdateSecretNoteDto = { note: 'test note' };
			mockSecretNoteService.create.mockResolvedValue(mockSecretNote);

			const result = await controller.create(dto);
			expect(result).toEqual(mockSecretNote);
			expect(service.create).toHaveBeenCalledWith(dto);
		});
	});

	describe('findAll', () => {
		it('should return all secret notes', async () => {
			mockSecretNoteService.findAll.mockResolvedValue(mockSecretNote);

			const result = await controller.findAll();
			expect(result).toEqual(mockSecretNote);
			expect(service.findAll).toHaveBeenCalled();
		});
	});

	describe('findById', () => {
		it('should return a secret note by id', async () => {
			mockSecretNoteService.findById.mockResolvedValue(mockSecretNote);

			const result = await controller.findById('1');
			expect(result).toEqual(mockSecretNote);
			expect(service.findById).toHaveBeenCalledWith('1');
		});

		it('should throw NotFoundException if note not found by id', async () => {
			mockSecretNoteService.findById.mockRejectedValueOnce(
				new NotFoundException(),
			);

			await expect(controller.findById('invalid-id')).rejects.toThrow(
				NotFoundException,
			);
		});
	});

	describe('findByIdDecrypted', () => {
		it('should return a decrypted secret note by id', async () => {
			mockSecretNoteService.findByIdDecrypted.mockResolvedValue(mockSecretNote);

			const result = await controller.findByIdDecrypted('1');
			expect(result).toEqual(mockSecretNote);
			expect(service.findByIdDecrypted).toHaveBeenCalledWith('1');
		});
	});

	describe('update', () => {
		it('should update a secret note', async () => {
			const dto: CreateUpdateSecretNoteDto = { note: 'test note' };
			mockSecretNoteService.update.mockResolvedValue(mockSecretNote);

			const result = await controller.update('1', dto);
			expect(result).toEqual(mockSecretNote);
			expect(service.update).toHaveBeenCalledWith('1', dto);
		});

		it('should throw NotFoundException if note not found during update', async () => {
			const dto: CreateUpdateSecretNoteDto = { note: 'test note' };
			mockSecretNoteService.update.mockRejectedValue(new NotFoundException());

			await expect(controller.update('invalid-id', dto)).rejects.toThrow(
				NotFoundException,
			);
		});
	});

	describe('remove', () => {
		it('should remove a secret note', async () => {
			const note: SecretNote = {
				id: '1',
				note: 'test note',
				createdAt: undefined,
				updatedAt: undefined,
				deletedAt: undefined,
			};
			mockSecretNoteService.remove.mockResolvedValue(note);

			const result = await controller.remove('1');
			expect(result).toEqual(note);
			expect(service.remove).toHaveBeenCalledWith('1');
		});
	});
});
