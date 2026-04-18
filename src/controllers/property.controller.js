import Property from '../models/property.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// @desc    Create a new property
// @route   POST /api/properties
// @access  Private (Agent only)
export const createProperty = asyncHandler(async (req, res) => {
    const {
        size,
        type,
        floor,
        price,
        listingType,
        images,
        subcity,
        woreda,
        kebele,
        description,
        bedrooms,
        bathrooms
    } = req.body;

    const property = await Property.create({
        agent: req.user._id,
        size,
        type,
        floor,
        price,
        listingType,
        images,
        subcity,
        woreda,
        kebele,
        description,
        bedrooms,
        bathrooms
    });

    res.status(201).json(property);
});

// @desc    Get all properties with filtering
// @route   GET /api/properties
// @access  Public (with optional auth)
export const getProperties = asyncHandler(async (req, res) => {
    const {
        minPrice,
        maxPrice,
        listingType,
        woreda,
        subcity,
        kebele,
        type,
        minSize,
        maxSize,
        bedrooms,
        status,
        page = 1,
        limit = 10
    } = req.query;

    const query = {};

    if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (listingType) query.listingType = listingType;
    if (woreda) query.woreda = woreda;
    if (subcity) query.subcity = subcity;
    if (kebele) query.kebele = kebele;
    if (type) query.type = type;
    if (bedrooms) query.bedrooms = Number(bedrooms);
    if (status) query.status = status;

    if (minSize || maxSize) {
        query.size = {};
        if (minSize) query.size.$gte = Number(minSize);
        if (maxSize) query.size.$lte = Number(maxSize);
    }

    const skip = (Number(page) - 1) * Number(limit);

    const properties = await Property.find(query)
        .populate('agent', 'name email phone')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit));

    const total = await Property.countDocuments(query);

    // Hide agent phone if user is not logged in
    const sanitizedProperties = properties.map(property => {
        const propertyObj = property.toObject();
        if (!req.user && propertyObj.agent) {
            delete propertyObj.agent.phone;
        }
        return propertyObj;
    });

    res.json({
        properties: sanitizedProperties,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
        total
    });
});

// @desc    Get single property by ID
// @route   GET /api/properties/:id
// @access  Public (with optional auth)
export const getPropertyById = asyncHandler(async (req, res) => {
    const property = await Property.findById(req.params.id).populate('agent', 'name email phone');

    if (!property) {
        return res.status(404).json({ message: 'Property not found' });
    }

    const propertyObj = property.toObject();

    // Hide agent phone if user is not logged in
    if (!req.user && propertyObj.agent) {
        delete propertyObj.agent.phone;
    }

    res.json(propertyObj);
});

// @desc    Update property
// @route   PUT /api/properties/:id
// @access  Private (Owner only)
export const updateProperty = asyncHandler(async (req, res) => {
    const property = await Property.findById(req.params.id);

    if (!property) {
        return res.status(404).json({ message: 'Property not found' });
    }

    // Check if user is the owner
    if (property.agent.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to update this property' });
    }

    const {
        size,
        type,
        floor,
        price,
        listingType,
        images,
        subcity,
        woreda,
        kebele,
        description,
        bedrooms,
        bathrooms,
        status
    } = req.body;

    property.size = size || property.size;
    property.type = type || property.type;
    property.floor = floor || property.floor;
    property.price = price || property.price;
    property.listingType = listingType || property.listingType;
    property.images = images || property.images;
    property.subcity = subcity || property.subcity;
    property.woreda = woreda || property.woreda;
    property.kebele = kebele || property.kebele;
    property.description = description || property.description;
    property.bedrooms = bedrooms || property.bedrooms;
    property.bathrooms = bathrooms || property.bathrooms;
    property.status = status || property.status;

    const updatedProperty = await property.save();

    res.json(updatedProperty);
});

// @desc    Delete property
// @route   DELETE /api/properties/:id
// @access  Private (Owner only)
export const deleteProperty = asyncHandler(async (req, res) => {
    const property = await Property.findById(req.params.id);

    if (!property) {
        return res.status(404).json({ message: 'Property not found' });
    }

    // Check if user is the owner
    if (property.agent.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to delete this property' });
    }

    await property.deleteOne();

    res.json({ message: 'Property removed' });
});
