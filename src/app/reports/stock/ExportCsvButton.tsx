"use client";

import { Download } from "lucide-react";

type ProductExportProps = {
  name: string;
  sku: string | null;
  price: number;
  stock: number;
};

export default function ExportCsvButton({ products }: { products: ProductExportProps[] }) {
  const handleExport = () => {
    try {
      const headers = ["Product", "SKU", "Price (KES)", "Stock", "Valuation (KES)"];
      
      const rows = products.map(p => [
        `"${String(p.name || '').replace(/"/g, '""')}"`, // Escape quotes
        `"${String(p.sku || 'N/A').replace(/"/g, '""')}"`,
        Number(p.price) || 0,
        Number(p.stock) || 0,
        (Number(p.stock) || 0) * (Number(p.price) || 0)
      ]);

      const csvContent = [
        headers.join(","),
        ...rows.map(e => e.join(","))
      ].join("\n");

      // Prepend BOM to ensure Excel reads UTF-8 correctly
      const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `stock_report_${new Date().toISOString().split('T')[0]}.csv`);
      
      // Append, click, and cleanup
      document.body.appendChild(link);
      link.click();
      
      // Delay cleanup to ensure download completes on all browsers
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 100);
    } catch (e) {
      console.error("Export CSV failed: ", e);
      alert("Failed to export CSV. Please try again.");
    }
  };

  return (
    <button 
      type="button"
      onClick={handleExport}
      className="flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-sm transition-all shadow-lg shadow-blue-500/20 active:scale-95"
    >
      <Download size={20} />
      <span>Export CSV</span>
    </button>
  );
}
