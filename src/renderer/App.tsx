import { Link, Route, HashRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import ImportTransactions from './ImportTransactions';
import Transactions from './Transactions';

export default function App() {
  return (
    <div>
      <Router>
        <Link to="/">Home</Link>
        <Link to="/import">Import</Link>
        <Routes>
          <Route path="/" element={<Transactions />} />
          <Route path="/import" element={<ImportTransactions />} />
        </Routes>
      </Router>
    </div>
  );
}
