export default function () {
  /**
   * 子域页面显示
   */
  this._provided.$bus.$on("pageAppear", (iframe) => {
    iframe.contentWindow.pageAppear && iframe.contentWindow.pageAppear()
  })
}
