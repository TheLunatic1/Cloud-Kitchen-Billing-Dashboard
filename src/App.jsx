import { useState } from 'react'
import { useSelector } from 'react-redux'
import './index.css'

function App() {
  const [activeTab, setActiveTab] = useState('corporate')

  const corporateBills = useSelector(state => state.billing.corporateBills)
  const eventBills   = useSelector(state => state.billing.eventBills)

  const bills = activeTab === 'corporate' ? corporateBills : eventBills

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
            className={`tab ${activeTab === 'corporate' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('corporate')}
          >
            Corporate Billing
          </button>
          <button
            className={`tab ${activeTab === 'event' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('event')}
          >
            Event Billing
          </button>
        </div>

        {/* Main content card */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h2 className="card-title text-2xl">
                {activeTab === 'corporate' ? 'Corporate Bills' : 'Event Bills'}
              </h2>
              <button className="btn btn-primary">
                + Create New {activeTab === 'corporate' ? 'Corporate' : 'Event'} Bill
              </button>
            </div>

            {/* Bills list table */}
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Date</th>
                    <th>Total (BDT)</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bills.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-10 text-base-content/70 italic">
                        No bills created yet. Click the button above to start.
                      </td>
                    </tr>
                  ) : (
                    bills.map(bill => (
                      <tr key={bill.id}>
                        <td>{bill.id.slice(0,8)}...</td>
                        <td>{bill.name || '—'}</td>
                        <td>{new Date(bill.date || bill.createdAt).toLocaleDateString()}</td>
                        <td>{bill.total?.toLocaleString() || '0'} BDT</td>
                        <td>
                          <button className="btn btn-sm btn-outline btn-info mr-2">View/Edit</button>
                          <button className="btn btn-sm btn-outline btn-error">Delete</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App