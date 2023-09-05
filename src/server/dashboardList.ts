import { DashboardConfigList } from "@/models";
import { procedure } from "./trpc";
import { configListData } from "./mockData";
import { sleep } from "@/utils";

export const dashboardConfigList = procedure
  .input({})
  .output(DashboardConfigList)
  .query(() => {
    sleep({ ms: 600 });
    return configListData;
  });
