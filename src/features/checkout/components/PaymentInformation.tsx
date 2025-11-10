import { CreditCard } from "lucide-react";

// PaymentInformation component
export function PaymentInformation() {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
        <CreditCard className="w-6 h-6 text-amber-400" />
        Payment Information
      </h2>
      <div className="space-y-4">
        <div>
          <label className="text-sm text-gray-400 mb-2 block">
            Card Number
          </label>
          <input
            type="text"
            placeholder="1234 5678 9012 3456"
            autoComplete="off"
            className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-400 mb-2 block">
              Expiry Date
            </label>
            <input
              type="text"
              placeholder="MM / JJ"
              autoComplete="off"
              className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white"
            />
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-2 block">CVC</label>
            <input
              type="text"
              placeholder="123"
              autoComplete="off"
              className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
