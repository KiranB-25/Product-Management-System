"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, Pencil, Trash2, Filter } from "lucide-react";
import { toast } from "sonner";

type Product = {
  _id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  visibility: boolean;
};

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [viewProduct, setViewProduct] = useState<Product | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const [filter, setFilter] = useState("all");
  const [minPrice, setMinPrice] = useState(50);
  const [maxPrice, setMaxPrice] = useState(350000);
  const [showFilter, setShowFilter] = useState(false);
  const [form, setForm] = useState<Omit<Product, "_id">>({
    name: "",
    price: 0,
    description: "",
    imageUrl: "",
    visibility: true,
  });

  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data);
      const urls = data.map((p: Product) => p.imageUrl).filter(Boolean);
      setImageUrls(urls);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch products");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleFormChange = (
    key: keyof typeof form,
    value: string | number | boolean
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    setLoading(true);
    try {
      if (form.imageUrl && !imageUrls.includes(form.imageUrl)) {
        setImageUrls((prev) => [...prev, form.imageUrl]);
      }

      if (editingProduct) {
        await fetch(`/api/products/${editingProduct._id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        toast.success("Product updated successfully!");
      } else {
        await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        toast.success("Product added successfully!");
      }
      fetchProducts();
      setModalOpen(false);
      setEditingProduct(null);
      setForm({ name: "", price: 0, description: "", imageUrl: "", visibility: true });
    } catch (err) {
      console.error(err);
      toast.error("Operation failed!");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    try {
      await fetch(`/api/products/${id}`, { method: "DELETE" });
      toast.success("Product deleted successfully!");
      fetchProducts();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete product");
    }
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setForm({
      name: product.name || "",
      price: product.price ?? 0,
      description: product.description || "",
      imageUrl: product.imageUrl || "",
      visibility: product.visibility ?? true,
    });
    setModalOpen(true);
  };

  const filteredProducts = products
    .filter((p) =>
      filter === "public" ? p.visibility : filter === "hidden" ? !p.visibility : true
    )
    .filter((p) => p.price >= minPrice && p.price <= maxPrice);

  const startIndex = (page - 1) * pageSize;
  const paginated = filteredProducts.slice(startIndex, startIndex + pageSize);
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));

  const filteredSuggestions = imageUrls.filter(
    (url) =>
      url.toLowerCase().includes(form.imageUrl.toLowerCase()) &&
      url !== form.imageUrl
  );

  return (
    <div className="p-6 flex flex-col h-[calc(100vh-2rem)] gap-6">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-2">
        <h1 className="text-2xl font-bold">Product Management</h1>
        <div className="flex gap-2">
          <Button
            onClick={() => {
              setEditingProduct(null);
              setModalOpen(true);
              setForm({ name: "", price: 0, description: "", imageUrl: "", visibility: true });
            }}
          >
            + Add New
          </Button>
          <Button variant="outline" onClick={() => setShowFilter((prev) => !prev)}>
            <Filter className="w-4 h-4 mr-1" /> Filter
          </Button>
        </div>
      </div>

      {/* Filter section */}
      {showFilter && (
        <div className="flex flex-wrap items-center gap-4 mt-3 border p-3 rounded bg-gray-50">
          <div className="flex gap-2 items-center">
            <label className="font-semibold">Visibility:</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border rounded px-2 py-1"
            >
              <option value="all">All</option>
              <option value="public">Public</option>
              <option value="hidden">Hidden</option>
            </select>
          </div>
          <div className="flex gap-2 items-center">
            <label className="font-semibold">Price:</label>
            <Input
              type="number"
              value={minPrice}
              min={50}
              max={350000}
              onChange={(e) => setMinPrice(Number(e.target.value))}
              placeholder="Min"
              className="w-24"
            />
            <span>-</span>
            <Input
              type="number"
              value={maxPrice}
              min={50}
              max={350000}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              placeholder="Max"
              className="w-24"
            />
          </div>
        </div>
      )}

      {/* Table */}
      <div className="flex-1 overflow-auto mt-2 border rounded">
        <Table className="min-w-full border-collapse">
          <TableCaption>A list of your products.</TableCaption>
          <TableHeader className="sticky top-0 z-10">
            <TableRow className="bg-white text-black">
              <TableHead className="rounded-tl-lg">Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Visibility</TableHead>
              <TableHead className="rounded-tr-lg">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.map((p, i) => (
              <TableRow key={p._id} className={`${i % 2 === 0 ? "bg-gray-100" : ""} hover:bg-none`}>
                <TableCell>
                  <img
                    src={p.imageUrl || "https://via.placeholder.com/150"}
                    alt={p.name}
                    className="w-12 h-12 rounded object-cover"
                  />
                </TableCell>
                <TableCell>{p.name}</TableCell>
                <TableCell>${p.price}</TableCell>
                <TableCell>{p.description}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded text-white font-semibold ${
                      p.visibility ? "bg-green-600" : "bg-red-600"
                    }`}
                  >
                    {p.visibility ? "Public" : "Hidden"}
                  </span>
                </TableCell>
                <TableCell className="flex gap-2 flex-wrap">
                  <Button variant="outline" size="icon" onClick={() => setViewProduct(p)}>
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => openEditModal(p)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="destructive" size="icon" onClick={() => handleDelete(p._id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row justify-between items-center mt-2 gap-2 sm:gap-0">
        <Button disabled={page === 1} onClick={() => setPage((p) => p - 1)} variant="outline">
          Previous
        </Button>
        <span>
          Page {page} of {totalPages}
        </span>
        <Button disabled={page === totalPages} onClick={() => setPage((p) => p + 1)} variant="outline">
          Next
        </Button>
      </div>

      {/* Add/Edit Modal */}
      <Dialog open={modalOpen} onOpenChange={() => setModalOpen(false)}>
        <DialogContent className="max-w-15xl w-full max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {editingProduct ? "Edit Product" : "Add New Product"}
            </DialogTitle>
            <DialogDescription>
              Create a new product or update an existing one.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
            {/* BASIC INFORMATION */}
            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-semibold border-b pb-1">BASIC INFORMATION</h3>
              <Input
                placeholder="Enter product name"
                value={form.name}
                onChange={(e) => handleFormChange("name", e.target.value)}
              />
              {/* ✅ Fixed Price input with arrows enabled */}
              <Input
                type="number"
                placeholder="0.00"
                value={form.price}
                onChange={(e) => handleFormChange("price", Number(e.target.value))}
                min={0}
                step=""
              />
              <div>
                <label className="block text-sm font-semibold mb-1">Visibility</label>
                <select
                  value={form.visibility ? "public" : "hidden"}
                  onChange={(e) => handleFormChange("visibility", e.target.value === "public")}
                  className="w-full border rounded px-4 py-2"
                >
                  <option value="public">Visible to customers</option>
                  <option value="hidden">Hidden</option>
                </select>
              </div>
            </div>

            {/* PRODUCT IMAGE */}
            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-semibold border-b pb-1">PRODUCT IMAGE</h3>
              <Input
                placeholder="https://example.com/image.jpg"
                value={form.imageUrl}
                onChange={(e) => {
                  handleFormChange("imageUrl", e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              />

              {/* Suggestions */}
              {showSuggestions && filteredSuggestions.length > 0 && (
                <ul className="bg-white border rounded shadow z-50 max-h-40 overflow-y-auto">
                  {filteredSuggestions.map((url, i) => (
                    <li
                      key={i}
                      className="px-2 py-1 hover:bg-gray-100 cursor-pointer text-xs break-all"
                      onMouseDown={() => handleFormChange("imageUrl", url)}
                    >
                      {url}
                    </li>
                  ))}
                </ul>
              )}

              {/* Image Preview */}
              <div className="w-full h-40 border rounded flex items-center justify-center overflow-hidden">
                {form.imageUrl ? (
                  <img src={form.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-gray-400 text-sm">Image preview</span>
                )}
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-semibold border-b pb-1">DESCRIPTION</h3>
              <textarea
                value={form.description}
                onChange={(e) => handleFormChange("description", e.target.value)}
                placeholder="Enter product description..."
                className="border rounded p-2 h-40 resize-none"
                maxLength={250}
              />
              <span className="text-xs text-gray-500 self-end">
                {250 - form.description.length} remaining
              </span>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-end gap-3 mt-6 border-t pt-4">
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={loading}>
              {editingProduct ? "Update Product" : "Create"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ✅ Redesigned View Modal */}
      <Dialog open={!!viewProduct} onOpenChange={() => setViewProduct(null)}>
        <DialogContent className="max-w-4xl w-full rounded-2xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Product Image */}
            <div className="relative flex items-center justify-center bg-white p-4">
              <img
                src={viewProduct?.imageUrl || "https://via.placeholder.com/400"}
                alt={viewProduct?.name}
                className="w-full h-full max-h-96 object-contain rounded-xl"
              />
              {viewProduct?.visibility && (
                <span className="absolute top-4 right-4 bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
                  In Stock
                </span>
              )}
            </div>

            {/* Right: Product Info */}
            <div className="flex flex-col justify-between p-4">
              {/* Name + Price */}
              <div className="flex flex-col gap-3">
                <h2 className="text-2xl font-bold text-gray-800">{viewProduct?.name}</h2>
                <p className="text-green-600 font-bold text-3xl">
                  ${viewProduct?.price?.toFixed(2)}
                </p>

                {/* Description */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-gray-800 font-semibold mb-1 flex items-center gap-1">
                    Product Description
                  </p>
                  <p className="text-gray-700 text-sm">{viewProduct?.description}</p>
                </div>

                {/* Price + Stock Status */}
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="bg-green-100 text-green-800 p-3 rounded-lg flex flex-col items-center">
                    <span className="text-xs font-semibold">Price</span>
                    <span className="text-lg font-bold">
                      ${viewProduct?.price?.toFixed(2)}
                    </span>
                  </div>
                  <div className="bg-green-100 text-green-800 p-3 rounded-lg flex flex-col items-center">
                    <span className="text-xs font-semibold">Stock Status</span>
                    <span className="text-lg font-bold">
                      {viewProduct?.visibility ? "Available" : "Hidden"}
                    </span>
                  </div>
                </div>

                {/* Visibility */}
                <div className="bg-blue-100 text-blue-800 p-3 rounded-lg flex flex-col items-center mt-4">
                  <span className="text-xs font-semibold">Product Visibility</span>
                  <span className="text-lg font-bold">
                    {viewProduct?.visibility
                      ? "Public - Visible to customers"
                      : "Hidden"}
                  </span>
                </div>
              </div>

              {/* Close Button */}
              <Button className="mt-6 w-full" onClick={() => setViewProduct(null)}>
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
