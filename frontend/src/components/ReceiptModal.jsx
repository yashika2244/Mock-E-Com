export default function ReceiptModal({ receipt, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-xl w-96">
        <h2 className="text-xl font-semibold mb-4">Order Receipt</h2>

        <p className="font-medium mb-2">Customer: {receipt.name}</p>

        <div className="bg-gray-100 rounded p-3 mb-3 max-h-40 overflow-y-auto">
          {receipt.items.map((item, i) => (
            <p key={i}>
              {item.name} × {item.qty} — ₹{item.price * item.qty}
            </p>
          ))}
        </div>

        <h3 className="text-lg font-semibold mb-2">Total: ₹{receipt.total}</h3>

        <p className="text-sm text-gray-500">
          {new Date(receipt.timestamp).toLocaleString()}
        </p>

        <button
          onClick={onClose}
          className="mt-4 bg-black text-white px-4 py-2 rounded w-full"
        >
          Close
        </button>
      </div>
    </div>
  );
}
