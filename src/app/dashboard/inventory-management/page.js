"use client";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";

const AddInventory = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [categories, setCategories] = useState([]);
  const { control, handleSubmit, reset } = useForm();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/inventory/category");
        const data = await res.json();
        const formattedCategories = data.categories.map((cat) => ({
          value: cat._id,
          label: cat.name,
        }));
        setCategories(formattedCategories);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    fetchCategories();
  }, []);

  const onSubmit = async (data) => {
    try {
      const res = await fetch("/api/inventory/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok) {
        setSuccess("Product added successfully!");
        setError("");
        reset();
      } else {
        setError(result.message || "Failed to add product");
        setSuccess("");
      }
    } catch (err) {
      setError("An error occurred while adding the product");
      setSuccess("");
    }
  };

  return (
    <DashboardLayout
      pageTitle="Add New Inventory Item"
      pageHeading="Add New Inventory Item"
    >
      <section className="w-full bg-primary h-full lg:h-[100vh] lg:overflow-y-scroll rounded-md p-6">
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md">
            {success}
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <Input
              control={control}
              name="productName"
              placeholder="Enter Product Name"
              required
              type="text"
              label="Product Name"
              autoComplete="productName"
            />
            <Input
              type="select"
              name="category"
              label="Product Category"
              control={control}
              required
              options={categories}
              placeholder="Choose Category"
            />
            <Input
              control={control}
              name="rate"
              placeholder="Enter Purchase Rate"
              required
              type="number"
              label="Purchase Rate"
              autoComplete="rate"
            />
            <Input
              control={control}
              name="salingRate"
              placeholder="Enter Regular Selling Rate"
              required
              type="number"
              label="Regular Selling Rate"
              autoComplete="salingRate"
            />
            <Input
              control={control}
              name="regularBulkRate"
              placeholder="Enter Regular Bulk Buyer Rate"
              required
              type="number"
              label="Regular Bulk Buyer Rate"
            />
            <Input
              control={control}
              name="bulkQuantityRate"
              placeholder="Enter Bulk Quantity Rate"
              required
              type="number"
              label="Bulk Quantity Rate"
            />
            <Input
              control={control}
              name="quantity"
              placeholder="Enter Quantity"
              required
              type="number"
              label="Quantity"
              autoComplete="quantity"
            />
          </div>
          <Button
            type="submit"
            className="flex justify-center items-center gap-3"
          >
            Add Product
          </Button>
        </form>
      </section>
    </DashboardLayout>
  );
};

export default AddInventory;
