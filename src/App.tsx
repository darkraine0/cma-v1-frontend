import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";
import Navbar from "./components/Navbar";
import Communities from "./pages/Communities";
import CommunityDetail from "./pages/CommunityDetail";
import Companies from "./pages/Companies";
import CompanyDetail from "./pages/CompanyDetail";
import Dashboard from "./pages/Dashboard";
import ChartPage from "./pages/ChartPage";

function App() {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Communities />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/company/:companyName" element={<CompanyDetail />} />
          <Route path="/community/:communityName" element={<CommunityDetail />} />
          <Route path="/community/:communityName/chart" element={<ChartPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
