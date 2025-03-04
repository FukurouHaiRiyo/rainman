import React from 'react';
import { AiOutlineReload } from 'react-icons/ai';
import { InventoryItem } from '../Inventory/types/InventoryItem';

interface RefreshButtonProps {
  fetchInventory: () => Promise<void> | void;
  setInventory?: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
}

const RefreshButton: React.FC<RefreshButtonProps> = ({ fetchInventory, setInventory  }) => {
  const handleRefresh = async () => {
    await fetchInventory();

    if (setInventory) {
      setInventory([]);
    }
  }

  return (
    <button onClick={handleRefresh} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 mr-10 rounded-full focus:outline-none focus:shadow-outline' title='Refresh database'>
      <AiOutlineReload />
    </button>
  )
}

export default RefreshButton;