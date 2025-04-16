import { Outlet } from "react-router-dom";
import "./App.css";
import Header from "./components/header/Header";

function App() {
  return (
    <div className="flex min-h-screen flex-col bg-transparent">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      {/* Optional footer could go here */}
    </div>
  );
}

export default App;
