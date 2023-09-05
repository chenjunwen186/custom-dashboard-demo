import { Select } from "@chakra-ui/react";
import { StorageKeyEnum, useMyDashboardContext } from "./context";

export function DashboardMenu() {
  const { storageKey, setStorageKey } = useMyDashboardContext();
  return (
    <Select
      value={storageKey}
      onChange={(e) => setStorageKey(e.target.value as StorageKeyEnum)}
      maxWidth={300}
    >
      <option value={StorageKeyEnum.A}>{StorageKeyEnum.A}</option>
      <option value={StorageKeyEnum.B}>{StorageKeyEnum.B}</option>
      <option value={StorageKeyEnum.C}>{StorageKeyEnum.C}</option>
    </Select>
  );
}
