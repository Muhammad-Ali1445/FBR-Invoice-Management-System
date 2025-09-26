import { useState } from "react";
import axios from "axios";
import { PlusCircle, Trash2, Send, FileMinus2 } from "lucide-react";
import toast from "react-hot-toast";

export default function InvoiceForm() {
  const [formData, setFormData] = useState({
    invoiceType: "Sale Invoice",
    invoiceDate: "",
    sellerNTNCNIC: "",
    sellerBusinessName: "",
    sellerProvince: "",
    sellerAddress: "",
    buyerNTNCNIC: "",
    buyerBusinessName: "",
    buyerProvince: "",
    buyerAddress: "",
    buyerRegistrationType: "Registered",
    invoiceRefNo: "",
    scenarioId: "SN001",
    items: [
      {
        hsCode: "",
        productDescription: "",
        rate: "18%",
        uoM: "",
        quantity: 1,
        totalValues: 0,
        valueSalesExcludingST: 0,
        fixedNotifiedValueOrRetailPrice: 0.0,
        salesTaxApplicable: 360.0,
        salesTaxWithheldAtSource: 0.0,
        extraTax: 0.0,
        furtherTax: 120.0,
        sroScheduleNo: "",
        fedPayable: 0.0,
        discount: 0.0,
        saleType: "Goods at standard rate (default)",
        sroItemSerialNo: "",
      },
    ],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "scenarioId") {
      let buyerType = formData.buyerRegistrationType;
      if (["SN001", "SN005", "SN006", "SN007"].includes(value)) {
        buyerType = "Registered";
      }
      if (value === "SN002") {
        buyerType = "Unregistered";
      }
      setFormData({
        ...formData,
        scenarioId: value,
        buyerRegistrationType: buyerType,
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleItemChange = (index, e) => {
    const newItems = [...formData.items];
    newItems[index][e.target.name] = e.target.value;
    setFormData({ ...formData, items: newItems });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [
        ...formData.items,
        {
          hsCode: "",
          productDescription: "",
          rate: "0%",
          uoM: "",
          quantity: 1,
          totalValues: 0,
          valueSalesExcludingST: 0,
        },
      ],
    });
  };

  const deleteItem = (index) => {
    if (formData.items.length === 1) return;
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
    toast.success("Item removed");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token"); // token saved at login

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/invoice/post`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // 👈 required
          },
        }
      );

      toast.success("Invoice submitted successfully! ✅");
      console.log(res.data);
    } catch (err) {
      if (err.response?.status === 400) {
        toast.error("Invoice already exists");
      } else if (err.response?.status === 401) {
        toast.error("Unauthorized: Please log in again");
      } else {
        toast.error("Error submitting invoice");
      }
      console.error(err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-8 bg-gradient-to-r from-indigo-50 to-purple-50 shadow-xl rounded-2xl">
      <h2 className="text-4xl font-extrabold mb-8 text-center text-indigo-700 flex items-center justify-center gap-4">
        <FileMinus2 className="w-8 h-8" /> Create Invoice
      </h2>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* ---- Seller & Buyer Info side by side ----- */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ------ Seller ------- */}

          <div className="p-5 bg-white rounded-xl shadow-lg hover:shadow-xl transition">
            <h3 className="font-bold text-lg text-indigo-600 mb-3">
              Seller Info
            </h3>
            <input
              className="border p-2 w-full mb-2 rounded"
              name="sellerNTNCNIC"
              placeholder="Seller NTN/CNIC"
              onChange={handleChange}
            />
            <input
              className="border p-2 w-full mb-2 rounded"
              name="sellerBusinessName"
              placeholder="Seller Business Name"
              onChange={handleChange}
            />
            <input
              className="border p-2 w-full mb-2 rounded"
              name="sellerProvince"
              placeholder="Seller Province"
              onChange={handleChange}
            />
            <input
              className="border p-2 w-full rounded"
              name="sellerAddress"
              placeholder="Seller Address"
              onChange={handleChange}
            />
          </div>

          {/* Buyer */}
          <div className="p-5 bg-white rounded-xl shadow-lg hover:shadow-xl transition">
            <h3 className="font-bold text-lg text-indigo-600 mb-3">
              Buyer Info
            </h3>
            <input
              className="border p-2 w-full mb-2 rounded"
              name="buyerNTNCNIC"
              placeholder="Buyer NTN/CNIC"
              onChange={handleChange}
            />
            <input
              className="border p-2 w-full mb-2 rounded"
              name="buyerBusinessName"
              placeholder="Buyer Business Name"
              onChange={handleChange}
            />
            <input
              className="border p-2 w-full mb-2 rounded"
              name="buyerProvince"
              placeholder="Buyer Province"
              onChange={handleChange}
            />
            <input
              className="border p-2 w-full mb-2 rounded"
              name="buyerAddress"
              placeholder="Buyer Address"
              onChange={handleChange}
            />
          </div>
        </div>

        {/* ---- Invoice Info ---- */}

        <div className="p-5 bg-white rounded-xl shadow-lg hover:shadow-xl transition">
          <h3 className="font-bold text-lg text-indigo-600 mb-3">
            Invoice Info
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="date"
              className="border p-2 w-full rounded"
              name="invoiceDate"
              onChange={handleChange}
            />
            <input
              className="border p-2 w-full rounded"
              name="invoiceRefNo"
              placeholder="Invoice Ref No"
              onChange={handleChange}
            />

            <select
              className="border p-2 w-full rounded"
              name="scenarioId"
              onChange={handleChange}
            >
              <option value="SN001">
                SN001 - Goods at standard rate (default)
              </option>
              <option value="SN002">SN002 - Standard Rate Unregistered</option>
              <option value="SN005">SN005 - Reduced Rate</option>
              <option value="SN006">SN006 - Exempt</option>
              <option value="SN007">SN007 - Zero Rated</option>
              <option value="SN016">SN016 - Processing</option>
              <option value="SN017">SN017 - FED in ST Mode</option>
              <option value="SN018">SN018 - Services FED in ST</option>
              <option value="SN019">SN019 - Services</option>
              <option value="SN024">SN024 - Goods in SRO</option>
            </select>
            <input
              type="text"
              name="buyerRegistrationType"
              value={formData.buyerRegistrationType}
              readOnly
              className="border p-2 w-full rounded"
            />
          </div>
        </div>

        {/* ------ Items ----- */}

        <div className="p-5 bg-white rounded-xl shadow-lg hover:shadow-xl transition">
          <h3 className="font-bold text-lg text-indigo-600 mb-3">
            Invoice Items
          </h3>
          {formData.items.map((item, index) => (
            <div
              key={index}
              className="border border-gray-200 bg-gray-50 p-4 mb-4 rounded-lg shadow-sm hover:shadow-md transition"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                <input
                  className="border p-2 rounded"
                  name="hsCode"
                  placeholder="HS Code"
                  onChange={(e) => handleItemChange(index, e)}
                />
                <input
                  className="border p-2 rounded"
                  name="productDescription"
                  placeholder="Product Description"
                  onChange={(e) => handleItemChange(index, e)}
                />
                <input
                  className="border p-2 rounded"
                  name="uoM"
                  placeholder="Unit of Measure"
                  onChange={(e) => handleItemChange(index, e)}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  type="number"
                  className="border p-2 rounded"
                  name="quantity"
                  placeholder="Quantity"
                  onChange={(e) => handleItemChange(index, e)}
                />
                <input
                  type="number"
                  className="border p-2 rounded"
                  name="totalValues"
                  placeholder="Total Value"
                  onChange={(e) => handleItemChange(index, e)}
                />
                <input
                  type="number"
                  className="border p-2 rounded"
                  name="valueSalesExcludingST"
                  placeholder="Value Excluding ST"
                  onChange={(e) => handleItemChange(index, e)}
                />
              </div>
              <button
                type="button"
                onClick={() => deleteItem(index)}
                className="mt-8 flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition float-right"
              >
                <Trash2 size={18} /> Delete Item
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addItem}
            className="mt-2 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded transition"
          >
            <PlusCircle size={18} /> Add Item
          </button>
        </div>

        {/* ------ Submit ----- */}

        <div className="text-center">
          <button
            type="submit"
            className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg text-lg font-semibold shadow-md transition mx-auto"
          >
            <Send size={20} /> Submit Invoice
          </button>
        </div>
      </form>
    </div>
  );
}
