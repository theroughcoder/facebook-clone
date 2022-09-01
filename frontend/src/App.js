import logo from './logo.svg';
import './App.css';

function App() {
  const get = async() =>{
    const res = await fetch('http://localhost:5000') 
    console.log(res)
  }
  get()
  return (
    <div className="App">
   
    </div>
  );
}

export default App;
