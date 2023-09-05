import { Button, Input } from "@chakra-ui/react";
import { useMyDashboardContext } from "./context";

export function RandomText() {
  const { randomText } = useMyDashboardContext();

  return (
    <Button variant={"solid"} color="rebeccapurple">
      {randomText}
    </Button>
  );
}
