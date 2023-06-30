
import React from 'react';

import { ForceGraph2D } from 'react-force-graph';

class Graph extends React.Component {

  render() {
    if (!this.props.data || !this.props.data.length || !this.props.nodes) {
      return
    }

    var prev = {};
    const filtered = this.props.nodes.filter((n) => n.visible);
    const data = this.props.data.map((row) => filtered.map((n, n_idx) => n.fields.map((f) => {
      if (row[f.value]) {
        prev[n_idx] = { ...prev[n_idx],
          [f.value]: row[f.value],
        }
      }
      return f.merge ? prev[n_idx][f.value] : row[f.value]
    })))

    const node_id = (x) => x ? x.filter((x) => x).join(" - ") : ""

    const colors = ["green", "blue", "purple", "red"]
    const node_colors = Object.fromEntries(data.map((n) => n.map((x, idx) => [
      node_id(x), colors[idx % colors.length],
    ])).flat())
    const nodes = Object.keys(node_colors).map((id) => ({id, color: node_colors[id]}))
    
    const links = this.props.links.map((l) => data.map((n) => ({
      source: node_id(n[l[0]]), target: node_id(n[l[1]])
    }))).flat()

    return <ForceGraph2D
      graphData={{nodes, links}}
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
