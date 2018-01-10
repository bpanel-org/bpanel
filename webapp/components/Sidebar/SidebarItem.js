import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import * as UI from 'bpanel-ui';

const { utils: { connectTheme } } = UI;

class SidebarItem extends PureComponent {
  constructor() {
    super();
    this.state = {
      hovered: false
    };
    this.onToggleHover = this.onToggleHover.bind(this);
  }

  static get propTypes() {
    return {
      name: PropTypes.string.isRequired,
      icon: PropTypes.string,
      subItem: PropTypes.bool,
      children: PropTypes.node,
      pathname: PropTypes.string
    };
  }

  onToggleHover() {
    this.setState({ hovered: !this.state.hovered });
  }

  onGetActive(name, pathname) {
    const { theme } = this.props;
    return pathname.includes(name) ? theme.sidebar.item.active : {};
  }

  render() {
    const {
      name,
      icon = 'cog',
      subItem = false,
      children,
      pathname,
      theme
    } = this.props;
    const hoverStyle = this.state.hovered ? theme.sidebar.item.hover : {};

    return (
      <Link
        to={name}
        className={`nav-item ${subItem ? 'subItem' : ''}`}
        style={theme.sidebar.link}
        onMouseEnter={this.onToggleHover}
        onMouseLeave={this.onToggleHover}
      >
        <div
          style={{
            ...theme.sidebar.item,
            ...hoverStyle,
            ...this.onGetActive(name, pathname)
          }}
        >
          <i className={`fa fa-${icon}`} style={theme.sidebar.itemIcon} />
          <span>{name}</span>
          {children}
        </div>
      </Link>
    );
  }
}

export default connectTheme(SidebarItem);
