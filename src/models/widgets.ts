import { z } from "zod";

export const LoremQueryKey = "lorem";
export const ButtonQueryKey = "button";
export const SquareQueryKey = "square";

export const Lorem = z.object({
  type: z.literal(LoremQueryKey),
});
export const Button = z.object({
  type: z.literal(ButtonQueryKey),
});
export const Square = z.object({
  type: z.literal(SquareQueryKey),
  count: z.number().optional(),
});

export type QueryMap = {
  [LoremQueryKey]: {
    text: string;
  };
  [ButtonQueryKey]: {
    title: string;
  };
  [SquareQueryKey]: {
    result: number;
  };
};
