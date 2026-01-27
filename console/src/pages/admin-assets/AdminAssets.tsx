import Tabs from "../../ui/tabs/Tab";
import { BsSignStop } from "react-icons/bs";
import Permissions from "./admin-assets-components/Permissions";
import { Breadcrumbs } from "../../ui/breadcrumbs/Breadcrumbs";

export default function AdminAssets() {
  const tabData = [
    {
      label: "Permissions",
      value: "permissions",
      icon: <BsSignStop />,
      component: <Permissions />,
    },
  ];
  return (
    <div>
      <Breadcrumbs
        title="Admin Assets"
        breadcrumbs={[
          { label: "Dashboard", path: "/dashboard" },
          { label: "Admin Assets" },
        ]}
      />
      <Tabs tabs={tabData} defaultTab={tabData?.[0]?.value} paramKey="tab" />
    </div>
  );
}
