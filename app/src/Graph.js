
import React from 'react';

import { ForceGraph2D } from 'react-force-graph';

class Graph extends React.Component {

  render() {
    if (!this.props.data || !this.props.data.length) {
      return
    }

    const primary_nodes = [...new Set(this.props.data.map((x) => x[this.props.primary.id]))];
    const secondary_nodes = [...new Set(this.props.data.map((x) => x[this.props.secondary.id]))];

    var primary_links = {};
    var secondary_links = {};
    this.props.data.forEach((x) => {
      // Map of primary_node -> secondary_node
      if (!primary_links[x[this.props.primary.id]]) {
        primary_links[x[this.props.primary.id]] = [];
      }
      primary_links[x[this.props.primary.id]].push(x[this.props.secondary.id])

      // Map of secondary_node -> primary_node
      if (!secondary_links[x[this.props.secondary.id]]) {
        secondary_links[x[this.props.secondary.id]] = [];
      }
      secondary_links[x[this.props.secondary.id]].push(x[this.props.primary.id])
    });

    var skip_links = [];
    primary_nodes.forEach((x) => {
      primary_links[x].forEach((y) => {
        skip_links = skip_links.concat(secondary_links[y].filter((z) => z !== x).map((z) => ({source: x, target: z})));
      });
    });

    const graphData = this.props.secondary.visible ? { 
      nodes: primary_nodes.map((x) => ({ id: x, color: 'green' })).concat(
        secondary_nodes.map((x) => ({ id: x, color: 'blue' })),
      ),
      links: this.props.data.map((x) => ({ 
        source: x[this.props.primary.id], 
        target: x[this.props.secondary.id],
      }))
    }: {
      nodes: primary_nodes.map((x) => ({ id: x, color: 'green' })),
      links: skip_links,
    }

    return <ForceGraph2D
      graphData={graphData}
      nodeLabel="id"
      nodeCanvasObject={(node, ctx, globalScale) => {
        const label = node.id;
        const fontSize = 12/globalScale;
        ctx.font = `${fontSize}px Sans-Serif`;
        const textWidth = ctx.measureText(label).width;
        const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2); // some padding

        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, ...bckgDimensions);

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = node.color;
        ctx.fillText(label, node.x, node.y);

        node.__bckgDimensions = bckgDimensions; // to re-use in nodePointerAreaPaint
      }}
      nodePointerAreaPaint={(node, color, ctx) => {
        ctx.fillStyle = color;
        const bckgDimensions = node.__bckgDimensions;
        bckgDimensions && ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, ...bckgDimensions);
      }}
    />;
  }
}

export default Graph;
