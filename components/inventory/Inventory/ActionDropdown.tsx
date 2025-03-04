import React from "react";
import { InventoryItem } from './types/InventoryItem';

interface ActionDropdownProps {
  actionModifier: string;
  setActionModifier: React.Dispatch<React.SetStateAction<string>>;
  selectedRows: InventoryItem[];
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedRows: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
  setItemToDelete: React.Dispatch<React.SetStateAction<InventoryItem | null>>;
  setShowDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const ActionDropdown: React.FC<ActionDropdownProps> = ({
  actionModifier,
  setActionModifier,
  selectedRows,
  setIsOpen,
  setSelectedRows,
  setItemToDelete,
  setShowDeleteModal,
}) => {
  const handleActionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setActionModifier(event.target.value);
  };

  const handleDelete = () => {
    if (selectedRows.length > 0) {
      setItemToDelete(selectedRows[0]); // Assuming you want to delete the first selected item
      setShowDeleteModal(true);
    }
  };

  return (
    <div className="relative">
      <select
        className="bg-white border rounded px-2 py-1"
        value={actionModifier}
        onChange={handleActionChange}
      >
        <option value="" disabled>
          Select Action
        </option>
        <option value="delete">Delete</option>
        <option value="edit">Edit</option>
      </select>

      {actionModifier === "delete" && selectedRows.length > 0 && (
        <button
          className="bg-red-500 text-white p-2 rounded ml-2"
          onClick={handleDelete}
        >
          Confirm Delete
        </button>
      )}
    </div>
  );
};

export default ActionDropdown;
