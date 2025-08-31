"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

type Product = {
  _id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  visibility: boolean;
};

export default function CustomerPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  // Fetch products from admin panel
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/products"); // your admin API
      const data: Product[] = await res.json();
      setProducts(data.filter((p) => p.visibility)); // Only visible products for customer
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter products based on search query
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 text-center sm:text-left">
        Products
      </h1>

      {/* Search Input */}
      <div className="mb-6 w-full max-w-lg mx-auto sm:mx-0">
        <Input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full"
        />
      </div>

      {loading ? (
        <div className="text-center text-base sm:text-lg">Loading products...</div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center text-base sm:text-lg">No products found.</div>
      ) : (
        <div
          className="
            grid grid-cols-1
            sm:grid-cols-2
            md:grid-cols-3
            lg:grid-cols-4
            xl:grid-cols-5
            gap-6 sm:gap-8
          "
        >
          {filteredProducts.map((product) => (
            <Card
              key={product._id}
              className="shadow hover:shadow-lg transition rounded-xl overflow-hidden relative group flex flex-col"
            >
              {/* Image Section */}
              <CardHeader className="p-0 rounded-t-xl overflow-hidden relative">
                <img
                  src={product.imageUrl || "https://via.placeholder.com/300"}
                  alt={product.name}
                  className="w-full h-48 sm:h-56 md:h-52 lg:h-56 xl:h-64 object-cover"
                />
                {/* Hover Description Overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center p-2 sm:p-4 text-white text-xs sm:text-sm md:text-base text-center rounded-t-xl">
                  {product.description}
                </div>
              </CardHeader>

              {/* Content Section */}
              <CardContent className="flex flex-col flex-1 justify-between p-3 sm:p-4">
                <CardTitle className="text-base sm:text-lg md:text-xl font-semibold line-clamp-2">
                  {product.name}
                </CardTitle>

                <div className="flex items-center justify-between mt-3">
                  <span className="text-gray-700 font-medium text-sm sm:text-base md:text-lg">
                    ${product.price}
                  </span>
                  <Badge
                    className={`${
                      product.visibility
                        ? "bg-green-200 text-green-800"
                        : "bg-red-600 text-white"
                    } text-xs sm:text-sm md:text-base`}
                  >
                    {product.visibility ? "Available" : "Hidden"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
