import { useQueryData } from "@/components/Dashboard";
import { QueryMap } from "@/models/widgets";
import { Button, Center } from "@chakra-ui/react";
import { Card } from "./commons/Card";

export function SquareWidget() {
  const { result } = useQueryData<QueryMap["square"]>();

  return (
    <Card>
      <Center width={"100%"}>
        <Button variant="outline" color="blue.600">
          {result}
        </Button>
      </Center>
    </Card>
  );
}
