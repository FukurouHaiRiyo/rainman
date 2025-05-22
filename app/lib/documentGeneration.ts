"use client"

import jsPDF from "jspdf"
import JsBarcode from "jsbarcode"
import QRCode from "qrcode"

// Generate driver paperwork
export async function generateDriverPaperwork(driver: any): Promise<Blob> {
  const doc = new jsPDF()

  // Add header
  doc.setFontSize(20)
  doc.text("Driver Sign-Out Paperwork", 105, 20, { align: "center" })

  // Add logo placeholder
  doc.rect(20, 10, 30, 15)
  doc.setFontSize(8)
  doc.text("LOGO", 35, 20, { align: "center" })

  // Add date
  doc.setFontSize(10)
  const today = new Date().toLocaleDateString()
  doc.text(`Date: ${today}`, 190, 20, { align: "right" })

  // Add driver information
  doc.setFontSize(12)
  doc.text("Driver Information", 20, 40)
  doc.setFontSize(10)
  doc.text(`Name: ${driver.name}`, 20, 50)
  doc.text(`Truck ID: ${driver.truckId}`, 20, 60)
  doc.text(`Company: ${driver.company}`, 20, 70)
  doc.text(`Order Type: ${driver.orderType === "inbound" ? "Inbound" : "Outbound"}`, 20, 80)
  doc.text(`Order ID: ${driver.orderId}`, 20, 90)

  // Add check-in/out times
  doc.text(`Check-In Time: ${driver.checkInTime || "N/A"}`, 120, 50)
  doc.text(`Check-Out Time: ${driver.checkOutTime || "N/A"}`, 120, 60)

  // Add barcode
  const canvas = document.createElement("canvas")
  JsBarcode(canvas, driver.orderId, {
    format: "CODE128",
    width: 2,
    height: 50,
    displayValue: true,
  })
  const barcodeDataUrl = canvas.toDataURL("image/png")
  doc.addImage(barcodeDataUrl, "PNG", 20, 100, 170, 30)

  // Add signature fields
  doc.line(20, 160, 100, 160)
  doc.text("Driver Signature", 60, 170)

  doc.line(120, 160, 190, 160)
  doc.text("Warehouse Signature", 155, 170)

  // Add notes
  doc.text("Notes:", 20, 190)
  doc.text(driver.notes || "No notes provided.", 20, 200)

  // Add footer
  doc.setFontSize(8)
  doc.text("This document serves as proof of delivery/pickup. Please retain for your records.", 105, 280, {
    align: "center",
  })

  return doc.output("blob")
}

// Generate pallet tag
export async function generatePalletTag(palletInfo: any): Promise<Blob> {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: [100, 150],
  })

  // Add header
  doc.setFontSize(16)
  doc.text("Pallet Tag", 75, 10, { align: "center" })

  // Add pallet information
  doc.setFontSize(12)
  doc.text(`Pallet ID: ${palletInfo.id}`, 10, 25)
  doc.text(`Product: ${palletInfo.product}`, 10, 35)
  doc.text(`Quantity: ${palletInfo.quantity}`, 10, 45)
  doc.text(`Date: ${palletInfo.date}`, 10, 55)
  doc.text(`Location: ${palletInfo.location}`, 10, 65)

  // Add barcode
  const canvas = document.createElement("canvas")
  JsBarcode(canvas, palletInfo.id, {
    format: "CODE128",
    width: 2,
    height: 30,
    displayValue: true,
  })
  const barcodeDataUrl = canvas.toDataURL("image/png")
  doc.addImage(barcodeDataUrl, "PNG", 10, 70, 130, 20)

  return doc.output("blob")
}

// Generate shipment plaque
export async function generateShipmentPlaque(shipmentInfo: any): Promise<Blob> {
  const doc = new jsPDF()

  // Add header
  doc.setFontSize(20)
  doc.text("Shipment Plaque", 105, 20, { align: "center" })

  // Add shipment information
  doc.setFontSize(14)
  doc.text(`Shipment ID: ${shipmentInfo.id}`, 20, 40)
  doc.text(`Customer: ${shipmentInfo.customer}`, 20, 50)
  doc.text(`Destination: ${shipmentInfo.destination}`, 20, 60)
  doc.text(`Date: ${shipmentInfo.date}`, 20, 70)
  doc.text(`Items: ${shipmentInfo.items}`, 20, 80)
  doc.text(`Weight: ${shipmentInfo.weight} kg`, 20, 90)

  // Add QR code
  const qrCodeDataUrl = await QRCode.toDataURL(
    JSON.stringify({
      id: shipmentInfo.id,
      customer: shipmentInfo.customer,
      destination: shipmentInfo.destination,
    }),
  )
  doc.addImage(qrCodeDataUrl, "PNG", 130, 40, 50, 50)

  // Add barcode
  const canvas = document.createElement("canvas")
  JsBarcode(canvas, shipmentInfo.id, {
    format: "CODE128",
    width: 2,
    height: 50,
    displayValue: true,
  })
  const barcodeDataUrl = canvas.toDataURL("image/png")
  doc.addImage(barcodeDataUrl, "PNG", 20, 100, 170, 30)

  // Add special instructions
  doc.setFontSize(12)
  doc.text("Special Instructions:", 20, 150)
  doc.text(shipmentInfo.instructions || "None", 20, 160)

  // Add handling symbols
  doc.rect(20, 180, 20, 20)
  doc.text("Fragile", 30, 190)

  doc.rect(60, 180, 20, 20)
  doc.text("This Side Up", 70, 190)

  doc.rect(120, 180, 20, 20)
  doc.text("Keep Dry", 130, 190)

  return doc.output("blob")
}

// Generate barcode
export function generateBarcode(value: string, format = "CODE128"): string {
  const canvas = document.createElement("canvas")
  JsBarcode(canvas, value, {
    format,
    width: 2,
    height: 50,
    displayValue: true,
  })
  return canvas.toDataURL("image/png")
}

// Generate QR code
export async function generateQRCode(value: string): Promise<string> {
  return await QRCode.toDataURL(value)
}
