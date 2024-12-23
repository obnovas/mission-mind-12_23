import React from 'react';
import { ZoomIn, ZoomOut, Maximize } from 'lucide-react';
import * as d3 from 'd3';

interface ZoomControlsProps {
  svgRef: React.RefObject<SVGSVGElement>;
}

export function ZoomControls({ svgRef }: ZoomControlsProps) {
  const handleZoomIn = () => {
    d3.select(svgRef.current)
      .transition()
      .duration(300)
      .call(d3.zoom<SVGSVGElement, unknown>().scaleBy, 1.5);
  };

  const handleZoomOut = () => {
    d3.select(svgRef.current)
      .transition()
      .duration(300)
      .call(d3.zoom<SVGSVGElement, unknown>().scaleBy, 0.75);
  };

  const handleReset = () => {
    d3.select(svgRef.current)
      .transition()
      .duration(300)
      .call(d3.zoom<SVGSVGElement, unknown>().transform, d3.zoomIdentity);
  };

  return (
    <div className="absolute bottom-4 right-4 flex gap-2 bg-white p-2 rounded-lg shadow-lg border border-neutral-200">
      <button
        onClick={handleZoomIn}
        className="p-2 hover:bg-neutral-100 rounded-md transition-colors duration-200"
        title="Zoom In"
      >
        <ZoomIn className="h-4 w-4 text-neutral-600" />
      </button>
      <button
        onClick={handleZoomOut}
        className="p-2 hover:bg-neutral-100 rounded-md transition-colors duration-200"
        title="Zoom Out"
      >
        <ZoomOut className="h-4 w-4 text-neutral-600" />
      </button>
      <button
        onClick={handleReset}
        className="p-2 hover:bg-neutral-100 rounded-md transition-colors duration-200"
        title="Reset Zoom"
      >
        <Maximize className="h-4 w-4 text-neutral-600" />
      </button>
    </div>
  );
}