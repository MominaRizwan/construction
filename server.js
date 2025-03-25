const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fs = require("fs");
require("dotenv").config(); // For environment variables
const path = require("path");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// MongoDB Connection
const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://admin:Mominawah786@cluster0.7i8tx.mongodb.net/construction_management?retryWrites=true&w=majority";

mongoose.set("strictQuery", false);
mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Project Schema & Model
const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  budget: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Project = mongoose.model("Project", projectSchema);

// Supplier Schema & Model
const supplierSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contactPerson: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  materials: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Supplier = mongoose.model("Supplier", supplierSchema);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Project Routes
app.get("/projects", async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/projects", async (req, res) => {
  try {
    const project = new Project(req.body);
    const newProject = await project.save();
    res.status(201).json(newProject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.put("/projects/:id", async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete("/projects/:id", async (req, res) => {
  try {
    const result = await Project.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ message: "Project not found" });
    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Supplier Routes
app.get("/suppliers", async (req, res) => {
  try {
    const suppliers = await Supplier.find().sort({ createdAt: -1 });
    res.json(suppliers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/suppliers", async (req, res) => {
  try {
    const supplier = new Supplier(req.body);
    const newSupplier = await supplier.save();
    res.status(201).json(newSupplier);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.put("/suppliers/:id", async (req, res) => {
  try {
    const supplier = await Supplier.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!supplier)
      return res.status(404).json({ message: "Supplier not found" });
    res.json(supplier);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete("/suppliers/:id", async (req, res) => {
  try {
    const result = await Supplier.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ message: "Supplier not found" });
    res.json({ message: "Supplier deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// JSON Data Import Function
const importJSONData = async () => {
  try {
    const suppliersData = JSON.parse(fs.readFileSync("suppliers.json", "utf8"));
    await Supplier.insertMany(suppliersData, { ordered: false });
    console.log("Suppliers data inserted successfully");

    const projectsData = JSON.parse(fs.readFileSync("projects.json", "utf8"));
    await Project.insertMany(projectsData, { ordered: false });
    console.log("Projects data inserted successfully");
  } catch (error) {
    console.error("Error inserting JSON data:", error);
  }
};

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);

  // Uncomment this if you want to import JSON data when the server starts
  // await importJSONData();
});
