import "./App.css";
import Footer from "./components/footer/Footer";
import Navbar from "./components/navbar/Navbar";
import AllRoutes from "./routes/AllRoutes";

function App() {
  return (
    <div className="app">
      <Navbar />
      <AllRoutes />
      <Footer />
    </div>
  );
}

export default App;
