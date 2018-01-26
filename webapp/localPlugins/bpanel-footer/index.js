import { components } from 'bpanel-ui';

const { Text } = components;

export const metadata = {
  name: 'bpanel-footer',
  author: 'bcoin-org'
};

export const mapComponentState = {
  Footer: (state, map) =>
    Object.assign(map, {
      version: state.node.node.version,
      progress: state.chain.progress
    })
};

export const decorateFooter = (Footer, { React, PropTypes }) => {
  return class extends React.PureComponent {
    static displayName() {
      return 'bPanelFooter';
    }

    static get propTypes() {
      return {
        theme: PropTypes.object,
        version: PropTypes.string,
        progress: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        customChildren: PropTypes.node
      };
    }

    render() {
      const {
        theme,
        progress,
        version,
        customChildren: existingCustomChildren
      } = this.props;
      const progressPercentage = progress * 100;

      let customChildren = (
        <div className="container">
          <div className="row align-items-center">
            <div className="col-3 version text-truncate">
              <Text style={theme.footer.text}>{version}</Text>
            </div>
            <div className="col-3" style={theme.footer.progress}>
              <Text style={theme.footer.text}>
                {progressPercentage.toFixed(2)}% synced
              </Text>
            </div>
            {existingCustomChildren}
          </div>
        </div>
      );

      return <Footer {...this.props} customChildren={customChildren} />;
    }
  };
};
