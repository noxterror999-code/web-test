import express from 'express';

const router = express.Router();

// Hardcoded decoy data
const OIL_PRICES = [
  { brand: 'PTT', fuel_type: 'Diesel', price: 29.94 },
  { brand: 'PTT', fuel_type: 'Gasohol 95', price: 30.55 },
  { brand: 'PTT', fuel_type: 'Gasohol 91', price: 30.18 },
  { brand: 'Shell', fuel_type: 'Diesel', price: 29.94 },
  { brand: 'Shell', fuel_type: 'Gasohol 95', price: 31.85 },
  { brand: 'Shell', fuel_type: 'Gasohol 91', price: 31.28 },
  { brand: 'Bangchak', fuel_type: 'Diesel', price: 29.94 },
  { brand: 'Bangchak', fuel_type: 'Gasohol 95', price: 30.55 },
  { brand: 'PT', fuel_type: 'Diesel', price: 29.94 },
  { brand: 'Caltex', fuel_type: 'Gasohol 95', price: 30.55 }
];

router.get('/api/prices', (req, res) => {
  res.json(OIL_PRICES);
});

export default router;
