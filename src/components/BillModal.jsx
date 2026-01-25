import { useState } from 'react';
import { numberToWordsBDT } from '../utils/numberToWords.js';

const BillModal = ({ isOpen, onClose, onSave, initialData = {}, type = 'corporate' }) => {
  const isCorporate = type === 'corporate';

  const [formData, setFormData] = useState(() => ({
    id: initialData.id || undefined,
    name: initialData.name || '',
    contactPerson: initialData.contactPerson || '',
    contactNo: initialData.contactNo || '',
    date: initialData.date || '',
    lineItems:
      initialData.lineItems && initialData.lineItems.length > 0
        ? initialData.lineItems.map((item) => ({
            ...item,
            lineTotal: (parseFloat(item.persons) || 0) * (parseFloat(item.unitPrice) || 0),
          }))
        : [{ date: '', packageType: '', persons: '', unitPrice: '', lineTotal: 0 }],
  }));

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLineItemChange = (index, field, value) => {
    setFormData((prev) => {
      const newLineItems = [...prev.lineItems];
      newLineItems[index] = { ...newLineItems[index], [field]: value };

      if (field === 'persons' || field === 'unitPrice') {
        const persons = parseFloat(newLineItems[index].persons) || 0;
        const unitPrice = parseFloat(newLineItems[index].unitPrice) || 0;
        newLineItems[index].lineTotal = persons * unitPrice;
      }

      return { ...prev, lineItems: newLineItems };
    });
  };

  const addLineItem = () => {
    setFormData((prev) => ({
      ...prev,
      lineItems: [
        ...prev.lineItems,
        { date: '', packageType: '', persons: '', unitPrice: '', lineTotal: 0 },
      ],
    }));
  };

  const removeLineItem = (index) => {
    if (formData.lineItems.length <= 1) return;
    setFormData((prev) => ({
      ...prev,
      lineItems: prev.lineItems.filter((_, i) => i !== index),
    }));
  };

  const calculateGrandTotal = () => {
    return formData.lineItems.reduce((sum, item) => sum + (item.lineTotal || 0), 0);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Required';
    if (!formData.contactPerson.trim()) newErrors.contactPerson = 'Required';
    if (!formData.contactNo.trim()) newErrors.contactNo = 'Required';
    if (!formData.date) newErrors.date = 'Required';

    formData.lineItems.forEach((item, idx) => {
      if (isCorporate && !item.date) newErrors[`line_${idx}_date`] = 'Required';
      if (!isCorporate && !item.packageName?.trim()) newErrors[`line_${idx}_packageName`] = 'Required';
      if (!item.packageType) newErrors[`line_${idx}_packageType`] = 'Required';
      if (!item.persons || parseFloat(item.persons) <= 0)
        newErrors[`line_${idx}_persons`] = 'Positive number required';
      if (!item.unitPrice || parseFloat(item.unitPrice) < 0)
        newErrors[`line_${idx}_unitPrice`] = 'Valid price required';
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const grandTotal = calculateGrandTotal();

    const billData = {
      ...formData,
      total: grandTotal,
      amountInWords: numberToWordsBDT(grandTotal),
    };

    onSave(billData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box w-11/12 max-w-5xl">
        <h3 className="font-bold text-xl mb-6">
          {initialData.id ? 'Edit' : 'Create'} {isCorporate ? 'Corporate' : 'Event'} Bill
        </h3>

        <form onSubmit={handleSubmit}>
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">
                  {isCorporate ? 'Corporate Name' : 'Event Name'}
                </span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`input input-bordered w-full ${errors.name ? 'input-error' : ''}`}
                placeholder={isCorporate ? 'e.g. X Ltd' : 'e.g. Birthday Party'}
              />
              {errors.name && <span className="text-error text-xs mt-1 block">{errors.name}</span>}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Contact Person</span>
              </label>
              <input
                type="text"
                name="contactPerson"
                value={formData.contactPerson}
                onChange={handleChange}
                className={`input input-bordered w-full ${errors.contactPerson ? 'input-error' : ''}`}
              />
              {errors.contactPerson && <span className="text-error text-xs mt-1 block">{errors.contactPerson}</span>}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Contact No</span>
              </label>
              <input
                type="tel"
                name="contactNo"
                value={formData.contactNo}
                onChange={handleChange}
                className={`input input-bordered w-full ${errors.contactNo ? 'input-error' : ''}`}
                placeholder="017xxxxxxxx"
              />
              {errors.contactNo && <span className="text-error text-xs mt-1 block">{errors.contactNo}</span>}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">
                  {isCorporate ? 'Billing Date' : 'Event Date'}
                </span>
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className={`input input-bordered w-full ${errors.date ? 'input-error' : ''}`}
              />
              {errors.date && <span className="text-error text-xs mt-1 block">{errors.date}</span>}
            </div>
          </div>

          {/* Line Items */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-semibold text-lg">
                {isCorporate ? 'Service Dates & Consumption' : 'Package Items'}
              </h4>
              <button
                type="button"
                className="btn btn-sm btn-success btn-outline"
                onClick={addLineItem}
              >
                + Add Row
              </button>
            </div>

            <div className="overflow-x-auto rounded-box border border-base-300">
              <table className="table table-zebra table-sm">
                <thead>
                  <tr>
                    <th className="w-8">#</th>
                    <th>{isCorporate ? 'Service Date' : 'Package Name'}</th>
                    <th>Package Type</th>
                    {!isCorporate && <th>Description</th>}
                    <th className="w-24">Persons</th>
                    <th className="w-32">Unit Price (BDT)</th>
                    <th className="w-32 text-right">Line Total</th>
                    <th className="w-24"></th>
                  </tr>
                </thead>
                <tbody>
                  {formData.lineItems.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>
                        {isCorporate ? (
                          <input
                            type="date"
                            value={item.date}
                            onChange={(e) => handleLineItemChange(index, 'date', e.target.value)}
                            className={`input input-sm input-bordered w-full ${errors[`line_${index}_date`] ? 'input-error' : ''}`}
                          />
                        ) : (
                          <input
                            type="text"
                            value={item.packageName || ''}
                            onChange={(e) => handleLineItemChange(index, 'packageName', e.target.value)}
                            placeholder="Package-1"
                            className={`input input-sm input-bordered w-full ${errors[`line_${index}_packageName`] ? 'input-error' : ''}`}
                          />
                        )}
                      </td>
                      <td>
                        <select
                          value={item.packageType}
                          onChange={(e) => handleLineItemChange(index, 'packageType', e.target.value)}
                          className={`select select-bordered select-sm w-full ${errors[`line_${index}_packageType`] ? 'select-error' : ''}`}
                        >
                          <option value="">Select</option>
                          <option value="Economy">Economy</option>
                          <option value="Standard">Standard</option>
                          <option value="Premium">Premium</option>
                        </select>
                      </td>
                      {!isCorporate && (
                        <td>
                          <input
                            type="text"
                            value={item.description || ''}
                            onChange={(e) => handleLineItemChange(index, 'description', e.target.value)}
                            placeholder="Chicken + Rice + Salad"
                            className="input input-sm input-bordered w-full"
                          />
                        </td>
                      )}
                      <td>
                        <input
                          type="number"
                          value={item.persons}
                          onChange={(e) => handleLineItemChange(index, 'persons', e.target.value)}
                          min="1"
                          className={`input input-sm input-bordered w-full ${errors[`line_${index}_persons`] ? 'input-error' : ''}`}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={item.unitPrice}
                          onChange={(e) => handleLineItemChange(index, 'unitPrice', e.target.value)}
                          min="0"
                          step="0.01"
                          className={`input input-sm input-bordered w-full ${errors[`line_${index}_unitPrice`] ? 'input-error' : ''}`}
                        />
                      </td>
                      <td className="text-right font-medium">
                        {item.lineTotal?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-sm btn-error btn-outline"
                          onClick={() => removeLineItem(index)}
                          disabled={formData.lineItems.length <= 1}
                        >
                          ×
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="font-bold">
                    <td colSpan={isCorporate ? 6 : 7} className="text-right">
                      Grand Total
                    </td>
                    <td className="text-right text-primary">
                      {calculateGrandTotal().toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} BDT
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Amount in Words */}
          <div className="mt-6 p-4 bg-base-200 rounded-lg">
            <p className="font-medium">
              Amount in Words:{' '}
              <span className="font-bold text-primary">
                {numberToWordsBDT(calculateGrandTotal()) || '—'}
              </span>
            </p>
          </div>

          {/* Actions */}
          <div className="modal-action mt-8">
            <button type="button" className="btn btn-neutral" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={Object.keys(errors).length > 0 || calculateGrandTotal() <= 0}
            >
              {initialData.id ? 'Update Bill' : 'Save Bill'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BillModal;