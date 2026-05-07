import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/clauses")({
  component: () => <Outlet />,
  beforeLoad: ({ location }) => {
    if (location.pathname === "/clauses") throw redirect({ to: "/extraction/clauses" });
  },
});
