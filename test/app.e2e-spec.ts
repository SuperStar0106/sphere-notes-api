import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { typeOrmTestConfig } from './../src/typeorm.test.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SecretNote } from './../src/secret-note/entity/secret-note.entity';
import { SecretNoteModule } from './../src/secret-note/secret-note.module';
import { decrypt } from './../src/utils/crypto.utils';

describe('SecretNoteController (e2e)', () => {
	let app: INestApplication;
	let initialNotesCount: number;
	let createdNoteId: string;
	const testNote = { note: 'This is a secret note' };
	const updatedNote = { note: 'This is an updated secret note' };

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [
				TypeOrmModule.forRootAsync({
					useFactory: () => ({
						...typeOrmTestConfig,
					}),
				}),
				TypeOrmModule.forFeature([SecretNote]),
				SecretNoteModule,
			],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	});

	afterAll(async () => {
		await app.close();
	});

	it('should perform CRUD operations on secret notes', async () => {
		// Step 1: Retrieve all notes
		await request(app.getHttpServer())
			.get('/secret-notes')
			.expect((res) => {
				if (res.status === 200) {
					expect(Array.isArray(res.body)).toBe(true);
					initialNotesCount = res.body.length;
				} else if (res.status === 404) {
					initialNotesCount = 0;
				} else {
					throw new Error('Unexpected resonse status');
				}
			});

		// Step 2: Post a new note
		const createResponse = await request(app.getHttpServer())
			.post('/secret-notes')
			.send(testNote)
			.expect(201);

		createdNoteId = createResponse.body.id;
		expect(createdNoteId).toBeDefined();

		// Verify the count of notes has increased by one
		const postCreateResponse = await request(app.getHttpServer())
			.get('/secret-notes')
			.expect(200);

		expect(postCreateResponse.body.length).toBe(initialNotesCount + 1);

		// Step 3: Retrieve the newly added note by ID
		const getResponse = await request(app.getHttpServer())
			.get(`/secret-notes/${createdNoteId}`)
			.expect(200);

		expect(getResponse.body.id).toBe(createdNoteId);
		expect(decrypt(getResponse.body.note)).toBe(testNote.note); // Ensure it's encrypted as a correct value

		// Step 4: Decrypt the note and verify content
		console.log('createdNoteId: ', createdNoteId);
		const decryptResponse = await request(app.getHttpServer())
			.get(`/secret-notes/${createdNoteId}/decrypted`)
			.expect(200);
		console.log('encryptedResponse: ', decryptResponse.body.note);

		expect(decryptResponse.body.id).toBe(createdNoteId);
		expect(decryptResponse.body.note).toBe(testNote.note);

		// Step 5: Update the specific note
		await request(app.getHttpServer())
			.put(`/secret-notes/${createdNoteId}`)
			.send(updatedNote)
			.expect(200);

		const updatedDecryptResponse = await request(app.getHttpServer())
			.get(`/secret-notes/${createdNoteId}/decrypted`)
			.expect(200);

		expect(updatedDecryptResponse.body.note).toBe(updatedNote.note);

		// Step 6: Delete the specific note
		await request(app.getHttpServer())
			.delete(`/secret-notes/${createdNoteId}`)
			.expect(200);

		await request(app.getHttpServer())
			.get(`/secret-notes/${createdNoteId}`)
			.expect(404);
	});
});
