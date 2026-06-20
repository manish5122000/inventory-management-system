import { useForm } from "react-hook-form";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Button from "../ui/Button";
import toast from "react-hot-toast";
import { useEffect } from "react";

export default function ProductForm({ isOpen, onClose, onSubmit, initialData = null }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      sku: "",
      price: "",
      stock_quantity: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    } else {
      reset({
        name: "",
        sku: "",
        price: "",
        stock_quantity: "",
      });
    }
  }, [initialData, reset]);

  const submit = async (data) => {
    try {
      await onSubmit({
        ...data,
        price: parseFloat(data.price),
        stock_quantity: parseInt(data.stock_quantity),
      });
      toast.success(initialData ? "Product updated successfully" : "Product created successfully");
      reset();
      onClose();
    } catch (error) {
      toast.error("Failed to save product");
      console.error(error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? "Edit Product" : "Add New Product"} size="md">
      <form onSubmit={handleSubmit(submit)} className="space-y-4">
        <Input
          label="Product Name"
          {...register("name", { required: "Product name is required" })}
          error={errors.name?.message}
          placeholder="Enter product name"
        />
        <Input
          label="SKU"
          {...register("sku", { required: "SKU is required" })}
          error={errors.sku?.message}
          placeholder="Enter SKU code"
        />
        <Input
          label="Price"
          type="number"
          step="0.01"
          {...register("price", { 
            required: "Price is required",
            min: { value: 0, message: "Price must be positive" }
          })}
          error={errors.price?.message}
          placeholder="0.00"
        />
        <Input
          label="Stock Quantity"
          type="number"
          {...register("stock_quantity", { 
            required: "Stock quantity is required",
            min: { value: 0, message: "Stock cannot be negative" }
          })}
          error={errors.stock_quantity?.message}
          placeholder="0"
        />
        <div className="flex gap-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" className="flex-1">
            {initialData ? "Update Product" : "Create Product"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}