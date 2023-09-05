import { useQueryData } from "@/components/Dashboard";
import { QueryMap } from "@/models/widgets";
import { Button, Center } from "@chakra-ui/react";
import { Card } from "./commons/Card";
import { useMyDashboardContext } from "../context";

const randomTexts: string[] = [
  "Lorem ipsum",
  "Dolor sit amet",
  "Consectetur adipiscing elit",
  "Sed do eiusmod tempor",
  "Incididunt ut labore et dolore",
  "Magna aliqua",
  "Ut enim ad minim veniam",
  "Quis nostrud exercitation ullamco",
  "Laboris nisi ut aliquip",
  "Ex ea commodo consequat",
];

const getRandomText = () => {
  return randomTexts[Math.floor(Math.random() * randomTexts.length)];
};

export function ButtonWidget() {
  const { title } = useQueryData<QueryMap["button"]>();
  const { setRandomText } = useMyDashboardContext();

  return (
    <Card>
      <Center width={"100%"}>
        <Button
          variant="solid"
          color="blue.600"
          onClick={() => setRandomText(getRandomText())}
        >
          {title}
        </Button>
      </Center>
    </Card>
  );
}
