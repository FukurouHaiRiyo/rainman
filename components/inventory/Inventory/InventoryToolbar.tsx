import React from 'react';
import { InventoryItem } from './types/InventoryItem';
import ActionDropdown from './ActionDropdown';
import SearchModifierDropdown from './SearchModifierDropdown';
import SearchTextInput from './SearchTextInput';
import RefreshButton from '../Dashboard/RefreshButton';

interface InventoryToolbarProps {
  inventory: InventoryItem[];
  setInventory: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  actionModifier: string;
  modifier: string;
  setModifier: React.Dispatch<React.SetStateAction<string>>;
  setActionModifier: React.Dispatch<React.SetStateAction<string>>;
  selectedRows: InventoryItem[];
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedRows: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
  setItemToDelete: React.Dispatch<React.SetStateAction<InventoryItem | null>>;
  setShowDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
  fetchInventory: () => void;
}

const InventoryToolbar: React.FC<InventoryToolbarProps> = ({
  inventory,
  setInventory,
  searchTerm,
  setSearchTerm,
  actionModifier,
  modifier,
  setModifier,
  setActionModifier,
  selectedRows,
  setIsOpen,
  setSelectedRows,
  setItemToDelete,
  setShowDeleteModal,
  fetchInventory,
}) => {
  return (
    <div className='flex flex-row justify-between p-1 border-cyan-400'>
      <div className='flex items-center'>
        <ActionDropdown
          actionModifier={actionModifier}
          setActionModifier={setActionModifier}
          selectedRows={selectedRows}
          setIsOpen={setIsOpen}
          setSelectedRows={setSelectedRows}
          setItemToDelete={setItemToDelete}
          setShowDeleteModal={setShowDeleteModal}
        />
      </div>
      <div className='flex items-center'>
        <RefreshButton setInventory={setInventory} fetchInventory={fetchInventory} />
        <SearchModifierDropdown inventory={inventory} setModifier={setModifier} />
        <SearchTextInput setSearchTerm={setSearchTerm} searchTerm={searchTerm} />
      </div>
    </div>
  );
};

export default InventoryToolbar;
