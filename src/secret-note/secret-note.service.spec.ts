import { Test, TestingModule } from '@nestjs/testing';
import { SecretNoteService } from './secret-note.service';

describe('SecretNoteService', () => {
  let service: SecretNoteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SecretNoteService],
    }).compile();

    service = module.get<SecretNoteService>(SecretNoteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
