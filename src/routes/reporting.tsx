import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/reporting")({
  component: () => <Outlet />,
  beforeLoad: ({ location }) => {
    if (location.pathname === "/reporting") throw redirect({ to: "/reporting/summary" });
  },
});
