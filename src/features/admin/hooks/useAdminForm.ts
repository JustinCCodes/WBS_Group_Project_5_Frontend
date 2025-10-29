import { useState } from "react";
import { getErrorMessage } from "@/shared/types";
import type { UseAdminFormOptions } from "@/features/admin/types";

export function useAdminForm<T>({
  initialData,
  onSubmit,
  onSuccess,
}: UseAdminFormOptions<T>) {
  const [formData, setFormData] = useState<T>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await onSubmit(formData);
      setFormData(initialData); // Reset form
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(getErrorMessage(err) || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFormData(initialData);
    setError(null);
  };

  const updateField = <K extends keyof T>(field: K, value: T[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return {
    formData,
    setFormData,
    updateField,
    loading,
    error,
    handleSubmit,
    reset,
  };
}
