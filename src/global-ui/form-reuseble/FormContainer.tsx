import React, { ReactNode } from "react";

type FormContainerProps = {
  title?: string;
  description?: string;
  formContent: ReactNode;
};

export function FormContainer({
  formContent,
}: FormContainerProps) {
  return (
    <div className="flex flex-col h-fit md:flex-row items-start justify-between max-w-7xl mx-auto px-4 lg:px-12">
      <div className="w-full flex flex-col items-center mx-auto space-y-4">
        <div
          className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl space-y-4"
          role="form"
          aria-labelledby="form-title"
        >
          {formContent}
        </div>
      </div>
    </div>
  );
}
