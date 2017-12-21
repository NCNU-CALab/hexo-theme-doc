'use strict';

module.exports = ({hexo}) => {
  const allowedProperties = {
    config: [
      'root',
      'theme',
      'theme_config',
      'time_format',
      'timezone'
    ],
    page: [
      'path',
      'title',
      'support'
    ]
  };

  const filter = (source, allowedValues) => {
    return Object
      .keys(source)
      .filter(key => allowedValues.includes(key))
      .reduce((obj, key) => {
        obj[key] = source[key];
        return obj;
      }, {});
  };

  hexo.extend.filter.register('template_locals', function (locals){

    const data = locals.site.data;

    const page = filter(locals.page, allowedProperties.page);

    const config = filter(locals.config, allowedProperties.config);

    // 準備彙整所有 posts
    let posts = [];

    // 依照 navigation data 格式彙整
    for (let post of locals.site.posts.data) {
      posts.push({
        text: post.title,
        type: 'link',
        path: post.path,
        date: post.date.format(),
      })
    }

    // 依建立時間排序
    posts = posts.sort((a, b) => {
      // 舊的在前
      return new Date(a.date) - new Date(b.date);
    });

    // 放置於 data 中待整合現有 navigation data
    data.posts = posts;

    locals.initial_state = {
      page,
      data,
      config
    };

    return locals;
  }, 20);
};
