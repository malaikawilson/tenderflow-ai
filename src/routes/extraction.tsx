import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/extraction")({
  component: () => <Outlet />,
  beforeLoad: ({ location }) => {
    if (location.pathname === "/extraction") throw redirect({ to: "/extraction/technical" });
  },
});
