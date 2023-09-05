import React from "react";

export type DashboardState = {
  randomText: string;
  setRandomText: (text: string) => void;
  storageKey: StorageKeyEnum;
  setStorageKey: (key: StorageKeyEnum) => void;
  count: number;
  setCount: (count: number) => void;
};
export const context = React.createContext({} as DashboardState);

export function useMyDashboardContext(): DashboardState {
  return React.useContext(context);
}

export enum StorageKeyEnum {
  A = "Dashboard-A",
  B = "Dashboard-B",
  C = "Dashboard-C",
}
