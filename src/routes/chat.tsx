import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/chat")({
  component: () => <Outlet />,
  beforeLoad: ({ location }) => {
    if (location.pathname === "/chat") throw redirect({ to: "/chat/assistant" });
  },
});
