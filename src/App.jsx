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
import InvoicePrintModal from './components/InvoicePrintModal.jsx';
import DeleteConfirmModal from './components/DeleteConfirmModal.jsx';
import './index.css';
import toast from 'react-hot-toast';

function App() {
  const [activeTab, setActiveTab] = useState('corporate');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [printModalOpen, setPrintModalOpen] = useState(false);
  const [currentBill, setCurrentBill] = useState(null);

  // Filter states
  const [searchName, setSearchName] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [filterType, setFilterType] = useState('all');

  // Delete confirmation modal states
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [billToDelete, setBillToDelete] = useState(null);

  const dispatch = useDispatch();

  const corporateBills = useSelector((state) => state.billing.corporateBills);
  const eventBills = useSelector((state) => state.billing.eventBills);

  let bills = activeTab === 'corporate' ? corporateBills : eventBills;

  // Apply filters
  bills = bills.filter((bill) => {
    // Name search
    if (searchName && !bill.name?.toLowerCase().includes(searchName.toLowerCase())) return false;

    // Date range
    if (dateFrom && bill.date < dateFrom) return false;
    if (dateTo && bill.date > dateTo) return false;

    // Type filter
    if (filterType !== 'all' && bill.type !== filterType) return false;

    return true;
  });

  const handleCreateNew = () => {
    setCurrentBill(null);
    setEditModalOpen(true);
    toast('Creating new bill...', { icon: '🆕' });
  };

  const handleView = (bill) => {
    setCurrentBill(bill);
    setPrintModalOpen(true);
    toast('Viewing bill...', { icon: '👁️' });
  };

  const handleEdit = (bill) => {
    setCurrentBill(bill);
    setEditModalOpen(true);
    toast('Editing bill...', { icon: '✏️' });
  };

  const handleDelete = (bill) => {
    setBillToDelete(bill);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (!billToDelete) return;

    try {
      if (billToDelete.type === 'corporate') {
        dispatch(deleteCorporateBill(billToDelete.id));
      } else {
        dispatch(deleteEventBill(billToDelete.id));
      }
      toast.success('Bill deleted successfully!');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete bill.');
    }

    setDeleteModalOpen(false);
    setBillToDelete(null);
  };

  const handleSave = (billData) => {
    try {
      if (activeTab === 'corporate') {
        if (billData.id) {
          dispatch(updateCorporateBill(billData));
          toast.success('Corporate Bill updated successfully!');
        } else {
          dispatch(addCorporateBill(billData));
          toast.success('New Corporate Bill created!');
        }
      } else {
        if (billData.id) {
          dispatch(updateEventBill(billData));
          toast.success('Event Bill updated successfully!');
        } else {
          dispatch(addEventBill(billData));
          toast.success('New Event Bill created!');
        }
      }
      setEditModalOpen(false);
      setCurrentBill(null);
    } catch (error) {
      console.error('Bill save error:', error);
      toast.error('Failed to save bill. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-base-200">
      {/* Navbar */}
      <div className="navbar bg-base-100 shadow sticky top-0 z-10">
        <div className="flex-1">
          <span className="text-xl font-bold px-4">Cloud Kitchen Billing Dashboard</span>
        </div>
        <div className="flex-none">
          <button
            className="btn btn-sm btn-ghost text-error"
            onClick={() => {
              if (window.confirm('Clear all saved bills? This cannot be undone.')) {
                localStorage.removeItem('cloud-kitchen-billing-data');
                toast.success('All data cleared!');
                window.location.reload();
              }
            }}
          >
            Clear Data
          </button>
        </div>
      </div>

      <main className="container mx-auto p-4 md:p-8">
        {/* Tabs */}
        <div className="tabs tabs-boxed mb-6 justify-center md:justify-start">
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

        {/* Filters & Search */}
        <div className="card bg-base-100 shadow mb-8">
          <div className="card-body">
            <h3 className="card-title">Filters & Search</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="label">
                  <span className="label-text">Search by Name</span>
                </label>
                <input
                  type="text"
                  placeholder="Type name..."
                  className="input input-bordered w-full"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                />
              </div>

              <div>
                <label className="label">
                  <span className="label-text">From Date</span>
                </label>
                <input
                  type="date"
                  className="input input-bordered w-full"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
              </div>

              <div>
                <label className="label">
                  <span className="label-text">To Date</span>
                </label>
                <input
                  type="date"
                  className="input input-bordered w-full"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                />
              </div>

              <div>
                <label className="label">
                  <span className="label-text">Billing Type</span>
                </label>
                <select
                  className="select select-bordered w-full"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="corporate">Corporate</option>
                  <option value="event">Event</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Bills List */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h2 className="card-title text-2xl">
                {activeTab === 'corporate' ? 'Corporate Bills' : 'Event / Random Bills'}
              </h2>
              <button className="btn btn-primary" onClick={handleCreateNew}>
                + Create New {activeTab === 'corporate' ? 'Corporate' : 'Event'} Bill
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="table table-zebra table-compact w-full">
                <thead>
                  <tr>
                    <th>ID / Invoice</th>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Date</th>
                    <th>Pax / Packages</th>
                    <th>Total (BDT)</th>
                    <th>Amount in Words</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bills.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-10 text-base-content/70 italic">
                        No bills match the filters or no bills created yet.
                      </td>
                    </tr>
                  ) : (
                    bills
                      .filter((bill) => bill && bill.id)
                      .map((bill) => {
                        const totalPersons = bill.lineItems?.reduce(
                          (sum, item) => sum + (parseFloat(item.persons) || 0),
                          0
                        ) || 0;

                        return (
                          <tr key={bill.id} className="cursor-pointer hover" onClick={() => handleView(bill)}>
                            <td className="font-mono">{bill.id.slice(0, 8)}...</td>
                            <td>{bill.name || '—'}</td>
                            <td>
                              <div className={`badge ${bill.type === 'corporate' ? 'badge-primary' : 'badge-secondary'}`}>
                                {bill.type === 'corporate' ? 'Corporate' : 'Event'}
                              </div>
                            </td>
                            <td>{bill.date ? new Date(bill.date).toLocaleDateString('en-GB') : '—'}</td>
                            <td className="text-center font-medium">{totalPersons}</td>
                            <td className="font-medium">
                              {Number(bill.total)?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || '0.00'} BDT
                            </td>
                            <td className="text-sm text-base-content/80 max-w-xs truncate">
                              {bill.amountInWords || '—'}
                            </td>
                            <td className="whitespace-nowrap">
                              <button
                                className="btn btn-sm btn-outline btn-info mr-2 tooltip"
                                data-tip="View Invoice"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleView(bill);
                                }}
                              >
                                👁
                              </button>
                              <button
                                className="btn btn-sm btn-outline btn-warning mr-2 tooltip"
                                data-tip="Edit"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEdit(bill);
                                }}
                              >
                                ✏️
                              </button>
                              <button
                                className="btn btn-sm btn-outline btn-error tooltip"
                                data-tip="Delete"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(bill);
                                }}
                              >
                                🗑
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

      {/* Edit/Create Modal */}
      <BillModal
        key={currentBill?.id || 'new'}
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setCurrentBill(null);
        }}
        onSave={handleSave}
        initialData={currentBill || {}}
        type={activeTab}
      />

      {/* Print/View Invoice Modal */}
      <InvoicePrintModal
        isOpen={printModalOpen}
        onClose={() => {
          setPrintModalOpen(false);
          setCurrentBill(null);
        }}
        bill={currentBill}
      />

      {/* Custom Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setBillToDelete(null);
        }}
        onConfirm={confirmDelete}
        billName={billToDelete?.name}
      />
    </div>
  );
}

export default App;