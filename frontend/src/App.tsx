import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/route";


import "./App.css";

function App() {
 

  return (
    <>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </>
  );
}

export default App;
