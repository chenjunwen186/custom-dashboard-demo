export type DashboardControllerProps = {
  storageKey: string;
  count: number;
};

export type DashboardControllerRefs = {
  setFlushConfigAt: (time: string) => void;
};
