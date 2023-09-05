"use client";

import {
  Responsive as ResponsiveGridLayout,
  ResponsiveProps,
} from "react-grid-layout";
import React, {
  MutableRefObject,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { usePrevious } from "react-use";
import isDeepEqual from "react-fast-compare";
import { useQuery } from "@tanstack/react-query";
import {
  DashboardConfigType,
  LayoutConfigType,
  QueryConfigType,
  WidgetConfigType,
} from "@/models";
import { useEvent } from "@/utils";
import { ErrorBoundary } from "react-error-boundary";

type WidgetsMap = Record<string, React.ComponentType>;

type DashboardProps = {
  width: number;
  widgetsMap: WidgetsMap;
  Loader: React.ComponentType;
  ErrorFallback: React.ComponentType;
  onLayoutChange: ResponsiveProps["onLayoutChange"];
} & ResponsiveProps &
  DashboardControllerState;

export function Dashboard({
  widgetsMap,
  config,
  Loader,
  ErrorFallback,
  queriesResult,
  ...gridProps
}: DashboardProps): React.ReactElement | null {
  if (!config) {
    return null;
  }

  return (
    <ResponsiveGridLayout className="layout" {...gridProps}>
      {config.widgets.map((widget) => (
        <div key={widget.id} data-grid={{ ...widget.layout, i: widget.id }}>
          <QueryNode
            queryResult={queriesResult.get(widget.id) ?? null}
            Component={widgetsMap[widget.type]}
            Loader={Loader}
            ErrorFallback={ErrorFallback}
            widget={widget}
          />
        </div>
      ))}
    </ResponsiveGridLayout>
  );
}

type QueryNodeProps = {
  queryResult: Promise<unknown> | null;
  widget: WidgetConfigType;
  Component: React.ComponentType | undefined;
} & Pick<DashboardProps, "Loader" | "ErrorFallback">;
function QueryNode(props: QueryNodeProps) {
  const { queryResult, widget, Component, Loader, ErrorFallback } = props;

  const [data, setData] = useState<unknown>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const latest = useRef({ widgetType: widget.type });
  const _error = useMemo(() => {
    if (!Component) {
      return new Error(`widget ${latest.current.widgetType} not found`);
    }

    return error;
  }, [Component, error]);

  useEffect(() => {
    if (!queryResult) {
      setIsLoading(false);
      setData(null);
      setError(null);
      return;
    }

    (async () => {
      try {
        setIsLoading(true);
        setData(null);
        const data = await queryResult;
        setData(data);
      } catch (e) {
        setError(e as Error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [queryResult, latest]);

  const wrapProvider = (children: ReactNode) => {
    return (
      <WidgetProvider value={{ widget, data, error: _error }}>
        {children}
      </WidgetProvider>
    );
  };

  const wrapErrorBoundary = (children: ReactNode) => {
    return (
      <ErrorBoundary fallback={<ErrorFallback />}>{children}</ErrorBoundary>
    );
  };

  if (_error || !Component) {
    return wrapProvider(<ErrorFallback />);
  }

  if (isLoading) {
    return wrapProvider(wrapErrorBoundary(<Loader />));
  }

  if (!data) {
    return wrapProvider(wrapErrorBoundary(<ErrorFallback />));
  }

  return wrapProvider(wrapErrorBoundary(<Component />));
}

export abstract class DashboardController<
  Props extends Record<string, unknown> = Record<string, unknown>,
  Refs extends Record<string, unknown> = Record<string, unknown>,
  DashboardConfig = unknown,
  QueryConfig = unknown
> {
  config: DashboardConfigType | null = null;
  refs: Refs | null = null;
  props: Props | null = null;
  prevProps: Props | null = null;

  abstract loadConfig(): Promise<DashboardConfig>;
  configWillReload(): boolean {
    return false;
  }

  abstract flushConfig?(config: DashboardConfigType): Promise<void>;

  abstract merge?(queryConfig: QueryConfig, props: Props): QueryConfig;

  abstract query?(query: unknown): Promise<any>;
}

type ControllerOptions<T, K> = {
  props: T;
  refs: K;
  /**
   * @default true
   */
  enabled?: boolean;
};

export type DashboardControllerState = {
  loadConfigError: Error | null;
  isConfigLoading: boolean;
  isConfigFetching: boolean;
  config: DashboardConfigType | null;
  isConfigLoaded: boolean;
  queriesResult: Map<string, Promise<unknown>>;
  onLayoutChange: ResponsiveProps["onLayoutChange"];
};
export type DashboardControllerAPI = {
  reload: () => void;
  refetch: () => void;
};
export function useDashboardController<
  T extends Record<string, unknown> = Record<string, unknown>,
  K extends Record<string, unknown> = Record<string, unknown>
>(
  Controller: new () => DashboardController<T, K>,
  { refs, props, enabled = true }: ControllerOptions<T, K>
): [state: DashboardControllerState, api: DashboardControllerAPI] {
  const prev = usePrevious({
    refs,
    props,
    Controller,
  });
  if (prev?.Controller && prev?.Controller !== Controller) {
    console.warn("The Controller must be immutable");
  }
  const controller = React.useMemo(() => new Controller(), [Controller]);
  controller.refs = refs;
  const [count, setCount] = useState(0);
  const update = useEvent(() => {
    setCount(count + 1);
  });

  const isPropsChanged = !isDeepEqual(prev?.props, props);
  const configKey = useRef(0);
  if (isPropsChanged) {
    controller.prevProps = prev?.props ?? null;
    controller.props = props;
    if (controller.configWillReload?.()) {
      configKey.current++;
    }
  }

  const {
    error: loadConfigError,
    isLoading: isConfigLoading,
    isFetching: isConfigFetching,
    data: config,
    isFetched: isConfigLoaded,
    refetch,
  } = useQuery(
    ["use-dashboard-controller", Controller.name, configKey.current],
    () => {
      return controller.loadConfig();
    },
    {
      enabled,
    }
  );
  controller.config = config as DashboardConfigType;
  const reload = useEvent(() => {
    configKey.current++;
    update();
  });

  const prevConfig = usePrevious(config);
  const isConfigChanged = !isDeepEqual(prevConfig, config);
  if (isConfigChanged) {
    controller.config = config as any;
    if (config) {
      controller.flushConfig?.(config as any);
    }
  }

  type QueriesResult = MutableRefObject<Map<string, Promise<unknown>>>;
  const queriesResult: QueriesResult = useRef(null as any);
  if (queriesResult.current === null) {
    queriesResult.current = new Map();
  }

  type Queries = MutableRefObject<Map<string, unknown>>;
  const queries: Queries = useRef(null as any);
  const getMergedQueries = useEvent((): Map<string, unknown> => {
    const map = new Map<string, unknown>();
    controller.config?.widgets.forEach((widget) => {
      map.set(
        widget.id,
        controller.merge?.(widget.query, props) ?? widget.query
      );
    });
    return map;
  });
  if (queries.current === null) {
    queries.current = getMergedQueries();
  }

  useEffect(() => {
    if (!config) {
      return;
    }

    if (!isConfigChanged && !isPropsChanged) {
      return;
    }

    if (!controller.query) {
      return;
    }

    if (isConfigChanged) {
      queries.current = getMergedQueries();
      for (const [id, query] of queries.current.entries()) {
        queriesResult.current.set(id, controller.query(query));
      }
      update();
      return;
    }

    const nextQueries = getMergedQueries();
    for (const [id, query] of nextQueries.entries()) {
      const prevQuery = queries.current.get(id);
      if (!prevQuery) {
        queriesResult.current.set(id, controller.query(query));
        continue;
      }

      if (isDeepEqual(prevQuery, query)) {
        continue;
      }

      queriesResult.current.set(id, controller.query(query));
      update();
    }

    queries.current = nextQueries;
    update();
  });

  const onLayoutChange: ResponsiveProps["onLayoutChange"] = useEvent(
    (layouts) => {
      if (!controller.flushConfig) {
        return;
      }

      if (!Array.isArray(layouts)) {
        return;
      }

      const config = controller.config;
      if (!config) {
        return;
      }

      const layoutsMap = new Map<string, LayoutConfigType>();
      for (const layout of layouts) {
        layoutsMap.set(layout.i, layout);
      }
      const widgets = config.widgets.map((widget) => {
        const layout = layoutsMap.get(widget.id);

        if (!layout) {
          return widget;
        }

        return {
          ...widget,
          layout,
        };
      });

      controller.flushConfig({
        ...config,
        widgets,
      });
    }
  );

  return [
    {
      loadConfigError: loadConfigError as any,
      isConfigLoading,
      isConfigFetching,
      config: config as any,
      isConfigLoaded,
      queriesResult: queriesResult.current,
      onLayoutChange,
    },
    {
      reload,
      refetch,
    },
  ];
}

type WidgetContextProps = {
  widget: WidgetConfigType;
  data: unknown | null;
  error: Error | null;
};

const context = React.createContext({} as WidgetContextProps);

const WidgetProvider = context.Provider;

export function useQueryData<T>(): T {
  const { data } = useContext(context);
  return data as T;
}

export function useQueryError(): Error | null {
  const { error } = useContext(context);
  return error;
}
