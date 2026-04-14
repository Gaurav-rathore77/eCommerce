"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Star } from "lucide-react";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  return (
    <Card className="group overflow-hidden border-0 bg-transparent shadow-none">
      <div className="relative aspect-square overflow-hidden rounded-lg border bg-muted">
        <Link href={`/product/${product.id}`} className="absolute inset-0">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </Link>
        {product.originalPrice && (
          <Badge className="absolute top-3 left-3 bg-red-500 hover:bg-red-600 z-10">
            Sale
          </Badge>
        )}
        <Button
          size="icon"
          className="absolute bottom-3 right-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100 z-10"
          onClick={(e) => {
            e.preventDefault();
            addToCart(product);
          }}
        >
          <ShoppingCart className="h-4 w-4" />
        </Button>
      </div>
      <CardContent className="p-4 px-0">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="font-normal">
              {product.category}
            </Badge>
            <div className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
              <span className="text-sm text-muted-foreground">
                {product.rating} ({product.reviews})
              </span>
            </div>
          </div>
          <Link href={`/product/${product.id}`}>
            <h3 className="font-medium line-clamp-1 hover:underline">{product.name}</h3>
          </Link>
          <div className="flex items-center gap-2">
            <span className="font-bold">${product.price}</span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
