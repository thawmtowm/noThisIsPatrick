// ==UserScript==
// @name         AHTT_norm
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Quanbua
// @author       Thawmtowm
// @match        https://an-hoang-trung-tuon*.blogspot.com/*
// @include      https://an-hoang-trung-tuon*.blogspot.com/*
// @grant        none
// @run-at       document-start
// ==/UserScript==




(function () {
    'use strict';
    /**
     * OVERRIDE funtion updateOneCommentContent() nhômnhựa của Zì
     *
     * https://cdn.jsdelivr.net/gh/antonroch/blogger/blogger.format.gd3.js
     *
     */

    // Khaibáo hàm mới để-thaythế, với IntersectionObserver
    const customUpdateOneCommentContent = function (bcId, idPrefix, authorUrl, timestamp) {
        var comtextid = document.getElementById(idPrefix + bcId); if (!comtextid) return;
        if (!comtextid) return;
        // Observing các-target Đầu và Chân, tránh lỗi với các comment có height quá lớn
        const targets = comtextid.closest('.comment-block').querySelectorAll('.comment-footer, .comment-header, .comment-author');
        if (targets.length === 0) return;
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCommentContentLegacy(bcId, idPrefix, authorUrl, timestamp);
                    targets.forEach(el => obs.unobserve(el));
                }
            });
        }, {
            rootMargin: '100px',
            threshold: 0
        });
        targets.forEach(el => observer.observe(el));
    };
    // Copy paste từ updateOneCommentContent() nhômnhựa của Zì, thêm [attr='is-processed'] để tránh xửlý-lại nhiều lần
    function updateCommentContentLegacy(bcId, idPrefix, authorUrl, timestamp) {
        var comtextid = document.getElementById(idPrefix + bcId); if (!comtextid) return;
        if (comtextid.getAttribute('is-processed') === 'true') return;
        var mrText = getStyledComment(authorUrl, '?', timestamp, comtextid.innerHTML);
        comtextid.innerHTML = mrText;
        comtextid.setAttribute('is-processed', 'true');
    };

    // Safely apply the override
    const safeOverride = (name, func) => {
        try {
            // Check if the property is already locked
            const desc = Object.getOwnPropertyDescriptor(window, name);
            if (desc && !desc.configurable) {
                window[name] = func;
                return;
            }
            Object.defineProperty(window, name, {
                value: func,
                writable: true,
                configurable: true,
                enumerable: true
            });
            console.log(`Successfully overridden ${name}`);
        } catch (e) {
            window[name] = func; // Fallback
        }
    };

    safeOverride('updateOneCommentContent', customUpdateOneCommentContent);













    /**
     * Ngay sau khi HTML(DOMContentLoaded)
     * Chỉnhsửa meta, CSS,...
     */

    document.addEventListener("DOMContentLoaded", () => {
        applyNewMetaTags();
        applyNewStyles();
        applyNewSidebarOrg();
        applyNewCommentPaging();

        initActionMenu?.();
        // Set text size from cookie
        const savedSize = getBodyTextSizeFromCookie();
        document.documentElement.style.setProperty('--comment-body-text-size', `${savedSize}px`);
    });
    /**
     * Đợi sau khi các Hàm nhôm-nhựa của Zì chạy xong
     * Observing .comment-block
     */
    window.addEventListener('load', () => {

        const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
        const commentBlocks = document.querySelectorAll('.comment-block');
        commentBlocks.forEach(commentBlock => {
            observerCommentBlock.observe(commentBlock);
            /**
             * Change color of ZZ DARKMODE/LIGHTMODE
             */
            if (prefersDarkScheme.matches) {
                const authorLink = commentBlock.querySelector('.comment-author a');
                if (isZZ(authorLink)) {
                    commentBlock.classList.add('zz-comment');
                } else {
                    commentBlock.classList.add('bua-comment');
                }
                const commentTextFontTags = commentBlock.querySelectorAll('.comment-text font');
                commentTextFontTags.forEach(fontTag => {
                    fontTag.color = '';
                });
            }
        });
    });


    /**
     * Tìm thẻ <meta> tên name="viewport"
     * 'initial-scale=1.0, maximum-scale=1, user-scalable=no' Giúp việc cuộn lên-xuống trên điện thoại không bị đảo chéo đảo phải
     * 'mobile-web-app-capable', 'apple-mobile-web-app-capable' Để cài áp standalone trên điện thoại kèm nhận thông báo
     */
    function applyNewMetaTags() {
        const head = document.head;

        const setMeta = (name, content) => {
            let meta = document.querySelector(`meta[name="${name}"]`);
            if (!meta) {
                meta = document.createElement('meta');
                meta.name = name;
                head.appendChild(meta);
            }
            meta.content = content;
        };

        // Set Viewport
        setMeta('viewport', 'width=device-width, initial-scale=1.0, maximum-scale=1, user-scalable=no, viewport-fit=cover');

        // Set Web App Capabilities
        ['mobile-web-app-capable', 'apple-mobile-web-app-capable'].forEach(name => setMeta(name, 'yes'));
    }
    /**
     * CSS mới
     */
    function applyNewStyles() {
        // HighlightJS cho block code/pre
        const resources = [
            { type: 'link', rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/default.min.css' },
            { type: 'script', src: 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/highlight.min.js' }
        ];
        resources.forEach(({ type, ...attrs }) => {
            const element = document.createElement(type);
            Object.entries(attrs).forEach(([key, value]) => element.setAttribute(key, value));
            document.head.appendChild(element);
        });
        // CSS
        const newStyles = document.createElement('style');
        newStyles.textContent =
            `
:root {
    --bg-primary: #ffffff;
    --bg-secondary: #f4f4f7;
    --bg-tertiary: #e9e9ee;

    --border-primary: #cccccc;
    --border-subtle: #eeeeee;

    --text-link: #007bff;
    --text-link-alt: #FF9900;
    --accent: #2a7aef;

    --text-primary: #121212;
    --text-secondary: #4a4a4a;
    --text-zizun: blue;
    --text-success: #169106;
    --text-info: #0dcaf0;
    --text-warning: #FF9966;
    --text-danger: #be2323;

    --box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
    --border-radius: 5px;

    color-scheme: light dark;
}

@media (prefers-color-scheme: dark) {
    :root {
        --bg-primary: #1e1e1e;
        --bg-secondary: #2c2c2c;
        --bg-tertiary: #444444;

        --border-primary: #444444;
        --border-subtle: #333333;

        --text-link: #3391ff;
        --text-link-alt: #FF9900;
        --accent: #4c9aff;

        --text-primary: #e0e0e0;
        --text-secondary: #a0a0a0;
        --text-zizun: #2196f3;
        --text-success: #2ecc71;
        --text-info: #6edff6;
        --text-warning: #ffb38a;
        --text-danger: #ff5c5c;

        --box-shadow: 0 4px 20px rgba(0, 0, 0, 0.6);
        --border-radius: 5px;
    }
}

*::-webkit-scrollbar {
    width: 6px;
    height: 6px;
}

*::-webkit-scrollbar-thumb {
    background: rgba(120, 120, 120, 0.7);
    border-radius: 6px;
}

h1,
h2,
h3,
h4,
h5,
h6,
summary,
button,
.btn-action-group,
.post-nav-container {
    -webkit-user-select: none;
    /* Safari */
    -ms-user-select: none;
    /* IE 10 and 11 */
    user-select: none;
    /* Standard syntax */
}

a,
code,
pre,
p,
div,
span,
font {
    overflow-wrap: anywhere;
    word-wrap: break-word;
    hyphens: auto;
}

a {
    color: var(--text-link);
    text-decoration: none;
    transition: color 0.2s ease;
    overflow-wrap: anywhere;
    word-break: break-all;
}

a:hover,
a:focus {
    color: var(--accent);
    text-decoration: underline;
}

.no-select {
    user-select: none;
    -webkit-user-select: none;
    /* For Safari */
    -moz-user-select: none;
    /* For Firefox */
    -ms-user-select: none;
    /* For older versions of IE */
}

.btn-primary {
    background-color: var(--accent);
    color: var(--bg-primary);
    padding: 10px 20px;
    border: none;
    border-radius: var(--border-radius);
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s ease, opacity 0.2s ease;
}


input[type="checkbox"],
input[type="radio"] {
    accent-color: var(--accent);
}

body {
    color: var(--text-secondary);
    background-color: var(--bg-primary);
}

#page_body .FeaturedPost,
.Blog .blog-posts .post-outer-container {
    background-color: var(--bg-primary);
}

.byline {
    color: var(--text-secondary);
}

.search-input input,
.Header h1,
.Header h1 a,
.Header h1 a:hover,
.Header h1 a:visited {
    color: var(--text-primary);
}

.sticky {
    background-color: var(--bg-primary);
}

.sidebar-container .widget .title {
    color: var(--text-primary);
}

@media screen and (min-width: 1440px) {
    .sidebar-container {
        bottom: 0;
        position: fixed;
        margin-top: 0;
        min-height: 0;
        overflow-x: hidden;
        overflow-y: scroll;
        z-index: 2000;
    }

    .sidebar-container {
        position: fixed;
        top: 0;
        left: calc(50% - 670px);
        height: 100vh;
    }
}

@media (min-width: 1200px) {
    .container {
        width: unset;
    }
}

@media (min-width: 992px) {
    .container {
        width: unset;
    }
}

@media (min-width: 768px) {
    .container {
        width: unset;
    }
}

.container {
    padding-right: unset;
    padding-left: unset;
    margin-right: unset;
    margin-left: unset;
}

@media screen and (min-width: 720px) {
    .page_body .centered {
        max-width: unset;
    }

    .page_body {
        margin-left: 0;
    }

    .page {
        max-width: 720px;
        margin: 0 auto;
    }
}


div.widget.Blog .blog-posts .post-outer-container {
    padding: 0;
}

.bg-photo-container,
.bg-photo-overlay,
.skip-navigation {
    display: none;
}

.centered-bottom {
    padding: 0;
}

.post-body {
    font: 1.35em san-serif;
    margin: 0.5em 0;
    color: var(--text-secondary);
}

.post {
    padding: 10px;
    background: var(--bg-secondary);
    border-radius: var(--border-radius);
}

.post-title,
.post-title a,
.post-title a:hover,
.post-title a:visited {
    color: var(--text-primary);
    font-size: x-large;
}

.post-snippet .snippet-item {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

#comments {
    border-top: 0;
    padding: 5px;
}









/* Paging */
span.num_comments {
    color: var(--text-primary);
}

.comment-paging,
#commentpaging {
    display: inline-block;
}

.comment-paging a,
#commentpaging a {
    float: left;
    display: flex;
    flex-wrap: wrap;
    font-size: 16px;
    font-family: 'GIUN_TAHOMA';
    width: 30px;
    height: 30px;
    border-radius: var(--border-radius);
    align-content: center;
    justify-content: center;
    margin: 2px;
    background-color: var(--text-link);
    color: white;
}

.comment-paging img {
    border-radius: var(--border-radius);
    width: 100%;
    height: 100%;
}

.comment-paging a:hover,
#commentpaging a:hover {
    text-decoration: none;
    background-color: var(--text-danger);
}

span.num_comments {
    padding-left: 20px;
}









/* .comment-block */
#comments-block {
    padding: 0 0 20px 0;
}

dd {
    margin-inline-start: 10px;
}

.comment-body {
    margin-bottom: 0;
    margin: 0 10px;
    font-size: 120%;
}

@media screen and (max-width: 720px) {
    .comment-body {
        font-size: 110%;
    }

    .comment-text .large-img,
    .comment-text iframe {
        max-width: 98%;
    }
}

.zz-comment .comment-text {
    color: var(--text-zizun);
}

.bua-comment .comment-text {
    color: var(--text-primary);
    font-family: Tahoma;
}

.comment-text .large-img,
.comment-text iframe {
    max-width: 95%;
    height: auto;
    display: block;
    margin: 0 auto;
    border-radius: var(--border-radius);
}

.comment-text iframe {
    aspect-ratio: 4/3;
}

.comment-footer img {
    display: none;
}

.comment-text pre {
    font-size: 70%;
    white-space: pre;
    word-wrap: break-word;
}

.comment-footer span,
.comment-footer a,
.comment-author a,
.comment-author font,
a.comment-ref {
    font-size: 10px;
    font-family: 'GIUN_TAHOMA';
    font-weight: bold;
}

.comment-author a,
.comment-author font {
    font-size: 14px;
}

.comment-go>a::after {
    content: 'REPLY';
    color: var(--text-success);
    padding: 0 5px;
}

a.comment-delete::after {
    content: 'DELETE';
    color: var(--text-danger);
    padding: 0 5px 0 10px;
}

a.comment-ref {
    border: 1px solid var(--border-primary);
    padding: 5px;
    border-radius: var(--border-radius);
    margin-left: 10px;
}

a.comment-ref>i {
    color: var(--text-warning) !important;
}








/* Sidebar */
.sidebar-container,
.sidebar-container .sidebar_bottom {
    background-color: var(--bg-primary);
}

.sidebar-container .widget+.widget {
    border-top: 0;
}

.sidebar-container .widget {
    padding: 0;
    border-top: 0;
}

summary {
    list-style: none;
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 5px 5px;
}

summary::-webkit-details-marker {
    display: none;
}

summary::before {
    content: '›';
    display: inline-block;
    margin-right: 10px;
    font-weight: 100;
    transition: transform 0.2s ease;
}

details[open] summary::before {
    transform: rotate(90deg);
}

.widget .title {
    font-size: 1.2em;
    font-weight: bold;
    color: var(--text-primary);
    line-height: normal;
}

/* Links in the Widget */
.sidebar_bottom .widget-content {
    padding: 0 10px;
}

.sidebar_bottom .widget-content img {
    border-radius: var(--border-radius);
}

#Label1 .show-more,
#Label1 .show-less {
    display: none;
}

#HTML1 a:nth-of-type(-n+4) {
    display: inline-block;
    margin-bottom: 5px;
}

#HTML1 a:nth-child(5) {
    margin-bottom: 10px;
}

.sidebar_bottom .widget-content>a {
    color: var(--text-link);
    font-size: 16px;
    text-decoration: none;
    display: block;
    padding: 5px 0 5px 10px;
    transition: margin 0.2s ease;
}

.sidebar_bottom .widget-content>a:hover {
    color: var(--accent);
    margin-left: 7px;
}

.sidebar_bottom .widget-content a::first-letter {
    text-transform: uppercase;
}

.sidebar_bottom .widget-content br {
    display: none;
}

#divRecentCommentsButton {
    margin: 0 0 0 10px;
}









/* TOOGLE ELEMENTS */
.popup-container {
    width: calc(100% - 14px);
    max-width: 720px;
    /* never wider than screen - safe margins */
    min-width: 280px;
    /* readable on small phones */
    max-height: 61.8vh;
    overflow-y: auto;
    overflow-x: hidden;
    position: absolute;
    z-index: 2000;
    background-color: var(--bg-secondary);
    border: 1px solid var(--border-primary);
    border-radius: var(--border-radius);
    box-shadow: var(--box-shadow);
    box-sizing: border-box;
    display: block;
    color: var(--text-secondary);
    font-family: 'GIUN_TAHOMA';
    padding-top: 35px;
    cursor: default;
    /* important */
    user-select: text;
    /* allow selecting text inside */
    touch-action: manipulation;
    /* better mobile feel */
    will-change: left, top;
    /* helps iOS rendering during drag */
    transform: translate3d(0, 0, 0);
    /* force GPU layer – smoother drag */
    -webkit-user-drag: none;
    /* prevent image/text drag interference */
}

.popup-close-btn {
    position: absolute;
    top: 8px;
    right: 4px;
    font-size: 14px;
    cursor: pointer;
    background: transparent;
    border: none;
    -webkit-appearance: none;
    appearance: none;
}

.popup-close-btn::after {
    content: '❌';
}

.popup-comment {
    padding: 5px;
}

.popup-comment>p {
    text-align: center;
    color: var(--text-secondary);
}

.popup-editor {
    z-index: 2100;
}

.popup-editor iframe {
    width: 100%;
    border: 0;
}

.popup-editor .iframe-editor {
    height: 55vh;
}

@media (orientation: portrait) and (max-width: 720px) {
    .popup-editor .iframe-editor {
        height: 85vh;
    }
}

.popup-editor .iframe-blog-cmt {
    min-height: 320px;
    border-radius: var(--border-radius) var(--border-radius) 0 0;
}

.popup-editor #block-refresh-btn {
    width: 80%;
    position: absolute;
    top: 5px;
    left: 50%;
    transform: translateX(-50%);
    border-radius: var(--border-radius);
    padding: 5px;
    color: var(--text-success);
    border: 1px solid var(--text-danger);
    -webkit-appearance: none;
    appearance: none;
    font-size: 12px;
}

.popup-editor #block-refresh-btn.active {
    color: white;
    background-color: var(--text-success);
}









/* FLOATING BUTTON ACTION GROUP  */
.btn-action-group {
    position: fixed;
    top: 20vh;
    right: calc((100% - min(100%, 700px)) / 2 + 10px);
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    /* Align buttons to the right */
    gap: 12px;
    z-index: 2000;
    /* ... existing styles ... */
}

.btn-item {
    display: flex;
    align-items: center;
    gap: 12px;
    /* 12px spacing requested */
}

.btn-label {
    font-size: 14px;
    color: var(--text-primary);
    text-shadow: 0 3px 3px rgba(0, 0, 0, 0.4);
    /* Subtle shading */
    white-space: nowrap;
    opacity: 0.8;
}

/* Optional: Keep the cursor as a pointer but prevent text selection */
.btn-label,
.btn-action-group button {
    cursor: pointer;
}

.btn-action-group button {
    width: 40px;
    height: 40px;
    background-color: var(--bg-primary);
    color: var(--text-secondary);
    border: 1px solid var(--border-primary);
    box-shadow: var(--box-shadow);
    border-radius: var(--border-radius);
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    flex-shrink: 0;
}

.btn-action-group button:hover {
    background-color: var(--bg-tertiary);
    border-color: var(--border-subtle);
}

/* Visibility Logic */
.btn-sub {
    display: none;
}

.btn-action-group.active .btn-sub {
    display: flex;
}


.comment-block.deactive {
    display: none;
}
.comment-text, .post-body {
    font-size: var(--comment-body-text-size);
}
`;
        document.head.appendChild(newStyles);
    }

    /**
     * Sửa thanh bên SIDEBAR
     */
    function applyNewSidebarOrg() {
        // Đảo vịtrí của LABELS lên đầu
        const sidebarBottom = document.querySelector('#sidebar_bottom');
        sidebarBottom.classList.add('no-select');
        sidebarBottom.insertBefore(sidebarBottom.children[4], sidebarBottom.firstChild);

        // Nhóm 3 mục DO-GO-COMMENT làm 1
        const second = sidebarBottom.children[1];
        const third = sidebarBottom.children[2];
        const fourth = sidebarBottom.children[3];
        const target = fourth.querySelector('.widget-content');
        Array.from(second.querySelectorAll('.widget-content a'))
            .forEach(a => {
                target.prepend(a);
            });
        Array.from(third.querySelectorAll('.widget-content a'))
            .reverse()
            .forEach(a => {
                target.prepend(a);
            });
        second.remove();
        third.remove();

        // Chuyểnđổi cấutrúc sang details/summary
        const widgets = sidebarBottom.querySelectorAll('.widget');
        widgets.forEach((widget, index) => {
            const title = widget.querySelector('h3.title');
            const widgetContent = widget.querySelector('.widget-content');
            if (title && widgetContent) {
                const details = document.createElement('details');
                const summary = document.createElement('summary');

                details.id = widget.id;
                details.className = widget.className;
                summary.className = title.className;
                summary.innerHTML = title.innerHTML;
                // Index > 5 mở (CRYPTO - MINEABLE - COMMUNITY), còn lại đóng
                if (index > 5) {
                    details.open = true;
                }
                details.appendChild(summary);
                details.appendChild(widgetContent);
                widget.parentNode.replaceChild(details, widget);
            }
        });
    }

    /**
     * Sửa comment-paging
     */
    function applyNewCommentPaging() {
        // Phân trang tại HOME-page
        document.querySelectorAll('.post-bottom').forEach(postBottom => {
            const numCommentsElement = postBottom.querySelector('.num_comments');
            if (numCommentsElement) { // Đếm tổng comment và phân trang cho từng post-bottom
                const numCommentsText = numCommentsElement.innerText;
                const numComments = parseInt(numCommentsText.replace(/\D/g, ''));
                const lastPage = Math.ceil(numComments / 200); // 200-comment/trang
                const postHref = postBottom.closest('.post').querySelector('.post-title a').href;

                let commentPagingSpan = '<span class="comment-paging">';
                // Ít hơn 3-trang, 3 nút liền nhau
                if (!lastPage || lastPage === 1) {
                    commentPagingSpan += `<a href="${postHref}">1</a>`;
                } else if (lastPage === 2) {
                    commentPagingSpan += `
                        <a href="${postHref}">1</a>
                        <a href="${postHref}?commentPage=2#comments">2</a>
                        `;
                } else if (lastPage === 3) {
                    commentPagingSpan += `
                        <a href="${postHref}">1</a>
                        <a href="${postHref}?commentPage=2#comments">2</a>
                        <a href="${postHref}?commentPage=3#comments">3</a>
                        `;
                } else { // Nhiều hơn 3-trang, 2-nút cuối và 1-nút đầutiên
                    commentPagingSpan += `
                        <a href="${postHref}" style="margin-right: 35px">1</a>
                        <a href="${postHref}?commentPage=${lastPage - 1}#comments">${lastPage - 1}</a>
                        <a href="${postHref}?commentPage=${lastPage}#comments">${lastPage}</a>
                        `;
                }
                commentPagingSpan += '</span>';
                // Thêm link đến trang comment trực tiếp - mặc định https://www.blogger.com/comment/fullpage/post/blogID/postID
                postBottom.innerHTML = `${commentPagingSpan}<a href="${numCommentsElement.closest('.comment-link').href}" style="margin-left: 0.35em;">${numCommentsText}</a>`;
            }
        });


        // Phân trang tại POST-page, tìm #commentpaging
        const commentPaging = document.getElementById('commentpaging');
        if (commentPaging) {
            const currentCommentPage = commentPaging.querySelector('[name="CurrentCommentPage"]');
            if (currentCommentPage) { // Đổi màu Nút[CurrentCommentPage] cho đỡ chói mắt
                currentCommentPage.style.backgroundColor = 'var(--text-danger)';
                currentCommentPage.firstChild.setAttribute('color', 'white');
            }
            // Post chỉ có 1-page có thể gây lỗi, thêm mặcđịnh [1] để tránh lỗi
            if (commentPaging.innerHTML === '1') commentPaging.innerHTML = '<a>1</a>';
            // Thêm 4 nút Go XUTENG-TOP-CENTER-BOTTOM
            var linkHtml = `
                <a href="javascript:xready()"><img src="https://cdn.jsdelivr.net/gh/asinerum/project/gui/web3.gif" title="Enable Web3 Provider"></a>
                <a href="#page_top" id="goTopBtn"><img src="https://cdn.jsdelivr.net/gh/asinerum/project/gui/up.gif" title="Go top"></a>
                <a href="#comments" id="goCommentsBtn"><img src="https://cdn.jsdelivr.net/gh/asinerum/project/gui/mid.gif" title="Go center"></a>
                <a href="#page_bottom" id="goBottomBtn"><img src="https://cdn.jsdelivr.net/gh/asinerum/project/gui/down.gif" title="Go bottom"></a>
            `;
            commentPaging.innerHTML = linkHtml + commentPaging.innerHTML;
            commentPaging.classList.add('no-select', 'comment-paging');

            // Clone và đặt thêm .commentpaging tại cuối #Blog1_comments-block-wrapper
            var clonedCommentPaging = commentPaging.cloneNode(true);
            var targetWrapper = document.getElementById('Blog1_comments-block-wrapper');
            targetWrapper.appendChild(clonedCommentPaging);
        }
    }
    /**
     * Tìm các ảnh trong .comment-text có width>192 và thêm class .large-img - Căn giữa
     */
    function applyBigImgStyle(commentBlock) {
        const commentImgTags = commentBlock.querySelectorAll('.comment-text img');
        commentImgTags.forEach(img => {
            img.removeAttribute('width');
            if (img.naturalWidth > 192) {
                img.classList.add('large-img');
            }
        })
    };
    /**
     * Tìm các pre/code trong .comment-text và áp zụng HighlightJS
     */
    function applyHighlight(commentBlock) {
        const codeBlocks = commentBlock.querySelectorAll('.comment-text pre');
        codeBlocks.forEach(block => {
            // Thay <br> bằng newLine
            let codeContent = block.innerHTML.replace(/<br\s*\/?>/g, '\n');
            block.innerHTML = codeContent;
            // highlight.js
            hljs.highlightElement(block);

        });
    };

    /**
     * Action Menu
     */
    function initActionMenu() {
        const actionGroup = document.createElement('div');
        actionGroup.className = 'btn-action-group';

        // Helper to create button with label
        const createBtn = (icon, title, onClick, isSub = true, isHiddenOnClick = true) => {
            const container = document.createElement('div');
            container.className = `btn-item ${isSub ? 'btn-sub' : ''}`;

            const label = document.createElement('span');
            label.className = 'btn-label';
            label.innerText = title;

            const btn = document.createElement('button');
            btn.innerHTML = icon;
            btn.onclick = (e) => {
                onClick(e);
                if (isHiddenOnClick && isSub) {
                    actionGroup.classList.remove('active');
                }
            };

            container.append(label, btn);
            return container;
        };

        const mainBtn = createBtn('⊹', '', () => actionGroup.classList.toggle('active'), false);

        const favBtn = createBtn('💎', 'Favorites', () => {
            document.querySelectorAll('.comment-block').forEach(commentBlock => {
                const authorLink = commentBlock.querySelector('.comment-author a');
                if (typeof isFavoriteBlogger === 'function' && !isFavoriteBlogger(authorLink)) {
                    commentBlock.classList.toggle('deactive');
                }
            });
        });

        const fontUpBtn = createBtn('A+', '', () => handleBodyTextSizeChange(1), true, false);
        const fontDownBtn = createBtn('A-', '', () => handleBodyTextSizeChange(-1), true, false);
        const topBtn = createBtn('↑', 'Top', () => document.getElementById('goTopBtn').click());
        const hashBtn = createBtn('#', 'Comment', () => document.getElementById('goCommentsBtn').click());
        const botBtn = createBtn('↓', 'Bottom', () => document.getElementById('goBottomBtn').click());

        actionGroup.append(mainBtn, favBtn, topBtn, hashBtn, botBtn, fontUpBtn, fontDownBtn);
        document.body.appendChild(actionGroup);
    }


    /**
     * Helper của Action Menu: Điềuchỉnh kíchthước chữ comment-body và lưu vào cookie
     * Sets 'commentBodyTextSize' for 30 days
     * in cookie and applies it to the root CSS variable --comment-body-text-size
     */
    const saveBodyTextSizeToCookie = (size) => {
        const d = new Date();
        d.setTime(d.getTime() + (30 * 24 * 60 * 60 * 1000));
        document.cookie = `commentBodyTextSize=${size};expires=${d.toUTCString()};path=/;SameSite=Lax`;
    };

    const getBodyTextSizeFromCookie = () => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; commentBodyTextSize=`);

        if (parts.length === 2) {
            return parseInt(parts.pop().split(';').shift());
        }

        // Default to 18 if cookie is missing
        const defaultSize = 18;
        saveBodyTextSizeToCookie(defaultSize);
        return defaultSize;
    };

    const updateBodyTextSize = (delta) => {
        const root = document.documentElement;
        const currentSize = parseInt(getComputedStyle(root).getPropertyValue('--comment-body-text-size')) || 18;
        const newSize = Math.min(Math.max(currentSize + delta, 12), 32);

        root.style.setProperty('--comment-body-text-size', `${newSize}px`);
        return newSize;
    };

    const handleBodyTextSizeChange = (delta) => {
        const newSize = updateBodyTextSize(delta);
        saveBodyTextSizeToCookie(newSize);
    };







    /**
     * IntersectionObserver on each comment
     */
    const observerCommentBlock = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                processCommentBlock(entry.target);
                observerCommentBlock.unobserve(entry.target); // Process once, then stop watching to save RAM
            }
        });
    }, { threshold: 0.1 });

    function processCommentBlock(commentBlock) {
        addCommentRef(commentBlock);
        addPopupEditorFunc(commentBlock);
        applyBigImgStyle(commentBlock);
        applyHighlight(commentBlock);
    }


    /**
     * Đóng-khung và màumè cho Ref: (0000)
     */
    function addCommentRef(commentBlock) {
        commentBlock.querySelectorAll('.comment-body a').forEach(link => {
            if (/#c\d+$/.test(link.href) || /#cmt\.\d+$/.test(link.href)) { // "c847" or "cmt.456"
                link.classList.add('comment-ref');
                // Clean up text node (💭 icon logic)
                const prev = link.previousSibling;
                if (prev && prev.nodeType === 3) {
                    const text = prev.textContent.trim();
                    prev.remove();
                    link.innerHTML = `💭 ${text} <i>${link.textContent}</i>`;
                }
            }
        });
    }


    /**
     * Click on Ref: (0000) to show popupComment
     */
    document.addEventListener('click', handleCommentRefClick, false);

    function handleCommentRefClick(e) {
        const ref = e.target.closest('.comment-ref');
        if (ref) {
            e.preventDefault();
            e.stopPropagation();
            showPopupComment(e, ref);
            return;
        }
    }

    function showPopupComment(e, ref) {
        const hash = new URL(ref.href).hash;
        const id = hash.replace(/^#/, '');
        let sourceNode = null, commentNode = null;

        if (/^c\d+$/.test(id)) {
            sourceNode = document.getElementById(id);
            commentNode = sourceNode ? sourceNode.parentNode : null;
        }
        else if (/^cmt\.(\d+)$/.test(id)) {
            const num = parseInt(RegExp.$1, 10);
            const comments = document.querySelectorAll('.c');
            if (num >= 1 && num <= comments.length) {
                sourceNode = comments[num - 1];
            }
            commentNode = sourceNode ? sourceNode : null;
        }

        if (commentNode) {
            const commentText = commentNode.querySelector('.comment-text');
            //if (commentText) return;
            var bcId = commentText.id.replace('ss-', '');
            var comid = document.getElementById('is-' + bcId);
            var authorUrl = comid.getAttribute('authorUrl');
            var authorName = comid.getAttribute('authorName');
            var timestamp = comid.getAttribute('timestamp');
            updateCommentContentLegacy(bcId, 'ss-', authorUrl, timestamp);
        }

        const popup = commentNode
            ? commentNode.cloneNode(true)
            : createFallback(ref.href);

        popup.classList.add('popup-container', 'popup-comment');

        const closeBtn = document.createElement('button');
        closeBtn.className = 'popup-close-btn';
        closeBtn.type = 'button';

        closeBtn.addEventListener('click', (ev) => {
            ev.stopPropagation();
            popup.remove();
        });

        popup.prepend(closeBtn);
        processCommentBlock(popup);
        // Inside showPopupComment, after processCommentBlock (if any)

        document.body.appendChild(popup);
        popup.style.display = 'block';
        popup.offsetHeight; // force reflow – very important on Safari

        // Use classic window values for initial clamp – more predictable on iOS
        requestAnimationFrame(() => {
            const rect = popup.getBoundingClientRect();

            let left = e.pageX + 9;
            let top = e.pageY + 9;

            const maxRight = window.innerWidth + window.scrollX - 7;
            const maxBottom = window.innerHeight + window.scrollY - 7;

            if (left + rect.width > maxRight) {
                left = e.pageX - rect.width - 5;
                if (left < window.scrollX + 7) left = window.scrollX + 7;
            }

            if (top + rect.height > maxBottom) {
                top = e.pageY - rect.height - 5;
                if (top < window.scrollY + 7) {
                    top = window.scrollY + 7;
                }
            }

            left = Math.max(window.scrollX + 7, left);
            top = Math.max(window.scrollY + 7, top);

            popup.style.left = `${left}px`;
            popup.style.top = `${top}px`;
        });

        makeDraggable(popup);
    }

    function createFallback(href) {
        const div = document.createElement('div');
        div.innerHTML = `
    <p style="font-style:italic;">
        <strong>TRẢLỜI ở Post-trước hoặc chưa-xácdịnh</strong><br><br>
        <a href="${href}" target="_blank">(Mở Tab-khác để xem)</a><br><br>
        ${href}
    </p>`;
        return div;
    }












    /**
     * Hiện Hộp TRẢLỜI khi click (.comment-go a)
     */
    var popupEditor = null, iframeEditor = null, iframeBlogspotComment = null, blockRefreshBtn = null, sandboxEnabled = true, closeEditorBtn = null, aTagCopyComment = null;
    function addPopupEditorFunc(commentBlock) {
        const commentGo = commentBlock.querySelector('.comment-go a');
        if (commentGo) {
            commentGo.addEventListener("click", (e) => {
                e.preventDefault();
                showPopupEditor(e, commentGo);
            });
        }
    }
    function showPopupEditor(e, commentGo) {
        const commentBlock = commentGo.closest('.comment-block');

        if (popupEditor === null) { // Create Popup Comment Editor if poup 1st time
            popupEditor = document.createElement('div');
            popupEditor.classList.add('popup-container', 'popup-editor');
            popupEditor.style.width = `${commentBlock.offsetWidth - 10}px`;

            iframeEditor = document.createElement('iframe');
            iframeEditor.className = 'iframe-editor';
            iframeEditor.src = 'https://meo-comment-phake.blogspot.com/';
            iframeEditor.allow = 'clipboard-write';

            closeEditorBtn = document.createElement('button');
            closeEditorBtn.classList.add('popup-close-btn');
            closeEditorBtn.addEventListener('click', () => {
                popupEditor.style.display = 'none'; // Just hide it when click ❌, not remove()
                iframeBlogspotComment.style.display = 'none';
                blockRefreshBtn.style.display = 'none';
            });

            popupEditor.appendChild(closeEditorBtn);
            popupEditor.appendChild(iframeEditor);
            makeDraggable(popupEditor);
            document.body.appendChild(popupEditor);


        } else { // Unhide popupEditor when popup agin
            popupEditor.style.display = 'block';
            popupEditor.style.width = `${commentBlock.offsetWidth - 10}px`;
            iframePostMessage(iframeEditor, 'pasteRef', refMaker(commentBlock));
        }

        movePopupEditorAround(e);

        // Send message to iframeEditor then create iframe (or show) when get message back
        iframeEditor.onload = () => {
            iframePostMessage(iframeEditor, 'pasteRef', refMaker(commentBlock));

            // GET MESSAGE FROM MEO COMMENT (https://meo-comment-phake.blogspot.com/)
            window.addEventListener('message', (e) => {
                const messageFrMeoCmt = e.data;
                if (messageFrMeoCmt.action === 'sendBack') {
                    const decodedText = decodeURIComponent(messageFrMeoCmt.text);
                    //copyToClipboard(decodedText);
                    if (iframeBlogspotComment === null) {
                        if (document[hiddenCommentForm]) { // Get postID and blogID to create iframe
                            // Iframe
                            const blogID = document.getElementById('blogID').value;
                            const postID = document.getElementById('postID').value;
                            iframeBlogspotComment = document.createElement("iframe");
                            iframeBlogspotComment.src = 'https://www.blogger.com/comment-iframe.g?blogID=' + blogID + '&postID=' + postID;
                            iframeBlogspotComment.className = 'iframe-blog-cmt';
                            // Block REFRESH Button
                            blockRefreshBtn = document.createElement('button');
                            blockRefreshBtn.id = 'block-refresh-btn';
                            blockRefreshBtn.classList.add('active');
                            blockRefreshBtn.textContent = 'Tắt BLOCK-REFRESH nếu không Đăngnhập được';
                            iframeBlogspotComment.sandbox = 'allow-scripts allow-same-origin allow-forms allow-popups';
                            blockRefreshBtn.addEventListener('click', () => {
                                if (!sandboxEnabled) {
                                    blockRefreshBtn.classList.add('active');
                                    blockRefreshBtn.textContent = 'BLOCK-REFRESH cóthể làm cô không Đăngnhập được - Click để  TẮT';
                                    iframeBlogspotComment.sandbox = 'allow-scripts allow-same-origin allow-forms allow-popups';
                                } else {
                                    blockRefreshBtn.classList.remove('active');
                                    blockRefreshBtn.textContent = 'BLOCK-REFRESH';
                                    iframeBlogspotComment.removeAttribute('sandbox');
                                }
                                sandboxEnabled = !sandboxEnabled;
                                iframeBlogspotComment.src = iframeBlogspotComment.src;
                            });
                            popupEditor.insertBefore(blockRefreshBtn, popupEditor.firstChild);
                            popupEditor.insertBefore(iframeBlogspotComment, popupEditor.firstChild);
                        } else { // If can't get postID, popup comment page
                            console.warn('Could not find Blogger IDs.');
                            const commentGoJavascript = commentGo.href.replace('javascript\:', '').split('\;');
                            activeJavascriptOfCommentGo(commentGo.href);
                        }
                    } else {
                        blockRefreshBtn.style.display = 'block';
                        iframeBlogspotComment.style.display = 'block';
                    }
                }
            }, false);

        }
    }

    function movePopupEditorAround(e) {
        if (popupEditor) {
            const screenWidth = window.innerWidth;
            const cloneWidth = popupEditor.offsetWidth;
            let mouseX = e.pageX + 10;
            if (mouseX + cloneWidth > screenWidth) {
                mouseX = (screenWidth - cloneWidth) / 2;
            }
            let mouseY = e.pageY + 10;
            popupEditor.style.left = `${mouseX}px`;
            popupEditor.style.top = `${mouseY}px`;
        }
    }
    function activeJavascriptOfCommentGo(href) {
        aTagCopyComment = document.createElement('a');
        aTagCopyComment.href = href;
        aTagCopyComment.click();
        aTagCopyComment.remove();
        aTagCopyComment = null;
    }


    function iframePostMessage(iframe, actionName, postText = '', url = 'https://meo-comment-phake.blogspot.com/') {
        const iframeWin = iframeEditor.contentDocument || iframe.contentWindow;
        const cleanText = encodeURIComponent(postText);
        try {
            iframeWin.postMessage({ action: actionName, text: cleanText }, url);
        } catch (err) {
            console.error('Failed to send message:', err);
        }
    }

    /**
     * Helpers
     */
    function makeDraggable(el) {

        if (isPhone()) return;
        let isDragging = false;
        let startX, startY;           // rename for clarity
        let initialLeft, initialTop;

        el.addEventListener('pointerdown', (e) => {
            if (e.target.closest('a, button, input, textarea, select') ||
                e.target.closest('.comment-body, .comment-footer')) {
                return;
            }

            e.preventDefault(); // ← helps prevent iOS touch weirdness

            startX = e.clientX;
            startY = e.clientY;

            // Read current position right at pointerdown — this is critical
            const style = getComputedStyle(el);
            initialLeft = parseFloat(style.left) || 0;
            initialTop = parseFloat(style.top) || 0;

            isDragging = true;
            el.style.userSelect = 'none';
            el.style.cursor = 'grabbing';
            // Optional: el.classList.add('dragging'); for visual feedback

            document.addEventListener('pointermove', onMove, { passive: false });
            document.addEventListener('pointerup', onUp, { passive: false });
            document.addEventListener('pointercancel', onUp, { passive: false });
        });

        function onMove(e) {
            if (!isDragging) return;
            e.preventDefault();

            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;

            const newLeft = initialLeft + deltaX;
            const newTop = initialTop + deltaY;

            // Optional: simple viewport clamp during drag (uncomment if needed)
            const rect = el.getBoundingClientRect();
            const minL = window.scrollX + 7;
            const minT = window.scrollY + 7;
            const maxL = window.innerWidth + window.scrollX - rect.width - 7;
            const maxT = window.innerHeight + window.scrollY - rect.height - 7;
            el.style.left = `${Math.max(minL, Math.min(maxL, newLeft))}px`;
            el.style.top = `${Math.max(minT, Math.min(maxT, newTop))}px`;

            //el.style.left = `${newLeft}px`;
            //el.style.top = `${newTop}px`;
        }

        function onUp() {
            isDragging = false;
            el.style.userSelect = '';
            el.style.cursor = '';
            // el.classList.remove('dragging');

            document.removeEventListener('pointermove', onMove);
            document.removeEventListener('pointerup', onUp);
            document.removeEventListener('pointercancel', onUp);
        }
    }



    function isPhone() {
        return /Mobi|Android|iPhone|iPad|iPod|Windows Phone|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
            ('ontouchstart' in window && window.innerWidth <= 1024);
    };

    function isZZ(authorLink) {
        const ids = ['06324965406194061835', '06344674862451687914', '08901517722071939298', 'an_hoang_trung_tuong'];
        return authorLink && ids.some(id => authorLink.href.endsWith(id));
    }

    function isFavoriteBlogger(authorLink) {
        const ids = [
            '06324965406194061835', '06344674862451687914', '08901517722071939298', 'an_hoang_trung_tuong',
            '04691363077306131049', '14274984856003699657', //'Ly Toet',
            '07419751018770328206', //'Sweet Hoy'
        ];
        return authorLink && ids.some(id => authorLink.href.endsWith(id));
    }

    function isVangson(commentBlock) {
        const imgs = commentBlock.querySelectorAll('img');
        for (let img of imgs) {
            if (img.src.endsWith('vangson.gif')) {
                return true;
            }
        }
        return false;
    }

    function isCacmac(commentBlock) {
        if (commentBlock.querySelector('.comment-author>a').textContent.startsWith("MADONNALILY")) {
            return true;
        }
        const imgs = commentBlock.querySelectorAll('img');
        for (let img of imgs) {
            if (img.src.endsWith('jahoi.gif') || img.src.endsWith('tinhhoa.gif')) {
                return true;
            }
        }
        return false;
    }

    function refMaker(commentBlock) {
        const commentID = commentBlock.querySelector('.comment-author');
        const commentAuthor = commentBlock.querySelector('.comment-author>a');
        const commentNo = commentBlock.querySelector('i font');
        const url = window.location.href.split('#')[0];

        let preText = '', postText = '';
        if (isZZ(commentAuthor)) {
            postText = '𓂸𓃀';
        } else if (isVangson(commentBlock)) {
            postText = '❤️❤️❤️';
        } else if (isCacmac(commentBlock)) {
            postText = ' Thưa Các Mác';
        } else {
            postText = '🐄🐖🐊';
        }
        if (commentAuthor && commentNo && commentID) {
            //preText = getCommentQuote(decodeURI(commentAuthor.textContent), commentNo.textContent, commentID.id);
            preText = `Ref: ${commentAuthor.textContent} <a href="${url}#${commentID.id}">${commentNo.textContent}</a>`;
        }
        return `<p>${preText} ${postText}</p><p><br></p><p><br></p>`;
    }
})();