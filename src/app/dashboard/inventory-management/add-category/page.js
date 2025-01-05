"use client";
import { useForm } from "react-hook-form";
import { useState } from "react";
import DashboardLayout from "@/components/layout";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";

const AddCategory = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { control, handleSubmit, reset } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await fetch("/api/inventory/category", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok) {
        setSuccess("Category added successfully!");
        setError("");
        reset();
      } else {
        setError(result.message || "Failed to add category");
        setSuccess("");
      }
    } catch (err) {
      setError("An error occurred while adding the category");
      setSuccess("");
    }
  };

  return (
    <DashboardLayout
      pageTitle="Add Product Category"
      pageHeading="Add Product Category"
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
          <Input
            control={control}
            name="name"
            placeholder="Enter Category Name"
            required
            type="text"
            label="Category Name"
          />
          <Button
            type="submit"
            className="flex justify-center items-center gap-3"
          >
            Add Category
          </Button>
        </form>
      </section>
    </DashboardLayout>
  );
};

export default AddCategory;
