import { DashboardController } from "@/components/Dashboard";
import { DashboardConfigType, QueryConfigType } from "@/models";
import { DashboardControllerProps, DashboardControllerRefs } from "./types";
import {
  ButtonQueryKey,
  LoremQueryKey,
  SquareQueryKey,
} from "@/models/widgets";
import { debounce, delay } from "@/utils/decorators";

function generateId() {
  return Math.floor(Math.random() * 100_000_000_000_000).toString(36);
}

function generateDefaultDashboard(): DashboardConfigType {
  const id = generateId();
  return {
    id,
    name: `Dashboard ${id}`,
    widgets: [
      {
        id: "1",
        type: LoremQueryKey,
        layout: {
          x: 0,
          y: 0,
          w: 3,
          h: 3,
          minH: 3,
          minW: 3,
        },
        query: {
          type: LoremQueryKey,
        },
      },
      {
        id: "2",
        type: ButtonQueryKey,
        layout: { x: 0, y: 0, w: 3, h: 6, minH: 3, minW: 3 },
        query: {
          type: ButtonQueryKey,
        },
      },
      {
        id: "3",
        type: SquareQueryKey,
        layout: { x: 0, y: 0, w: 6, h: 6, minH: 3, minW: 3 },
        query: {
          type: SquareQueryKey,
        },
      },
    ],
  };
}

export class LocalStorageController extends DashboardController<
  DashboardControllerProps,
  DashboardControllerRefs,
  DashboardConfigType
> {
  @delay({ ms: 1000 })
  async loadConfig(): Promise<DashboardConfigType> {
    const storageKey = this.props?.storageKey;
    if (!storageKey) {
      return generateDefaultDashboard();
    }

    try {
      const item = localStorage.getItem(storageKey);
      const result = JSON.parse(item as any);
      if (!result) {
        return generateDefaultDashboard();
      }

      return result;
    } catch (e) {
      console.error(e);
      return generateDefaultDashboard();
    }
  }

  configWillReload(): boolean {
    return this.prevProps?.storageKey !== this.props?.storageKey;
  }

  @debounce({ ms: 100 })
  async flushConfig(config: DashboardConfigType) {
    const storageKey = this.props?.storageKey;
    if (!storageKey) {
      return;
    }

    try {
      localStorage.setItem(storageKey, JSON.stringify(config));
      console.log("flushConfig successfully");
    } catch (e) {
      console.error("flushConfig failed", e);
    }
  }

  merge(
    queryConfig: QueryConfigType,
    props: DashboardControllerProps
  ): QueryConfigType {
    if (queryConfig.type === SquareQueryKey) {
      return {
        ...queryConfig,
        count: props.count,
      };
    }

    return queryConfig;
  }

  @delay({ ms: 600 })
  async query(config: QueryConfigType) {
    if (config.type === LoremQueryKey) {
      return {
        text: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
      };
    }

    if (config.type === ButtonQueryKey) {
      return {
        title: "Random Text",
      };
    }

    if (config.type === SquareQueryKey) {
      return {
        result: (config.count ?? 0) ** 2,
      };
    }

    return null;
  }
}
