import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';

import { connectStyle } from '@shoutem/theme';
import {
  Button,
  Icon,
  View,
} from '@shoutem/ui';
import {
  FadeIn,
  TimingDriver,
} from '@shoutem/animation';

class NavigationToolbar extends PureComponent {
  static PropTypes = {
    goForward: PropTypes.func,
    goBack: PropTypes.func,
    reload: PropTypes.func,
    webNavigationState: PropTypes.object,
  };

  renderForwardButton() {
    const { goForward, webNavigationState } = this.props;
    const iconStyle = !webNavigationState.canGoForward ? 'disabled' : null;

    return (
      <Button
        onPress={goForward}
        styleName="clear"
      >
        <Icon name="right-arrow" styleName={iconStyle} />
      </Button>
    );
  }

  renderBackButton() {
    const { goBack, webNavigationState } = this.props;
    const iconStyle = !webNavigationState.canGoBack ? 'disabled' : null;

    return (
      <Button
        onPress={goBack}
        styleName="clear"
      >
        <Icon name="left-arrow" styleName={iconStyle} />
      </Button>
    );
  }

  renderRefreshButton() {
    const { reload } = this.props;

    return (
      <Button
        onPress={reload}
        styleName="clear"
      >
        <Icon name="refresh" />
      </Button>
    );
  }

  componentWillMount() {
    this.driver = new TimingDriver({
      duration: 450,
    });
  }

  componentDidMount() {
    this.driver.runTimer(1);
  }

  render() {
    return (
      <FadeIn driver={this.driver}>
        <View styleName="container">
          <View styleName="navigation-buttons">
            {this.renderBackButton()}
            {this.renderForwardButton()}
          </View>

          <View styleName="vertical v-center h-center">
            {this.renderRefreshButton()}
          </View>
        </View>
      </FadeIn>
    );
  }
}

export default connectStyle('shoutem.webview.NavigationToolbar', {})(NavigationToolbar);
