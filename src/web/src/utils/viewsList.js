import { lazy } from "react";

const viewsList = {
  AssetsList: lazy(() => import("views/AssetsList")),
  DestributeAndCancelStock: lazy(() =>
    import("views/DestributeAndCancelStock")
  ),
  LendAndReturn: lazy(() => import("views/LendAndReturn")),
  AssetClass: lazy(() => import("views/AssetClass")),
  TagTemplateSetting: lazy(() => import("views/TagTemplateSetting")),
  ScrapManager: lazy(() => import("views/ScrapManager")),
  MaintainManager: lazy(() => import("views/MaintainManager")),
  OrgManager: lazy(() => import("views/OrgManager")),
  PlaceManager: lazy(() => import("views/PlaceManager")),
  EmployeeManager: lazy(() => import("views/EmployeeManager")),

  PersonalInfo: lazy(() => import("views/PersonalInfo")),
  UserManager: lazy(() => import("views/UserManager")),
  InventoryManager: lazy(() => import("views/InventoryManager")),
  AssetTrack: lazy(() => import("views/AssetTrack")),
  AssetMonitor: lazy(() => import("views/AssetMonitor")),
  TagPrint: lazy(() => import("views/TagPrint")),
  DevicePlace: lazy(() => import("views/DevicePlace")),
  StatusMonitor: lazy(() => import("views/StatusMonitor")),
  ProviderManager: lazy(() => import("views/ProviderManager")),
  MaterialList: lazy(() => import("views/MaterialList")),
  MaterialOutAndReturn: lazy(() => import("views/MaterialOutAndReturn")),
  MaterialEnterWarehouse: lazy(() => import("views/MaterialEnterWarehouse")),
  PurchasedList: lazy(() => import("views/PurchasedList")),
  PaymentList: lazy(() => import("views/PaymentList")),
  PaymentHistory: lazy(() => import("views/PaymentHistory")),
  Dashboard: lazy(() => import("views/Dashboard")),
  WarningList: lazy(() => import("views/WarningList")),
  AssetHistory: lazy(() => import("views/AssetHistory")),
  OfflineRecord: lazy(() => import("views/OfflineRecord")),
  AssetWarn: lazy(() => import("views/AssetWarn")),
};
export default viewsList;
