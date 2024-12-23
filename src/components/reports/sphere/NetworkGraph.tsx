import React from 'react';
import * as d3 from 'd3';
import { colors } from '../../../styles/colors';
import { Node, Link } from './types';
import { GraphTooltip } from './GraphTooltip';
import { ZoomControls } from './ZoomControls';
import { User } from 'lucide-react';

interface NetworkGraphProps {
  nodes: Node[];
  links: Link[];
}

export function NetworkGraph({ nodes, links }: NetworkGraphProps) {
  const svgRef = React.useRef<SVGSVGElement>(null);
  const tooltipRef = React.useRef<HTMLDivElement>(null);
  const [tooltipPosition, setTooltipPosition] = React.useState({ x: 0, y: 0 });

  React.useEffect(() => {
    if (!svgRef.current || !tooltipRef.current) return;

    const svg = d3.select(svgRef.current);
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;
    const centerX = width / 2;
    const centerY = height / 2;

    // Clear previous graph
    svg.selectAll("*").remove();

    // Create main container group
    const g = svg.append("g")
      .attr("transform", `translate(${centerX},${centerY})`);

    // Calculate max influence score for scaling
    const maxScore = Math.max(...nodes.map(n => n.influenceScore));
    
    // Create radial scale with more compact range
    const radiusScale = d3.scaleLinear()
      .domain([0, maxScore])
      .range([20, Math.min(width, height) / 2 - 100]);

    // Create angular scale
    const angleScale = d3.scaleLinear()
      .domain([0, nodes.length])
      .range([0, 2 * Math.PI]);

    // Draw concentric circles for reference
    const circles = [maxScore * 0.25, maxScore * 0.5, maxScore * 0.75, maxScore];
    circles.forEach(value => {
      g.append("circle")
        .attr("r", radiusScale(value))
        .attr("fill", "none")
        .attr("stroke", colors.neutral[100])
        .attr("stroke-dasharray", "1,2")
        .attr("stroke-width", 0.25);
    });

    // Add central user icon
    const userIcon = g.append("g")
      .attr("class", "user-icon");

    // Add circle background for user icon
    userIcon.append("circle")
      .attr("r", 15)
      .attr("fill", colors.accent[500])
      .attr("stroke", colors.white)
      .attr("stroke-width", 2);

    // Add user icon using SVG path
    userIcon.append("path")
      .attr("d", "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z")
      .attr("transform", "translate(-12, -12) scale(0.8)")
      .attr("stroke", colors.white)
      .attr("stroke-width", 2)
      .attr("fill", "none");

    // Position nodes in a spiral pattern
    nodes.forEach((node, i) => {
      const angle = angleScale(i);
      const radius = radiusScale(node.influenceScore);
      node.x = Math.cos(angle) * radius;
      node.y = Math.sin(angle) * radius;
    });

    // Create nodes container
    const nodeGroups = g.selectAll("g.node")
      .data(nodes)
      .join("g")
      .attr("class", "node")
      .attr("transform", d => `translate(${d.x},${d.y})`);

    // Add smaller circles to nodes
    nodeGroups.append("circle")
      .attr("r", d => Math.max(2, Math.sqrt(d.influenceScore)))
      .attr("fill", d => getNodeColor(d.type))
      .attr("stroke", colors.white)
      .attr("stroke-width", 0.25);

    // Add label lines and text
    nodeGroups.each(function(d) {
      const node = d3.select(this);
      const nodeRadius = Math.max(2, Math.sqrt(d.influenceScore));
      const angle = Math.atan2(d.y!, d.x!);
      
      // Calculate label position
      const labelDistance = nodeRadius + 5;
      const labelX = Math.cos(angle) * labelDistance;
      const labelY = Math.sin(angle) * labelDistance;
      
      // Add connecting line
      node.append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", labelX)
        .attr("y2", labelY)
        .attr("stroke", colors.neutral[300])
        .attr("stroke-width", 0.15);

      // Add label background for better readability
      const text = node.append("text")
        .text(d.name)
        .attr("x", labelX)
        .attr("y", labelY)
        .attr("dy", "0.15em")
        .attr("text-anchor", d.x! > 0 ? "start" : "end")
        .attr("fill", colors.neutral[700])
        .attr("font-size", "6px")
        .attr("font-weight", "300");

      // Add white background to text
      const bbox = (text.node() as SVGTextElement).getBBox();
      node.insert("rect", "text")
        .attr("x", bbox.x + labelX - 0.5)
        .attr("y", bbox.y + labelY - 0.5)
        .attr("width", bbox.width + 1)
        .attr("height", bbox.height + 1)
        .attr("fill", "white")
        .attr("fill-opacity", 0.95);
    });

    // Handle tooltips
    const tooltip = d3.select(tooltipRef.current);
    nodeGroups
      .on("mouseover", (event, d) => {
        const rect = svgRef.current!.getBoundingClientRect();
        const mouseX = event.pageX - rect.left;
        const mouseY = event.pageY - rect.top;
        
        setTooltipPosition({
          x: mouseX + 10, // Offset slightly from cursor
          y: mouseY - 5
        });
        
        tooltip.style("opacity", 1)
          .html(GraphTooltip({ node: d }));
        
        d3.select(event.currentTarget)
          .select("circle")
          .attr("stroke", colors.accent[500])
          .attr("stroke-width", 0.5);
      })
      .on("mouseout", (event) => {
        tooltip.style("opacity", 0);
        
        d3.select(event.currentTarget)
          .select("circle")
          .attr("stroke", colors.white)
          .attr("stroke-width", 0.25);
      });

    // Add zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 10])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoom)
      .call(zoom.transform, d3.zoomIdentity
        .translate(centerX, centerY)
        .scale(0.8));

  }, [nodes, links]);

  return (
    <div className="relative w-full h-full">
      <ZoomControls svgRef={svgRef} />
      <svg
        ref={svgRef}
        className="w-full h-full"
        viewBox={`0 0 ${window.innerWidth} ${window.innerHeight - 300}`}
      />
      <div
        ref={tooltipRef}
        style={{
          left: `${tooltipPosition.x}px`,
          top: `${tooltipPosition.y}px`,
        }}
        className="absolute pointer-events-none bg-white p-1.5 rounded-lg shadow-lg border border-neutral-200 opacity-0 transition-opacity duration-200 text-[10px] z-50 min-w-[120px]"
      />
    </div>
  );
}

function getNodeColor(type: string): string {
  switch (type) {
    case 'Individual': return colors.ocean[500];
    case 'Organization': return colors.sage[500];
    case 'Business': return colors.coral[500];
    default: return colors.neutral[500];
  }
}