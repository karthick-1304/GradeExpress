import 'bootstrap/dist/css/bootstrap.min.css';
import Home from "./Components/Common_pages/Home";
import {Routes,Route} from "react-router-dom"
import StudentHomePage from './Components/Student/StudentHomePage';
import AboutUs from './Components/Common_pages/AboutUs';
import Contact from './Components/Common_pages/Contact';
import Features from './Components/Common_pages/Features';
function App() {
  return (
    <div className="App">
     <Routes>
        <Route path="/" element={<Home/>}></Route>
        <Route path='/aboutUs' element={<AboutUs/>}></Route>
        <Route path='/contact' element={<Contact/>}></Route>
        <Route path='/login' element={<StudentHomePage/>}></Route>
        <Route path='/features' element={<Features/>}></Route>
        <Route path='/studentHomePage' element={<StudentHomePage/>}></Route>
     </Routes>
    </div>
  );
}

export default App;
