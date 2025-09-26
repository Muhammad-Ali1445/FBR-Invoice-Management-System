import axios from "axios";
import InvoiceModel from "../models/invoiceModel.js";

// -------------------- Helper Logger --------------------

const logFbrRequest = (type, payload) => {
  console.log(`\n================= FBR ${type} REQUEST =================`);
  console.log(JSON.stringify(payload, null, 2));
  console.log("Scenario:", payload.scenarioId || "N/A");
  if (payload.items) {
    console.log(
      "Sale Types:",
      payload.items.map((i) => i.saleType)
    );
  }
  console.log("========================================================\n");
};

const logFbrResponse = (type, response) => {
  console.log(`\n================= FBR ${type} RESPONSE =================`);
  console.log(JSON.stringify(response, null, 2));
  console.log("=========================================================\n");
};

// -------------------- POST INVOICE --------------------

export const invoicePost = async (req, res) => {
  try {
    const { invoiceRefNo, sellerNTNCNIC } = req.body;

    // 1️⃣ Check for duplicate invoice in DB (by seller + ref no)
    const existing = await InvoiceModel.findOne({
      invoiceRefNo,
      sellerNTNCNIC,
    });
    if (existing) {
      return res.status(400).json({
        success: false,
        message:
          "Invoice already exists with this reference number for this seller",
      });
    }

    // 2️⃣ Save invoice first as PENDING
    const newInvoice = new InvoiceModel({
      ...req.body,
      status: "Pending",
    });
    await newInvoice.save();

    // 3️⃣ Post invoice to FBR
    logFbrRequest("POST", req.body);

    const fbrResponse = await axios.post(
      "https://gw.fbr.gov.pk/di_data/v1/di/postinvoicedata_sb",
      req.body,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.FBR_SANDBOX_TOKEN}`,
        },
      }
    );

    logFbrResponse("POST", fbrResponse.data);

    // 4️⃣ Update status based on FBR response
    const validation = fbrResponse.data?.validationResponse;
    newInvoice.status = validation?.status === "Invalid" ? "Invalid" : "Valid";
    newInvoice.fbrResponse = fbrResponse.data;
    await newInvoice.save();

    res.json({
      success: true,
      message: "Invoice saved and posted to FBR",
      invoice: newInvoice,
    });
  } catch (err) {
    console.error("Invoice posting error:", err.response?.data || err.message);
    res.status(500).json({
      success: false,
      error: err.response?.data || "FBR Error while posting invoice",
    });
  }
};

// -------------------- VALIDATE INVOICE --------------------

export const invoiceValidate = async (req, res) => {
  try {
    const { invoiceRefNo, sellerNTNCNIC } = req.body;

    if (!invoiceRefNo || !sellerNTNCNIC) {
      return res.status(400).json({
        success: false,
        message: "Both invoiceRefNo and sellerNTNCNIC are required",
      });
    }

    // 1️⃣ First check in local DB
    const localInvoice = await InvoiceModel.findOne({
      invoiceRefNo,
      sellerNTNCNIC,
    });
    if (!localInvoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found in local database",
      });
    }

    // 2️⃣ Send full invoice payload from DB to FBR
    const payload = localInvoice.toObject();
    logFbrRequest("VALIDATE", payload);

    const fbrResponse = await axios.post(
      "https://gw.fbr.gov.pk/di_data/v1/di/validateinvoicedata_sb",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.FBR_SANDBOX_TOKEN}`,
        },
      }
    );

    logFbrResponse("VALIDATE", fbrResponse.data);

    // 3️⃣ Update local invoice
    const validation = fbrResponse.data?.validationResponse;

    localInvoice.status =
      validation?.status === "Invalid"
        ? "Invalid"
        : validation?.status === "Valid"
        ? "Valid"
        : "Pending";

    // ✅ Merge fbrResponse correctly (preserve invoiceNumber if FBR doesn’t return it)
    localInvoice.fbrResponse = {
      ...localInvoice.fbrResponse,
      invoiceNumber:
        fbrResponse.data?.invoiceNumber ||
        localInvoice.fbrResponse?.invoiceNumber,
      dated: fbrResponse.data?.dated || localInvoice.fbrResponse?.dated,
      validationResponse: fbrResponse.data?.validationResponse,
    };

    await localInvoice.save();

    res.json({
      success: true,
      message: "Invoice validation completed",
      invoice: localInvoice,
    });
  } catch (err) {
    console.error("Validation error:", err.response?.data || err.message);
    res.status(500).json({
      success: false,
      error: err.response?.data || "FBR validation error",
    });
  }
};
