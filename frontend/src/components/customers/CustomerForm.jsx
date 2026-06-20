import { useForm } from "react-hook-form";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Button from "../ui/Button";
import toast from "react-hot-toast";
import { useEffect } from "react";

export default function CustomerForm({ isOpen, onClose, onSubmit, initialData = null }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      full_name: "",
      email: "",
      phone: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    } else {
      reset({
        full_name: "",
        email: "",
        phone: "",
      });
    }
  }, [initialData, reset]);

  const submit = async (data) => {
    try {
      await onSubmit(data);
      toast.success(initialData ? "Customer updated successfully" : "Customer created successfully");
      reset();
      onClose();
    } catch (error) {
      toast.error("Failed to save customer");
      console.error(error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? "Edit Customer" : "Add New Customer"} size="md">
      <form onSubmit={handleSubmit(submit)} className="space-y-4">
        <Input
          label="Full Name"
          {...register("full_name", { required: "Full name is required" })}
          error={errors.full_name?.message}
          placeholder="Enter customer name"
        />
        <Input
          label="Email"
          type="email"
          {...register("email", { 
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address"
            }
          })}
          error={errors.email?.message}
          placeholder="customer@example.com"
        />
        <Input
          label="Phone"
          type="tel"
          {...register("phone", { required: "Phone number is required" })}
          error={errors.phone?.message}
          placeholder="+1 234 567 8900"
        />
        <div className="flex gap-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" className="flex-1">
            {initialData ? "Update Customer" : "Create Customer"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}