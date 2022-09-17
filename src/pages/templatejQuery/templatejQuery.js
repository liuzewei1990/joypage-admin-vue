import $ from "jquery";
// console.log("templatejQuery");

document.querySelector("#btn-message").addEventListener("click", () => {
    window.parent.postMessage({
        message: "message",
        data: {
            message: "我是通过子域调起来的消息提示",
            type: "error"
        }
    });
});
