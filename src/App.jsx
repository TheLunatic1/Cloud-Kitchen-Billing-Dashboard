import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  addCorporateBill,
  updateCorporateBill,
  deleteCorporateBill,
  addEventBill,
  updateEventBill,
  deleteEventBill,
} from './features/billing/billingSlice.js';
import BillModal from './components/BillModal.jsx';
import './index.css';

function App() {
  const [activeTab, setActiveTab] = useState('corporate');
  const [modalOpen, setModalOpen] = useState(false);
  const [currentBill, setCurrentBill] = useState(null);

  const dispatch = useDispatch();

  const corporateBills = useSelector((state) => state.billing.corporateBills);
  const eventBills = useSelector((state) => state.billing.eventBills);

  const bills = activeTab === 'corporate' ? corporateBills : eventBills;

  const handleCreateNew = () => {
    setCurrentBill(null);
    setModalOpen(true);
  };

  const handleEdit = (bill) => {
    setCurrentBill(bill);
    setModalOpen(true);
  };

  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this bill?')) return;

    if (activeTab === 'corporate') {
      dispatch(deleteCorporateBill(id));
    } else {
      dispatch(deleteEventBill(id));
    }
  };

  const handleSave = (billData) => {
    if (activeTab === 'corporate') {
      if (billData.id) {
        dispatch(updateCorporateBill(billData));
      } else {
        dispatch(addCorporateBill(billData));
      }
    } else {
      if (billData.id) {
        dispatch(updateEventBill(billData));
      } else {
        dispatch(addEventBill(billData));
      }
    }
    setModalOpen(false);
    setCurrentBill(null);
  };

  return (
    <div className="min-h-screen bg-base-200">
      {/* Navbar */}
      <div className="navbar bg-base-100 shadow sticky top-0 z-10">
        <div className="flex-1">
          <span className="text-xl font-bold px-4">Cloud Kitchen Billing</span>
        </div>
      </div>

      <main className="container mx-auto p-4 md:p-8">
        {/* Tabs */}
        <div className="tabs tabs-boxed mb-8 justify-center md:justify-start">
          <button
            className={`tab text-lg ${activeTab === 'corporate' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('corporate')}
          >
            Corporate Billing
          </button>
          <button
            className={`tab text-lg ${activeTab === 'event' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('event')}
          >
            Event / Random Billing
          </button>
        </div>

        {/* Bills List */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h2 className="card-title text-2xl">
                {activeTab === 'corporate' ? 'Corporate Bills' : 'Event Bills'}
              </h2>
              <button className="btn btn-primary" onClick={handleCreateNew}>
                + Create New {activeTab === 'corporate' ? 'Corporate' : 'Event'} Bill
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Date</th>
                    <th>Total (BDT)</th>
                    <th>Amount in Words</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bills.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-10 text-base-content/70 italic">
                        No bills created yet. Click the button above to start.
                      </td>
                    </tr>
                  ) : (
                    bills.map((bill, index) => {
                      if (!bill || !bill.id) {
                        console.warn('Invalid bill at index', index, bill);
                        return null;
                      }
                      return (
                        <tr key={bill.id}>
                          <td className="font-mono">{bill.id.slice(0, 8)}...</td>
                          <td>{bill.name || '—'}</td>
                          <td>{bill.date ? new Date(bill.date).toLocaleDateString('en-GB') : '—'}</td>
                          <td className="font-medium">
                            {bill.total?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || '0.00'} BDT
                          </td>
                          <td className="text-sm text-base-content/80 max-w-xs truncate">
                            {bill.amountInWords || '—'}
                          </td>
                          <td>
                            <button
                              className="btn btn-sm btn-outline btn-info mr-2"
                              onClick={() => handleEdit(bill)}
                            >
                              View/Edit
                            </button>
                            <button
                              className="btn btn-sm btn-outline btn-error"
                              onClick={() => handleDelete(bill.id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      <BillModal
        key={currentBill?.id || 'new'}
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setCurrentBill(null);
        }}
        onSave={handleSave}
        initialData={currentBill || {}}
        type={activeTab}
      />
    </div>
  );
}

export default App;