import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Dimensions } from 'react-native';
import moment from 'moment';
import _ from 'lodash';

import {
  Screen,
  ScrollView,
  View,
  Tile,
  Title,
  Caption,
  Icon,
  ImageBackground,
  ImageGallery,
  SimpleHtml,
} from '@shoutem/ui';
import { connectStyle } from '@shoutem/theme';

import { NextArticle } from 'shoutem.news';
import { NavigationBar } from 'shoutem.navigation';

import { getLeadImageUrl, resolveArticleTitle } from '../services';
import { ext } from '../const';

export class ArticleDetailsScreen extends PureComponent {
  static propTypes = {
    // The news article to display
    article: PropTypes.object.isRequired,
    // The next article, if this article is defined, the
    // up next view will be displayed on this screen
    nextArticle: PropTypes.object,
    // A function that will open the given article, this
    // function is required to show the up next view
    openArticle: PropTypes.func,
    // Whether the inline gallery should be displayed on the
    // details screen. Inline gallery displays the image
    // attachments that are not directly referenced in the
    // article body.
    showInlineGallery: PropTypes.bool,
    openNextArticle: PropTypes.func,
  };

  renderUpNext() {
    const { nextArticle, openArticle } = this.props;
    if (nextArticle && openArticle) {
      return (
        <NextArticle
          title={nextArticle.title.rendered}
          imageUrl={getLeadImageUrl(nextArticle)}
          openArticle={() => openArticle(nextArticle)}
        />
      );
    }

    return null;
  }

  renderInlineGallery() {
    const { article, showInlineGallery } = this.props;

    if (!showInlineGallery) {
      return null;
    }

    const images = _.map(article.wp.attachments.href, 'url');

    return (
      <ImageGallery sources={images} height={300} width={Dimensions.get('window').width} />
    );
  }

  render() {
    const { article } = this.props;

    const articleImageUrl = getLeadImageUrl(article);
    const momentDate = moment(article.modified);

    const dateInfo = momentDate.isAfter(0) ? (
      <Caption styleName="md-gutter-left">
        {momentDate.fromNow()}
      </Caption>
    ) : null;

    const resolvedTitle = resolveArticleTitle(article.title.rendered);

    return (
      <Screen styleName="full-screen paper">
        <NavigationBar
          styleName="clear"
          animationName="solidify"
          title={article.title.rendered}
          share={{
            title: resolvedTitle,
            link: article.link,
          }}
        />
        <ScrollView>
          <ImageBackground
            styleName="large-portrait placeholder"
            source={articleImageUrl ? { uri: articleImageUrl } : undefined}
            animationName="hero"
          >
            <Tile animationName="hero">
              <Title styleName="centered">{resolvedTitle.toUpperCase()}</Title>
              <View styleName="horizontal collapsed" virtual>
                <Caption numberOfLines={1} styleName="collapsible">{article.author}</Caption>
                {dateInfo}
              </View>
              <Icon name="down-arrow" styleName="scroll-indicator" />
            </Tile>
          </ImageBackground>
          <View styleName="solid">
            <SimpleHtml body={article.content.rendered} />
            {this.renderInlineGallery()}
            {this.renderUpNext()}
          </View>
        </ScrollView>
      </Screen>
    );
  }
}

export default connectStyle(ext('ArticleDetailsScreen'))(ArticleDetailsScreen);
