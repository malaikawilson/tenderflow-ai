import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/ingestion")({
  component: () => <Outlet />,
  beforeLoad: ({ location }) => {
    if (location.pathname === "/ingestion") throw redirect({ to: "/ingestion/upload" });
  },
});
