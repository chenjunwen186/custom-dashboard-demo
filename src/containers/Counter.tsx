import {
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from "@chakra-ui/react";
import { useMyDashboardContext } from "./context";

export function Counter() {
  const { count, setCount } = useMyDashboardContext();

  return (
    <NumberInput
      value={count}
      onChange={(_, value) => setCount(value)}
      step={1}
    >
      <NumberInputField />
      <NumberInputStepper>
        <NumberIncrementStepper />
        <NumberDecrementStepper />
      </NumberInputStepper>
    </NumberInput>
  );
}
