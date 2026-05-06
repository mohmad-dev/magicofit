"use client";

import { useState } from "react";
import { Button } from "../ui/Button";
import AddressForm from "./AddressForm";
import ShippingSelector from "./ShippingSelector";
import OrderSummary from "./OrderSummary";

interface OrderFormProps {
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  onSubmit: (data: OrderFormData) => void;
  loading?: boolean;
}

export interface OrderFormData {
  shippingAddress: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  shippingMethod: string;
  notes?: string;
}

export default function OrderForm({ items, onSubmit, loading }: OrderFormProps) {
  const [shippingAddress, setShippingAddress] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "SA",
  });
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      shippingAddress,
      shippingMethod,
      notes,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Forms */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Shipping Information
            </h2>
            <AddressForm
              data={shippingAddress}
              onChange={setShippingAddress}
            />
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Shipping Method
            </h2>
            <ShippingSelector
              selected={shippingMethod}
              onSelect={setShippingMethod}
            />
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Order Notes (Optional)
            </h2>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any special instructions for your order..."
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              rows={3}
            />
          </div>
        </div>

        {/* Right Column - Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Order Summary
            </h2>
            <OrderSummary items={items} shippingMethod={shippingMethod} />
            
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-6"
              loading={loading}
            >
              Place Order
            </Button>
            
            <p className="mt-4 text-xs text-center text-gray-500">
              By placing this order, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </form>
  );
}
