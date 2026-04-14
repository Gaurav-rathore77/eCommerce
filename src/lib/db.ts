import fs from 'fs/promises';
import path from 'path';
import { Product } from '@/types';

const DB_PATH = path.join(process.cwd(), 'data', 'db.json');

interface Database {
  products: Product[];
}

const defaultData: Database = {
  products: [
    {
      id: "1",
      name: "Premium Wireless Headphones",
      description: "Experience crystal-clear audio with our premium wireless headphones. Featuring active noise cancellation, 30-hour battery life, and ultra-comfortable ear cushions for all-day wear.",
      price: 299,
      originalPrice: 399,
      images: [
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop&q=60"
      ],
      category: "Electronics",
      rating: 4.8,
      reviews: 1247,
      inStock: true,
      tags: ["wireless", "noise-cancelling", "premium"]
    },
    {
      id: "2",
      name: "Minimalist Leather Watch",
      description: "A timeless piece that combines classic elegance with modern minimalism. Crafted from genuine Italian leather and featuring a precise Swiss movement.",
      price: 189,
      images: [
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&auto=format&fit=crop&q=60"
      ],
      category: "Accessories",
      rating: 4.6,
      reviews: 892,
      inStock: true,
      tags: ["leather", "minimalist", "classic"]
    },
    {
      id: "3",
      name: "Smart Fitness Tracker",
      description: "Track your health and fitness goals with our advanced smart fitness tracker. Monitors heart rate, sleep patterns, steps, and 25+ workout modes.",
      price: 149,
      originalPrice: 199,
      images: [
        "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=800&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=800&auto=format&fit=crop&q=60"
      ],
      category: "Electronics",
      rating: 4.5,
      reviews: 2156,
      inStock: true,
      tags: ["fitness", "smart", "health"]
    },
    {
      id: "4",
      name: "Designer Canvas Backpack",
      description: "A versatile backpack designed for the modern commuter. Water-resistant canvas exterior, padded laptop compartment, and thoughtful organization pockets.",
      price: 129,
      images: [
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1622560480605-d83c8b1a6f4e?w=800&auto=format&fit=crop&q=60"
      ],
      category: "Accessories",
      rating: 4.7,
      reviews: 634,
      inStock: true,
      tags: ["backpack", "canvas", "travel"]
    },
    {
      id: "5",
      name: "Portable Bluetooth Speaker",
      description: "Take your music anywhere with this compact yet powerful Bluetooth speaker. 360-degree sound, waterproof design, and 12-hour battery life.",
      price: 79,
      originalPrice: 99,
      images: [
        "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=60"
      ],
      category: "Electronics",
      rating: 4.4,
      reviews: 1823,
      inStock: true,
      tags: ["bluetooth", "portable", "waterproof"]
    },
    {
      id: "6",
      name: "Premium Sunglasses",
      description: "Protect your eyes in style with these premium polarized sunglasses. UV400 protection, lightweight titanium frame, and scratch-resistant lenses.",
      price: 249,
      images: [
        "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=60"
      ],
      category: "Accessories",
      rating: 4.9,
      reviews: 445,
      inStock: true,
      tags: ["sunglasses", "polarized", "premium"]
    },
    {
      id: "7",
      name: "Ergonomic Office Chair",
      description: "Work in comfort with this ergonomic office chair. Adjustable lumbar support, breathable mesh back, and customizable armrests for all-day productivity.",
      price: 449,
      originalPrice: 599,
      images: [
        "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=800&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800&auto=format&fit=crop&q=60"
      ],
      category: "Home",
      rating: 4.6,
      reviews: 892,
      inStock: true,
      tags: ["furniture", "ergonomic", "office"]
    },
    {
      id: "8",
      name: "Ceramic Coffee Set",
      description: "Elevate your morning routine with this artisanal ceramic coffee set. Hand-crafted stoneware includes 4 cups and matching saucers in a minimalist design.",
      price: 89,
      images: [
        "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&auto=format&fit=crop&q=60"
      ],
      category: "Home",
      rating: 4.8,
      reviews: 334,
      inStock: true,
      tags: ["ceramic", "coffee", "handcrafted"]
    }
  ]
};

async function ensureDbExists() {
  try {
    await fs.access(path.dirname(DB_PATH));
  } catch {
    await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
  }
  
  try {
    await fs.access(DB_PATH);
  } catch {
    await fs.writeFile(DB_PATH, JSON.stringify(defaultData, null, 2));
  }
}

export async function readDb(): Promise<Database> {
  await ensureDbExists();
  const data = await fs.readFile(DB_PATH, 'utf-8');
  return JSON.parse(data);
}

export async function writeDb(db: Database): Promise<void> {
  await ensureDbExists();
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2));
}

export async function getAllProducts(): Promise<Product[]> {
  const db = await readDb();
  return db.products;
}

export async function getProductById(id: string): Promise<Product | null> {
  const db = await readDb();
  return db.products.find(p => p.id === id) || null;
}

export async function createProduct(product: Omit<Product, 'id'>): Promise<Product> {
  const db = await readDb();
  const newProduct = {
    ...product,
    id: Date.now().toString()
  };
  db.products.push(newProduct);
  await writeDb(db);
  return newProduct;
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
  const db = await readDb();
  const index = db.products.findIndex(p => p.id === id);
  if (index === -1) return null;
  
  db.products[index] = { ...db.products[index], ...updates };
  await writeDb(db);
  return db.products[index];
}

export async function deleteProduct(id: string): Promise<boolean> {
  const db = await readDb();
  const index = db.products.findIndex(p => p.id === id);
  if (index === -1) return false;
  
  db.products.splice(index, 1);
  await writeDb(db);
  return true;
}
