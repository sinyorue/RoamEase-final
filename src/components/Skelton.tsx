import React from "react";

/**
 * Renders a skeleton/loading state for a card component.
 *
 * It uses CSS animations on divs with gray backgrounds to mimic the shape and layout of the actual content, before the data is loaded.
 */
function Skelton() {
  return (
    <div>
      <div
        className="mx-auto
         w-full max-w-sm rounded-md p-4 shadow-md"
      >
        <div className="flex animate-pulse flex-col space-x-4">
          <div className="h-[150px] w-full rounded-md bg-slate-200"></div>
          <div className="flex-1 space-y-6 py-1">
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

export default Skelton;
