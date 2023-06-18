
import React from 'react';

import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { FaBars } from "react-icons/fa";

class SheetInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sheet: props.sheet ? props.sheet : "",
      format: props.format ? props.format : "row",
      primary: props.primary ? props.primary : props.header ? props.header[0] : "",
      secondary: props.secondary ? props.secondary : props.header ? props.header[1] : "",
      show_secondary: props.show_secondary ? true : false,
      collapsed: true,
    };

    if (!props.primary || !props.secondary) {
      this.props.update(this.state);
    }
  }

  render() {
    
    return (
        <Sidebar 
        collapsed={this.state.collapsed} collapsedWidth='80px'
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
        <Menu>
          <MenuItem icon={<FaBars/>} onClick={(x) => this.setState(
            {collapsed: !this.state.collapsed}, 
            () => {this.props.update(this.state)}
          )}></MenuItem>
          {this.state.collapsed ? [] : [
            <MenuItem>
              {"Sheet: "}{<input type="text" value={this.state.sheet} onChange={(x) => this.setState(
                {sheet: x.target.value}, () => {this.props.update(this.state)},
              )} />}
            </MenuItem>, <MenuItem>
              {"Primary: "}
              <select name="primary" value={this.state.primary} onChange={(x) => this.setState(
                {primary: x.target.value}, () => {this.props.update(this.state)},
              )}>
                {this.props.header.map((x) => <option id={"primary-"+x} value={x}>{x}</option>)}
              </select>
            </MenuItem>, <MenuItem>
              {"Secondary: "}
              <select name="secondary" value={this.state.secondary} onChange={(x) => this.setState(
                {secondary: x.target.value}, () => {this.props.update(this.state)},
              )}>
                {this.props.header.map((x) => <option id={"secondary-"+x} value={x}>{x}</option>)}
              </select>
              <div>
                {"Visible: "}
                <input type="checkbox" onChange={(x) => this.setState({show_secondary: !this.state.show_secondary})} checked={this.state.show_secondary}></input>
                {" Format: "}
                <select name="format" value={this.state.format} onChange={(x) => this.setState(
                  {format: x.target.value}, () => {this.props.update(this.state)},
                )}>
                  <option value="row">row</option>
                  <option value="csv">csv</option>
                </select>
              </div>
            </MenuItem>, <MenuItem onClick={() => {this.props.save(this.state)}}> 
              Save 
            </MenuItem>
          ]}
        </Menu>
        </div>
      </Sidebar>
    );
  }
}

export default SheetInput;
