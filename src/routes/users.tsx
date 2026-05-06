import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/users")({
  component: () => <Outlet />,
  beforeLoad: ({ location }) => {
    if (location.pathname === "/users") throw redirect({ to: "/users/team" });
  },
});
