'use client';

import React, { useState } from 'react';
import { AlertTriangle, Loader2, Plus, Search, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useFirebaseData } from '@/app/lib/firebase';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { firebaseService } from '@/app/lib/firebaseService';

const IncidentReport = () => {
  const [searchQuery, setSearchQuery] = useState('');
  // Update the destructuring to include refreshData
  const { data: incidents, loading, refreshData } = useFirebaseData('incidents');
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  // Add state for editing and selected incident
  const [isEditing, setIsEditing] = useState(false)
  const [selectedIncident, setSelectedIncident] = useState<any>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  // Add form state
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    severity: '',
    location: '',
    date: '',
    reportedBy: '',
    description: '',
    actions: '',
    status: 'reported',
  });

  // Add reset form function
  const resetForm = () => {
    setFormData({
      title: '',
      type: '',
      severity: '',
      location: '',
      date: '',
      reportedBy: '',
      description: '',
      actions: '',
      status: 'reported',
    });

    setIsEditing(false);
    setSelectedIncident(null);
  }

  // Add handle input change function
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  }

  // Add handle select change function
  const handleSelectChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // Add handle edit function
  const handleEdit = (incident: any) => {
    setSelectedIncident(incident);
    setFormData({
      title: incident.title,
      type: incident.type,
      severity: incident.severity,
      location: incident.location,
      date: incident.date,
      reportedBy: incident.reportedBy,
      description: incident.description || '',
      actions: incident.actions || '',
      status: incident.status,
    });
    setIsEditing(true);
    setOpen(true);
  }

  // Add handle delete function
  const handleDelete = (incident: any) => {
    setSelectedIncident(incident);
    setDeleteDialogOpen(true);
  }

  

  return (
    <div>IncidentReport</div>
  )
}

export default IncidentReport;