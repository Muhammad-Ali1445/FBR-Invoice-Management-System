import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  hsCode: { type: String, required: true },
  productDescription: { type: String, required: true },
  rate: { type: String, required: true },
  uoM: { type: String, required: true },
  quantity: { type: Number, required: true },
  totalValues: { type: Number, required: true },
  valueSalesExcludingST: { type: Number, required: true },
  fixedNotifiedValueOrRetailPrice: { type: Number, default: 0 },
  salesTaxApplicable: { type: Number, default: 0 },
  salesTaxWithheldAtSource: { type: Number, default: 0 },
  extraTax: { type: Number, default: 0 },
  furtherTax: { type: Number, default: 0 },
  sroScheduleNo: { type: String, default: "" },
  fedPayable: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  saleType: {
    type: String,
    enum: [
      "Goods at standard rate (default)",
      "Standard Rate Unregistered",
      "Reduced Rate",
      "Exempt Sale",
      "Zero Rated",
      "Processing / Conversion",
      "FED in ST Mode",
      "Services FED in ST",
      "Services",
      "Goods under SRO 297(1)/2023",
    ],
    required: true,
  },
  sroItemSerialNo: { type: String, default: "" },
});

const invoiceSchema = new mongoose.Schema(
  {
    invoiceType: { type: String, required: true },
    invoiceDate: { type: String, required: true },
    sellerNTNCNIC: { type: String, required: true },
    sellerBusinessName: { type: String, required: true },
    sellerProvince: { type: String },
    sellerAddress: { type: String },

    buyerNTNCNIC: { type: String },
    buyerBusinessName: { type: String },
    buyerProvince: { type: String },
    buyerAddress: { type: String },
    buyerRegistrationType: { type: String },

    invoiceRefNo: { type: String, required: true, unique: true },
    scenarioId: { type: String, required: true },

    items: [itemSchema],
    fbrResponse: { type: Object },

    status: {
      type: String,
      enum: ["Pending", "Valid", "Invalid"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

const InvoiceModel = mongoose.model("Invoice", invoiceSchema);
export default InvoiceModel;
