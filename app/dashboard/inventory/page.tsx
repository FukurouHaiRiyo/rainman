'use client'

import React, { useState } from 'react'
import {
  Loader2, Package, Plus, Search, Edit, Trash2,
  Layers, AlertTriangle, ArrowDownIcon, ArrowUpIcon
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { useFirebaseData, firebaseService } from '@/app/lib/firebase'
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
} from '@/components/ui/alert-dialog'

export default function InventoryOverview() {
  const { data: inventory, loading, refreshData } = useFirebaseData('inventory')
  const [searchQuery, setSearchQuery] = useState("")
  const [open, setOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    quantity: "",
    location: "",
    status: "",
  })

  const resetForm = () => {
    setFormData({ name: "", sku: "", quantity: "", location: "", status: "" })
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
      toast({ title: "Item deleted", description: "Item removed successfully." });
    } else {
      toast({ title: "Error", description: "Failed to delete item.", variant: "destructive" });
    }
    refreshData()
    setDeleteDialogOpen(false)
    setSelectedItem(null)
  }

  const handleSubmit = async () => {
    if (!formData.name || !formData.sku || !formData.quantity || !formData.location || !formData.status) {
      toast({ title: "Missing info", description: "Fill all fields.", variant: "destructive" })
      return
    }
    const itemData = {
      name: formData.name,
      sku: formData.sku,
      quantity: Number.parseInt(formData.quantity),
      location: formData.location,
      status: formData.status,
      lastUpdated: new Date().toLocaleDateString(),
    }

    const result = isEditing && selectedItem
      ? await firebaseService.update("inventory", selectedItem.id, itemData)
      : await firebaseService.create("inventory", itemData)

    if (result.success) {
      toast({
        title: isEditing ? "Item updated" : "Item added",
        description: "Success.",
      })
    } else {
      toast({
        title: "Error",
        description: "Operation failed.",
        variant: "destructive",
      })
    }

    resetForm()
    setOpen(false)
    refreshData()
  }

  const filteredInventory = inventory?.filter(
    (item: any) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase())
  ) || []

  const lowStockItems = inventory?.filter((i: any) => i.status === 'low-stock') || []
  const outOfStockItems = inventory?.filter((i: any) => i.status === 'out-of-stock') || []
  const inStockItems = inventory?.filter((i: any) => i.status === 'in-stock') || []
  const topInventoryItems = [...(inventory || [])].sort((a, b) => b.quantity - a.quantity).slice(0, 5)
  const lowStockItemsToReorder = lowStockItems.slice(0, 5)

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-3xl font-bold tracking-tight'>Panou de control</h2>
        <p className='text-muted-foreground'>Monitorizați nivelul stocurilor și gestionați stocurile.</p>
      </div>

      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Card><CardHeader className='flex justify-between pb-2'><CardTitle className='text-sm'>Total Inventory Items</CardTitle><Layers className='h-4 w-4' /></CardHeader><CardContent><div className='text-2xl font-bold'>{inventory?.length || 0}</div><p className='text-xs text-muted-foreground'>Across all warehouses</p></CardContent></Card>
        <Card><CardHeader className='flex justify-between pb-2'><CardTitle className='text-sm'>In Stock</CardTitle><ArrowUpIcon className='h-4 w-4 text-green-500' /></CardHeader><CardContent><div className='text-2xl font-bold'>{inStockItems.length}</div><p className='text-xs'>{Math.round((inStockItems.length / (inventory?.length || 1)) * 100)}%</p></CardContent></Card>
        <Card><CardHeader className='flex justify-between pb-2'><CardTitle className='text-sm'>Low Stock</CardTitle><AlertTriangle className='h-4 w-4 text-yellow-500' /></CardHeader><CardContent><div className='text-2xl font-bold'>{lowStockItems.length}</div><p className='text-xs'>Requires attention</p></CardContent></Card>
        <Card><CardHeader className='flex justify-between pb-2'><CardTitle className='text-sm'>Out of Stock</CardTitle><ArrowDownIcon className='h-4 w-4 text-red-500' /></CardHeader><CardContent><div className='text-2xl font-bold'>{outOfStockItems.length}</div><p className='text-xs'>Needs reorder</p></CardContent></Card>
      </div>

      <div className='grid gap-4 md:grid-cols-2'>
        <Card><CardHeader><CardTitle>Top Inventory Items</CardTitle></CardHeader><CardContent><div className='space-y-4'>{topInventoryItems.map((item, i) => <div key={i} className='flex justify-between border-b pb-2'><div><p className='font-medium'>{item.name}</p><p className='text-sm text-muted-foreground'>{item.sku}</p></div><div className='text-right'><p className='font-medium'>{item.quantity} units</p><p className='text-sm text-muted-foreground'>{item.location}</p></div></div>)}</div></CardContent></Card>
        <Card><CardHeader><CardTitle>Items to Reorder</CardTitle></CardHeader><CardContent><div className='space-y-4'>{lowStockItemsToReorder.length > 0 ? lowStockItemsToReorder.map((item: any, i: any) => <div key={i} className='flex justify-between border-b pb-2'><div><p className='font-medium'>{item.name}</p><p className='text-sm text-muted-foreground'>{item.sku}</p></div><div className='text-right'><Badge variant={item.status === 'low-stock' ? 'outline' : 'destructive'}>{item.status}</Badge><p className='text-sm text-muted-foreground mt-1'>{item.quantity} remaining</p></div></div>) : <p className='text-center text-muted-foreground'>No items to reorder</p>}</div></CardContent></Card>
      </div>

      {/* Inventory CRUD UI */}
      {/* Search & Add Item Section */}
      <div className="flex items-center justify-between mt-8">
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
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{isEditing ? "Edit Inventory Item" : "Add Inventory Item"}</DialogTitle>
              <DialogDescription>
                {isEditing ? "Update the details of the inventory item." : "Enter the details of the new inventory item."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input id="name" className="col-span-3" value={formData.name} onChange={handleInputChange} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="sku" className="text-right">SKU</Label>
                <Input id="sku" className="col-span-3" value={formData.sku} onChange={handleInputChange} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="quantity" className="text-right">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  className="col-span-3"
                  value={formData.quantity}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="location" className="text-right">Location</Label>
                <Input id="location" className="col-span-3" value={formData.location} onChange={handleInputChange} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">Status</Label>
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
              <Button variant="outline" onClick={() => { resetForm(); setOpen(false) }}>
                Cancel
              </Button>
              <Button type="submit" onClick={handleSubmit}>
                {isEditing ? "Update Item" : "Save Item"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search Input */}
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

      {/* Table View */}
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
                          {item.status.replace("-", " ").replace(/\b\w/g, (c: any) => c.toUpperCase())}
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

      {/* Delete Confirmation Dialog */}
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
    </div>
  )
}
