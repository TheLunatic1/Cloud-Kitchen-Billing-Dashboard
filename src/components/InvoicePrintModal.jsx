import { useRef, useState } from 'react';

const InvoicePrintModal = ({ isOpen, onClose, bill }) => {
  const printRef = useRef();
  const [isPrinting, setIsPrinting] = useState(false);

  if (!isOpen || !bill) return null;

  const handlePrint = () => {
    if (!printRef.current) return;

    setIsPrinting(true);

    const printContent = printRef.current.innerHTML;
    const originalContents = document.body.innerHTML;

    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContents;

    // delay to show spinner a lil bit longer
    setTimeout(() => {
      setIsPrinting(false);
      window.location.reload();
    }, 800);
  };

  const totalPersons = bill.lineItems?.reduce(
    (sum, item) => sum + (parseFloat(item.persons) || 0),
    0
  ) || 0;

  const isCorporate = bill.type === 'corporate';

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-4xl w-11/12 bg-white p-0">
        <div
          ref={printRef}
          className="p-6 md:p-10 bg-white text-black print:bg-white print:text-black print:p-8"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-black">Cloud Kitchen Billing</h1>
            <p className="text-lg md:text-xl mt-2 text-black">MetroChef</p>
            <p className="text-xl md:text-2xl font-semibold mt-6 text-black">
              {isCorporate ? 'Corporate Bill' : 'Event / Random Bill'}
            </p>
          </div>

          {/* Bill Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-8 text-black">
            <div className="space-y-1.5">
              <p className="font-medium text-black">
                <strong>{isCorporate ? 'Corporate Name' : 'Event Name'}:</strong> {bill.name || '—'}
              </p>
              <p className="font-medium text-black">
                <strong>Contact Person:</strong> {bill.contactPerson || '—'}
              </p>
              <p className="font-medium text-black">
                <strong>Contact No:</strong> {bill.contactNo || '—'}
              </p>
            </div>
            <div className="text-right space-y-1.5">
              <p className="font-medium text-black">
                <strong>Date:</strong> {bill.date ? new Date(bill.date).toLocaleDateString('en-GB') : '—'}
              </p>
              <p className="font-medium text-black">
                <strong>Invoice No:</strong> {bill.id?.slice(0, 8) || '—'}...
              </p>
              <p className="font-medium text-black">
                <strong>{isCorporate ? 'Total Persons / Pax' : 'Total Packages / Persons'}:</strong> {totalPersons}
              </p>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="mb-8 overflow-x-auto">
            <table className="w-full border-collapse border border-black text-black print:border-black text-sm md:text-base">
              <thead className="bg-white print:bg-white">
                <tr className="font-bold text-black">
                  <th className="border border-black px-3 py-2 md:px-4 md:py-3 text-center">Sl. No.</th>
                  <th className="border border-black px-3 py-2 md:px-4 md:py-3">
                    {isCorporate ? 'Date' : 'Package Name'}
                  </th>
                  <th className="border border-black px-3 py-2 md:px-4 md:py-3">Package Type</th>
                  {!isCorporate && (
                    <th className="border border-black px-3 py-2 md:px-4 md:py-3">Description</th>
                  )}
                  <th className="border border-black px-3 py-2 md:px-4 md:py-3 text-center">Persons</th>
                  <th className="border border-black px-3 py-2 md:px-4 md:py-3 text-right">Unit Price (BDT)</th>
                  <th className="border border-black px-3 py-2 md:px-4 md:py-3 text-right">Total BDT</th>
                </tr>
              </thead>
              <tbody className="text-black">
                {bill.lineItems.map((item, index) => (
                  <tr key={index}>
                    <td className="border border-black px-3 py-2 md:px-4 md:py-3 text-center font-medium">
                      {index + 1}
                    </td>
                    <td className="border border-black px-3 py-2 md:px-4 md:py-3">
                      {isCorporate ? item.date : item.packageName}
                    </td>
                    <td className="border border-black px-3 py-2 md:px-4 md:py-3">{item.packageType || '—'}</td>
                    {!isCorporate && (
                      <td className="border border-black px-3 py-2 md:px-4 md:py-3">{item.description || '—'}</td>
                    )}
                    <td className="border border-black px-3 py-2 md:px-4 md:py-3 text-center">
                      {item.persons || '—'}
                    </td>
                    <td className="border border-black px-3 py-2 md:px-4 md:py-3 text-right">
                      {Number(item.unitPrice).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="border border-black px-3 py-2 md:px-4 md:py-3 text-right font-medium">
                      {Number(item.lineTotal).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="font-bold text-black bg-white print:bg-white">
                  <td
                    colSpan={isCorporate ? 5 : 6}
                    className="border border-black px-3 py-3 md:px-4 md:py-4 text-right"
                  >
                    Total Amount
                  </td>
                  <td className="border border-black px-3 py-3 md:px-4 md:py-4 text-right font-bold">
                    {Number(bill.total).toLocaleString('en-US', { minimumFractionDigits: 2 })} BDT
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Amount in Words */}
          <div className="mb-10">
            <p className="text-lg md:text-xl font-bold text-black">
              Amount in Words: <span className="font-bold text-black">{bill.amountInWords || '—'}</span>
            </p>
          </div>

          {/* Signature */}
          <div className="text-right mt-12 md:mt-16">
            <p className="border-t-2 border-black w-64 md:w-72 inline-block text-center pt-4 md:pt-6 text-base md:text-lg font-medium text-black">
              Sincerely,<br />
              M. Mustafizur Rahman<br />
              CEO, MetroChef
            </p>
          </div>
        </div>

        {/* Screen-only actions */}
        <div className="modal-action p-4 md:p-6 bg-base-100 print:hidden">
          <button className="btn btn-neutral btn-sm md:btn-md" onClick={onClose}>
            Close
          </button>
          <button
            className="btn btn-primary btn-sm md:btn-md"
            onClick={handlePrint}
            disabled={isPrinting}
          >
            {isPrinting ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Printing...
              </>
            ) : (
              'Print / Save as PDF'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoicePrintModal;