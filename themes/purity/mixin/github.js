export default {
  methods: {
    getGithubListUrl() {
      if (this.$fragy.github) {
        const { repo, proxy, base } = this.$fragy.github;
        const apiUrl = this.$consts.GITHUB_CONTENTS_API.replace('{repo}', repo).replace(
          '{base}',
          base || '.fragy/posts',
        );
        if (proxy) {
          let formattedProxy = proxy;
          if (proxy.endsWith('/')) {
            formattedProxy = `${proxy}/`;
          }
          return `${formattedProxy}${apiUrl}`;
        }
        return apiUrl;
      }
    },
    getGithubContentUrl(contentUrl) {
      const { proxy } = this.$fragy.github;
      if (proxy) {
        const formattedProxy = proxy.endsWith('/') ? proxy : `${proxy}/`;
        return `${formattedProxy}${contentUrl}`;
      }
      return contentUrl;
    },
    getGithubRawContentUrl(fileName) {
      const { proxy, branch, repo, base } = this.$fragy.github;
      const formattedBase = base || '.fragy/posts';
      const formattedBranch = branch || 'main';
      const contentUrl = this.$consts.GITHUB_CONTENT_URL.replace('{repo}', repo)
        .replace('{branch}', formattedBranch)
        .replace('{base}', formattedBase)
        .replace('{fileName}', encodeURIComponent(fileName));
      if (proxy) {
        const formattedProxy = proxy.endsWith('/') ? proxy : `${proxy}/`;
        return `${formattedProxy}${contentUrl}`;
      }
      return contentUrl;
    },
  },
};
