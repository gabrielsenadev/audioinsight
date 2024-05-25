"use client";

import { useError } from "@/app/context/ErrorContext";
import { IconX } from "@tabler/icons-react";

export default function ErrorViewer() {
  const { error, clearError } = useError();

  return error && (
    <div className="fixed w-full">
      <div className="mx-auto flex items-center justify-between bg-white w-6/12 mt-4 px-4 py-3 rounded-xl text-base">
        <div>
          <h6 className="font-bold">{`OH SNAP! There's an error!`}</h6>
          <p className="max-h-40 overflow-auto text-red-500">{error}</p>
        </div>
        <button
          type="button"
          onClick={() => clearError()}
          className="text-black/80 hover:text-black transition-colors"
        >
          <IconX />
        </button>
      </div>
    </div>
  )
}