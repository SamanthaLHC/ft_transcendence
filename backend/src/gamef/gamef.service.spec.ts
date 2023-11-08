import { Test, TestingModule } from '@nestjs/testing';
import { GameFService } from './gamef.service';

describe('GameService', () => {
  let service: GameFService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GameFService],
    }).compile();

    service = module.get<GameFService>(GameFService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
