import { Test, TestingModule } from '@nestjs/testing';
import { AnalysePassportService } from './analyse-passport.service';

describe('AnalysePassportService', () => {
  let service: AnalysePassportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AnalysePassportService],
    }).compile();

    service = module.get<AnalysePassportService>(AnalysePassportService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
