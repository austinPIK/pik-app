import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppView from "./pages/AppView";
import OnboardingView from "./pages/OnboardingView";

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<AppView />} />
      <Route path="/app" element={<AppView />} />
      <Route path="/onboard" element={<OnboardingView />} />
    </Routes>
  </BrowserRouter>
);

export default App;
