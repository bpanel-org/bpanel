import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const getActive = (name, pathname) =>
  pathname.includes(name) ? 'sidebar-item-active' : '';

export default class SidebarItem extends PureComponent {
  static get propTypes() {
    return {
      name: PropTypes.string.isRequired,
      icon: PropTypes.string,
      subItem: PropTypes.bool,
      children: PropTypes.node,
      pathname: PropTypes.string
    };
  }
  render() {
    const {
      name,
      icon = 'cog',
      subItem = false,
      children,
      pathname
    } = this.props;

    return (
      <Link
        to={name}
        className={`nav-item sidebar-link ${subItem ? 'subItem' : ''}`}
      >
        <div className={`sidebar-item  ${getActive(name, pathname)}`}>
          <i className={`fa fa-${icon} sidebar-item-icon`} />
          <span>{name}</span>
          {children}
        </div>
      </Link>
    );
  }
}
