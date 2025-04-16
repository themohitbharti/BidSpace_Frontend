import { Outlet } from "react-router-dom";
import "./App.css";
import {Header , Footer} from './components/index'

function App() {
  return (
    <div className="flex min-h-screen flex-col bg-transparent">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer/>
    </div>
  );
}

export default App;
