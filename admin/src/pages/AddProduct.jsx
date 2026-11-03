import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Package,
  DollarSign,
  Image as ImageIcon,
  Search,
  Settings,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Eye,
  ShoppingCart,
  Star,
  Award,
  FolderTree,
  RefreshCw,
  Plus,
  Edit3,
  Trash2,
  Layers,
  Sliders,
  ChevronRight,
} from "lucide-react";

const emptyProduct = {
  name: "",
  title: "",
  brand_id: "",
  brand: "",
  parent_category_id: "",
  category_id: "",
  category: "",
  subcategory_id: "",
  description: "",
  mrp: "",
  sellingPrice: "",
  onOffer: false,
  offerPrice: "",
  ageGroup: "3-5 years",
  stockQTY: "25",
  metaTitle: "",
  metaDescription: "",
  metaKeywords: "",
  imageUrl: "",
  images: "",
  attributes: "",
};

const ageGroups = [
  "0-2 years",
  "3-5 years",
  "6-8 years",
  "9-12 years",
  "12+ years",
  "All Ages",
];

const sampleImagePresets = [
  {
    label: "RC Monster Truck",
    url: "https://images.unsplash.com/photo-1594787318286-3d835c1d207f?auto=format&fit=crop&w=600&q=80",
  },
  {
    label: "LEGO Technic",
    url: "https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?auto=format&fit=crop&w=600&q=80",
  },
  {
    label: "Wooden Building Blocks",
    url: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=600&q=80",
  },
  {
    label: "Plush Teddy Bear",
    url: "https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=600&q=80",
  },
];

// ─────────────────────────────────────────────────────────────
// Category & Subcategory Specific Specification Templates
// ─────────────────────────────────────────────────────────────
const CATEGORY_SPECS_CATALOG = [
  // 1. Construction Toys
  {
    id: "construction-toys",
    title: "Construction Toys",
    keywords: ["construction", "construction toys", "builder set"],
    attributes: [
      { name: "Material", placeholder: "e.g. Non-toxic High-Grade ABS Plastic", hint: "Core composition" },
      { name: "Number of Pieces", placeholder: "e.g. 450+ Pieces", hint: "Total pieces count" },
      { name: "Assembly Required", placeholder: "e.g. Yes - Step-by-Step Guide", hint: "Assembly requirement" },
      { name: "Difficulty Level", placeholder: "e.g. Intermediate (Ages 6+)", hint: "Build challenge" },
      { name: "Box Contents", placeholder: "e.g. Bricks, 2 Minifigures, Tools, Manual", hint: "Included parts" },
    ],
  },

  // 2. Building Blocks & LEGO
  {
    id: "building-blocks",
    title: "Building Blocks",
    keywords: ["building blocks", "lego", "bricks", "block", "interlocking"],
    attributes: [
      { name: "Theme / Series", placeholder: "e.g. City / Architecture / Technic / Police", hint: "Model theme line" },
      { name: "Pieces Count", placeholder: "e.g. 520 Pieces", hint: "Total bricks & parts" },
      { name: "Compatible With", placeholder: "e.g. Major interlocking brick brands", hint: "Compatibility" },
      { name: "Model Dimensions", placeholder: "e.g. 28 x 16 x 12 cm", hint: "Finished model size" },
      { name: "Set Number", placeholder: "e.g. 42115", hint: "Official set or model code" },
      { name: "Min Age", placeholder: "e.g. 6+ Years", hint: "Recommended age" },
    ],
  },

  // 3. Metal-Construction Sets
  {
    id: "metal-construction",
    title: "Metal-Construction Sets",
    keywords: ["metal-construction", "metal construction", "meccano", "steel blocks", "metal kit"],
    attributes: [
      { name: "Metal Material", placeholder: "e.g. Stainless Steel & Zinc Alloy Plates", hint: "Metal type" },
      { name: "Tools Included", placeholder: "e.g. Mini Screwdriver & Wrench Included", hint: "Tools in box" },
      { name: "Models Buildable", placeholder: "e.g. 10-in-1 Multimodel Kit", hint: "Assembly possibilities" },
      { name: "Fasteners Count", placeholder: "e.g. 150 Nuts & Bolts", hint: "Hardware" },
    ],
  },

  // 4. Diecast Toys
  {
    id: "diecast-toys",
    title: "Diecast Toys",
    keywords: ["diecast", "diecast toys", "die-cast", "scale model", "metal model"],
    attributes: [
      { name: "Scale", placeholder: "e.g. 1:18 Scale / 1:24 Scale", hint: "Proportional scale" },
      { name: "Material", placeholder: "e.g. Die-Cast Zinc Metal with ABS & Rubber", hint: "Body & parts composition" },
      { name: "Vehicle Brand / Model", placeholder: "e.g. Lamborghini Aventador / Ferrari SF90", hint: "Automobile make" },
      { name: "Official License", placeholder: "e.g. 100% Officially Licensed Authentic Replica", hint: "Licensing authenticity" },
      { name: "Finish / Paint", placeholder: "e.g. Electrostatic Gloss Metallic Coat", hint: "Paint quality" },
    ],
  },

  // 5. Diecast Cars
  {
    id: "diecast-cars",
    title: "Diecast Cars",
    keywords: ["diecast cars", "diecast car", "die cast car", "model car"],
    attributes: [
      { name: "Opening Parts", placeholder: "e.g. Both Doors, Hood & Trunk Openable", hint: "Movable openings" },
      { name: "Steering & Suspension", placeholder: "e.g. Functional Steering & 4-Wheel Spring Suspension", hint: "Chassis features" },
      { name: "Interior Detailing", placeholder: "e.g. High-Precision Detailed Cockpit & Engine Bay", hint: "Interior fidelity" },
      { name: "Action / Wheels", placeholder: "e.g. Free-Rolling Authentic Rubber Tires", hint: "Wheel mechanism" },
    ],
  },

  // 6. Diecast Bikes
  {
    id: "diecast-bikes",
    title: "Diecast Bikes",
    keywords: ["diecast bikes", "diecast bike", "diecast motorcycle", "diecast motorbike", "scale bike"],
    attributes: [
      { name: "Bike Type", placeholder: "e.g. Superbike / Motocross / Cruiser / MotoGP", hint: "Motorcycle classification" },
      { name: "Movable Features", placeholder: "e.g. Working Kickstand, Steerable Handlebars, Rear Spring", hint: "Articulation" },
      { name: "Display Base Included", placeholder: "e.g. Yes - Includes Branded Collector Plinth", hint: "Stand inclusion" },
    ],
  },

  // 7. Diecast Tractors & Heavy Machinery
  {
    id: "diecast-tractors",
    title: "Diecast Tractors",
    keywords: ["diecast tractors", "diecast tractor", "diecast truck", "diecast excavator", "farm toy"],
    attributes: [
      { name: "Machine Type", placeholder: "e.g. Agricultural Tractor / Excavator / Dump Truck", hint: "Machinery type" },
      { name: "Movable Attachments", placeholder: "e.g. Functional Front Loader Arm & Detachable Trailer", hint: "Working parts" },
      { name: "Tire Specs", placeholder: "e.g. Deep-Tread Heavy Duty Rubber Wheels", hint: "Tire tread" },
    ],
  },

  // 8. Remote Control Toys (RC)
  {
    id: "rc-toys",
    title: "Remote Control Toys",
    keywords: ["remote control", "rc", "rc toys", "radio control", "wireless toy"],
    attributes: [
      { name: "Control Frequency", placeholder: "e.g. 2.4GHz Anti-Interference Wireless", hint: "Transmitter frequency" },
      { name: "Remote Range", placeholder: "e.g. 50 - 80 Meters", hint: "Operating distance" },
      { name: "Vehicle Battery", placeholder: "e.g. 7.4V 1200mAh Rechargeable Li-ion (Included)", hint: "Rechargeable pack" },
      { name: "Play Time", placeholder: "e.g. 25 - 30 Minutes per charge", hint: "Runtime" },
      { name: "Charging Time", placeholder: "e.g. 90 - 120 Minutes (USB Fast Charger)", hint: "Charge duration" },
      { name: "Remote Battery", placeholder: "e.g. 2x 1.5V AA Batteries (Not included)", hint: "Transmitter batteries" },
    ],
  },

  // 9. RC Cars & Trucks
  {
    id: "rc-cars",
    title: "RC Cars",
    keywords: ["rc car", "rc cars", "rc truck", "monster truck", "drift car"],
    attributes: [
      { name: "Scale", placeholder: "e.g. 1:14 Scale All-Terrain", hint: "Model size scale" },
      { name: "Top Speed", placeholder: "e.g. Up to 25 km/h", hint: "Maximum vehicle speed" },
      { name: "Drive System", placeholder: "e.g. 4WD All-Wheel Drive with Differential", hint: "Drivetrain" },
      { name: "Shock Absorbers", placeholder: "e.g. Independent Oil-Filled Metal Shocks", hint: "Suspension type" },
    ],
  },

  // 10. Drones & Flying Toys
  {
    id: "drones",
    title: "Drones & Quadcopters",
    keywords: ["drone", "drones", "quadcopter", "helicopter", "flying toy", "fpv"],
    attributes: [
      { name: "Camera Quality", placeholder: "e.g. 1080P HD / 4K FPV Dual Camera (WiFi Live Stream)", hint: "Camera resolution" },
      { name: "Flight Features", placeholder: "e.g. Altitude Hold, 360° Stunt Flip, Headless Mode, One-Key Return", hint: "Smart features" },
      { name: "Flight Time", placeholder: "e.g. 15 - 20 Minutes per battery", hint: "Airtime" },
      { name: "Gyroscope", placeholder: "e.g. 6-Axis Gyro for Ultra-Stable Hovering", hint: "Stabilization" },
    ],
  },

  // 11. Board Games
  {
    id: "board-games",
    title: "Board Games",
    keywords: ["board games", "board game", "tabletop", "family game", "card game"],
    attributes: [
      { name: "Number of Players", placeholder: "e.g. 2 to 6 Players", hint: "Player capacity" },
      { name: "Average Play Time", placeholder: "e.g. 45 - 60 Minutes", hint: "Match length" },
      { name: "Game Genre", placeholder: "e.g. Strategy / Family / Party / Financial", hint: "Play style" },
      { name: "Minimum Age", placeholder: "e.g. 8+ Years", hint: "Target age" },
      { name: "Components Included", placeholder: "e.g. 1 Game Board, 150 Cards, 6 Tokens, 2 Dice, Rulebook", hint: "Box components" },
      { name: "Language", placeholder: "e.g. English", hint: "Game language" },
    ],
  },

  // 12. Puzzles
  {
    id: "puzzles",
    title: "Puzzles",
    keywords: ["puzzle", "puzzles", "jigsaw", "brain teaser", "3d puzzle"],
    attributes: [
      { name: "Pieces Count", placeholder: "e.g. 500 / 1000 Pieces", hint: "Jigsaw parts" },
      { name: "Completed Dimensions", placeholder: "e.g. 70 x 50 cm (27.5 x 19.6 inches)", hint: "Finished size" },
      { name: "Material", placeholder: "e.g. Premium 3-Layer Recycled Cardboard / Wood", hint: "Puzzle board quality" },
      { name: "Difficulty Level", placeholder: "e.g. Intermediate to Advanced", hint: "Challenge level" },
      { name: "Poster Included", placeholder: "e.g. Yes - 1:1 Full Color Reference Poster", hint: "Reference guide" },
    ],
  },

  // 13. Action Figures & Collectibles
  {
    id: "action-figures",
    title: "Action Figures",
    keywords: ["action figure", "action figures", "figure", "figures", "superhero", "marvel", "dc", "anime", "transformers", "collectible"],
    attributes: [
      { name: "Character / Hero", placeholder: "e.g. Spider-Man / Iron Man / Batman / Optimus Prime", hint: "Character name" },
      { name: "Franchise / Universe", placeholder: "e.g. Marvel Cinematic Universe / DC / Anime", hint: "Studio franchise" },
      { name: "Figure Height", placeholder: "e.g. 7 Inches (18 cm)", hint: "Stature" },
      { name: "Points of Articulation", placeholder: "e.g. 22+ Highly Poseable Movable Joints", hint: "Articulation" },
      { name: "Material", placeholder: "e.g. Premium PVC & Die-Cast Elements", hint: "Figure materials" },
      { name: "Accessories Included", placeholder: "e.g. 3 Pairs of Hands, Energy Blast, Blaster, Stand", hint: "Box props" },
    ],
  },

  // 14. Art & Craft
  {
    id: "art-and-craft",
    title: "Art & Craft",
    keywords: ["art & craft", "art and craft", "craft", "painting", "drawing", "clay", "sketching", "beads"],
    attributes: [
      { name: "Craft Activity", placeholder: "e.g. Acrylic Painting / Clay Modeling / DIY Jewelry", hint: "Craft type" },
      { name: "Materials Included", placeholder: "e.g. 12 Paints, 3 Brushes, 1 Palette, 2 Canvases", hint: "Contents" },
      { name: "Non-Toxic & Safe", placeholder: "e.g. 100% Non-Toxic, Odorless & Washable", hint: "Child safety" },
      { name: "Key Skills Developed", placeholder: "e.g. Creativity, Fine Motor Skills, Hand-Eye Coordination", hint: "Learning benefit" },
      { name: "Reusable / Refillable", placeholder: "e.g. Yes - High durability tools", hint: "Reusability" },
    ],
  },

  // 15. DIY Toys
  {
    id: "diy-toys",
    title: "DIY Toys",
    keywords: ["diy", "diy toys", "do it yourself", "maker kit", "experiment kit"],
    attributes: [
      { name: "DIY Project Type", placeholder: "e.g. Solar Robot / Hydraulic Arm / Electronic Alarm", hint: "Project type" },
      { name: "Estimated Build Time", placeholder: "e.g. 60 - 90 Minutes", hint: "Assembly duration" },
      { name: "Tools Required", placeholder: "e.g. No Extra Tools or Glue Needed - All Included", hint: "Tool requirements" },
      { name: "Core Principle Learned", placeholder: "e.g. Solar Energy, Pneumatics, Mechanical Transmission", hint: "Educational concept" },
      { name: "Instruction Guide", placeholder: "e.g. Step-by-Step Color Illustrated Manual", hint: "Manual type" },
    ],
  },

  // 16. Educational & STEM Toys
  {
    id: "educational-toys",
    title: "Educational Toys",
    keywords: ["educational", "educational toys", "stem", "steam", "learning", "science kit", "math"],
    attributes: [
      { name: "Learning Discipline", placeholder: "e.g. STEM (Science, Technology, Engineering, Math)", hint: "Educational focus" },
      { name: "Skills Developed", placeholder: "e.g. Problem Solving, Spatial Reasoning, Logical Thinking", hint: "Skill outcomes" },
      { name: "Number of Activities", placeholder: "e.g. 40+ Hands-on Guided Experiments", hint: "Experiment count" },
      { name: "Manual / Guide Included", placeholder: "e.g. 52-page Illustrated Learning Book Included", hint: "Guide book" },
      { name: "Batteries Required", placeholder: "e.g. 2x AAA Batteries (Not included)", hint: "Power requirements" },
    ],
  },

  // 17. Role-Play & Pretend Play
  {
    id: "role-play-toys",
    title: "Role-Play Toys",
    keywords: ["role-play", "role play", "pretend play", "kitchen set", "doctor set", "dress up", "costume", "playset"],
    attributes: [
      { name: "Theme / Playset", placeholder: "e.g. Master Chef Kitchen Set / Little Doctor Clinic", hint: "Play theme" },
      { name: "Total Accessories", placeholder: "e.g. 36 Realistic Accessories Included", hint: "Piece count" },
      { name: "Interactive Features", placeholder: "e.g. Realistic Sizzling Cooking Sounds & Stove Lights", hint: "Sound / light features" },
      { name: "Material & Safety", placeholder: "e.g. Smooth-Edged BPA-Free ABS Plastic", hint: "Material safety" },
      { name: "Portability / Storage", placeholder: "e.g. Compact Foldable Suitcase / Trolley Case", hint: "Storage type" },
    ],
  },

  // 18. Tent Houses & Play Tents
  {
    id: "tent-houses",
    title: "Tent Houses",
    keywords: ["tent house", "tent houses", "tent", "play tent", "teepee", "playhouse"],
    attributes: [
      { name: "Tent Dimensions", placeholder: "e.g. 135 x 105 x 125 cm (L x W x H)", hint: "Assembled size" },
      { name: "Fabric Material", placeholder: "e.g. Breathable 100% Cotton Canvas / Polyester", hint: "Fabric" },
      { name: "Frame Material", placeholder: "e.g. Heavy-Duty Fiberglass & PVC Poles", hint: "Structure frame" },
      { name: "Child Capacity", placeholder: "e.g. Accommodates 2 - 3 Kids comfortably", hint: "Capacity" },
      { name: "Indoor / Outdoor", placeholder: "e.g. Both Indoor & Backyard Outdoor Safe", hint: "Usage" },
    ],
  },

  // 19. Activity & Outdoor Toys
  {
    id: "activity-toys",
    title: "Activity Toys",
    keywords: ["activity", "activity toys", "outdoor", "sports", "ride on", "scooter", "blaster"],
    attributes: [
      { name: "Play Environment", placeholder: "e.g. Indoor Playroom & Outdoor Backyard", hint: "Usage area" },
      { name: "Physical Skills", placeholder: "e.g. Hand-Eye Coordination, Gross Motor Skills, Balance", hint: "Skills" },
      { name: "Max Weight Capacity", placeholder: "e.g. Up to 50 kg", hint: "Weight limit" },
      { name: "Material & Durability", placeholder: "e.g. UV-Resistant Impact-Proof Polymer", hint: "Durability" },
      { name: "Safety Standards", placeholder: "e.g. Anti-Slip Grips & EN71 / BIS Certified", hint: "Safety certification" },
    ],
  },

  // 20. Dolls & Plush Toys
  {
    id: "dolls-and-plush",
    title: "Dolls & Plush Toys",
    keywords: ["doll", "dolls", "plush", "stuffed", "soft toy", "teddy", "barbie"],
    attributes: [
      { name: "Doll / Plush Height", placeholder: "e.g. 12 Inches (30 cm)", hint: "Height" },
      { name: "Material", placeholder: "e.g. Ultra-Soft Hypoallergenic Plush / Soft Vinyl", hint: "Fabric / material" },
      { name: "Filling Material", placeholder: "e.g. 100% Virgin PP Cotton", hint: "Stuffing" },
      { name: "Washable", placeholder: "e.g. Machine Washable at 30°C / Surface Clean", hint: "Washing instructions" },
      { name: "Accessories Included", placeholder: "e.g. Dress, Shoes, Handbag, Comb Included", hint: "Included items" },
    ],
  },

  // 21. Baby & Toddler Toys
  {
    id: "baby-toddler",
    title: "Baby & Toddler Toys",
    keywords: ["baby", "infant", "toddler", "teether", "rattle", "sensory"],
    attributes: [
      { name: "Age Stage", placeholder: "e.g. 6 to 18 Months (Infant to Toddler)", hint: "Target development stage" },
      { name: "Developmental Benefits", placeholder: "e.g. Sensory Exploration, Teething Relief, Auditory Development", hint: "Benefits" },
      { name: "Safety Material", placeholder: "e.g. 100% Food-Grade Silicone & BPA-Free ABS", hint: "Safety rating" },
      { name: "Sterilization / Cleaning", placeholder: "e.g. Boil-Safe / Dishwasher Safe / Damp Cloth Wipe", hint: "Sanitization" },
    ],
  },

  // 22. Musical Toys
  {
    id: "musical-toys",
    title: "Musical Toys",
    keywords: ["musical", "music", "instrument", "keyboard", "piano", "drum", "guitar", "karaoke"],
    attributes: [
      { name: "Instrument Type", placeholder: "e.g. Electronic Keyboard / Drum Set / Xylophone", hint: "Instrument" },
      { name: "Keys / Notes / Rhythms", placeholder: "e.g. 37 Piano Keys, 8 Tones, 8 Rhythms, 6 Demos", hint: "Audio features" },
      { name: "Microphone Included", placeholder: "e.g. Yes - Real Singing Microphone with Holder", hint: "Mic accessory" },
      { name: "Power Mode", placeholder: "e.g. Dual Power: USB Charging Cable or 4x AA Batteries", hint: "Power source" },
    ],
  },
];

const DEFAULT_GENERAL_SPECS = [
  { name: "Material", placeholder: "e.g. Non-toxic BPA-free Plastic", hint: "Core material" },
  { name: "Recommended Age", placeholder: "e.g. 3 to 8 Years", hint: "Age appropriateness" },
  { name: "Product Dimensions", placeholder: "e.g. 25 x 12 x 10 cm", hint: "L x W x H" },
  { name: "Item Weight", placeholder: "e.g. 450 grams", hint: "Weight" },
  { name: "Safety Certifications", placeholder: "e.g. BIS / EN71 Certified", hint: "Testing standard" },
  { name: "Country of Origin", placeholder: "e.g. India", hint: "Manufacturing country" },
];

const findCategoryTemplate = (categoryName) => {
  if (!categoryName || typeof categoryName !== "string") return null;
  const name = categoryName.toLowerCase().trim();

  // Try matching entries, sorted by longest keyword match first for highest specificity
  for (const entry of CATEGORY_SPECS_CATALOG) {
    if (entry.keywords.some((kw) => name.includes(kw))) {
      return entry;
    }
  }
  return null;
};

const getResolvedCategoryAttributes = (parentCatOrName = "", subCatOrName = "") => {
  const parentObj = typeof parentCatOrName === "object" && parentCatOrName !== null ? parentCatOrName : null;
  const parentName = parentObj ? (parentObj.name || "") : (typeof parentCatOrName === "string" ? parentCatOrName : "");

  const subObj = typeof subCatOrName === "object" && subCatOrName !== null ? subCatOrName : null;
  const subName = subObj ? (subObj.name || "") : (typeof subCatOrName === "string" ? subCatOrName : "");

  const result = [];
  const addedNames = new Set();

  const addAttr = (attr, sourceLabel) => {
    if (!attr || !attr.name) return;
    const key = attr.name.toLowerCase().trim();
    if (!addedNames.has(key)) {
      addedNames.add(key);
      result.push({
        id: attr.id || "attr-" + Math.random().toString(36).substring(2, 9),
        name: attr.name,
        value: "",
        placeholder: attr.placeholder || "",
        hint: attr.hint || "",
        source: sourceLabel,
        isTemplate: true,
      });
    } else {
      // If already present, let subcategory refine placeholder / hint if more specific
      const existing = result.find((a) => a.name.toLowerCase().trim() === key);
      if (existing && attr.placeholder) {
        existing.placeholder = attr.placeholder;
        if (attr.hint) existing.hint = attr.hint;
        if (existing.source !== sourceLabel) {
          existing.source = `${existing.source} › ${sourceLabel}`;
        }
      }
    }
  };

  // 1. Resolve Parent Category Attributes (Check DB custom attributes first!)
  const parentCustomAttrs = Array.isArray(parentObj?.attributes) ? parentObj.attributes : [];
  if (parentCustomAttrs.length > 0) {
    parentCustomAttrs.forEach((a) => addAttr(a, parentName || "Category"));
  } else {
    // Fall back to built-in template catalog if no DB attributes configured
    const pTemplate = findCategoryTemplate(parentName);
    if (pTemplate) {
      pTemplate.attributes.forEach((a) => addAttr(a, parentName || pTemplate.title));
    }
  }

  // 2. Resolve Subcategory Attributes (Check DB custom attributes first!)
  if (subName && subName.toLowerCase().trim() !== parentName.toLowerCase().trim()) {
    const subCustomAttrs = Array.isArray(subObj?.attributes) ? subObj.attributes : [];
    if (subCustomAttrs.length > 0) {
      subCustomAttrs.forEach((a) => addAttr(a, subName));
    } else {
      const sTemplate = findCategoryTemplate(subName);
      if (sTemplate) {
        sTemplate.attributes.forEach((a) => addAttr(a, subName || sTemplate.title));
      }
    }
  }

  // 3. Fallback to default general toy attributes if neither matched any specs
  if (result.length === 0) {
    DEFAULT_GENERAL_SPECS.forEach((a) => addAttr(a, "General Toy"));
  }

  return result;
};

const syncAttributesForCategory = (parentCatOrName = "", subCatOrName = "", currentList = []) => {
  let subArg = subCatOrName;
  let list = [];

  if (Array.isArray(subCatOrName)) {
    // Called as syncAttributesForCategory(cat, currentList)
    list = subCatOrName;
    subArg = "";
  } else {
    // Called as syncAttributesForCategory(parentCat, subCat, currentList)
    list = Array.isArray(currentList) ? currentList : [];
  }

  const templateAttrs = getResolvedCategoryAttributes(parentCatOrName, subArg);

  // Map existing values by attribute name (case-insensitive)
  const existingMap = new Map();
  list.forEach((item) => {
    if (item && item.name) {
      existingMap.set(item.name.toLowerCase().trim(), item.value);
    }
  });

  // Build resolved list based on matching category and subcategory templates
  const matchedList = templateAttrs.map((tmpl) => {
    const val = existingMap.get(tmpl.name.toLowerCase().trim()) || "";
    existingMap.delete(tmpl.name.toLowerCase().trim());
    return {
      ...tmpl,
      value: val,
    };
  });

  // Any remaining custom attributes the user explicitly added
  const customRemaining = list
    .filter((item) => item && item.name && existingMap.has(item.name.toLowerCase().trim()))
    .map((item) => ({
      id: item.id || "attr-" + Math.random().toString(36).substring(2, 9),
      name: item.name,
      value: item.value || "",
      placeholder: item.placeholder || "e.g. Specification value",
      hint: item.hint || "Custom specification",
      source: item.source || "Custom",
      isTemplate: false,
    }));

  return [...matchedList, ...customRemaining];
};

export default function AddProduct() {
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [product, setProduct] = useState(emptyProduct);
  const [attributesList, setAttributesList] = useState([]);
  const [msg, setMsg] = useState({ text: "", type: "", createdId: null });
  const [loading, setLoading] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(false);
  const [activeSection, setActiveSection] = useState("basic");

  // Dynamic Brands & Categories fetched from PostgreSQL
  const [brandsList, setBrandsList] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [loadingMeta, setLoadingMeta] = useState(true);
  const [customBrandMode, setCustomBrandMode] = useState(false);

  const fetchMetadata = async () => {
    setLoadingMeta(true);
    try {
      const [brandRes, catRes] = await Promise.all([
        fetch("/api/admin/brands?limit=100"),
        fetch("/api/admin/categories?limit=100"),
      ]);
      const brandData = await brandRes.json();
      const catData = await catRes.json();

      const bList = brandData.data || [];
      const cList = catData.data || [];
      setBrandsList(bList);
      setCategoriesList(cList);

      // Pre-select first brand & category only if creating a new product
      if (!id) {
        let firstCatName = "";
        setProduct((prev) => {
          const next = { ...prev };
          if (!next.brand_id && bList.length > 0) {
            next.brand_id = bList[0].id;
            next.brand = bList[0].name;
          }
          if (!next.parent_category_id && cList.length > 0) {
            const firstParent = cList.find((c) => !c.parent_id) || cList[0];
            next.parent_category_id = firstParent.id;
            next.category_id = firstParent.id;
            next.category = firstParent.name;
            firstCatName = firstParent.name;
          }
          return next;
        });

        if (firstParent) {
          setAttributesList(syncAttributesForCategory(firstParent, null, []));
        } else {
          setAttributesList([]);
        }
      }
    } catch (err) {
      console.error("Failed to load brands or categories:", err);
    } finally {
      setLoadingMeta(false);
    }
  };

  useEffect(() => {
    fetchMetadata();
  }, []);

  // Fetch product details when editing
  useEffect(() => {
    if (!id) {
      setProduct(emptyProduct);
      return;
    }

    const fetchProductDetails = async () => {
      setLoadingProduct(true);
      try {
        const res = await fetch(`/api/v1/products/${id}`);
        const result = await res.json();
        if (result.success && result.data) {
          const p = result.data;

          let parentCatId = p.categoryObj?.parent_id || "";
          let subCatId = "";
          let catId = p.category_id || "";

          if (p.categoryObj?.parent_id) {
            parentCatId = p.categoryObj.parent_id;
            subCatId = p.category_id;
          } else {
            parentCatId = p.category_id || "";
          }

          const rawImages = Array.isArray(p.images) ? p.images : (p.image ? [p.image] : []);
          const primaryImg = rawImages[0] || p.image || "";
          const imgStr = rawImages.join(", ");

          const currentAttrs = Array.isArray(p.attributes)
            ? p.attributes.map((a) => ({ name: a.attributeName, value: a.attributeValue }))
            : [];
          const parentName = p.categoryObj?.parent?.name || (p.categoryObj?.parent_id ? "" : (p.parentCategory || p.category || ""));
          const subName = p.categoryObj?.parent_id ? (p.categoryObj?.name || p.category || "") : "";
          setAttributesList(syncAttributesForCategory(parentName || p.category, subName, currentAttrs));

          const kwStr = Array.isArray(p.metaKeywords) ? p.metaKeywords.join(", ") : "";

          setProduct({
            name: p.name || "",
            title: p.title || "",
            brand_id: p.brand_id || "",
            brand: p.brand || "",
            parent_category_id: parentCatId,
            category_id: catId,
            category: p.category || "",
            subcategory_id: subCatId,
            description: p.description || "",
            mrp: p.mrp !== null && p.mrp !== undefined ? String(p.mrp) : (p.originalPrice ? String(p.originalPrice) : ""),
            sellingPrice: p.sellingPrice !== null && p.sellingPrice !== undefined ? String(p.sellingPrice) : (p.price ? String(p.price) : ""),
            onOffer: Boolean(p.onOffer),
            offerPrice: p.offerPrice !== null && p.offerPrice !== undefined ? String(p.offerPrice) : "",
            ageGroup: p.ageGroup || "3-5 years",
            stockQTY: String(p.stockQTY ?? p.stock ?? 0),
            metaTitle: p.metaTitle || "",
            metaDescription: p.metaDescription || "",
            metaKeywords: kwStr,
            imageUrl: primaryImg,
            images: imgStr,
            attributes: "",
          });
        } else {
          setMsg({ text: "Could not locate product with ID: " + id, type: "error" });
        }
      } catch (err) {
        console.error("Failed to fetch product for editing:", err);
        setMsg({ text: "Error loading product: " + err.message, type: "error" });
      } finally {
        setLoadingProduct(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  // Filter main/parent categories (where parent_id is null)
  const parentCategories = categoriesList.filter((c) => !c.parent_id);

  // Filter subcategories belonging to currently selected parent category
  const availableSubcategories = product.parent_category_id
    ? categoriesList.filter((c) => c.parent_id === product.parent_category_id)
    : [];

  const handleParentCategoryChange = (e) => {
    const parentId = e.target.value;
    const parentCat = categoriesList.find((c) => c.id === parentId);
    const parentName = parentCat ? parentCat.name : "";
    setProduct((prev) => ({
      ...prev,
      parent_category_id: parentId,
      subcategory_id: "",
      category_id: parentId,
      category: parentName,
    }));
    // Dynamically update attributes for chosen parent category
    setAttributesList((prev) => syncAttributesForCategory(parentCat || parentName, null, prev));
  };

  const handleSubcategoryChange = (e) => {
    const subId = e.target.value;
    const parentCat = categoriesList.find(
      (c) => c.id === product.parent_category_id
    );
    const parentName = parentCat ? parentCat.name : "";

    let subName = "";
    if (subId) {
      const subCat = categoriesList.find((c) => c.id === subId);
      subName = subCat ? subCat.name : "";
      setProduct((prev) => ({
        ...prev,
        subcategory_id: subId,
        category_id: subId,
        category: subName || parentName,
      }));
    } else {
      // Revert back to parent category as primary category
      setProduct((prev) => ({
        ...prev,
        subcategory_id: "",
        category_id: prev.parent_category_id,
        category: parentName,
      }));
    }
    // Dynamically update attributes for BOTH parent category AND subcategory!
    const subCat = subId ? categoriesList.find((c) => c.id === subId) : null;
    setAttributesList((prev) => syncAttributesForCategory(parentCat || parentName, subCat || subName, prev));
  };

  const handleBrandSelectChange = (e) => {
    const bId = e.target.value;
    if (bId === "__NEW__") {
      setCustomBrandMode(true);
      setProduct((prev) => ({ ...prev, brand_id: "", brand: "" }));
    } else {
      const bObj = brandsList.find((b) => b.id === bId);
      setProduct((prev) => ({
        ...prev,
        brand_id: bId,
        brand: bObj ? bObj.name : "",
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct((p) => ({
      ...p,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const setPresetImage = (url) => {
    setProduct((p) => ({
      ...p,
      imageUrl: url,
      images: url,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ text: "", type: "", createdId: null });

    const payload = {
      ...product,
      brand_id: product.brand_id || undefined,
      brand: product.brand ? product.brand.trim() : undefined,
      category_id: product.category_id || undefined,
      category: product.category ? product.category.trim() : undefined,
      mrp: Number(product.mrp) || 0,
      sellingPrice: Number(product.sellingPrice) || Number(product.mrp) || 0,
      offerPrice: product.offerPrice ? Number(product.offerPrice) : null,
      stockQTY: Number(product.stockQTY) || 0,
      metaKeywords:
        typeof product.metaKeywords === "string"
          ? product.metaKeywords
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : [],
      imageUrl:
        typeof product.imageUrl === "string"
          ? product.imageUrl
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : [],
      images:
        typeof product.images === "string"
          ? product.images
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : [],
      attributes: attributesList
        .filter((a) => a && a.name && a.name.trim() && a.value && a.value.trim())
        .map((a) => ({
          attributeName: a.name.trim(),
          attributeValue: a.value.trim(),
        })),
    };

    try {
      const endpoint = isEditMode
        ? `/api/v1/products/${id}`
        : "/api/v1/products";
      const method = isEditMode ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMsg({
          text: isEditMode
            ? "Product updated successfully & saved to PostgreSQL!"
            : "Product successfully created & saved to PostgreSQL!",
          type: "success",
          createdId: data.data?.id || id,
        });
        if (!isEditMode) {
          // Reset form keeping the current category & brand for convenience
          setProduct({
            ...emptyProduct,
            brand_id: product.brand_id,
            brand: product.brand,
            parent_category_id: product.parent_category_id,
            category_id: product.category_id,
            category: product.category,
          });
        }
      } else {
        setMsg({
          text: data.message || `Failed to ${isEditMode ? "update" : "create"} product.`,
          type: "error",
          createdId: null,
        });
      }
    } catch (err) {
      setMsg({ text: err.message, type: "error", createdId: null });
    } finally {
      setLoading(false);
    }
  };

  const sections = [
    { id: "basic", label: "Basic Info", icon: Package },
    { id: "pricing", label: "Pricing & Stock", icon: DollarSign },
    { id: "media", label: "Media & Images", icon: ImageIcon },
    { id: "seo", label: "SEO & Meta", icon: Search },
    { id: "attributes", label: "Attributes", icon: Settings },
  ];

  const inputClass =
    "w-full bg-[#121A2F] border border-indigo-950 rounded-xl px-4 py-2.5 text-slate-100 text-xs font-sans outline-none transition-all duration-200 placeholder:text-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20";
  const selectClass = inputClass + " cursor-pointer [&>option]:bg-[#0E1526]";
  const textareaClass = inputClass + " resize-y min-h-[90px]";
  const labelClass =
    "text-[11px] font-bold text-slate-400 uppercase tracking-wide block mb-1.5";

  // Compute live preview fields
  const previewImg =
    (product.imageUrl && product.imageUrl.split(",")[0]?.trim()) ||
    (product.images && product.images.split(",")[0]?.trim()) ||
    "https://images.unsplash.com/photo-1558060370-d644479cb6f7?auto=format&fit=crop&q=80&w=600";
  const previewPrice =
    Number(product.sellingPrice) || Number(product.mrp) || 0;
  const previewMrp = Number(product.mrp) || 0;
  const previewDiscount =
    previewMrp > previewPrice
      ? `${Math.round(((previewMrp - previewPrice) / previewMrp) * 100)}%`
      : null;

  const selectedParentObj = categoriesList.find(
    (c) => c.id === product.parent_category_id
  );

  const selectedSubObj = product.subcategory_id
    ? categoriesList.find((c) => c.id === product.subcategory_id)
    : null;

  return (
    <div className="space-y-6">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            {isEditMode ? (
              <>
                <Edit3 className="w-6 h-6 text-amber-400" />
                <span>Edit Toy Listing</span>
              </>
            ) : (
              <>
                <Sparkles className="w-6 h-6 text-amber-400" />
                <span>Create New Toy Listing</span>
              </>
            )}
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            {isEditMode
              ? `Update details and inventory for "${product.name || "Product"}" in PostgreSQL.`
              : "Choose brand, category & subcategory from PostgreSQL database."}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchMetadata}
            title="Reload Brands & Categories"
            className="flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-white border border-indigo-950 hover:border-slate-700 bg-[#0E1526] px-3 py-2 rounded-xl transition-all"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${loadingMeta ? "animate-spin text-indigo-400" : ""}`}
            />
            <span className="hidden sm:inline">Refresh DB Data</span>
          </button>

          <Link
            to="/products"
            className="text-xs font-bold text-slate-400 hover:text-white border border-indigo-950 hover:border-slate-700 bg-[#0E1526] px-4 py-2 rounded-xl transition-all"
          >
            ← Back to All Products
          </Link>
        </div>
      </div>

      {/* ── Feedback Alert ── */}
      {msg.text && (
        <div
          className={`p-4 rounded-2xl border flex items-center justify-between gap-4 animate-fadeIn ${
            msg.type === "success"
              ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-300"
              : "bg-rose-950/40 border-rose-500/40 text-rose-300"
          }`}
        >
          <div className="flex items-center gap-3">
            {msg.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            )}
            <span className="text-xs font-semibold">{msg.text}</span>
          </div>
          {msg.createdId && (
            <a
              href={`http://localhost:5173/product/${msg.createdId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-bold underline text-emerald-200 hover:text-white"
            >
              <span>View in Store</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      )}

      {/* ── Two Column Layout (Form + Live Storefront Preview) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Form Column (8 cols) */}
        <div className="lg:col-span-8 bg-[#0E1526] border border-indigo-950/60 rounded-3xl p-6 sm:p-8 shadow-sm">
          {/* Section Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-4 border-b border-indigo-950/60 mb-6">
            {sections.map((s) => {
              const Icon = s.icon;
              const active = activeSection === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setActiveSection(s.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    active
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/25"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/40"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{s.label}</span>
                </button>
              );
            })}
          </div>

          {loadingProduct ? (
            <div className="py-24 text-center space-y-3">
              <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-slate-400 text-xs">Loading toy product details from PostgreSQL...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
            {/* 1. Basic Info Section */}
            {activeSection === "basic" && (
              <div className="space-y-4 animate-fadeIn">
                {/* Product Name */}
                <div>
                  <label className={labelClass}>Product Name *</label>
                  <input
                    name="name"
                    value={product.name}
                    onChange={handleChange}
                    placeholder="e.g. Remote Control Off-Road Truck"
                    required
                    className={inputClass}
                  />
                </div>

                {/* Brand Selection (Dynamic Dropdown + Quick Add Link) */}
                <div className="p-4 rounded-2xl bg-[#090D16]/60 border border-indigo-950/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wide flex items-center gap-2">
                      <Award className="w-4 h-4 text-amber-400" />
                      <span>Brand *</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setCustomBrandMode(!customBrandMode)}
                        className="text-[11px] text-slate-400 hover:text-amber-400 transition-colors"
                      >
                        {customBrandMode
                          ? "← Choose from DB list"
                          : "+ Type custom brand name"}
                      </button>
                      <span className="text-slate-600">|</span>
                      <Link
                        to="/brands"
                        target="_blank"
                        className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                      >
                        <span>Manage Brands</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>

                  {customBrandMode ? (
                    <div>
                      <input
                        name="brand"
                        value={product.brand}
                        onChange={(e) =>
                          setProduct((p) => ({
                            ...p,
                            brand: e.target.value,
                            brand_id: "",
                          }))
                        }
                        placeholder="Type new brand name (e.g. Hot Wheels, Funskool)..."
                        className={inputClass}
                      />
                      <span className="text-[10px] text-slate-500 mt-1 block">
                        Will be automatically created and linked in the database.
                      </span>
                    </div>
                  ) : (
                    <select
                      value={product.brand_id || ""}
                      onChange={handleBrandSelectChange}
                      className={selectClass}
                    >
                      <option value="" disabled>
                        {loadingMeta
                          ? "Loading brands from DB..."
                          : "-- Select Brand from Database --"}
                      </option>
                      {brandsList.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.name}{!b.is_active ? " (Inactive)" : ""} {b.seo_title ? `(${b.seo_title})` : ""}
                        </option>
                      ))}
                      <option value="__NEW__">
                        + Type a new brand name manually...
                      </option>
                    </select>
                  )}
                </div>

                {/* Category & Subcategory Selection (Dynamic Hierarchy) */}
                <div className="p-4 rounded-2xl bg-[#090D16]/60 border border-indigo-950/60 space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wide flex items-center gap-2">
                      <FolderTree className="w-4 h-4 text-indigo-400" />
                      <span>Category & Subcategory Hierarchy *</span>
                    </label>
                    <Link
                      to="/categories"
                      target="_blank"
                      className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                    >
                      <span>Manage Categories</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Main Parent Category */}
                    <div>
                      <span className={labelClass}>
                        1. Main Category (Parent)
                      </span>
                      <select
                        value={product.parent_category_id || ""}
                        onChange={handleParentCategoryChange}
                        className={selectClass}
                      >
                        <option value="" disabled>
                          {loadingMeta
                            ? "Loading categories..."
                            : "-- Select Main Category --"}
                        </option>
                        {parentCategories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}{!c.is_active ? " (Inactive)" : ""}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Subcategory */}
                    <div>
                      <span className={labelClass}>
                        2. Subcategory (Optional)
                      </span>
                      <select
                        value={product.subcategory_id || ""}
                        onChange={handleSubcategoryChange}
                        disabled={availableSubcategories.length === 0}
                        className={`${selectClass} ${
                          availableSubcategories.length === 0
                            ? "opacity-60 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        <option value="">
                          {availableSubcategories.length === 0
                            ? "(No subcategories found under this category)"
                            : `-- None (Keep at "${selectedParentObj?.name || "Main Category"}") --`}
                        </option>
                        {availableSubcategories.map((sub) => (
                          <option key={sub.id} value={sub.id}>
                            ↳ {sub.name}{!sub.is_active ? " (Inactive)" : ""}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Summary of chosen categorization */}
                  <div className="text-[11px] text-slate-400 bg-[#121A2F]/80 p-2.5 rounded-xl border border-indigo-950/40 flex items-center gap-2">
                    <span className="text-slate-500">Selected Path:</span>
                    <span className="font-bold text-slate-200">
                      {selectedParentObj?.name || "None"}
                    </span>
                    {product.subcategory_id && (
                      <>
                        <span className="text-indigo-400 font-bold">›</span>
                        <span className="font-bold text-amber-400">
                          {product.category}
                        </span>
                        <span className="text-[10px] text-slate-500 ml-auto">
                          (Foreign key category_id points to subcategory)
                        </span>
                      </>
                    )}
                    {!product.subcategory_id && selectedParentObj && (
                      <span className="text-[10px] text-slate-500 ml-auto">
                        (Foreign key category_id points to main category)
                      </span>
                    )}
                  </div>

                  {/* ── Category & Subcategory Specifications Panel ── */}
                  <div className="mt-4 pt-4 border-t border-indigo-950/80 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <Sliders className="w-4 h-4 text-amber-400" />
                          <span className="text-xs font-bold text-white tracking-wide">
                            Category Specifications ({attributesList.length})
                          </span>
                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                            {selectedSubObj?.name
                              ? `${selectedParentObj?.name || "Category"} › ${selectedSubObj.name}`
                              : (selectedParentObj?.name || product.category || "General Toys")}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1">
                          Specifications below are automatically mapped for your selected category and subcategory. Fill them in to improve search and details on the storefront.
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            setAttributesList(
                              syncAttributesForCategory(selectedParentObj || product.category, selectedSubObj || null, [])
                            );
                          }}
                          title="Reset to category standard attributes"
                          className="text-[10px] font-bold text-slate-400 hover:text-white bg-[#121A2F] hover:bg-slate-800 border border-indigo-950 px-2.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>Reset Defaults</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setAttributesList((prev) => [
                              ...prev,
                              {
                                id: "attr-" + Math.random().toString(36).substring(2, 9),
                                name: "",
                                value: "",
                                placeholder: "e.g. Specification value",
                                hint: "Custom specification",
                                source: "Custom",
                                isTemplate: false,
                              },
                            ]);
                          }}
                          className="text-[10px] font-bold text-indigo-300 hover:text-white bg-indigo-600/20 hover:bg-indigo-600 border border-indigo-500/30 px-2.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5"
                        >
                          <Plus className="w-3 h-3" />
                          <span>+ Add Spec</span>
                        </button>
                      </div>
                    </div>

                    {/* Quick attribute category badges summary */}
                    <div className="flex flex-wrap items-center gap-1.5 py-1">
                      <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mr-1">
                        Active Templates:
                      </span>
                      {selectedParentObj?.name && (
                        <span className="text-[10px] font-bold bg-indigo-950/60 text-indigo-300 border border-indigo-800/40 px-2 py-0.5 rounded-md flex items-center gap-1">
                          <FolderTree className="w-3 h-3" />
                          <span>{selectedParentObj.name}</span>
                        </span>
                      )}
                      {selectedSubObj?.name && (
                        <span className="text-[10px] font-bold bg-amber-950/40 text-amber-300 border border-amber-800/40 px-2 py-0.5 rounded-md flex items-center gap-1">
                          <ChevronRight className="w-3 h-3" />
                          <span>{selectedSubObj.name}</span>
                        </span>
                      )}
                      {!selectedParentObj?.name && !selectedSubObj?.name && (
                        <span className="text-[10px] font-medium text-slate-500 italic">
                          Standard General Toy specifications
                        </span>
                      )}
                    </div>

                    {/* Attributes Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                      {attributesList.map((attr, idx) => (
                        <div
                          key={attr.id}
                          className="bg-[#121A2F]/70 border border-indigo-950/80 hover:border-indigo-800/60 rounded-xl p-3 flex flex-col justify-between gap-2 transition-all group"
                        >
                          <div className="flex items-center justify-between gap-2">
                            {attr.isTemplate ? (
                              <div className="flex items-center gap-1.5 truncate">
                                <span className="text-xs font-bold text-white tracking-wide truncate">
                                  {attr.name}
                                </span>
                                {attr.source && (
                                  <span className="text-[9px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-1.5 py-0.5 rounded shrink-0">
                                    {attr.source}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <input
                                type="text"
                                placeholder="Specification Name..."
                                value={attr.name}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setAttributesList((prev) =>
                                    prev.map((item, i) =>
                                      i === idx ? { ...item, name: val } : item
                                    )
                                  );
                                }}
                                className="w-full bg-[#090D16] border border-indigo-950 rounded-lg px-2.5 py-1 text-xs text-white font-bold placeholder:text-slate-500 outline-none focus:border-indigo-500"
                              />
                            )}

                            <button
                              type="button"
                              onClick={() => {
                                setAttributesList((prev) => prev.filter((_, i) => i !== idx));
                              }}
                              title="Remove specification"
                              className="text-slate-500 hover:text-rose-400 p-1 rounded-lg hover:bg-rose-950/40 transition-colors shrink-0"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="w-full">
                            <input
                              type="text"
                              placeholder={attr.placeholder || "Enter specification value..."}
                              value={attr.value}
                              onChange={(e) => {
                                const val = e.target.value;
                                setAttributesList((prev) =>
                                  prev.map((item, i) =>
                                    i === idx ? { ...item, value: val } : item
                                  )
                                );
                              }}
                              className="w-full bg-[#090D16] border border-indigo-950/90 rounded-lg px-3 py-2 text-xs text-white placeholder:text-slate-600 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30"
                            />
                            {attr.hint && (
                              <p className="text-[10px] text-slate-500 mt-1 truncate">
                                {attr.hint}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}

                      {attributesList.length === 0 && (
                        <div className="col-span-1 md:col-span-2 p-6 text-center bg-[#090D16]/50 border border-indigo-950/60 rounded-xl">
                          <p className="text-slate-400 text-xs mb-2">
                            No specifications currently assigned.
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              setAttributesList(
                                syncAttributesForCategory(selectedParentObj || product.category, selectedSubObj || null, [])
                              );
                            }}
                            className="text-xs font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3.5 py-1.5 rounded-lg hover:bg-indigo-500/20 transition-all inline-flex items-center gap-1.5"
                          >
                            <RefreshCw className="w-3 h-3" />
                            <span>Load Template Specifications</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Age Group */}
                <div>
                  <label className={labelClass}>Target Age Group</label>
                  <select
                    name="ageGroup"
                    value={product.ageGroup}
                    onChange={handleChange}
                    className={selectClass}
                  >
                    {ageGroups.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Catchy Title */}
                <div>
                  <label className={labelClass}>Catchy Title / Headline</label>
                  <input
                    name="title"
                    value={product.title}
                    onChange={handleChange}
                    placeholder="e.g. 1:18 Scale High-Speed Racing Machine"
                    className={inputClass}
                  />
                </div>

                {/* Detailed Description */}
                <div>
                  <label className={labelClass}>Detailed Description</label>
                  <textarea
                    name="description"
                    value={product.description}
                    onChange={handleChange}
                    placeholder="Provide full description of features, materials, and safety guidelines..."
                    className={textareaClass}
                  />
                </div>
              </div>
            )}

            {/* 2. Pricing & Stock Section */}
            {activeSection === "pricing" && (
              <div className="space-y-4 animate-fadeIn">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>MRP (Maximum Retail Price) ₹ *</label>
                    <input
                      type="number"
                      name="mrp"
                      value={product.mrp}
                      onChange={handleChange}
                      placeholder="e.g. 2999"
                      required
                      min="0"
                      step="any"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Selling Price ₹ *</label>
                    <input
                      type="number"
                      name="sellingPrice"
                      value={product.sellingPrice}
                      onChange={handleChange}
                      placeholder="e.g. 2499"
                      required
                      min="0"
                      step="any"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center pt-2">
                  <div>
                    <label className={labelClass}>Stock Quantity (Units)</label>
                    <input
                      type="number"
                      name="stockQTY"
                      value={product.stockQTY}
                      onChange={handleChange}
                      placeholder="e.g. 25"
                      min="0"
                      className={inputClass}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        name="onOffer"
                        checked={product.onOffer}
                        onChange={handleChange}
                        className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 bg-[#121A2F] border-indigo-950"
                      />
                      <span className="text-xs font-bold text-slate-200">
                        Mark as Special Deal / Offer
                      </span>
                    </label>

                    {product.onOffer && (
                      <input
                        type="number"
                        name="offerPrice"
                        value={product.offerPrice}
                        onChange={handleChange}
                        placeholder="Offer Price ₹ (Optional)"
                        min="0"
                        step="any"
                        className={inputClass}
                      />
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 3. Media & Images Section */}
            {activeSection === "media" && (
              <div className="space-y-4 animate-fadeIn">
                <div>
                  <label className={labelClass}>
                    Main Image URL (or comma-separated list of image URLs)
                  </label>
                  <input
                    name="imageUrl"
                    value={product.imageUrl}
                    onChange={handleChange}
                    placeholder="https://images.unsplash.com/... or paste image CDN link"
                    className={inputClass}
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Direct public URLs render immediately on customer storefront and in the preview card.
                  </p>
                </div>

                {/* Preset image suggestions for quick demo creation */}
                <div className="pt-2">
                  <span className="text-[11px] font-bold text-slate-400 block mb-2">
                    Quick Sample Toy Images (Click to use):
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {sampleImagePresets.map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => setPresetImage(preset.url)}
                        className="bg-[#121A2F] hover:bg-slate-800 border border-indigo-950 hover:border-indigo-600/40 p-2 rounded-xl text-left transition-all group"
                      >
                        <img
                          src={preset.url}
                          alt={preset.label}
                          className="w-full h-20 object-cover rounded-lg mb-1.5 group-hover:scale-102 transition-transform"
                        />
                        <span className="text-[10px] font-semibold text-slate-300 block truncate">
                          {preset.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 4. SEO & Meta Section */}
            {activeSection === "seo" && (
              <div className="space-y-4 animate-fadeIn">
                <div>
                  <label className={labelClass}>Meta Title (Browser Tab Title)</label>
                  <input
                    name="metaTitle"
                    value={product.metaTitle}
                    onChange={handleChange}
                    placeholder="e.g. High-Speed RC Monster Truck | Buy Online at ToyCulture"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Meta Description (Search Snippet)</label>
                  <textarea
                    name="metaDescription"
                    value={product.metaDescription}
                    onChange={handleChange}
                    placeholder="Brief description that appears in Google search engine results..."
                    className={textareaClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    Meta Keywords (comma-separated)
                  </label>
                  <input
                    name="metaKeywords"
                    value={product.metaKeywords}
                    onChange={handleChange}
                    placeholder="rc truck, toy car, rechargeable, off-road"
                    className={inputClass}
                  />
                </div>
              </div>
            )}

            {/* 5. Attributes Section (Category-Dependent) */}
            {activeSection === "attributes" && (
              <div className="space-y-5 animate-fadeIn">
                {/* Category Banner */}
                <div className="bg-[#121A2F] border border-indigo-950/80 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                      <Layers className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-2">
                        <span>Specifications for:</span>
                        <span className="text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-lg border border-indigo-500/20">
                          {selectedSubObj?.name ? `${selectedParentObj?.name || "Category"} › ${selectedSubObj.name}` : (selectedParentObj?.name || product.category || "General Toys")}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Showing attributes tailored for the{" "}
                        <span className="text-slate-300 font-semibold">{product.category || "General"}</span> category.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setAttributesList(syncAttributesForCategory(selectedParentObj || product.category, selectedSubObj || null, []));
                      }}
                      title="Reset to category standard attributes"
                      className="text-[11px] font-bold text-slate-400 hover:text-white bg-[#0E1526] hover:bg-slate-800 border border-indigo-950 px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Reset Defaults</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setAttributesList((prev) => [
                          ...prev,
                          {
                            id: "attr-" + Math.random().toString(36).substring(2, 9),
                            name: "",
                            value: "",
                            placeholder: "e.g. Special Feature",
                            hint: "Custom specification",
                            isTemplate: false,
                          },
                        ]);
                      }}
                      className="text-[11px] font-bold text-indigo-300 hover:text-white bg-indigo-600/20 hover:bg-indigo-600 border border-indigo-500/30 px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ Add Custom Attribute</span>
                    </button>
                  </div>
                </div>

                {/* Attributes Form Grid */}
                <div className="space-y-3">
                  {attributesList.map((attr, idx) => (
                    <div
                      key={attr.id}
                      className="bg-[#090D16]/60 border border-indigo-950/70 hover:border-indigo-900/60 rounded-2xl p-3.5 flex flex-col md:flex-row items-stretch md:items-center gap-3 transition-all"
                    >
                      {/* Attribute Name Column */}
                      <div className="md:w-1/3 shrink-0">
                        {attr.isTemplate ? (
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-white tracking-wide">
                              {attr.name}
                            </span>
                            <span className="text-[10px] text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md font-medium">
                              {attr.source || "Standard"}
                            </span>
                          </div>
                        ) : (
                          <input
                            type="text"
                            placeholder="Attribute Name (e.g. Weight)"
                            value={attr.name}
                            onChange={(e) => {
                              const val = e.target.value;
                              setAttributesList((prev) =>
                                prev.map((item, i) =>
                                  i === idx ? { ...item, name: val } : item
                                )
                              );
                            }}
                            className="w-full bg-[#121A2F] border border-indigo-950 rounded-xl px-3 py-2 text-xs text-white font-bold placeholder:text-slate-500 outline-none focus:border-indigo-500"
                          />
                        )}
                        {attr.hint && (
                          <p className="text-[10px] text-slate-500 mt-1 truncate">
                            {attr.hint}
                          </p>
                        )}
                      </div>

                      {/* Attribute Value Column */}
                      <div className="flex-1 flex items-center gap-2">
                        <input
                          type="text"
                          placeholder={attr.placeholder || "Enter specification value..."}
                          value={attr.value}
                          onChange={(e) => {
                            const val = e.target.value;
                            setAttributesList((prev) =>
                              prev.map((item, i) =>
                                i === idx ? { ...item, value: val } : item
                              )
                            );
                          }}
                          className="w-full bg-[#121A2F] border border-indigo-950 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30"
                        />

                        <button
                          type="button"
                          onClick={() => {
                            setAttributesList((prev) => prev.filter((_, i) => i !== idx));
                          }}
                          title="Remove this attribute"
                          className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 rounded-xl transition-colors shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {attributesList.length === 0 && (
                    <div className="p-8 text-center bg-[#121A2F]/40 border border-indigo-950/50 rounded-2xl">
                      <p className="text-slate-400 text-xs mb-3">
                        No specifications added yet for this product.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setAttributesList(syncAttributesForCategory(selectedParentObj || product.category, selectedSubObj || null, []));
                        }}
                        className="text-xs font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-4 py-2 rounded-xl hover:bg-indigo-500/20 transition-all inline-flex items-center gap-2"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Load Attributes for {product.category || "General Toys"}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Navigation & Submit Toolbar */}
            <div className="pt-4 border-t border-indigo-950/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {activeSection !== "basic" && (
                  <button
                    type="button"
                    onClick={() => {
                      const idx = sections.findIndex((s) => s.id === activeSection);
                      if (idx > 0) setActiveSection(sections[idx - 1].id);
                    }}
                    className="text-xs font-semibold text-slate-400 hover:text-white px-3 py-2 rounded-xl hover:bg-slate-800/40 transition-colors"
                  >
                    ← Previous
                  </button>
                )}

                {activeSection !== "attributes" && (
                  <button
                    type="button"
                    onClick={() => {
                      const idx = sections.findIndex((s) => s.id === activeSection);
                      if (idx < sections.length - 1)
                        setActiveSection(sections[idx + 1].id);
                    }}
                    className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 px-3 py-2 rounded-xl hover:bg-indigo-950/40 transition-colors"
                  >
                    Next Step →
                  </button>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || loadingProduct}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs px-6 py-3 rounded-xl shadow-lg shadow-orange-500/25 active:scale-95 transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>Saving to PostgreSQL...</span>
                  </>
                ) : isEditMode ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Update Product Listing</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Publish Toy Listing</span>
                  </>
                )}
              </button>
            </div>
          </form>
          )}
        </div>

        {/* Live Customer Storefront Card Preview (4 cols) */}
        <div className="lg:col-span-4 space-y-3 sticky top-24">
          <div className="flex items-center justify-between text-xs px-1">
            <span className="font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-indigo-400" />
              <span>Live Storefront Preview</span>
            </span>
            <span className="text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-full font-bold">
              Real-time
            </span>
          </div>

          {/* Customer Store Product Card Simulation */}
          <div className="bg-white rounded-2xl p-4 shadow-xl border border-gray-100 flex flex-col font-sans text-[#0F243E] max-w-[320px] mx-auto">
            {/* Card Top / Image */}
            <div className="relative aspect-square mb-3 bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center p-3">
              {previewDiscount && (
                <div className="absolute top-2 left-2 bg-[#F96515] text-white text-[10px] font-black px-2 py-0.5 rounded-md z-10 shadow-xs">
                  -{previewDiscount}
                </div>
              )}
              {product.onOffer && (
                <div className="absolute top-2 right-2 bg-amber-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-md z-10">
                  Deal
                </div>
              )}
              <img
                src={previewImg}
                alt="Preview"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src =
                    "https://images.unsplash.com/photo-1558060370-d644479cb6f7?auto=format&fit=crop&q=80&w=600";
                }}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Badges: Brand & Category */}
            <div className="flex items-center gap-1.5 flex-wrap mb-1.5">
              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded uppercase tracking-wider">
                {product.brand || "ToyCulture Brand"}
              </span>
              {product.category && (
                <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200/60 px-2 py-0.5 rounded">
                  {selectedParentObj && product.subcategory_id
                    ? `${selectedParentObj.name} › ${product.category}`
                    : product.category}
                </span>
              )}
            </div>

            <h3 className="text-sm font-bold text-[#0F243E] leading-tight mb-2 line-clamp-2 min-h-[38px]">
              {product.name || "Toy Product Name Preview"}
            </h3>

            {/* Stars */}
            <div className="flex items-center gap-1 mb-3">
              <div className="flex items-center text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-current" />
                ))}
              </div>
              <span className="text-[11px] font-bold text-gray-600 ml-1">4.8</span>
              <span className="text-[11px] text-gray-400">(0)</span>
            </div>

            {/* Category Specs Pills */}
            {attributesList.filter((a) => a.value).length > 0 && (
              <div className="mb-3 flex flex-wrap gap-1">
                {attributesList
                  .filter((a) => a.value)
                  .slice(0, 3)
                  .map((a, i) => (
                    <span
                      key={i}
                      className="text-[9px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium truncate max-w-[140px]"
                    >
                      <strong className="text-slate-900">{a.name}:</strong> {a.value}
                    </span>
                  ))}
              </div>
            )}

            {/* Price & Add to Cart button */}
            <div className="mt-auto pt-2 border-t border-gray-100">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-lg font-black text-[#0F243E]">
                  ₹{previewPrice.toLocaleString()}
                </span>
                {previewMrp > previewPrice && (
                  <span className="text-xs text-gray-400 line-through">
                    ₹{previewMrp.toLocaleString()}
                  </span>
                )}
              </div>

              <div className="w-full bg-[#F96515] text-white text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-1.5 shadow-sm">
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Add to Cart</span>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 text-center px-4">
            This is how your product will immediately render on the customer storefront.
          </p>
        </div>
      </div>
    </div>
  );
}
