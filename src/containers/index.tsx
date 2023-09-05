import { Button, Divider, HStack } from "@chakra-ui/react";
import { DashboardMenu } from "./DashboardMenu";
import { MyDashboard } from "./MyDashboard";
import { useDashboardController } from "@/components/Dashboard";
import { LocalStorageController } from "./LocalStorageController";
import { useMemo, useState } from "react";
import { StorageKeyEnum, context } from "./context";
import { Counter } from "./Counter";
import { RandomText } from "./RandomText";

export function App() {
  const [count, setCount] = useState(0);
  const [randomText, setRandomText] = useState("");
  const [storageKey, setStorageKey] = useState<StorageKeyEnum>(
    StorageKeyEnum.A
  );
  const [dashboardState, api] = useDashboardController(LocalStorageController, {
    refs: { sayHello: () => {} },
    props: { storageKey, count },
  });

  const value = useMemo(() => {
    return {
      count,
      setCount,
      randomText,
      setRandomText,
      storageKey,
      setStorageKey,
    };
  }, [count, randomText, storageKey]);

  return (
    <context.Provider value={value}>
      <HStack padding="8px">
        <DashboardMenu />
        <Button onClick={api.reload}>Reload</Button>
        <Counter />
        <RandomText />
      </HStack>
      <Divider margin="0 0 8px" />
      <MyDashboard state={dashboardState} />
    </context.Provider>
  );
}
