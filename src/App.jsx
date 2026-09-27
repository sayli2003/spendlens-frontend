import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Transactions from "./pages/Transactions";
import Analytics from "./pages/Analytics";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/transactions"
          element={<Transactions />}
        />

        <Route
          path="/analytics"
          element={<Analytics />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
