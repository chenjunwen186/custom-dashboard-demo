import { Dashboard, DashboardControllerState } from "@/components/Dashboard";
import {
  ButtonQueryKey,
  LoremQueryKey,
  SquareQueryKey,
} from "@/models/widgets";
import { Center, Spinner, Text } from "@chakra-ui/react";
import { useMemo } from "react";
import { useWindowSize } from "react-use";
import { ButtonWidget } from "./widgets/ButtonWidget";
import { LoremWidget } from "./widgets/LoremWidget";
import { Card } from "./widgets/commons/Card";
import { SquareWidget } from "./widgets/SquareWidget";

const widgetsMap = {
  [LoremQueryKey]: LoremWidget,
  [ButtonQueryKey]: ButtonWidget,
  [SquareQueryKey]: SquareWidget,
};

type MyDashboardProps = {
  state: DashboardControllerState;
};
export function MyDashboard({ state }: MyDashboardProps) {
  const { width: windowWidth } = useWindowSize();
  const dashboardWidth = useMemo(() => {
    if (windowWidth < 768) {
      return 768;
    }

    return windowWidth;
  }, [windowWidth]);

  if (state.isConfigLoading) {
    return (
      <Center height={"300px"}>
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
        />
      </Center>
    );
  }

  return (
    <Dashboard
      widgetsMap={widgetsMap}
      width={dashboardWidth}
      rowHeight={30}
      Loader={Loader}
      ErrorFallback={ErrorFallback}
      breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
      cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
      {...state}
    />
  );
}

function Loader() {
  return (
    <Card>
      <Center height={"100%"} width={"100%"} textAlign={"center"}>
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size={"lg"}
        />
      </Center>
    </Card>
  );
}

function ErrorFallback() {
  return (
    <Card>
      <Center height={"100%"} width={"100%"} textAlign={"center"}>
        <Text fontSize={"3xl"} color="tomato">
          Something went wrong
        </Text>
      </Center>
    </Card>
  );
}
