import { BrowserRouter } from "react-router-dom";
import Providers from "./components/providers/Providers";
import Router from "./routers/Router";

function App() {
  return (
    <BrowserRouter>
      <Providers>
        <Router />
      </Providers>
    </BrowserRouter>
  );
}

export default App;
