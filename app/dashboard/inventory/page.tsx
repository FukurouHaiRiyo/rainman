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
import { useFirebaseData, firebaseService } from '@/app/lib/firebase'
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'



type InventoryItem = {
  id?: string,
  name: string,
  sku: string,
  quantity: number,
  location: string,
  sourceLocation: string,
  destinationLocation: string,
  accountType: string,
  status: string,
  lot: string,
  validity: string,
  entryPrice: string,
  retailPrice: string,
  cost: string,
  lastUpdated: string
}

export default function InventoryOverview() {
  const { data: inventory, loading, refreshData} = useFirebaseData('inventory');
  const [searchQuery, setSearchQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const { toast } = useToast()

  const [formData, setFormData] = useState<InventoryItem>({
    name: '',
    sku: '',
    quantity: 0,
    location: '',
    sourceLocation: '',
    destinationLocation: '',
    accountType: '',
    status: '',
    lot: '',
    validity: '',
    entryPrice: '',
    retailPrice: '',
    cost: '',
    lastUpdated: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({...prev, [id]: value}));
  }

  const handleSelectedChange = (field: keyof InventoryItem, value: string) => {
    setFormData((prev) => ({...prev, [field]: value}));
  }

  const generateSKU = (name: string) => {
    const prefix = name.toLowerCase().includes('telefon') ? 'T': name.toLowerCase().includes('laptop') ? 'L': 'X';
  
    const id = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}_${id}`;
  }

  const handleSubmit = async () => {
    if(!formData.name || !formData.quantity || !formData.location) {
      toast({
        title: 'Eroare',
        description: 'Toate campurile sunt obligatorii',
        variant: 'destructive'
      });
      return;
    }

    const itemData = {
      ...formData,
      sku: isEditing && formData.sku ? formData.sku: generateSKU(formData.name),
      quantity: Number(formData.quantity),
      lastUpdated: new Date().toLocaleDateString(),
    }

    const result = isEditing && selectedItem?.id ? await firebaseService.update('inventory', selectedItem.id, itemData): await firebaseService.create('inventory', itemData);

    if (result.success) {
      toast({ 
        title: isEditing ? 'Item update': 'Item created'
       });
    } else {
      toast({
        title: 'Error',
        description: 'Eroare',
        variant: 'destructive'
      });
    } 

    refreshData();
    setOpen(false);
    setFormData({
      name: '', sku: '', quantity: 0, location: '', sourceLocation: '', destinationLocation: '',
      accountType: '', status: '', lot: '', validity: '', entryPrice: '', retailPrice: '', cost: '',
      lastUpdated: ''
    });
    setIsEditing(false);
  }

  const handleEdit = (item: InventoryItem) => {
    setSelectedItem(item);
    setFormData(item);
    setIsEditing(true);
    setOpen(true);
  }

  const handleDelete = async (item: InventoryItem) => {
    if(!item.id) return;

    const result = await firebaseService.delete('inventory', item.id);

    if (result.success) {
      toast({
        title: 'Șters',
        description: `${item.name} a fost șters` 
      });
      refreshData();
    }
  }

  const filteredInventory = inventory?.filter((item:any) => 
    item.name?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return(
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h2 className='text-2xl font-bold'>
          Prezentare generală a inventarului
        </h2>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className='mr-2 h-4 w-4' /> Adăugați articol </Button>
          </DialogTrigger>

          <DialogContent className='radix-dialog-content'>
            <DialogHeader>
              <DialogTitle> {isEditing ? 'Editare': 'Adăugare'} </DialogTitle>
              <DialogDescription>Completați toate câmpurile</DialogDescription>
            </DialogHeader>

            <div className='grid gap-4 py-4'>
              {[
                { id: 'name', label: 'Name' },
                { id: 'quantity', label: 'Quantity', type: 'number' },
                { id: 'location', label: 'Location' },
                { id: 'lot', label: 'Lot' },
                { id: 'validity', label: 'Validity' },
                { id: 'entryPrice', label: 'Entry Price' },
                { id: 'retailPrice', label: 'Retail Price' },
                { id: 'cost', label: 'Cost' },
              ].map(({id, label, type='text'}) => (
                <div key={id} className='grid grid-cols-4 items-center gap-4'>
                  <Label htmlFor={id}> {label} </Label>
                  <Input id={id} className='col-span-3' type={type} value={(formData as any)[id]} onChange={handleInputChange} />
                </div>
              ))}

              <div className='grid grid-cols-4 items-center gap-4'>
                <Label>
                  Locație sursă
                </Label>

                <Select value={formData.sourceLocation} onValueChange={(val) => handleSelectedChange('sourceLocation', val)}>
                  <SelectTrigger className='col-span-3'>
                    <SelectValue placeholder='Select...' />
                  </SelectTrigger>

                  <SelectContent className='radix-dialog-content'>
                    <SelectItem value='Depozit A'>Depozit A</SelectItem>
                    <SelectItem value='Depozit B'>Depozit B</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='grid grid-cols-4 items-center gap-4'>
                <Label> Destinație </Label>
                <Select value={formData.destinationLocation} onValueChange={(val) => handleSelectedChange('destinationLocation', val)}>
                  <SelectTrigger className='col-span-3'><SelectValue placeholder='Select...' /></SelectTrigger>
                  <SelectContent className='radix-dialog-content'>
                    <SelectItem value='Magazin 1'>Magazin 1</SelectItem>
                    <SelectItem value='Magazin 2'>Magazin 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='grid grid-cols-4 items-center gap-4'>
                <Label>Account Type</Label>
                <Select value={formData.accountType} onValueChange={(val) => handleSelectedChange('accountType', val)}>
                  <SelectTrigger className='col-span-3'><SelectValue placeholder='Select...' /></SelectTrigger>
                  <SelectContent className='radix-dialog-content'>
                    <SelectItem value='Productie'>Productie</SelectItem>
                    <SelectItem value='Consum'>Consum</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button onClick={handleSubmit}>{isEditing ? 'Update': 'Save'}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className='relative'>
        <Search className='absolute left-2 top-3 h-4 w-4 text-muted-foreground' />
        <Input 
          type='text'
          placeholder='Search by name...'
          className='pl-8 w-1/3'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Card>
        <CardHeader><CardTitle>Inventory Table</CardTitle></CardHeader>
        <CardContent className='overflow-auto'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>ID (SKU)</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>Lot</TableHead>
                <TableHead>Validity</TableHead>
                <TableHead>Entry Price</TableHead>
                <TableHead>Retail Price</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInventory.map((item: InventoryItem, i: any) => (
                <TableRow key={item.id || `${item.sku}-${i}`}>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.sku}</TableCell>
                  <TableCell>{item.sourceLocation}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.lot}</TableCell>
                  <TableCell>{item.validity}</TableCell>
                  <TableCell>{item.entryPrice}</TableCell>
                  <TableCell>{item.retailPrice}</TableCell>
                  <TableCell>{item.cost}</TableCell>
                  <TableCell>
                    <Button size='icon' variant='ghost' onClick={() => handleEdit(item)}><Edit className='w-4 h-4' /></Button>
                    <Button size='icon' variant='ghost' onClick={() => handleDelete(item)}><Trash2 className='w-4 h-4' /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
