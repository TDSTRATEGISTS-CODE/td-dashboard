/*
 * TD Strategists dashboard — Wix Custom Element wrapper.
 *
 * Wix's built-in "Embed HTML" element is a FIXED height and can't be resized from code, so a
 * multi-page SPA scrolls unevenly (the iframe stays at the tallest page's height and shorter pages
 * get trailing whitespace). A Wix Custom Element CAN resize itself and Wix reflows the page around
 * it — so this wraps the dashboard in an iframe and grows/shrinks to the height the dashboard reports
 * (app.js posts { type:'td-embed-height', height } on every page/data change). Result: each page fits
 * its own height, like the GitHub Pages view.
 *
 * In the Wix editor (Dev Mode on): Add → Embed Code → Custom Element
 *   • Tag name : td-dashboard
 *   • Server URL: this file's public URL  (e.g. https://<your-pages-host>/wix-embed.js)
 *   • Attribute : data-client = nkv   (or amacx, etc.)
 * The element finds the dashboard next to this script, so there's no URL to hardcode. Optional
 * attributes: data-src (full index.html URL override) and data-min-height (initial px, default 900).
 */
(function () {
  var SELF = (document.currentScript && document.currentScript.src) || '';
  var BASE = SELF.replace(/[^/]*$/, '');   // directory this script lives in (where index.html is)
  if (window.customElements && customElements.get('td-dashboard')) return;

  customElements.define('td-dashboard', class extends HTMLElement {
    connectedCallback() {
      if (this._init) return;            // guard against repeated connects
      this._init = true;
      var client = (this.getAttribute('data-client') || 'nkv').replace(/[^a-z0-9_-]/gi, '');
      var src = this.getAttribute('data-src') || (BASE + 'index.html?client=' + encodeURIComponent(client));
      var minH = parseInt(this.getAttribute('data-min-height'), 10) || 900;

      this.style.display = 'block';
      this.style.width = '100%';
      this.style.background = '#f1ece6';   // dashboard --bg: mask any Wix section colour behind the iframe

      var f = document.createElement('iframe');
      f.src = src;
      f.title = 'TD Strategists Dashboard';
      f.setAttribute('scrolling', 'no');
      // No allowtransparency: keep the iframe opaque so the host page never shows through a gap (the
      // "green bar" some mobiles showed). Give it the dashboard bg so there's no flash before it paints.
      f.style.cssText = 'width:100%;border:0;display:block;background:#f1ece6;height:' + minH + 'px;transition:height .18s ease;';
      this.appendChild(f);

      var self = this;
      function apply(h) {
        if (!h || h < 100) return;
        h = Math.ceil(h);
        f.style.height = h + 'px';
        self.style.height = h + 'px';    // grow the Custom Element too so Wix reflows the page
      }

      window.addEventListener('message', function (e) {
        var d = e.data;
        // only act on our own iframe's messages
        if (d && d.type === 'td-embed-height' && typeof d.height === 'number' &&
            (!f.contentWindow || e.source === f.contentWindow)) {
          apply(d.height);
        }
      });
    }
  });
})();
