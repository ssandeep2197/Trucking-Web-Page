import Home from "./pages/Home";
import Logistics from "./pages/Logistics";
import Crypto from "./pages/Crypto";
import Admin from "./pages/Admin";
import { SiteConfigProvider } from "./lib/siteConfig";
import { useRoute } from "./lib/router";
import ErrorBoundary from "./components/ErrorBoundary";

export default function App() {
  const route = useRoute();
  return (
    <ErrorBoundary>
      <SiteConfigProvider>
        {route === "home" && <Home />}
        {route === "logistics" && <Logistics />}
        {route === "crypto" && <Crypto />}
        {route === "admin" && <Admin />}
      </SiteConfigProvider>
    </ErrorBoundary>
  );
}
