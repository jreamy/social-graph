
import React from 'react';

import { ForceGraph2D } from 'react-force-graph';

class Graph extends React.Component {

  render() {
    if (!this.props.data || !this.props.data.length || !this.props.nodes) {
      return
    }

    const visible_nodes = this.props.nodes.filter((n) => n.visible).map((n) => this.props.data.map((d) => 
      Object.fromEntries(n.fields.map((f) => ([ [f.value], {value: d[f.value], merge: f.merge} ])))
    ))

    var prev = {}
    visible_nodes.forEach((x, i) => {   // node types
      x.forEach((y, j) => {             // nodes of a type
        Object.keys(y).forEach((k) => { // fields of a node
           if (y[k].value) {
            prev[k] = y[k].value;
          } else if (prev[k] && y[k].merge) {
            visible_nodes[i][j][k].value = prev[k];
          }
        })
      })
    })

    const colors = ["green", "blue", "purple", "red"]
    const all_nodes = visible_nodes.map((x, idx) => [...new Set(
      x.map((n) => Object.entries(n).filter((x) => x[1].value).map((x) => `${x[1].value}`).join(` - `))
    )].map((id) => ({ id, color: colors[idx % colors.length] })));

    const links = this.props.links.map((l) => all_nodes[l[0]].map((n0) => all_nodes[l[1]].map((n1) => ({
      source: n0.id, target: n1.id
    })))).flat().flat().filter(x => x.source !== '' && x.target !== '')

    const nodes = all_nodes.flat();

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
