import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Search } from "lucide-react";

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
      toast.success("Validation completed");
    } catch (err) {
      console.error(err);
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

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-xl mt-10">
     <h2 className="text-2xl font-bold mb-4 text-indigo-600 text-center flex items-center justify-center gap-3">
  <Search className="w-6 h-6" /> Validate Invoice
</h2>

      {/* Form */}
      <div className="flex flex-col gap-3">
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
      {result && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg shadow-inner">
          <h3 className="font-semibold text-lg text-gray-700 mb-2">
            Validation Result
          </h3>

          {/* Local DB Info */}
          {result.localInvoice ? (
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Found in Local DB <br />
                <span className="font-mono text-gray-800">
                  Ref: {result.localInvoice.invoiceRefNo}
                </span>
              </p>
            </div>
          ) : (
            <p className="text-sm text-red-600 mb-4">
              Invoice not found in local DB
            </p>
          )}

          {/* FBR Info */}
          {result.fbrResponse?.validationResponse ? (
            <div>
              <p className="text-sm text-gray-600">FBR Status:</p>
              <div className="flex items-center gap-2 mt-1">
                {renderStatusBadge(
                  result.fbrResponse.validationResponse.status
                )}
                <span className="text-sm text-gray-700">
                  {result.fbrResponse.validationResponse.error ||
                    "No errors reported"}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-yellow-600">
              No response from FBR validation
            </p>
          )}
        </div>
      )}
    </div>
  );
}
