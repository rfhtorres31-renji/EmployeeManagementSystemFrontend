import './App.css'
import {Routes, Route} from 'react-router-dom';
import EmployeePage from './pages/EmployeePage';



function App() {

  return (
      <Routes>
          <Route path = "/" element={<EmployeePage />} />
      </Routes>       
    )
}

export default App
