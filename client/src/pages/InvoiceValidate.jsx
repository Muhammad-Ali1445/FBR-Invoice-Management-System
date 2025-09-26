import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Search } from "lucide-react";
import QRCode from "react-qr-code"; // ✅ default export

export default function InvoiceValidator() {
  const [invoiceRefNo, setInvoiceRefNo] = useState("");
  const [sellerNTNCNIC, setSellerNTNCNIC] = useState("");
  const [result, setResult] = useState(null);

  const handleValidate = async () => {
    if (!invoiceRefNo || !sellerNTNCNIC) {
      toast.error("Both Invoice Ref No and Seller NTN/CNIC are required ❌");
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/invoice/validate`,
        { invoiceRefNo, sellerNTNCNIC }
      );

      setResult(res.data);
      console.log("Validation Response:", res.data); // ✅ console after setting state
      toast.success("Validation completed");
    } catch (err) {
      console.error("Validation Error:", err);
      toast.error("Validation failed");
    }
  };

  const renderStatusBadge = (status) => {
    if (!status) return null;
    let color = "bg-gray-400";
    if (status === "Valid") color = "bg-green-500";
    if (status === "Invalid") color = "bg-red-500";

    return (
      <span className={`px-3 py-1 text-white text-sm rounded ${color}`}>
        {status}
      </span>
    );
  };

  const invoice = result?.invoice || result?.localInvoice; // ✅ handle both API shapes

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-10">
      <h2 className="text-2xl font-bold mb-4 text-indigo-600 text-center flex items-center justify-center gap-3">
         Validate Invoice
      </h2>

      {/* Form */}
      <div className="flex flex-col gap-3 max-w-md mx-auto">
        <input
          type="text"
          className="border p-2 rounded"
          placeholder="Invoice Ref No"
          value={invoiceRefNo}
          onChange={(e) => setInvoiceRefNo(e.target.value)}
        />
        <input
          type="text"
          className="border p-2 rounded"
          placeholder="Seller NTN/CNIC"
          value={sellerNTNCNIC}
          onChange={(e) => setSellerNTNCNIC(e.target.value)}
        />
        <button
          onClick={handleValidate}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2 justify-center"
        >
          <Search size={18} /> Validate
        </button>
      </div>

      {/* Result */}
      {invoice && (
        <div className="mt-6 p-6 bg-gray-50 rounded-lg shadow-inner relative">
          <h3 className="font-semibold text-lg text-gray-700 mb-4">
            Validation Result
          </h3>

          {/* Status */}
          <div className="mb-4 flex items-center gap-2">
            {renderStatusBadge(invoice?.status)}
            <span className="text-sm text-gray-700">
              {result?.message || "Invoice validation completed"}
            </span>
          </div>

          {/* QR Code - positioned top right */}
          {invoice?.fbrResponse?.invoiceNumber && (
            <div className="absolute top-6 right-6 flex flex-col items-center">
              <h4 className="font-semibold text-indigo-600 mb-2">Scan QR Code</h4>
              <QRCode value={invoice.fbrResponse.invoiceNumber} size={75} />
              <p className="text-xs text-gray-500 mt-2">
                Scan to verify invoice at FBR
              </p>
            </div>
          )}

          {/* Invoice Details */}
          <div className="space-y-4 mt-4">
            {/* Basic Info */}
            <div>
              <h4 className="font-semibold text-indigo-600">Invoice Info</h4>
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-700 mt-2">
                <p>
                  <b>Type:</b> {invoice.invoiceType}
                </p>
                <p>
                  <b>Date:</b> {invoice.invoiceDate}
                </p>
                <p>
                  <b>Ref No:</b> {invoice.invoiceRefNo}
                </p>
                <p>
                  <b>Scenario ID:</b> {invoice.scenarioId}
                </p>
              </div>
            </div>

            {/* Seller */}
            <div>
              <h4 className="font-semibold text-indigo-600">Seller Info</h4>
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-700 mt-2">
                <p>
                  <b>NTN/CNIC:</b> {invoice.sellerNTNCNIC}
                </p>
                <p>
                  <b>Name:</b> {invoice.sellerBusinessName}
                </p>
                <p>
                  <b>Province:</b> {invoice.sellerProvince}
                </p>
                <p>
                  <b>Address:</b> {invoice.sellerAddress}
                </p>
              </div>
            </div>

            {/* Buyer */}
            <div>
              <h4 className="font-semibold text-indigo-600">Buyer Info</h4>
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-700 mt-2">
                <p>
                  <b>NTN/CNIC:</b> {invoice.buyerNTNCNIC}
                </p>
                <p>
                  <b>Name:</b> {invoice.buyerBusinessName}
                </p>
                <p>
                  <b>Province:</b> {invoice.buyerProvince}
                </p>
                <p>
                  <b>Address:</b> {invoice.buyerAddress}
                </p>
                <p>
                  <b>Reg Type:</b> {invoice.buyerRegistrationType}
                </p>
              </div>
            </div>

            {/* Items */}
            <div>
              <h4 className="font-semibold text-indigo-600">Items</h4>
              <table className="w-full text-sm border mt-2">
                <thead className="bg-gray-200 text-gray-700">
                  <tr>
                    <th className="p-2 border">HS Code</th>
                    <th className="p-2 border">Description</th>
                    <th className="p-2 border">Qty</th>
                    <th className="p-2 border">Rate</th>
                    <th className="p-2 border">Value</th>
                    <th className="p-2 border">Sales Tax</th>
                    <th className="p-2 border">Further Tax</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items?.map((item, idx) => (
                    <tr key={idx} className="text-center">
                      <td className="border p-2">{item.hsCode}</td>
                      <td className="border p-2">{item.productDescription}</td>
                      <td className="border p-2">{item.quantity}</td>
                      <td className="border p-2">{item.rate}</td>
                      <td className="border p-2">{item.totalValues}</td>
                      <td className="border p-2">{item.salesTaxApplicable}</td>
                      <td className="border p-2">{item.furtherTax}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
