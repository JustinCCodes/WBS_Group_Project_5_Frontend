import { AlertCircle } from "lucide-react";

// CheckoutHeader component
export function CheckoutHeader() {
  return (
    <div className="mb-8">
      <h1 className="text-4xl font-bold bg-linear-to-r from-amber-500 to-yellow-600 bg-clip-text text-transparent">
        Checkout
      </h1>
      <div className="mt-4 p-4 bg-zinc-900 border border-amber-500/40 rounded-lg flex items-center gap-3">
        <AlertCircle className="w-6 h-6 text-amber-400" />
        <div>
          <p className="text-sm text-gray-300 font-semibold">
            <span className="text-amber-400">Portfolio Notice:</span> This site
            is for demonstration purposes only. No actual purchases will be
            made. Do not enter real payment or shipping information.
          </p>
        </div>
      </div>
    </div>
  );
}
