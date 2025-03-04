import React, { useState, useEffect } from 'react';
import { initialFormData } from '@/app/constants';

import './ItemModal.css';

interface FormData {
  itemNumber: string; 
  description: string;
  lpnNumber: string;
  lotNumber: string;
  status: string;
  location: string;
  cases: string;
  manufacturedDate: string;
  expirationDate: string;
  agingProfile: string;
}

interface SelectedRow {
  item_number: string;
  description: string;
  lpn_number: string;
  lot_number: string;
  status: string;
  location: string;
  cases: string;
  manufactured_date: string;
  expiration_date: string;
  aging_profile: string;
}

interface ItemModalProps {
  closeModal: () => void;
  onSave: (formData: FormData) => void;
  selectedRows: SelectedRow[];
}

const ItemModal: React.FC<ItemModalProps> = ({ closeModal, onSave, selectedRows }) => {
  const [formData, setFormData] = useState<FormData>(initialFormData);

  useEffect(() => {
    if (selectedRows.length === 1) {
      const {
        item_number,
        description,
        lpn_number,
        lot_number,
        status,
        location,
        cases,
        manufactured_date,
        expiration_date,
        aging_profile,
      } = selectedRows[0];
    
      setFormData({
        itemNumber: item_number,
        description,
        lpnNumber: lpn_number,
        lotNumber: lot_number,
        status,
        location,
        cases,
        manufacturedDate: manufactured_date,
        expirationDate: expiration_date,
        agingProfile: aging_profile,
      });
    } else {
      setFormData(initialFormData);
    }
  }, [selectedRows]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const {name, value} = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSave(formData);
    closeModal();
  }

  return (
    <div className='modal' id='item-modal'>
      <div className='modal-container'>
        <span className='close' onClick={closeModal}>
          &times;
        </span>

        <form onSubmit={handleSubmit} id='item-form'>
          <div className='column'>
            <label htmlFor='itemNumber'> Item number: </label>
            <input 
              type='text'
              id='itemNumber'
              name='itemNumber'
              value={formData.itemNumber}
              onChange={handleChange}
              required
            />

<label htmlFor='description'>Description:</label>
            <input
              type='text'
              id='description'
              name='description'
              value={formData.description}
              onChange={handleChange}
              required
            />

            <label htmlFor='lpnNumber'>LPN Number:</label>
            <input
              type='text'
              id='lpnNumber'
              name='lpnNumber'
              value={formData.lpnNumber}
              onChange={handleChange}
              required
            />

            <label htmlFor='lotNumber'>Lot Number:</label>
            <input
              type='text'
              id='lotNumber'
              name='lotNumber'
              value={formData.lotNumber}
              onChange={handleChange}
              required
            />

            <label htmlFor='status'>Status:</label>
            <select
              id='status'
              name='status'
              value={formData.status}
              onChange={handleChange}
            >
              <option value='AVAILABLE'>AVAILABLE</option>
              <option value='EXPIRED'>EXPIRED</option>
              <option value='AVAILABLE CLOSE TO EXPIRATION'>
                AVAILABLE CLOSE TO EXPIRATION
              </option>
              <option value='HOLD'>HOLD</option>
              <option value='QCNS'>QCNS</option>
              <option value='DUMP'>DUMP</option>
              <option value='STAGED'>STAGED</option>
              <option value='SHIPPED'>SHIPPED</option>
            </select>
          </div>

          <div className='column'>
            <label htmlFor='location'>Location:</label>
            <input
              type='text'
              id='location'
              name='location'
              value={formData.location}
              onChange={handleChange}
              required
            />

            <label htmlFor='cases'>Cases:</label>
            <input
              type='text'
              id='cases'
              name='cases'
              value={formData.cases}
              onChange={handleChange}
              required
            />

            <label htmlFor='manufacturedDate'>Manufactured Date:</label>
            <input
              type='date'
              id='manufacturedDate'
              name='manufacturedDate'
              value={formData.manufacturedDate}
              onChange={handleChange}
              required
            />

            <label htmlFor='expirationDate'>Expiration Date:</label>
            <input
              type='date'
              id='expirationDate'
              name='expirationDate'
              value={formData.expirationDate}
              onChange={handleChange}
              required
            />

            <label htmlFor='agingProfile'>Aging Profile:</label>
            <input
              type='text'
              id='agingProfile'
              name='agingProfile'
              value={formData.agingProfile}
              onChange={handleChange}
              required
            />
          </div>

          <input type='submit' value='Save' />
        </form>
      </div>
    </div>
  )
}

export default ItemModal;