'use client';

import React, { useState } from 'react';

import { Barcode, FileText, Loader2, Printer, QrCode, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useFirebaseData } from '@/app/lib/firebase';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { generateDriverPaperwork, generatePalletTag, generateShipmentPlaque } from '@/app/lib/documentGeneration';

export default function DocumentGenerator() {
  const [searchQuery, setSearchQuery] = useState('');
  const [documentType, setDocumentType] = useState('all');
  const { data: documents, loading } = useFirebaseData('documents');
  const { toast } = useToast();

  const filteredDocuments =
    documents?.filter((doc: any) => {
      const matchesSearch =
        doc.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.relatedTo.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesType = documentType === 'all' || documentType === doc.type

      return matchesSearch && matchesType
    }) || [];

  const handleGeneratePdf = async (documentId: string) => {
    try {
      // Find the document
      const document = documents?.find((doc: any) => doc.id === documentId);

      if (!document) return;

      toast({
        title: 'Se generează PDF',
        description: 'Documentul dumneavoastră este generat...',
      });

      let pdfBlob: Blob | null = null;
      let fileName = '';

      // Generate the appropiate document based on type
      if (document.type === 'driver') {
        // For demo purposes, we'll use mock data
        const driverData = {
          name: "John Smith",
          truckId: "TRK-458",
          company: "Global Logistics",
          orderId: "ORD-10044",
          orderType: "inbound",
          checkInTime: "08:45 AM",
        }

        pdfBlob = await generateDriverPaperwork(driverData);
        fileName = `driver-paperwork-${document.id}.pdf`;
      } else if (document.type === 'pallet') {
        // For demo purposes, we'll use mock data
        const palletData = {
          orderId: "ORD-10045",
          customer: "Acme Corp",
          palletNumber: 1,
          totalPallets: 12,
          sku: "PAL-STD-001",
          weight: 450,
        }

        pdfBlob = await generatePalletTag(palletData)
        fileName = `pallet-tag-${document.id}.pdf`
      } else if (document.type === "shipment") {
        // For demo purposes, we'll use mock data
        const shipmentData = {
          shipmentId: "SHP-2023-045",
          destination: "Tech Solutions Ltd",
          date: "2023-04-23",
          totalPallets: 5,
          totalWeight: 1250,
        }

        pdfBlob = await generateShipmentPlaque(shipmentData)
        fileName = `shipment-plaque-${document.id}.pdf`
      }

      if (pdfBlob) {
        
      }
    } catch(error) {
      console.error('Error generating pdf: ', error);
      toast({
        title: 'Eroare',
        description: 'Nu s-a putut genera PDF-ul. Vă rugăm să încercați din nou.',
        variant: 'destructive'
      });
    }
  }
  return (
    <div>generator</div>
  )
}
