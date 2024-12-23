import { useCallback } from 'react';
import * as d3 from 'd3';
import { Node, Link } from '../types';

export function useGraphSimulation(nodes: Node[], links: Link[]) {
  const simulation = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links).id((d: any) => d.id))
    .force("charge", d3.forceManyBody().strength(-200))
    .force("center", d3.forceCenter())
    .force("collision", d3.forceCollide().radius(d => Math.max(20, Math.sqrt((d as Node).influenceScore) * 5) + 5));

  const dragHandlers = d3.drag<SVGGElement, Node>()
    .on("start", (event: d3.D3DragEvent<SVGGElement, Node, Node>) => {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    })
    .on("drag", (event: d3.D3DragEvent<SVGGElement, Node, Node>) => {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    })
    .on("end", (event: d3.D3DragEvent<SVGGElement, Node, Node>) => {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    });

  return { simulation, dragHandlers };
}