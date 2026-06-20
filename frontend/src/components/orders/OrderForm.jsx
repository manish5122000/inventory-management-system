import { useState } from "react";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Button from "../ui/Button";
import toast from "react-hot-toast";
import { X, Plus } from "lucide-react";

export default function OrderForm({
  isOpen,
  onClose,
  customers = [],
  products = [],
  onSubmit,
}) {
  const [customerId, setCustomerId] = useState("");
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [orderItems, setOrderItems] = useState([]);

  const safeCustomers = Array.isArray(customers) ? customers : [];
  const safeProducts = Array.isArray(products) ? products : [];

  const addItem = () => {
    if (!productId || !quantity) {
      toast.error("Please select a product and enter quantity");
      return;
    }

    const selectedProduct = safeProducts.find(
      (p) => p?.id === Number(productId)
    );

    if (!selectedProduct) {
      toast.error("Product not found");
      return;
    }

    if (Number(quantity) > selectedProduct.stock_quantity) {
      toast.error(`Insufficient stock. Only ${selectedProduct.stock_quantity} units available.`);
      return;
    }

    const existingItemIndex = orderItems.findIndex(
      (item) => item.product_id === Number(productId)
    );

    if (existingItemIndex !== -1) {
      const updatedItems = [...orderItems];
      const newQuantity = updatedItems[existingItemIndex].quantity + Number(quantity);
      
      if (newQuantity > selectedProduct.stock_quantity) {
        toast.error(`Insufficient stock. Only ${selectedProduct.stock_quantity} units available.`);
        return;
      }

      updatedItems[existingItemIndex].quantity = newQuantity;
      setOrderItems(updatedItems);
    } else {

      setOrderItems([
        ...orderItems,
        {
          product_id: Number(productId),
          quantity: Number(quantity),
          product_name: selectedProduct.name,
          product_price: selectedProduct.price,
          product_stock: selectedProduct.stock_quantity,
        },
      ]);
    }

    setProductId("");
    setQuantity("");
  };

  const removeItem = (index) => {
    setOrderItems(orderItems.filter((_, i) => i !== index));
  };

  const submit = async (e) => {
    e.preventDefault();

    if (!customerId) {
      toast.error("Please select a customer");
      return;
    }

    if (orderItems.length === 0) {
      toast.error("Please add at least one product to the order");
      return;
    }

    try {
      await onSubmit({
        customer_id: Number(customerId),
        items: orderItems.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
        })),
      });

      toast.success("Order created successfully");

      setCustomerId("");
      setProductId("");
      setQuantity("");
      setOrderItems([]);
      onClose();
    } catch (error) {
      console.error(error);
  
      const errorMessage = error.response?.data?.detail || error.message || "Failed to create order";
      toast.error(errorMessage);
    }
  };

  const totalPrice = orderItems.reduce(
    (sum, item) => sum + (item.product_price || 0) * item.quantity,
    0
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Order" size="lg">
      <form onSubmit={submit} className="space-y-4">

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Customer
          </label>

          <select
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            className="w-full px-4 py-2.5 border rounded-lg text-sm"
          >
            <option value="">Select Customer</option>

            {safeCustomers.map((c) => (
              <option key={c?.id} value={c?.id}>
                {c?.full_name || "Unknown"}
              </option>
            ))}
          </select>
        </div>

        <div className="border rounded-lg p-4 bg-slate-50">
          <h4 className="text-sm font-medium text-slate-700 mb-3">Add Products to Order</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Product
              </label>

              <select
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                className="w-full px-4 py-2.5 border rounded-lg text-sm"
              >
                <option value="">Select Product</option>

                {safeProducts.map((p) => (
                  <option key={p?.id} value={p?.id}>
                    {p?.name || "N/A"} - ₹{p?.price || 0} (Stock:{" "}
                    {p?.stock_quantity ?? 0})
                  </option>
                ))}
              </select>
            </div>

           
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Quantity
              </label>

              <Input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Enter quantity"
              />
            </div>
          </div>

          <Button
            type="button"
            onClick={addItem}
            className="w-full mt-3"
            variant="secondary"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add to Order
          </Button>
        </div>

        {orderItems.length > 0 && (
          <div className="border rounded-lg p-4">
            <h4 className="text-sm font-medium text-slate-700 mb-3">Order Items ({orderItems.length})</h4>
            
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {orderItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-white border rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">{item.product_name}</p>
                    <p className="text-sm text-slate-500">
                      Qty: {item.quantity} × ₹{item.product_price} = ₹{(item.quantity * item.product_price).toFixed(2)}
                    </p>
                  </div>
                  <Button
                    type="button"
                    onClick={() => removeItem(index)}
                    variant="secondary"
                    className="p-2 text-red-600 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {totalPrice > 0 && (
          <div className="bg-slate-50 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-slate-700 font-medium">Total Amount:</span>
              <span className="font-bold text-slate-900 text-xl">
                ₹{Number(totalPrice).toFixed(2)}
              </span>
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {orderItems.length} product{orderItems.length !== 1 ? 's' : ''} in order
            </div>
          </div>
        )}

        <div className="flex gap-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>

          <Button type="submit" className="flex-1">
            Create Order
          </Button>
        </div>
      </form>
    </Modal>
  );
}