import { Router } from "@funstack/router";
import { route, type RouteDefinition } from "@funstack/router/server";
import { Home } from "./pages/Home";

const routes: RouteDefinition[] = [
  route({
    path: "/",
    component: <Home />,
  }),
];

export default function App() {
  return <Router routes={routes} />;
}
