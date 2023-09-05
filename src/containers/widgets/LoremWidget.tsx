import { useQueryData } from "@/components/Dashboard";
import { QueryMap } from "@/models/widgets";
import { Text } from "@chakra-ui/react";
import { Card } from "./commons/Card";

export function LoremWidget() {
  const { text } = useQueryData<QueryMap["lorem"]>();

  return (
    <Card>
      <Text>{text}</Text>
    </Card>
  );
}
