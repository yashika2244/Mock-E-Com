import React from "react";

function ReceiptModal({ receipt, onClose }) {
  if (!receipt) return null;

  
  const totalWithoutDiscount = receipt.items.reduce((sum, item) => {
    const price = Number(item.price) || 0;
    const quantity = Number(item.quantity) || 1;
    const discount = Number(item.discount) || 0;
    const originalPrice =
      item.originalPrice ||
      (discount > 0 ? price / (1 - discount / 100) : price);
    return sum + originalPrice * quantity;
  }, 0);

  const totalWithDiscount = receipt.items.reduce((sum, item) => {
    const price = Number(item.price) || 0;
    const quantity = Number(item.quantity) || 1;
    return sum + price * quantity;
  }, 0);

  const savings = totalWithoutDiscount - totalWithDiscount;

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50 animate-fadeIn">
      <div className="relative w-[90%] max-w-md max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200 flex flex-col">
        {/* Top Gradient Bar */}
        <div className="h-2 w-full bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500"></div>

        {/* Content */}
        <div className="p-4 overflow-y-auto flex-1">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition"
          >
            ✕
          </button>

          {/* Success Icon */}
          <div className="flex justify-center mb-3">
            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.2}
                stroke="green"
                className="w-7 h-7"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 text-center">
            Payment Successful!
          </h2>
          <p className="text-center text-gray-500 text-sm mb-4">
            Thank you for shopping with us 💚
          </p>

          {/* Customer Name */}
          <div className="text-center mb-2">
            <p className="text-gray-700 font-medium">
              <span className="text-gray-500">Customer:</span>{" "}
              <span className="font-semibold text-gray-900">
                {receipt.name}
              </span>
            </p>
          </div>

          {/* Items List */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-5 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400">
            {receipt.items.map((item, i) => {
              const price = Number(item.price) || 0;
              const quantity = Number(item.quantity) || 1;
              const discount = Number(item.discount) || 0;
              const originalPrice =
                item.originalPrice ||
                (discount > 0 ? price / (1 - discount / 100) : price);

              const isDiscounted = discount > 0 && price < originalPrice;

              return (
                <div
                  key={i}
                  className="flex justify-between items-center text-gray-700 text-sm mb-3"
                >
                  <div>
                    <span className="font-medium">{item.name || "Unnamed Item"}</span>{" "}
                    × {quantity}
                    {isDiscounted && (
                      <span className="ml-2 text-xs text-green-600 font-semibold bg-green-50 px-1.5 py-0.5 rounded">
                        {discount}% OFF
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    {/* Final price */}
                    <span
                      className={`block font-semibold ${
                        isDiscounted ? "text-green-600" : "text-gray-900"
                      }`}
                    >
                      ₹{(price * quantity).toFixed(2)}
                    </span>

                    {/* Original cut price */}
                    {isDiscounted && (
                      <span className="text-gray-400 line-through text-xs">
                        ₹{(originalPrice * quantity).toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Total */}
          <div className="flex justify-between items-center text-lg font-semibold text-gray-900">
            <span>Total</span>
            <span className="text-green-600">
              ₹{totalWithDiscount.toFixed(2)}
            </span>
          </div>

      

          {/* Timestamp */}
          <p className="text-xs text-gray-500 text-center">
            {new Date(receipt.timestamp).toLocaleString()}
          </p>
        </div>

        {/* Bottom Button */}
        <div className="p-4 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-gray-900 to-gray-800 text-white py-3 rounded-lg font-medium hover:from-black hover:to-gray-900 active:scale-95 transition-all"
          >
            Close Receipt
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReceiptModal;
