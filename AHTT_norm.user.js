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
    document.addEventListener("DOMContentLoaded", () => {
        applyNewMetaTags();
        applyNewStyles();
        applySidebarNewOrg();
        addZZToogleBtn();
        applyNewCommentPaging();
    });
    window.addEventListener('load', () => {

        const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
        const commentBlocks = document.querySelectorAll('.comment-block');
        commentBlocks.forEach(commentBlock => {
            observerCommentBlock.observe(commentBlock);
            /**
             * Change color of ZZ DARKMODE/LIGHTMODE
             * Remove if don't use DARKMODE
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
        var viewportMetaTag = document.querySelector('meta[name="viewport"]');
        if (viewportMetaTag) {
            viewportMetaTag.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1, user-scalable=no, viewport-fit=cover');
        } else {
            var newMetaTag = document.createElement('meta');
            newMetaTag.setAttribute('name', 'viewport');
            newMetaTag.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1, user-scalable=no, viewport-fit=cover');
            document.head.appendChild(newMetaTag);
        }
        ['mobile-web-app-capable', 'apple-mobile-web-app-capable'].forEach(name => {
            var metaTag = document.createElement('meta');
            metaTag.setAttribute('name', name);
            metaTag.setAttribute('content', 'yes');
            document.head.appendChild(metaTag);
        });
    }
    /**
     * Zanh sách CSS mới
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
        const newStyles = document.createElement('style');
        newStyles.textContent =
            `
        :root {
            --bg-primary: #ffffff;
            --bg-secondary: #f4f4f7;
            --bg-tertiary: #e9e9ee;

            --text-primary: #121212;
            --text-secondary: #4a4a4a;
            --text-link: #007bff;
            --accent: #2a7aef;

            --border-primary: #cccccc;
            --border-subtle: #eeeeee;

            --text-zizun: blue;

            color-scheme: light dark;
        }

        @media (prefers-color-scheme: dark) {
            :root {
                --bg-primary: #1e1e1e;
                --bg-secondary: #2c2c2c;
                --bg-tertiary: #444444;
                --text-primary: #CCCCCC;
                --text-secondary: #c9c9c9;
                --text-link: #4493f8;
                --accent: #2a7aef;
                --border-primary: #555555;
                --border-subtle: #333333;
                --text-zizun: #2196f3;
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

        .no-select {
            user-select: none;
            -webkit-user-select: none; /* For Safari */
            -moz-user-select: none; /* For Firefox */
            -ms-user-select: none; /* For older versions of IE */
        }

        body {
            color: var(--text-secondary);
            background-color: var(--bg-primary);
        }
        .sidebar-container, .sidebar-container .sidebar_bottom {
            background-color: var(--bg-primary);
        }
        #page_body .FeaturedPost, .Blog .blog-posts .post-outer-container {
            background-color: var(--bg-primary);
        }
        .post-title, .post-title a, .post-title a:hover, .post-title a:visited {
            color: var(--text-primary);
            font-size: x-large;
        }
        .byline {
            color: var(--text-secondary);
        }
        .search-input input, .Header h1, .Header h1 a, .Header h1 a:hover, .Header h1 a:visited {
            color: var(--text-primary);
        }
        .sticky {
            background-color: var(--bg-primary);
        }
        .sidebar-container .widget .title {
            color: var(--text-primary);
        }
        a {
            color: var(--text-link);
            text-decoration: none;
            transition: color 0.2s ease;
        }

        a:hover,
        a:focus {
            color: var(--accent);
        }

        .btn-primary {
            background-color: var(--accent);
            color: var(--bg-primary);
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            font-weight: 600;
            cursor: pointer;
            transition: background-color 0.2s ease, opacity 0.2s ease;
        }


        input[type="checkbox"],
        input[type="radio"] {
            accent-color: var(--accent);
        }
        .comment-text .large-img,
        .comment-text iframe {
            max-width: 95%;
            height: auto;
            display: block;
            margin: 0 auto;
            border-radius: 5px;
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

        .comment-go > a::after {
            content: 'REPLY';
            color: #169106;
            padding: 0 5px;
        }

        a.comment-delete::after {
            content: 'DELETE';
            color: #be2323;
            padding: 0 5px 0 10px;
        }

        a.comment-ref {
            border: 1px solid var(--border-primary);
            padding: 5px;
            border-radius: 5px;
            margin-left: 10px;
        }

        a.comment-ref>i {
            color: #FF9966 !important;
        }





        .zz-comment .comment-text {
            color: var(--text-zizun);
        }
        .bua-comment .comment-text {
            color: var(--text-primary);
            font-family: Tahoma;
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
                width: unset ;
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
            display:none;
        }
        .centered-bottom{
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
            border-radius: 5px;
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

        #comments-block {
            padding: 0 0 20px 0;
        }
        span.num_comments {
            color: var(--text-primary);
        }
        .comment-paging, #commentpaging {
            display: inline-block;
        }
        .comment-paging a, #commentpaging a {
            float: left;
            display: flex;
            flex-wrap: wrap;
            font-size: 18px;
            font-family: 'GIUN_TAHOMA';
            width: 30px;
            height: 30px;
            border-radius: 5px;
            align-content: center;
            justify-content: center;
            margin: 2px;
            background-color: var(--text-link);
            color: white;
        }
        .comment-paging img {
            border-radius: 5px;
            width: 100%;
            height: 100%;
        }
        .comment-paging a:hover, #commentpaging a:hover {
            text-decoration: none;
            background-color: rgb(175, 70, 70);
        }

        span.num_comments {
            padding-left: 20px;
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

        .sidebar-container .widget + .widget {
            border-top: 0;
        }
        .sidebar-container .widget {
            padding: 0;
            border-top: 0;
        }

        /* Widget Title */
        .widget .title {
            font-size: 16px;
            font-weight: bold;
            color: var(--text-primary);
        }

        .widget .HTML .title  {
            padding-top: 5px;
        }

        #HTML5 .title,
        #HTML8 .title,
        #HTML10 .title {
            font-size: 18px;
        }
        /* Collapsible Details */
        .collapsible {
            margin-top: 10px;
        }

        .collapsible-title {
            cursor: pointer;
            padding: 5px 10px 5px 0;
        }


        /* Links in the Widget */
        .sidebar_bottom .widget-content {
            padding: 0 10px;
        }
        .sidebar_bottom .widget-content img {
            border-radius: 5px;
        }
        #HTML1 a:nth-of-type(-n+4) {
            display: inline-block;
            margin-bottom: 5px;
        }
        #HTML1 a:nth-child(5) {
            margin-bottom: 10px;
        }
        .bua-links {
            max-height: 0;
            overflow: hidden;
            transition: max-height 1000ms ease-in-out;
        }
        .bua-links.open {
            width: auto;
            height: auto;
            transition: max-height 1000ms ease-in-out;
            max-height: 3000px;
        }
        .sidebar_bottom .widget-content>a {
            color: var(--text-link);
            font-size: 16px;
            text-decoration: none;
            display: block;
            padding: 5px 0 5px 10px;
        }
        .sidebar_bottom .widget-content>a:hover{
            color: var(--accent);
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

        #zz-toogle-btn {
            position: fixed;
            bottom: 10px;
            right: 10px;
            width: 40px;
            height: 40px;
            background-color: var(--bg-tertiary);
            color: var(--text-primary);
            border: none;
            border-radius: 5px;
            font-size: 18px;
            cursor: pointer;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 2000;
        }

        .popup-comment {
            width: calc(100% - 14px);
            max-width: 700px;
            /* never wider than screen - safe margins */
            min-width: 280px;
            /* readable on small phones */
            max-height: 61.8vh;
            overflow-y: auto;
            overflow-x: hidden;
            position: absolute;
            z-index: 2000;
            padding: 5px;
            background-color: var(--bg-secondary);
            border: 1px solid var(--border-primary);
            border-radius: 5px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
            box-sizing: border-box;
            pointer-events: auto;
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

        .popup-comment.dragging {
        opacity: 0.92;
        box-shadow: 0 12px 40px rgba(0,0,0,0.35);
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

        .popup-comment > p {
            text-align: center;
            color: var(--text-secondary);
        }

        .popup-editor {
            display: block;
            position: absolute;
            z-index: 1000;
            background-color: var(--border-primary);
            border: 2px solid var(--border-primary);
            color: var(--text-secondary);
            border-radius: 5px;
            font-family: 'GIUN_TAHOMA';
            padding-top: 35px;
        }
        .iframe-editor {
            border: 0;
            width: 100%;
            height: 55vh;
        }

        @media (orientation: portrait) and (max-width: 720px) {
            .iframe-editor {
                height: 85vh;
            }
        }
        .iframe-blog-cmt {
            border: 0;
            width: 100%;
            min-height: 320px;
            border-radius: 5px 5px 0 0;
        }
        #block-refresh-btn {
            display: block;
            margin: 0 auto;
            border-radius: 5px;
            padding: 5px;
            color: #169106;
            border: 1px solid #be2323;
            -webkit-appearance: none;
            appearance: none;
            font-family: 'GIUN_TAHOMA';
            font-size: 12px;
        }
        #block-refresh-btn.active {
            color: white;
            background-color: #169106;
        }

        `;
        document.head.appendChild(newStyles);
    }
    /**
     * Sửa thanh bên SIDEBAR
     */
    function applySidebarNewOrg() {
        // Đảo vị trí của LABELS lên đầu
        const sidebarBottom = document.querySelector('#sidebar_bottom');
        sidebarBottom.classList.add('no-select');
        sidebarBottom.insertBefore(sidebarBottom.children[4], sidebarBottom.firstChild);
        // Nhóm 3 mục DO-GO-COMMENT làm một
        const second = sidebarBottom.children[1];  // 2nd
        const third = sidebarBottom.children[2];  // 3rd
        const fourth = sidebarBottom.children[3];  // 4th
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


        // Hiệu ứng SIDEBAR
        const widgets = document.querySelectorAll('.widget.HTML');
        widgets.forEach((widget, index) => {
            const title = widget.querySelector('h3.title');
            const widgetContent = widget.querySelector('.widget-content');
            if (title && widgetContent) {
                if (index < 5) { // Đóng (mặc định) 5 mục đầu
                    widgetContent.classList.add('bua-links');
                } else { // Mở (mặc định) 3 mục cuối CRYPTO - MINEABLE - COMMUNITY
                    widgetContent.classList.add('bua-links', 'open');
                }
                title.addEventListener('click', () => { // Hiệu ứng đóng/mở khi click vào mỗi mục
                    widgetContent.classList.toggle('open');
                });
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
            if (numCommentsElement) { // Đếm số comment và tạo các nút trang cho từng post-bottom
                const numCommentsText = numCommentsElement.innerText;
                const numComments = parseInt(numCommentsText.replace(/\D/g, ''));
                const lastPage = Math.ceil(numComments / 200); //200 còm mỗi trang
                const postHref = postBottom.closest('.post').querySelector('.post-title a').href;

                let commentPagingSpan = '<span class="comment-paging">';

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
                } else {
                    commentPagingSpan += `
                        <a href="${postHref}" style="margin-right: 35px">1</a>
                        <a href="${postHref}?commentPage=${lastPage - 1}#comments">${lastPage - 1}</a>
                        <a href="${postHref}?commentPage=${lastPage}#comments">${lastPage}</a>
                        `;
                }
                commentPagingSpan += '</span>';
                postBottom.innerHTML = commentPagingSpan;
                // Thêm link đến trang comment trực tiếp - mặc định https://www.blogger.com/comment/fullpage/post/blogID/postID
                const newNumCommentsElement = document.createElement('a');
                newNumCommentsElement.innerText = numCommentsText;
                newNumCommentsElement.href = numCommentsElement.closest('.comment-link').href;
                console.log(newNumCommentsElement.href);
                postBottom.appendChild(newNumCommentsElement);
            }
        });


        // Phân trang tại POST-page, tìm #commentpaging
        const commentPaging = document.getElementById('commentpaging');
        if (commentPaging) {
            const currentCommentPage = commentPaging.querySelector('[name="CurrentCommentPage"]');
            if (currentCommentPage) { // Đổi màu của Nút trang-hiệntại cho đỡ chói mắt
                currentCommentPage.style.backgroundColor = '#af4646';
                currentCommentPage.firstChild.setAttribute('color', 'white');
            }
            // Post có một page có thể gây lỗi, thêm 1 trang để tránh lỗi
            if (commentPaging.innerHTML === '1') commentPaging.innerHTML = '<a>1</a>';
            // Thêm 4 nút Go XUTENG-TOP-CENTER-BOTTOM
            var linkHtml = `
                <a href="javascript:xready()"><img src="https://cdn.jsdelivr.net/gh/asinerum/project/gui/web3.gif" title="Enable Web3 Provider"></a>
                <a href="#page_top"><img src="https://cdn.jsdelivr.net/gh/asinerum/project/gui/up.gif" title="Go top"></a>
                <a href="#comments"><img src="https://cdn.jsdelivr.net/gh/asinerum/project/gui/mid.gif" title="Go center"></a>
                <a href="#page_bottom"><img src="https://cdn.jsdelivr.net/gh/asinerum/project/gui/down.gif" title="Go bottom"></a>
            `;
            commentPaging.innerHTML = linkHtml + commentPaging.innerHTML;
            commentPaging.classList.add('no-select', 'comment-paging');

            // Copy và đặt thêm môt phân trang tại cuối #Blog1_comments-block-wrapper
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
            // Xóa các thẻ <br>
            let codeContent = block.innerHTML.replace(/<br\s*\/?>/g, '\n');
            block.innerHTML = codeContent;
            // highlight.js
            hljs.highlightElement(block);

        });
    };
    /**
     * Nút toogle-zizun
     */
    function addZZToogleBtn() {
        // Giao ziện
        const zzToogleBtn = document.createElement('button');
        zzToogleBtn.id = 'zz-toogle-btn';
        zzToogleBtn.textContent = '☰';
        document.body.appendChild(zzToogleBtn);
        // Khi click, ẩn hiện thằng không phải Zì isZZ(commentAuthor)
        zzToogleBtn.addEventListener('click', () => {
            const commentBlocks = document.querySelectorAll('.comment-block');
            if (commentBlocks) {
                commentBlocks.forEach(commentBlock => {
                    const commentAuthor = commentBlock.querySelector('.comment-author>a');
                    if (!isZZ(commentAuthor)) {
                        commentBlock.style.display = commentBlock.style.display === 'none' ? 'block' : 'none';
                    }
                });
            }
        });
    }










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

        const popup = commentNode
            ? commentNode.cloneNode(true)
            : createFallback(ref.href);

        popup.classList.add('popup-comment');

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
            popupEditor.classList.add('popup-editor');
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
                            blockRefreshBtn.textContent = 'BLOCK-REFRESH cóthể làm cô không Đăngnhập được - Click để  TẮT';
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
            if (e.target.closest('.popup-close-btn') ||
                e.target.closest('a, button, input, textarea, select')) {
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


    const isPhone = () => {
        return /Mobi|Android|iPhone|iPad|iPod|Windows Phone|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
            ('ontouchstart' in window && window.innerWidth <= 1024);
    };

    function copyToClipboard(text) {
        navigator.clipboard.writeText(text)
            .then(() => {
                console.log("Text successfully copied to clipboard:", text);
            })
            .catch((err) => {
                alert('LỖI khi COPY. Ctrl+A Ctrl+C để COPY');
                console.error("Failed to copy text to clipboard:", err);
            });
    }

    function isZZ(authorLink) {
        return authorLink && (authorLink.href.endsWith('06324965406194061835') ||
            authorLink.href.endsWith('06344674862451687914') ||
            authorLink.href.endsWith('08901517722071939298') ||
            authorLink.href.endsWith('an_hoang_trung_tuong'));
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


