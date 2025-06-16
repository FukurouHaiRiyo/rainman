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
          name: 'John Smith',
          truckId: 'TRK-458',
          company: 'Global Logistics',
          orderId: 'ORD-10044',
          orderType: 'inbound',
          checkInTime: '08:45 AM',
        }

        pdfBlob = await generateDriverPaperwork(driverData);
        fileName = `driver-paperwork-${document.id}.pdf`;
      } else if (document.type === 'pallet') {
        // For demo purposes, we'll use mock data
        const palletData = {
          orderId: 'ORD-10045',
          customer: 'Acme Corp',
          palletNumber: 1,
          totalPallets: 12,
          sku: 'PAL-STD-001',
          weight: 450,
        }

        pdfBlob = await generatePalletTag(palletData)
        fileName = `pallet-tag-${document.id}.pdf`
      } else if (document.type === 'shipment') {
        // For demo purposes, we'll use mock data
        const shipmentData = {
          shipmentId: 'SHP-2023-045',
          destination: 'Tech Solutions Ltd',
          date: '2023-04-23',
          totalPallets: 5,
          totalWeight: 1250,
        }

        pdfBlob = await generateShipmentPlaque(shipmentData)
        fileName = `shipment-plaque-${document.id}.pdf`
      }

      if (pdfBlob) {
        // Create a download link
        const url = URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.href = url;
        link.document = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast({
          title: 'PDF generat',
          description: 'Documentul dumneavoastră a fost generat cu succes și este gata pentru descărcare.',
        });
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

  const handleGenerateBarcode = async(documentId: string) => {
    try{
      // Find the document
      const document = documents?.find((doc: any) => doc.id === documentId);

      if (!document) 
        return;

      toast({
        title: 'Se generează codului de bare',
        description: 'Codul dumneavoastră de bare este generat...'
      });

      // For demo purposes, we'll use the document ID as the barcode value
      const { generateBarcode, generateQRCode } = await import('@/app/lib/documentGeneration');

      let barcodeDataUrl: string
      let fileName = ''

      if (document.type === 'shipment') {
        barcodeDataUrl = await generateQRCode(document.id)
        fileName = `qrcode-${document.id}.png`
      } else {
        barcodeDataUrl = await generateBarcode(document.id)
        fileName = `barcode-${document.id}.png`
      }

      // Create a download link
      const link = document.createElement('a')
      link.href = barcodeDataUrl
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: 'Barcode Generated',
        description: 'Your barcode has been successfully generated and is ready for download.',
      })
    } catch(error) {
      console.error('Error generating barcode:', error)
      toast({
        title: 'Eroare',
        description: 'Nu s-a putut genera codul de bare. Vă rugăm să încercați din nou.',
        variant: 'destructive',
      })
    }
  }

  return (
    <>
      <div className='flex items-center justify-between'>
        <div className='space-y-1'>
          <h2 className='text-2xl font-semibold tracking-tight'>
            Generator de documente
          </h2>

          <p className='text-sm text-muted-foreground'>
            Generați documente pentru șoferi, etichete pentru paleți și plăcuțe de expediere
          </p>
        </div>

        <div className='flex items-center gap-2'>
          <Button>
            <FileText className='mr-2 h-4 w-4' />
            Template nou 
          </Button>
        </div>
      </div>

      <Tabs defaultValue='all' onValueChange={setDocumentType} className='space-y-4 mt-4'>
        <div className='flex items-center justify-between'>
          <TabsList>
            <TabsTrigger value='all'>Toate documentele</TabsTrigger>
            <TabsTrigger value='driver'>Documente șofer</TabsTrigger>
            <TabsTrigger value='pallet'>Etichete pentru paleți</TabsTrigger>
            <TabsTrigger value='shipment'>Plăcuțe de expediere</TabsTrigger>
          </TabsList>

          <div className='relative'>
            <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
            <Input
              type='search'
              placeholder='Căutați documente...'
              className='pl-8 w-[200px] md:w-[300px]'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <TabsContent value='all' className='space-y-4'>
          <DocumentsTable documents={filteredDocuments} loading={loading} onGeneratePdf={handleGeneratePdf} onGenerateBarcode={handleGenerateBarcode} />
        </TabsContent>
      </Tabs>
    </>
  )
}

function DocumentsTable({ documents, loading, onGeneratePdf, onGenerateBarcode}: {
  documents: any[]
  loading: boolean
  onGeneratePdf: (id: string) => void
  onGenerateBarcode: (id: string) => void
}) {
  return (
    <Card>
      <CardHeader> 
        <CardTitle> Templates </CardTitle>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className='flex items-center justify-center p-8'>
            <Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
          </div>
        ): (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Titlu</TableHead>
                <TableHead>Tip</TableHead>
                <TableHead>Legat de</TableHead>
                <TableHead>Creat</TableHead>
                <TableHead>Ultima utilizare</TableHead>
                <TableHead className='text-right'>Acțiuni</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {documents && documents.length > 0 ? (
                documents.map((doc: any) => (
                  <TableRow key={doc.id}>
                    <TableCell className='font-medium'>
                      {doc.id}
                    </TableCell>

                    <TableCell>
                      {doc.title}
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant={doc.type === 'driver' ? 'default' : doc.type === 'pallet' ? 'secondary' : 'outline'}
                      >
                        {doc.type === 'driver'
                          ? 'Driver Paperwork'
                          : doc.type === 'pallet'
                            ? 'Pallet Tag'
                            : 'Shipment Plaque'}
                      </Badge>
                    </TableCell>
                    <TableCell>{doc.relatedTo}</TableCell>
                    <TableCell>{doc.created}</TableCell>
                    <TableCell>{doc.lastUsed || 'Never'}</TableCell>
                    <TableCell className='text-right'>
                      <Button variant='ghost' size='sm' onClick={() => onGeneratePdf(doc.id)} className='mr-2'>
                        <FileText className='mr-2 h-4 w-4' />
                        PDF
                      </Button>
                      <Button variant='ghost' size='sm' onClick={() => onGenerateBarcode(doc.id)}>
                        <Barcode className='mr-2 h-4 w-4' />
                        Barcode
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ): (
                <TableRow>
                  <TableCell colSpan={7} className='text-center py-8'>
                    <div className='flex flex-col items-center justify-center text-muted-foreground'>
                      <FileText className='h-8 w-8 mb-2' />
                      <p>Nu s-au găsit documente</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}