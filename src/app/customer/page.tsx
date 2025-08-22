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
    <div className="p-4 sm:p-6">
      <h1 className="text-3xl font-bold mb-4 text-center sm:text-left">Products</h1>

      {/* Search Input */}
      <div className="mb-6 max-w-md mx-auto sm:mx-0">
        <Input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full"
        />
      </div>

      {loading ? (
        <div className="text-center">Loading products...</div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center">No products found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredProducts.map((product) => (
            <Card
              key={product._id}
              className="shadow hover:shadow-lg transition rounded-lg overflow-hidden relative group flex flex-col"
            >
              <CardHeader className="p-0 rounded-t-lg overflow-hidden relative">
                <img
                  src={product.imageUrl || "https://via.placeholder.com/300"}
                  alt={product.name}
                  className="w-full h-48 sm:h-56 md:h-48 lg:h-56 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center p-4 text-white text-sm text-center rounded-t-lg">
                  {product.description}
                </div>
              </CardHeader>
              <CardContent className="flex flex-col flex-1 justify-between p-4">
                <CardTitle className="text-lg font-semibold line-clamp-2">
                  {product.name}
                </CardTitle>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-gray-700 font-medium">${product.price}</span>
                  <Badge
                    className={`${
                      product.visibility
                        ? "bg-green-200 text-green-800" // Light apple green for available
                        : "bg-red-600 text-white"
                    }`}
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
