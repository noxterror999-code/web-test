import express from 'express';

const router = express.Router();

// Comprehensive oil price data for comparison table
const OIL_PRICES = [
  // PTT
  { brand: 'PTT', fuel_type: 'แก๊สโซฮอล์ 95', price: 31.05 },
  { brand: 'PTT', fuel_type: 'แก๊สโซฮอล์ 91', price: 30.68 },
  { brand: 'PTT', fuel_type: 'แก๊สโซฮอล์ E20', price: 27.84 },
  { brand: 'PTT', fuel_type: 'แก๊สโซฮอล์ E85', price: 25.79 },
  { brand: 'PTT', fuel_type: 'แก๊สโซฮอล์ 95 พรีเมี่ยม', price: 40.04 },
  { brand: 'PTT', fuel_type: 'เบนซิน 95', price: 39.64 },
  { brand: 'PTT', fuel_type: 'ดีเซล', price: 29.94 },
  { brand: 'PTT', fuel_type: 'ดีเซลพรีเมี่ยม', price: 43.44 },
  { brand: 'PTT', fuel_type: 'แก๊ส NGV', price: 16.69 },

  // Bangchak
  { brand: 'Bangchak', fuel_type: 'แก๊สโซฮอล์ 95', price: 31.05 },
  { brand: 'Bangchak', fuel_type: 'แก๊สโซฮอล์ 91', price: 30.68 },
  { brand: 'Bangchak', fuel_type: 'แก๊สโซฮอล์ E20', price: 27.84 },
  { brand: 'Bangchak', fuel_type: 'แก๊สโซฮอล์ E85', price: 25.79 },
  { brand: 'Bangchak', fuel_type: 'แก๊สโซฮอล์ 95 พรีเมี่ยม', price: 49.54 },
  { brand: 'Bangchak', fuel_type: 'ดีเซล', price: 29.94 },
  { brand: 'Bangchak', fuel_type: 'ดีเซลพรีเมี่ยม', price: 45.64 },

  // Shell
  { brand: 'Shell', fuel_type: 'แก๊สโซฮอล์ 95', price: 32.35 },
  { brand: 'Shell', fuel_type: 'แก๊สโซฮอล์ 91', price: 31.78 },
  { brand: 'Shell', fuel_type: 'แก๊สโซฮอล์ E20', price: 28.94 },
  { brand: 'Shell', fuel_type: 'แก๊สโซฮอล์ 95 พรีเมี่ยม', price: 49.84 },
  { brand: 'Shell', fuel_type: 'ดีเซล', price: 29.94 },
  { brand: 'Shell', fuel_type: 'ดีเซลพรีเมี่ยม', price: 49.84 },

  // Caltex
  { brand: 'Caltex', fuel_type: 'แก๊สโซฮอล์ 95', price: 31.05 },
  { brand: 'Caltex', fuel_type: 'แก๊สโซฮอล์ 91', price: 30.68 },
  { brand: 'Caltex', fuel_type: 'แก๊สโซฮอล์ E20', price: 27.84 },
  { brand: 'Caltex', fuel_type: 'เบนซิน 95', price: 49.51 },
  { brand: 'Caltex', fuel_type: 'ดีเซล', price: 29.94 },
  { brand: 'Caltex', fuel_type: 'ดีเซลพรีเมี่ยม', price: 45.64 },

  // IRPC
  { brand: 'IRPC', fuel_type: 'แก๊สโซฮอล์ 95', price: 31.05 },
  { brand: 'IRPC', fuel_type: 'แก๊สโซฮอล์ 91', price: 30.68 },
  { brand: 'IRPC', fuel_type: 'ดีเซล', price: 29.94 },

  // PT
  { brand: 'PT', fuel_type: 'แก๊สโซฮอล์ 95', price: 31.05 },
  { brand: 'PT', fuel_type: 'แก๊สโซฮอล์ 91', price: 30.68 },
  { brand: 'PT', fuel_type: 'แก๊สโซฮอล์ E20', price: 27.84 },
  { brand: 'PT', fuel_type: 'เบนซิน 95', price: 40.14 },
  { brand: 'PT', fuel_type: 'ดีเซล', price: 29.94 },

  // Susco
  { brand: 'Susco', fuel_type: 'แก๊สโซฮอล์ 95', price: 31.05 },
  { brand: 'Susco', fuel_type: 'แก๊สโซฮอล์ 91', price: 30.68 },
  { brand: 'Susco', fuel_type: 'แก๊สโซฮอล์ E20', price: 27.84 },
  { brand: 'Susco', fuel_type: 'เบนซิน 95', price: 39.79 },
  { brand: 'Susco', fuel_type: 'ดีเซล', price: 29.94 },

  // Pure
  { brand: 'Pure', fuel_type: 'แก๊สโซฮอล์ 95', price: 31.05 },
  { brand: 'Pure', fuel_type: 'แก๊สโซฮอล์ 91', price: 30.68 },
  { brand: 'Pure', fuel_type: 'แก๊สโซฮอล์ E20', price: 27.84 },
  { brand: 'Pure', fuel_type: 'ดีเซล', price: 29.94 }
];

router.get('/api/prices', (req, res) => {
  res.json(OIL_PRICES);
});

export default router;
