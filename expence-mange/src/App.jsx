import './App.css';
import { Header } from './components/Header';
import { Balence} from './components/Balence';
import { IncomeExpence } from './components/IncomeExpence';
import { TransactionList } from './components/TransactionList';
import { Addtransactions } from './components/Addtransactions';
import { GlobalProvider } from './context/Global';
import { PieChart } from './components/PieChart';
import {Link,Route,Routes} from "react-router-dom"
import { GeminiApi } from './components/GeminiApi';
import { Navigatorhead } from './components/Navigatorhead';



function Home() {
  return (
    <GlobalProvider>
      <div className='NavatGem'>
        <Navigatorhead />
      <div className="fullwithAi">
        

        <div className="root1">
          <div className="expense-tracker-container">
            {/* on the left of the page */}
            <div className="control-panel panel">
              <Header />
              <div className="financial-content">
                <Balence />
                <IncomeExpence />
              </div>
            </div>
            <div className="transaction-form-container">
              <Addtransactions />
            </div>
          </div>
          <div className="roothistory">
            <div className="history-panel panel">
              <TransactionList />
            </div>
            <PieChart />
          </div>
        </div>
        <div>
          <Link to="/zuno">
          <button className='btn1'> Zuno Ai 🤖✨</button>
          </Link>
        </div>
      </div>
      </div>
    </GlobalProvider>
  );
}

function App(){
  return(
    <GlobalProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/zuno" element={<GeminiApi />} />
      </Routes>
    </GlobalProvider>
  );
}

export default App;
