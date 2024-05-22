import { Test, TestingModule } from '@nestjs/testing';
import { SecretNoteController } from './secret-note.controller';

describe('SecretNoteController', () => {
  let controller: SecretNoteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SecretNoteController],
    }).compile();

    controller = module.get<SecretNoteController>(SecretNoteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
