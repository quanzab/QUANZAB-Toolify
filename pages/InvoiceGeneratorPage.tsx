
import React, { useState } from 'react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import saveAs from 'file-saver';
import ToolPageLayout from '../components/ToolPageLayout';

interface Item {
  description: string;
  quantity: number;
  price: number;
}

const InvoiceGeneratorPage: React.FC = () => {
  const [from, setFrom] = useState('Your Company\n123 Street, City\nCountry');
  const [to, setTo] = useState('Client Company\n456 Avenue, Town\nCountry');
  const [invoiceNumber, setInvoiceNumber] = useState('INV-001');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [items, setItems] = useState<Item[]>([{ description: 'Service or Product', quantity: 1, price: 100 }]);
  
  const handleItemChange = (index: number, field: keyof Item, value: string | number) => {
    const newItems = [...items];
    (newItems[index] as any)[field] = value;
    setItems(newItems);
  };
  
  const addItem = () => {
    setItems([...items, { description: '', quantity: 1, price: 0 }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };
  
  const calculateTotal = () => {
    return items.reduce((acc, item) => acc + (item.quantity * item.price), 0).toFixed(2);
  };
  
  const generatePdf = async () => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    let y = height - 50;
    
    // Header
    page.drawText('INVOICE', { x: 50, y, size: 24, font });
    y -= 50;

    // From/To
    page.drawText('From:', { x: 50, y, size: 12, font });
    page.drawText(from, { x: 50, y: y - 15, size: 10, font, lineHeight: 12 });
    page.drawText('To:', { x: 350, y, size: 12, font });
    page.drawText(to, { x: 350, y: y - 15, size: 10, font, lineHeight: 12 });
    y -= 100;
    
    // Details
    page.drawText(`Invoice #: ${invoiceNumber}`, { x: 350, y, size: 12, font });
    page.drawText(`Date: ${date}`, { x: 350, y: y-15, size: 12, font });
    y -= 50;
    
    // Table Header
    page.drawText('Description', { x: 50, y, size: 12, font });
    page.drawText('Qty', { x: 350, y, size: 12, font });
    page.drawText('Price', { x: 425, y, size: 12, font });
    page.drawText('Total', { x: 500, y, size: 12, font });
    y -= 20;

    // Table Items
    items.forEach(item => {
        page.drawText(item.description, { x: 50, y, size: 10, font });
        page.drawText(item.quantity.toString(), { x: 350, y, size: 10, font });
        page.drawText(`$${item.price.toFixed(2)}`, { x: 425, y, size: 10, font });
        page.drawText(`$${(item.quantity * item.price).toFixed(2)}`, { x: 500, y, size: 10, font });
        y -= 20;
    });

    // Total
    y -= 20;
    page.drawText(`Total: $${calculateTotal()}`, { x: 450, y, size: 14, font });

    const pdfBytes = await pdfDoc.save();
    saveAs(new Blob([pdfBytes], { type: 'application/pdf' }), `${invoiceNumber}.pdf`);
  };

  return (
    <ToolPageLayout title="Invoice Generator" description="Create professional invoices quickly and download them as PDFs.">
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block font-semibold mb-1 text-slate-800 dark:text-gray-200">From</label>
                    <textarea value={from} onChange={e => setFrom(e.target.value)} rows={4} className="w-full p-2 border rounded-md bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-primary shadow-sm dark:shadow-none"></textarea>
                </div>
                <div>
                    <label className="block font-semibold mb-1 text-slate-800 dark:text-gray-200">To</label>
                    <textarea value={to} onChange={e => setTo(e.target.value)} rows={4} className="w-full p-2 border rounded-md bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-primary shadow-sm dark:shadow-none"></textarea>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block font-semibold mb-1 text-slate-800 dark:text-gray-200">Invoice Number</label>
                    <input type="text" value={invoiceNumber} onChange={e => setInvoiceNumber(e.target.value)} className="w-full p-2 border rounded-md bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-primary shadow-sm dark:shadow-none" />
                </div>
                <div>
                    <label className="block font-semibold mb-1 text-slate-800 dark:text-gray-200">Date</label>
                    <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full p-2 border rounded-md bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-primary shadow-sm dark:shadow-none" />
                </div>
            </div>

            <h3 className="font-bold text-lg mt-6 border-t pt-4 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white">Items</h3>
            {items.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                    <input type="text" placeholder="Description" value={item.description} onChange={e => handleItemChange(index, 'description', e.target.value)} className="w-1/2 p-2 border rounded-md bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-primary shadow-sm dark:shadow-none" />
                    <input type="number" placeholder="Quantity" value={item.quantity} onChange={e => handleItemChange(index, 'quantity', parseFloat(e.target.value))} className="w-1/6 p-2 border rounded-md bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-primary shadow-sm dark:shadow-none" />
                    <input type="number" placeholder="Price" value={item.price} onChange={e => handleItemChange(index, 'price', parseFloat(e.target.value))} className="w-1/6 p-2 border rounded-md bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-primary shadow-sm dark:shadow-none" />
                    <span className="w-1/6 text-slate-800 dark:text-gray-200">{(item.quantity * item.price).toFixed(2)}</span>
                    <button onClick={() => removeItem(index)} className="text-red-500 font-bold">X</button>
                </div>
            ))}
            <button onClick={addItem} className="px-4 py-2 bg-slate-200 dark:bg-slate-700 rounded-md text-slate-800 dark:text-gray-200 hover:bg-slate-300 dark:hover:bg-slate-600 shadow-sm">Add Item</button>

            <div className="text-right font-bold text-xl mt-4 text-slate-900 dark:text-white">
                Total: ${calculateTotal()}
            </div>
            
            <div className="text-center mt-8">
                <button onClick={generatePdf} className="w-full sm:w-auto px-12 py-4 text-lg font-semibold text-slate-900 bg-primary rounded-lg shadow-lg hover:bg-opacity-90">Generate PDF Invoice</button>
            </div>
        </div>
    </ToolPageLayout>
  );
};
export default InvoiceGeneratorPage;
