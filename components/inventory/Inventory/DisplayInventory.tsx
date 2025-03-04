import React, { useEffect, useState } from 'react';
import { getDatabase, ref, get, set, remove, update, query, orderByChild, equalTo, push } from '@firebase/database';
import { firebase, db } from '@/app/lib/firebase';
import { toast, useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';

import { InventoryItem } from './types/InventoryItem';
import InventoryToolbar from './InventoryToolbar';
import ItemModal from './ItemModal';


interface Product {
  id: string;
  item: string;
  description: string;
  location: string;
  status: string;
}

const DisplayInventory: React.FC = () => {
  const { toast } = useToast();

  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [actionModifier, setActionModifier] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;
  const [modifier, setModifier] = useState<string>('');
  const [selectedRows, setSelectedRows] = useState<InventoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const fetchInventory = async () => {
    try {
      const inventoryRef = ref(db, 'inventory');
      let dbQuery = query(inventoryRef, orderByChild(modifier));

      if (searchTerm) {
        dbQuery = query(inventoryRef, orderByChild(modifier), equalTo(searchTerm));
      }

      const snapshot = await get(dbQuery);
      if (snapshot.exists()) {
        const data = snapshot.val();
        const itemList: InventoryItem[] = Object.keys(data).map((key) => ({
          id: key,
          ...data[key]
        }));

        setInventory(itemList.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));
      } else {
        setInventory([]);
      }
    } catch(error) {
      console.error('Error fetching inventory:', error);
    }
  }

  useEffect(() => {
    fetchInventory();
  }, [currentPage, searchTerm]);

  const closeModal = () => {
    setIsOpen(false);
  };

  const onSave = async(formData: InventoryItem) => {
    const {
      item_number,
      description,
      lpn_number,
      lot_number,
      status,
      location,
    } = formData;

    const item: InventoryItem = {
      id: selectedRows.length === 0 ? push(ref(db, 'inventory')).key || '' : selectedRows[0].id,
      item_number,
      description,
      lpn_number,
      lot_number,
      status,
      location,
    };

    try{
      if (selectedRows.length === 0) {
        await set(ref(db, `inventory/${item.id}`), item);
        setInventory([...inventory, item]);
      } else {
        await update(ref(db, `inventory/${selectedRows[0].id}`), item);
        setInventory(
          inventory.map((invItem) =>
            invItem.id === selectedRows[0].id ? item : invItem
          )
        );
      }

      setSelectedRows([]);
      setActionModifier('');
    } catch(error) {
      toast({
        title: 'Eroare',
        description: 'A aparut o eroare la adaugarea in baza de date',
        variant: 'destructive'
      });
    }
  }

  const confirmDelete = async () => {
    try{
      for (const row of selectedRows) {
        await remove(ref(db, `inventory/${row.id}`))
      }

      setInventory(inventory.filter((item) => !selectedRows.some((selectedItem) => selectedItem.id === item.id)));
      setSelectedRows([]);
      setActionModifier('');
      setShowDeleteModal(false);
    } catch(error) {
      toast({
        title: 'Eroare',
        description: 'A aparut o eroare la stergere',
        variant: 'destructive'
      });
    }
  }

  const handleRowClick = (rowItem: InventoryItem) => {
    setSelectedRows((prevSelectedRows) => {
      const isRowSelected = prevSelectedRows.some((item) => item.id === rowItem.id);
      return isRowSelected
        ? prevSelectedRows.filter((item) => item.id !== rowItem.id)
        : [...prevSelectedRows, rowItem];
    });
  };

  if (loading) {
    return (
      <div className='flex animate-pulse'>
        <div className='srhink-0'>
          <span className='size-12 block bg-gray-200 rounded-full dark:bg-neutral-700'></span>
        </div>

        <div className='ms-4 mt-2 w-full'>
          <p className='h-4 bg-gray-200 rounded-full dark:bg-neutral-700' style={{width: '40%'}}></p>

          <ul className='mt-5 space-y-3'>
          <li className='w-full h-4 bg-gray-200 rounded-full dark:bg-neutral-700'></li>
          <li className='w-full h-4 bg-gray-200 rounded-full dark:bg-neutral-700'></li>
          <li className='w-full h-4 bg-gray-200 rounded-full dark:bg-neutral-700'></li>
          <li className='w-full h-4 bg-gray-200 rounded-full dark:bg-neutral-700'></li>
        </ul>
        </div>
      </div>
    );
  }

  if (error) {
    toast({
      title: 'Eroare',
      description: 'A aparut o eroare la afisarea datelor' + error,
      variant: 'destructive'
    });
  }

  return (
    <div className='mt-8 border-orange-500 ml-2' style={{width: '99%'}}>
      <InventoryToolbar
        inventory={inventory}
        setInventory={setInventory}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        modifier={modifier}
        setModifier={setModifier}
        actionModifier={actionModifier}
        setActionModifier={setActionModifier}
        selectedRows={selectedRows}
        setIsOpen={setIsOpen}
        setSelectedRows={setSelectedRows}
        fetchInventory={fetchInventory} setItemToDelete={function (value: React.SetStateAction<InventoryItem | null>): void {
          throw new Error('Function not implemented.');
        } } setShowDeleteModal={function (value: React.SetStateAction<boolean>): void {
          throw new Error('Function not implemented.');
        } }      
      />

      {inventory && (
        <div className='table-container h-80 overflow-y-auto mt-1'>
          <table className='rounded-lg overflow-hidden text-sm w-full'>
            <thead className='bg-gray-800 text-white'>
            <tr>
              <th className='py-2'></th>
              <th className='py-2'>Item Number</th>
              <th className='py-2'>Lot Number</th>
              <th className='py-2'>Description</th>
              <th className='py-2'>LPN Number</th>
              <th className='py-2'>Status</th>
              <th className='py-2'>Location</th>
              </tr>
            </thead>

            <tbody>
              {inventory.map((item, index) => (
                <tr key={item.id} className={`${
                  selectedRows.some((selectedItem) => selectedItem.id === item.id)
                    ? "font-bold bg-yellow-200"
                    : index % 2 === 0
                    ? "bg-gray-100"
                    : "hover:bg-gray-200"
                }`} onClick={() => handleRowClick(item)}>
                  <td className="py-2">
                    <input
                      type="checkbox"
                      checked={selectedRows.some((selectedItem) => selectedItem.id === item.id)}
                      onChange={() => handleRowClick(item)}
                      style={{ marginRight: "6px" }}
                    />
                  </td>

                  <td className="py-2 text-center">{item.item_number}</td>
                  <td className="py-2 text-center">{item.lot_number}</td>
                  <td className="py-2 text-center">{item.description}</td>
                  <td className="py-2 text-center">{item.lpn_number}</td>
                  <td className="py-2 text-center">{item.status}</td>
                  <td className="py-2 text-center">{item.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className='pagination text-center mt-10'>
        <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} className='px-4 py-2 rounded-md bg-blue-500 text-white text-lg hover:bg-blue-600'>
          &laquo; Previous Page
        </button>

        <button onClick={() => setCurrentPage(currentPage + 1)} disabled={inventory.length < itemsPerPage} className='px-4 py-2 rounded-md bg-blue-500 text-white text-lg hover:bg-blue-600 ml-4'>
          Next Page &raquo;
        </button>
      </div>

      {/* {isOpen && <ItemModal setIsOpen={setIsOpen} closeModal={closeModal} onSave={onSave} selectedRows={selectedRows} />}
      {showDeleteModal && <DeleteConfirmationModal onCancel={() => setShowDeleteModal(false)} onConfirm={confirmDelete} />} */}
    </div>
  )
}

export default DisplayInventory;