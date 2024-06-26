import PageHeader from "@/app/shared/page-header";
import { routes } from "@/config/routes";
import { metaObject } from "@/config/site.config";
import HighlightIndex from "../own-fixtures/components/HighlightIndex";

const pageHeader = {
  title: "Manage Live Matches",
  breadcrumb: [
    {
      href: routes.admin.dashboard,
      name: "Dashboard"
    },
    {
      name: "Manage Live"
    }
  ]
};

export const metadata = {
  ...metaObject("Manage Live")
};

export default function Page() {
  return (
    <>
      <PageHeader
        title={pageHeader.title}
        breadcrumb={pageHeader.breadcrumb}
        isLinkBtn={false}
        isLinkBtnText='Add New Live Match'
        href={routes.admin.manageLive.create}
      ></PageHeader>
      <HighlightIndex />
      {/* <LiveMatchIndex /> */}
    </>
  );
}
