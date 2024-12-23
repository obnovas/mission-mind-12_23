import { useCallback } from 'react';
import * as d3 from 'd3';

export function useZoom(svgRef: React.RefObject<SVGSVGElement>) {
  const handleZoom = useCallback((event: d3.D3ZoomEvent<SVGSVGElement, unknown>) => {
    d3.select(svgRef.current)
      .select('g')
      .attr('transform', event.transform.toString());
  }, []);

  const initializeZoom = useCallback(() => {
    if (!svgRef.current) return;

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on('zoom', handleZoom);

    d3.select(svgRef.current)
      .call(zoom)
      .call(zoom.transform, d3.zoomIdentity);
  }, [handleZoom]);

  return { initializeZoom };
}