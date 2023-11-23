import { Test, TestingModule } from '@nestjs/testing';
import { GameFGateway } from './gamef.gateway';

describe('GameGateway', () => {
  let gateway: GameFGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GameFGateway],
    }).compile();

    gateway = module.get<GameFGateway>(GameFGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
