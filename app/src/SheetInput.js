
import React from 'react';

import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { FaBars } from "react-icons/fa";

class SheetInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      collapsed: true,

      sheet: props.sheet ?? "",
      nodes: props.nodes ?? [],
      links: new Set((props.links ?? []).filter((_, idx) => idx <= props.nodes.length).map((x) => JSON.stringify(x))),
    };

    this.menu_collapse = this.menu_collapse.bind(this);
    this.sheet_input = this.sheet_input.bind(this);
    this.save = this.save.bind(this);
  }

  menu_collapse(x) {
    this.setState({ collapsed: !this.state.collapsed }, () => {this.props.update(this.state)})
  }

  sheet_input(x) {
    this.setState({ sheet: x.target.value }, () => {this.props.update(this.state)})
  }

  save(x) {
    this.props.save(this.state)
  }

  render() {
    return (
        <Sidebar 
        collapsed={this.state.collapsed} collapsedWidth='80px'
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
        <Menu>
          <MenuItem key="collapse" icon={<FaBars/>} onClick={this.menu_collapse}></MenuItem>
          
          {this.state.collapsed ? [] : <MenuItem key="sheet-input">
            {"Sheet: "}{<input type="text" value={this.state.sheet} onChange={this.sheet_input} />}
          </MenuItem>}

          {this.state.collapsed ? [] : this.state.nodes.map((node, n_idx) =>
            <SubMenu key={`node-${n_idx}`} label={`Node ${n_idx}`}> 
              {[node.fields.map((field, f_idx) => 
                <MenuItem key={"node-"+n_idx+"-"+f_idx}>
                  <select key={"node-"+n_idx+"-"+f_idx} value={field.value} onChange={(x) => {
                    const nodes = this.state.nodes;
                    nodes[n_idx].fields[f_idx].value = x.target.value;
                    this.setState({ nodes }, () => {this.props.update(this.state)});
                  }}>
                    {this.props.header.map((x) => <option key={`node-${n_idx}-${f_idx}-${x}`} value={x}>{x}</option>)}
                  </select> {"merge: "}
                  <input type="checkbox" checked={field.merge} onChange={(x) => {
                    const nodes = this.state.nodes;
                    nodes[n_idx].fields[f_idx].merge = x.target.checked;
                    this.setState({ nodes }, () => {this.props.update(this.state)});
                  }}/>
                </MenuItem>
              )]}

              { /* Button to remove a node parameter */ }
              {node.fields && node.fields.length > 1 ? <button onClick={()=>{
                const nodes = this.state.nodes;
                nodes[n_idx].fields.pop();
                this.setState({ nodes }, () => {this.props.update(this.state)});
              }}>-</button> : []}

              { /* Button to add a node parameter */ }
              <button onClick={()=>{
                const nodes = this.state.nodes;
                nodes[n_idx].fields.push({value: this.props.header[0], merge: false});
                this.setState({ nodes }, () => {this.props.update(this.state)});
              }}>+</button>

              { /* Button for node visibility */ }
              <button onClick={(x)=>{
                const nodes = this.state.nodes;
                nodes[n_idx].visible = !nodes[n_idx].visible;
                this.setState({ nodes }, () => {this.props.update(this.state)});
              }}>{node.visible ? "hide" : "show"}</button>

              { /* Button to remove node */ }
              {this.state.nodes.length !== 0 ? <button onClick={(x)=>{
                const nodes = this.state.nodes;
                nodes.splice(n_idx, 1);
                this.setState({ nodes }, () => {this.props.update(this.state)});
              }}>{"delete"}</button> : []}

            </SubMenu>
          )}

          {this.state.collapsed ? [] : <MenuItem key="add-node" onClick={() => {
            const nodes = this.state.nodes;
            nodes.push({ fields: [{value: this.props.header[0] ?? "", merge: false}], visible: true });
            this.setState({ nodes }, () => {this.props.update(this.state)});
          }}> {"Add Node"} </MenuItem>}

          {this.state.collapsed ? [] : this.state.nodes.map((_, i) => this.state.nodes.map((_, j) => 
            ( i < j ? <MenuItem key={`link-${i}-${j}`}>
              {`${i} <-> ${j} `}<input type="checkbox" checked={this.state.links.has(JSON.stringify([i, j]))} onChange={(x)=>{
                const links = this.state.links;
                if (x.target.checked) {
                  links.add(JSON.stringify([i, j]))
                } else {
                  links.delete(JSON.stringify([i, j]))
                }
                this.setState({ links }, () => {this.props.update(this.state)});
              }}/>
            </MenuItem> : []
          ))).flat()}

          {this.state.collapsed ? [] : <MenuItem key="save" onClick={this.save}> 
            {"Save"}
          </MenuItem>}

        </Menu>
        </div>
      </Sidebar>
    );
  }
}

export default SheetInput;
