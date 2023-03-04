import { z } from "zod";
import type { CounterColor } from "@/@types/client/counters";
import type { NewRecord } from "@/@types/api/records";

const RecordIncrementValue = z
  .number({
    required_error: "Cannot be empty",
    invalid_type_error: "Cannot be empty",
  })
  .min(1, "Invalid increment");

export const RecordFormSchema = z.object({
  increment: RecordIncrementValue,
  labels: z.array(z.string()),
  description: z.string(),
});

export type CustomIncrementEvent = {
  counterId: number;
  counterColor: CounterColor;
  counterTitle: string;
  latestValue: number;
};

export type NewRecordRequest = NewRecord & {
  labels: Array<string>
}