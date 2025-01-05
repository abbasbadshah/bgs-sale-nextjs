"use client";
import { useForm } from "react-hook-form";
import { useState } from "react";
import DashboardLayout from "@/components/layout";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";

const AddInventory = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { control, handleSubmit, reset } = useForm();

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
      <section className="w-full bg-primary h-full lg:h-[100vh] lg:overflow-y-scroll rounded-md p-6 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-md">
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
          <div className="grid grid-cols-4 gap-4">
            <Input
              control={control}
              name={"productName"}
              placeholder={"Enter productName Name"}
              required
              type="text"
              label={"productName Name"}
              autoComplete={"productName"}
            />
            <Input
              control={control}
              name={"rate"}
              placeholder={"Enter Purchase rate"}
              required
              type="number"
              label={"Purchase Rate"}
              autoComplete={"rate"}
            />
            <Input
              control={control}
              name={"salingRate"}
              placeholder={"Enter Purchase salingRate"}
              required
              type="number"
              label={"Purchase Saling Rate"}
              autoComplete={"salingRate"}
            />
            <Input
              control={control}
              name={"quantity"}
              placeholder={"Enter Quantity"}
              required
              type="number"
              label={"Enter Quantity"}
              autoComplete={"quantity"}
            />
          </div>
          <Button
            type="submit"
            className={"flex justify-center items-center gap-3"}
          >
            Add Product
          </Button>
        </form>
      </section>
    </DashboardLayout>
  );
};

export default AddInventory;
