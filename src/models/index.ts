import { z } from "zod";
import * as QueryTypes from "./widgets";

export const LayoutConfig = z.object({
  x: z.number(),
  y: z.number(),
  w: z.number(),
  h: z.number(),
  minW: z.number().optional(),
  maxW: z.number().optional(),
  minH: z.number().optional(),
  maxH: z.number().optional(),
  isDraggable: z.boolean().optional(),
  isResizable: z.boolean().optional(),
  isBounded: z.boolean().optional(),
});

export type LayoutConfigType = z.infer<typeof LayoutConfig>;

export const QueryConfig = z.union([
  QueryTypes.Lorem,
  QueryTypes.Button,
  QueryTypes.Square,
]);

export type QueryConfigType = z.infer<typeof QueryConfig>;

export const WidgetConfig = z.object({
  id: z.string(),
  type: z.string(),
  query: QueryConfig.optional(),
  layout: LayoutConfig,
});

export type WidgetConfigType = z.infer<typeof WidgetConfig>;

export const DashboardConfig = z.object({
  id: z.string(),
  name: z.string(),
  widgets: z.array(WidgetConfig),
});

export type DashboardConfigType = z.infer<typeof DashboardConfig>;

export const DashboardItemConfig = z.object({
  id: z.string(),
  name: z.string(),
});

export type DashboardItemConfigType = z.infer<typeof DashboardItemConfig>;

export const DashboardConfigList = z.object({
  defaultId: z.string(),
  items: z.array(DashboardItemConfig),
});

export type DashboardConfigListType = z.infer<typeof DashboardConfigList>;
