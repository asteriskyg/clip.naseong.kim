(function() {
  const w = window;
  if (w.ChannelIO) {
    return w.console.error('ChannelIO script included twice.');
  }
  const ch = function() {
    ch.c(arguments);
  };
  ch.q = [];
  ch.c = function(args) {
    ch.q.push(args);
  };
  w.ChannelIO = ch;
  function l() {
    if (w.ChannelIOInitialized) {
      return;
    }
    w.ChannelIOInitialized = true;
    const s = document.createElement('script');
    s.type = 'text/javascript';
    s.async = true;
    s.src = 'https://cdn.channel.io/plugin/ch-plugin-web.js';
    const x = document.getElementsByTagName('script')[0];
    if (x.parentNode) {
      x.parentNode.insertBefore(s, x);
    }
  }
  if (document.readyState === 'complete') {
    l();
  } else {
    w.addEventListener('DOMContentLoaded', l);
    w.addEventListener('load', l);
  }
})();

// eslint-disable-next-line no-undef
ChannelIO('boot', {
  pluginKey: '02450e74-074b-4597-bb95-a9aa42f7f5d2',
});
