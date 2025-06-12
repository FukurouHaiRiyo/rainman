"use client"

import type React from "react"

import { useState } from "react"
import { Loader2, Package, Plus, Search, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useFirebaseData, firebaseService } from "@/app/lib/firebase"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function InventoryOverview() {
  const [searchQuery, setSearchQuery] = useState("")
  const { data: inventory, loading, refreshData } = useFirebaseData("inventory")
  const [open, setOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const { toast } = useToast()

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    quantity: "",
    location: "",
    status: "",
  })

  const resetForm = () => {
    setFormData({
      name: "",
      sku: "",
      quantity: "",
      location: "",
      status: "",
    })
    setIsEditing(false)
    setSelectedItem(null)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, status: value }))
  }

  const handleEdit = (item: any) => {
    setSelectedItem(item)
    setFormData({
      name: item.name,
      sku: item.sku,
      quantity: item.quantity.toString(),
      location: item.location,
      status: item.status,
    })
    setIsEditing(true)
    setOpen(true)
  }

  const handleDelete = (item: any) => {
    setSelectedItem(item)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!selectedItem) return

    const result = await firebaseService.delete("inventory", selectedItem.id)

    if (result.success) {
      toast({
        title: "Item deleted",
        description: "The inventory item has been deleted successfully.",
      })
      refreshData()
    } else {
      toast({
        title: "Error",
        description: "Failed to delete the item. Please try again.",
        variant: "destructive",
      })
    }

    setDeleteDialogOpen(false)
    setSelectedItem(null)
  }

  const handleSubmit = async () => {
    // Validate form
    if (!formData.name || !formData.sku || !formData.quantity || !formData.location || !formData.status) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    try {
      const itemData = {
        name: formData.name,
        sku: formData.sku,
        quantity: Number.parseInt(formData.quantity),
        location: formData.location,
        status: formData.status,
        lastUpdated: new Date().toLocaleDateString(),
      }

      let result

      if (isEditing && selectedItem) {
        // Update existing item
        result = await firebaseService.update("inventory", selectedItem.id, itemData)

        if (result.success) {
          toast({
            title: "Item updated",
            description: "The inventory item has been updated successfully.",
          })
        }
      } else {
        // Create new item
        result = await firebaseService.create("inventory", itemData)

        if (result.success) {
          toast({
            title: "Item added",
            description: "The inventory item has been added successfully.",
          })
        }
      }

      if (!result.success) {
        throw new Error("Operation failed")
      }

      // Reset form and close dialog
      resetForm()
      setOpen(false)
      refreshData()
    } catch (error) {
      console.error("Error saving inventory item:", error)
      toast({
        title: "Error",
        description: "Failed to save the item. Please try again.",
        variant: "destructive",
      })
    }
  }

  const filteredInventory =
    inventory?.filter(
      (item: any) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase()),
    ) || []

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">Inventory Management</h2>
          <p className="text-sm text-muted-foreground">Manage and track your warehouse inventory</p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog
            open={open}
            onOpenChange={(newOpen) => {
              setOpen(newOpen)
              if (!newOpen) resetForm()
            }}
          >
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Item
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] radix-dialog-content">
              <DialogHeader>
                <DialogTitle>{isEditing ? "Edit Inventory Item" : "Add Inventory Item"}</DialogTitle>
                <DialogDescription>
                  {isEditing
                    ? "Update the details of the inventory item."
                    : "Enter the details of the new inventory item."}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input id="name" className="col-span-3" value={formData.name} onChange={handleInputChange} />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="sku" className="text-right">
                    SKU
                  </Label>
                  <Input id="sku" className="col-span-3" value={formData.sku} onChange={handleInputChange} />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="quantity" className="text-right">
                    Quantity
                  </Label>
                  <Input
                    id="quantity"
                    type="number"
                    className="col-span-3"
                    value={formData.quantity}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="location" className="text-right">
                    Location
                  </Label>
                  <Input id="location" className="col-span-3" value={formData.location} onChange={handleInputChange} />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">
                    Status
                  </Label>
                  <Select onValueChange={handleSelectChange} value={formData.status}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="in-stock">In Stock</SelectItem>
                      <SelectItem value="low-stock">Low Stock</SelectItem>
                      <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                      <SelectItem value="backordered">Backordered</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    resetForm()
                    setOpen(false)
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" onClick={handleSubmit}>
                  {isEditing ? "Update Item" : "Save Item"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="relative mt-4">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search inventory by name, SKU, or location..."
          className="pl-8 w-full md:w-1/3 lg:w-1/4"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Inventory Items</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInventory.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <Package className="h-8 w-8 mb-2" />
                        <p>No inventory items found</p>
                        {searchQuery && <p className="text-sm">Try adjusting your search query</p>}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredInventory.map((item: any) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.sku}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{item.location}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            item.status === "in-stock"
                              ? "default"
                              : item.status === "low-stock"
                                ? "secondary"
                                : item.status === "out-of-stock"
                                  ? "destructive"
                                  : "outline"
                          }
                        >
                          {item.status === "in-stock"
                            ? "In Stock"
                            : item.status === "low-stock"
                              ? "Low Stock"
                              : item.status === "out-of-stock"
                                ? "Out of Stock"
                                : item.status === "backordered"
                                  ? "Backordered"
                                  : item.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{item.lastUpdated}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(item)} className="mr-1">
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(item)}>
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the inventory item
              {selectedItem && <strong> {selectedItem.name}</strong>} from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
