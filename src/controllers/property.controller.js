import Property from "../models/property.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// ─── Create Property ────────────────────────────────────────────────────────
// POST /api/properties
export const createProperty = asyncHandler(async (req, res) => {
  const { title, description, price, type, status, images, address, lat, lng } =
    req.body;

  if (!lat || !lng) {
    return res
      .status(400)
      .json({ message: "lat and lng are required for map placement" });
  }

  const property = await Property.create({
    title,
    description,
    price,
    type,
    status,
    images,
    address,
    agent: req.user._id,
    location: {
      type: "Point",
      coordinates: [parseFloat(lng), parseFloat(lat)], // GeoJSON: [lng, lat]
    },
  });

  res.status(201).json(property);
});

// ─── Get All Properties ──────────────────────────────────────────────────────
// GET /api/properties
export const getProperties = asyncHandler(async (req, res) => {
  const { type, status, minPrice, maxPrice } = req.query;

  const filter = {};
  if (type) filter.type = type;
  if (status) filter.status = status;
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  const properties = await Property.find(filter).populate("agent", "name email phone");
  res.json(properties);
});

// ─── Get Single Property ─────────────────────────────────────────────────────
// GET /api/properties/:id
export const getPropertyById = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id).populate(
    "agent",
    "name email phone"
  );

  if (!property) {
    return res.status(404).json({ message: "Property not found" });
  }

  res.json(property);
});

// ─── Update Property ─────────────────────────────────────────────────────────
// PUT /api/properties/:id
export const updateProperty = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);

  if (!property) {
    return res.status(404).json({ message: "Property not found" });
  }

  // Only the agent who created it or an admin can update
  if (
    property.agent.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    return res.status(403).json({ message: "Not authorized" });
  }

  const { lat, lng, ...rest } = req.body;

  if (lat && lng) {
    rest.location = {
      type: "Point",
      coordinates: [parseFloat(lng), parseFloat(lat)],
    };
  }

  const updated = await Property.findByIdAndUpdate(req.params.id, rest, {
    new: true,
    runValidators: true,
  });

  res.json(updated);
});

// ─── Delete Property ──────────────────────────────────────────────────────────
// DELETE /api/properties/:id
export const deleteProperty = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);

  if (!property) {
    return res.status(404).json({ message: "Property not found" });
  }

  if (
    property.agent.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    return res.status(403).json({ message: "Not authorized" });
  }

  await property.deleteOne();
  res.json({ message: "Property deleted" });
});

// ─── Nearby Properties (GPS Search) ──────────────────────────────────────────
// GET /api/properties/nearby?lat=9.03&lng=38.74&radius=5000
// radius is in meters (default 5km)
export const getNearbyProperties = asyncHandler(async (req, res) => {
  const { lat, lng, radius = 5000 } = req.query;

  if (!lat || !lng) {
    return res
      .status(400)
      .json({ message: "lat and lng query params are required" });
  }

  const properties = await Property.find({
    location: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [parseFloat(lng), parseFloat(lat)],
        },
        $maxDistance: Number(radius), // meters
      },
    },
  }).populate("agent", "name email phone");

  res.json(properties);
});
