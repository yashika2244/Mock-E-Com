export default function ReceiptModal({ receipt, onClose }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 animate-fadeIn">
      <div className="relative w-[90%] max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200">
        {/* Top Accent Bar */}
        <div className="h-2 w-full bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500"></div>

        {/* Content */}
        <div className="p-6">
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
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-900 text-center">
            Payment Successful!
          </h2>
          <p className="text-center text-gray-500 text-sm mb-6">
            Thank you for shopping with us 💚
          </p>

          {/* Customer Info */}
          <div className="text-center mb-5">
            <p className="text-gray-700 font-medium">
              <span className="text-gray-500">Customer:</span>{" "}
              <span className="font-semibold text-gray-900">
                {receipt.name}
              </span>
            </p>
          </div>

          {/* Order Items */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-5 max-h-48 overflow-y-auto">
            {receipt.items.map((item, i) => (
              <div
                key={i}
                className="flex justify-between text-gray-700 text-sm mb-2"
              >
                <span>
                  {item.name} × {item.qty}
                </span>
                <span className="font-medium">₹{item.price * item.qty}</span>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="flex justify-between items-center text-lg font-semibold text-gray-900 border-t border-gray-300 pt-3 mb-3">
            <span>Total</span>
            <span className="text-green-600">₹{receipt.total}</span>
          </div>

          {/* Timestamp */}
          <p className="text-xs text-gray-500 text-center mb-5">
            {new Date(receipt.timestamp).toLocaleString()}
          </p>

          {/* Close Button */}
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
