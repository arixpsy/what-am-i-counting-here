import { z } from "zod";
import type { CounterColor } from "@/@types/client/counters";

const RecordIncrementValue = z
  .number({
    required_error: "Cannot be empty",
    invalid_type_error: "Cannot be empty",
  })
  .min(1, "Invalid increment");

export const RecordFormSchema = z.object({
  incrementValue: RecordIncrementValue,
  labels: z.array(z.string()),
  description: z.string(),
});

export type CustomIncrementEvent = {
  counterId: number;
  counterColor: CounterColor;
  counterTitle: string;
  latestValue: number;
};