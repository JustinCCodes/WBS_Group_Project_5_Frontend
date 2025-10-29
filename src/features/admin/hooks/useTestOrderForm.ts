import { useReducer, useState } from "react";
import { getErrorMessage } from "@/shared/types";
import type {
  TestOrderFormState,
  TestOrderFormAction,
} from "@/features/admin/types";

const initialState: TestOrderFormState = {
  userId: "",
  status: "pending",
  products: [{ productId: "", quantity: 1 }],
};

function testOrderFormReducer(
  state: TestOrderFormState,
  action: TestOrderFormAction
): TestOrderFormState {
  switch (action.type) {
    case "SET_USER_ID":
      return { ...state, userId: action.payload };
    case "SET_STATUS":
      return { ...state, status: action.payload };
    case "ADD_PRODUCT_LINE":
      return {
        ...state,
        products: [...state.products, { productId: "", quantity: 1 }],
      };
    case "REMOVE_PRODUCT_LINE":
      return {
        ...state,
        products: state.products.filter((_, i) => i !== action.payload),
      };
    case "UPDATE_PRODUCT_LINE":
      const updated = [...state.products];
      updated[action.payload.index] = {
        ...updated[action.payload.index],
        [action.payload.field]: action.payload.value,
      };
      return { ...state, products: updated };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

export function useTestOrderForm(
  onSubmit: (data: TestOrderFormState) => Promise<void>
) {
  const [state, dispatch] = useReducer(testOrderFormReducer, initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await onSubmit(state);
      dispatch({ type: "RESET" });
    } catch (err) {
      setError(getErrorMessage(err) || "Failed to create test order");
    } finally {
      setLoading(false);
    }
  };

  return {
    formState: state,
    dispatch,
    loading,
    error,
    handleSubmit,
    reset: () => dispatch({ type: "RESET" }),
  };
}
