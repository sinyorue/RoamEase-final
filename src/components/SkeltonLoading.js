import React from "react";

/**
 * Returns JSX for a skeleton loading component.
 * Renders a div with a placeholder image, title, and content.
 * Uses Tailwind CSS classes to create the animated loading effect.
 */
function SkeltonLoading() {
  return (
    <div>
      <div className="w-[187px] rounded-md border bg-white p-2 shadow">
        <div className="flex animate-pulse flex-col ">
          <div className="h-[90px] w-[170px] rounded-lg bg-slate-200"></div>
          <div className="flex-1 space-y-2 py-3 ">
            <div className="h-2 rounded bg-slate-200"></div>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 h-2 rounded bg-slate-200"></div>
                <div className="col-span-1 h-2 rounded bg-slate-200"></div>
              </div>
              <div className="h-2 rounded bg-slate-200"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SkeltonLoading;
