import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

interface Transaction {
  date: Date;
  type: 'EXPENSE' | 'INCOME' | 'TRANSFER';
  description: string;
  amount: number;
  from: string;
  to: string;
}

function Transactions() {
  const [transactionsList, setTransactionsList] = useState<Transaction[]>([]);
  useEffect(() => {
    async function getData() {
      const data = await window.electron.ipcRenderer.invoke('get-transactions');
      setTransactionsList(data);
      console.log('data :>> ', data);
    }
    getData();
  }, []);

  return (
    <div>
      <h2>Transactions</h2>
      <DataTable value={transactionsList}>
        <Column field="date" header="Date"></Column>
        <Column field="description" header="Description"></Column>
        <Column field="amount" header="Amount"></Column>
        <Column field="from" header="From"></Column>
        <Column field="to" header="To"></Column>
      </DataTable>
    </div>
  );
}

export default Transactions;
