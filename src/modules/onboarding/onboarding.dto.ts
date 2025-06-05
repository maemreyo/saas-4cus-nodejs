import { z } from 'zod';

export class StartOnboardingDTO {
  static schema = z.object({
    flowId: z.string(),
    context: z.record(z.any()).optional()
  });

  flowId!: string;
  context?: Record<string, any>;
}

export class CompleteStepDTO {
  static schema = z.object({
    stepId: z.string(),
    data: z.any().optional()
  });

  stepId!: string;
  data?: any;
}

export class GetHintsDTO {
  page!: string;
}