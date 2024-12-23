import React from 'react';
import { Node } from './types';
import { colors } from '../../../styles/colors';

interface GraphTooltipProps {
  node: Node;
}

export function GraphTooltip({ node }: GraphTooltipProps) {
  return `
    <div class="space-y-2">
      <div class="font-medium text-neutral-900">${node.name}</div>
      <div class="flex items-center gap-2">
        <div class="w-2 h-2 rounded-full" style="background-color: ${getNodeColor(node.type)}"></div>
        <span class="text-sm text-neutral-600">${node.type}</span>
      </div>
      ${node.email ? `<div class="text-sm text-neutral-600">${node.email}</div>` : ''}
      ${node.phone ? `<div class="text-sm text-neutral-600">${node.phone}</div>` : ''}
      <div class="text-sm text-neutral-600">
        Influence Score: ${node.influenceScore.toFixed(1)}
      </div>
    </div>
  `;
}

function getNodeColor(type: string): string {
  switch (type) {
    case 'Individual': return colors.ocean[500];
    case 'Organization': return colors.sage[500];
    case 'Business': return colors.coral[500];
    default: return colors.neutral[500];
  }
}