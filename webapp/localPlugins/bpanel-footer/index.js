export const metadata = {
  name: 'bpanel-footer',
  author: 'bcoin-org'
};

export const decorateFooter = (Footer, { React, PropTypes }) => {
  return class extends React.PureComponent {
    static displayName() {
      return 'bPanelFooter';
    }

    //   static get propTypes() {
    //     return {

    //     }
    //   }

    render() {
      const customFooter = (
        <div>
          <p>Hi! I am a custom footer ;)</p>
        </div>
      );
      return <Footer customFooter={customFooter} {...this.props} />;
    }
  };
};
