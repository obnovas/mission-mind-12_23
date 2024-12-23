export interface Node extends d3.SimulationNodeDatum {
  id: string;
  name: string;
  type: string;
  influenceScore: number;
  email?: string;
  phone?: string;
}

export interface Link extends d3.SimulationLinkDatum<Node> {
  value: number;
  isGroupConnection?: boolean;
}

export interface ColorFamily {
  name: string;
  colors: Record<number, string>;
}