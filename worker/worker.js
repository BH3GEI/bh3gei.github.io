//<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=22668285&auto=1&height=66"></iframe>

// 定义 Github 项目，文章会从这里读取
const github_base = "BH3GEI/blog/";

// 设置站点信息
var default_title	 = "BH3GEI's Blog";					// 站点标题（显示在浏览器标题栏）
var default_intitle	 = "BH3GEI's Blog";								// 站点名称（显示在首页）
var site_domain		 = "liyao.blog";								// 站点域名
var site_subtitle	 = "";							// 站点副标题
var site_favicon	 = "https://en.gravatar.com/userimage/194126597/84ff189b66b338a3d5dcfc9a4d13d028.png?size=200";				// 站点 Logo

// 博主信息
var owner_name = "BH3GEI";									// 博主名字
var owner_logo = "https://avatars.githubusercontent.com/u/58540850?v=4"	// 博主头像
var owner_desc = "          BH3GEIのブログへようこそ！";					// 博主简介

// 设置站点资源文件地址
var css_bootstrap	 = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css";		// Boostrap css 文件地址
var css_hljs_github   = "https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/styles/github.min.css";  	// Highlight js css 地址
var js_jquery		 = "https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js";		// JQuery 地址
var js_bootstrap	= "https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js";		// Bootstrap 地址
var js_instantclick   = "https://cdn.jsdelivr.net/npm/instantclick@3.1.0/instantclick.min.js";		// InstantClick 地址
var js_showdown	 = "https://cdn.jsdelivr.net/npm/showdown@2.1.0/dist/showdown.min.js";			// Showdown 地址
var js_showdown_table = "https://cdn.jsdelivr.net/npm/showdown-table@1.0.1/dist/showdown-table.min.js";		// Showdown table 地址
var js_highlight	= "https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/highlight.min.js";		// Highlight 地址
var js_highlight_pack = "https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/highlight.min.js";		// Highlight pack 地址
// // 设置站点资源文件地址
// var css_bootstrap	 = "./bootstrap.min.css";		// Boostrap css 文件地址
// var css_hljs_github   = "./github.css";  	// Highlight js css 地址
// var js_jquery		 = "./jquery.min.js";		// JQuery 地址
// var js_bootstrap	= "./bootstrap.min.js";		// Bootstrap 地址
// var js_instantclick   = "./instantclick.min.js";		// InstantClick 地址
// var js_showdown	 = "./showdown.min.js";			// Showdown 地址
// var js_showdown_table = "./showdown-table.min.js";		// Showdown table 地址
// var js_highlight	= "./highlight.min.js";		// Highlight 地址
// var js_highlight_pack = "./highlight.pack.js";		// Highlight pack 地址
// // 设置站点资源文件地址
// var css_bootstrap	 = "./.min.css";		// Boostrap css 文件地址
// var css_hljs_github   = "./gitub.cs";  	// Highlight js css 地址
// var js_jquery		 = "./jqury.min.js";		// JQuery 地址
// var js_bootstrap	= "./bootstra.min.js";		// Bootstrap 地址
// var js_instantclick   = "./instanclick.min.js";		// InstantClick 地址
// var js_showdown	 = "./showdownmin.js";			// Showdown 地址
// var js_showdown_table = "./showdon-table.min.js";		// Showdown table 地址
// var js_highlight	= "./highlight.mn.js";		// Highlight 地址
// var js_highlight_pack = "./highght.pack.js";		// Highlight pack 地址

// 这是一些临时变量，无需修改
var title = "";
var intitle = "";
var title2 = "";
var description = "";
var ctime = "unknown";
var isunknown = "";

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
});

var header = `<!DOCTYPE HTML>
<!-- 由 CloudFlare Workers Blog 强力驱动 -->
<html lang="zh_CN">
	<head>
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="application-name" content="${default_title}">
		<meta name="description" content="{description}">
		<meta name="keywords" content="BH3GEI, blog, tech, programming, software development">
		<meta name="author" content="${owner_name}">
		<meta property="og:title" content="{title}">
		<meta property="og:description" content="{description}">
		<meta property="og:type" content="website">
		<meta property="og:url" content="https://${site_domain}">
		<meta property="og:image" content="${owner_logo}">
		<meta name="twitter:card" content="summary">
		<meta name="twitter:title" content="{title}">
		<meta name="twitter:description" content="{description}">
		<meta name="twitter:image" content="${owner_logo}">
		<link rel="canonical" href="https://${site_domain}">
		<link rel="shortcut icon" href="${site_favicon}" />
		<link rel="stylesheet" href="${css_bootstrap}" crossorigin="anonymous">
		<link rel="stylesheet" href="${css_hljs_github}">
		<title>{title}</title>
		<style type="text/css">
		:root {
			--bg-primary: #0a0b0e;
			--bg-secondary: rgba(30, 41, 59, 0.4);
			--text-primary: #e2e8f0;
			--text-secondary: #94a3b8;
			--accent-color: #60a5fa;
			--border-color: rgba(148, 163, 184, 0.1);
		}
		
		body {
			font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
			line-height: 1.6;
			color: var(--text-primary);
			background-color: var(--bg-primary);
			margin: 0;
			padding: 0;
			min-height: 100vh;
			position: relative;
			overflow-x: hidden;
		}

		#starry-background {
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			z-index: -1;
			pointer-events: none;
		}

		.container {
			position: relative;
			z-index: 1;
			background: rgba(10, 11, 14, 0.7);
			backdrop-filter: blur(10px);
			-webkit-backdrop-filter: blur(10px);
			border-radius: 16px;
			margin: 20px auto;
			padding: 30px;
			max-width: 1200px;
			box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
		}

		.thread {
			background: var(--bg-secondary);
			border-radius: 12px;
			padding: 30px;
			margin: 20px 0;
			border: 1px solid var(--border-color);
			overflow-x: auto;
		}

		.posts-container {
			display: grid;
			grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
			gap: 20px;
			margin: 20px 0;
		}

		.post-card {
			background: var(--bg-secondary);
			border: 1px solid var(--border-color);
			border-radius: 12px;
			padding: 20px;
			transition: all 0.3s ease;
			height: 100%;
		}

		.post-link {
			text-decoration: none;
			color: inherit;
			display: block;
			height: 100%;
		}

		.post-card:hover {
			transform: translateY(-5px);
			box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
			border-color: var(--accent-color);
		}

		.post-date {
			color: var(--text-secondary);
			font-size: 0.9em;
			margin-bottom: 10px;
		}

		.post-title {
			color: var(--text-primary);
			margin: 0;
			font-size: 1.2em;
			font-weight: 600;
		}

		pre {
			background: rgba(0, 0, 0, 0.2) !important;
			border-radius: 8px;
			padding: 15px;
			overflow-x: auto;
			max-width: 100%;
		}

		code {
			color: var(--accent-color);
			background: rgba(0, 0, 0, 0.2);
			padding: 2px 6px;
			border-radius: 4px;
			font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
		}

		img {
			max-width: 100%;
			height: auto;
			border-radius: 8px;
			margin: 20px 0;
		}

		table {
			width: 100%;
			border-collapse: collapse;
			margin: 20px 0;
			overflow-x: auto;
			display: block;
		}

		th, td {
			padding: 12px;
			border: 1px solid var(--border-color);
			background: rgba(0, 0, 0, 0.2);
		}

		th {
			background: rgba(0, 0, 0, 0.3);
			font-weight: 600;
		}

		.sidebar {
			background: var(--bg-secondary);
			border-radius: 12px;
			padding: 20px;
			border: 1px solid var(--border-color);
			position: sticky;
			top: 20px;
		}

		.sidebar img {
			border-radius: 50%;
			margin: 0 auto 20px;
			display: block;
			max-width: 150px;
			width: 100%;
		}

		@media (max-width: 768px) {
			.container {
				margin: 10px;
				padding: 15px;
			}
			
			.posts-container {
				grid-template-columns: 1fr;
			}
			
			.thread {
				padding: 15px;
			}
			
			.sidebar {
				position: static;
				margin-top: 20px;
			}
		}
		</style>
		<!-- Google Analytics -->
		<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
		<script>
			window.dataLayer = window.dataLayer || [];
			function gtag(){dataLayer.push(arguments);}
			gtag('js', new Date());
			gtag('config', 'G-XXXXXXXXXX');
		</script>
		<script type="application/ld+json">
		{
			"@context": "https://schema.org",
			"@type": "Blog",
			"headline": "${default_title}",
			"description": "${site_subtitle}",
			"url": "https://${site_domain}",
			"author": {
				"@type": "Person",
				"name": "${owner_name}",
				"image": "${owner_logo}",
				"description": "${owner_desc}"
			},
			"publisher": {
				"@type": "Organization",
				"name": "${default_title}",
				"logo": {
					"@type": "ImageObject",
					"url": "${site_favicon}"
				}
			}
		}
		</script>
	</head>
	<body>
		<canvas id="starry-background"></canvas>
		<div class="container">
			<div class="row">
				<div class="col-sm-12">
					<nav aria-label="breadcrumb" class="mt-3">
						<ol class="breadcrumb">
							<li class="breadcrumb-item"><a href="/">Home</a></li>
							{breadcrumb}
						</ol>
					</nav>
					<div class="d-flex justify-content-between align-items-center">
			<h2><a href="/" class="post-a">{intitle}</a></h2>
						<div class="d-flex gap-2">
							<a href="/rss.xml" title="RSS Feed" class="text-muted">
								<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
									<path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm1.5 2.5c5.523 0 10 4.477 10 10a1 1 0 1 1-2 0 8 8 0 0 0-8-8 1 1 0 0 1 0-2zm0 4a6 6 0 0 1 6 6 1 1 0 1 1-2 0 4 4 0 0 0-4-4 1 1 0 0 1 0-2zm.5 7a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/>
								</svg>
							</a>
							<a href="https://github.com/${github_base}" title="GitHub Repository" class="text-muted">
								<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
									<path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
								</svg>
							</a>
						</div>
					</div>
		</div>
				<div class="col-sm-12">
					<p class="lead text-muted">${site_subtitle}</p>
		<hr>
				</div>
				<div class="col-sm-9">
					<div class="thread">
						`;


var modifyHeader = {};
var cookieText = "";

function getRequestParams(str) {
	var index = str.indexOf("?");
	str = str.substring(index + 1, str.length);
	if(typeof(str) == "string"){
		u = str.split("&");
		var get = {};
		for(var i in u){
			var j = u[i].split("=");
			get[j[0]] = j[1];
		}
		return get;
	} else {
		return {};
	}
}

async function bloghandle(request) {
	var cookie = {};
	var clist = undefined;
	try {
		cookieText.split(';').forEach(l => {
			var parts = l.split('=');
			cookie[parts[0].trim()] = decodeURIComponent((parts[1] || '').trim());
		});
	} catch(e) {
		// 无可奉告
	}
	var $_GET = getRequestParams(request.url);
	var urls = new URL(request.url);
	var data = header;
	
	// 修复中文路径处理
	if(urls.pathname == "/") {
		var url = "https://raw.githubusercontent.com/" + github_base + "/main/list.json";
		const init = {
		method: "GET"
		};
		const response = await fetch(url, init);
		var resptxt = await response.text();
		if(cookie['list'] == undefined) {
			var Days = 30; 
			var exp = new Date(); 
			exp.setTime(exp.getTime() + Days*24*60*60*1000); 
			modifyHeader = {
				"Set-Cookie" : "list="+ encodeURIComponent(resptxt) + ";expires=" + exp.toGMTString()
			};
		}
		var json = JSON.parse(resptxt);
		data += `<div class="posts-container">`;
		var before_page = 0;
		var current_page = 1;
		var next_page = 2;
		var pagenow = json.length;
		var pageval = json.length - 12;
		if($_GET['p'] != undefined && $_GET['p'] != "") {
			pageval = json.length - (parseInt($_GET['p']) * 12);
			pagenow = json.length - ((parseInt($_GET['p']) - 1) * 12) - 1;
			next_page = parseInt($_GET['p']) + 1;
			current_page = parseInt($_GET['p']);
			before_page = parseInt($_GET['p']) - 1;
		}
		var update_i = 0;
		for(var i = pagenow;i >= pageval;i--) {
		try {
				var tmpfilename = json[i].file
					.replace(/"/g, "")
					.replace(/posts\//ig, "")
					.replace(/\.md/ig, "");
			var tmptime = json[i].time;
			var tmptitle = json[i].title;
				data += `
					<a href="/${encodeURIComponent(tmpfilename)}" class="post-link">
						<div class="post-card">
							<div class="post-date">${new Date(tmptime).toLocaleDateString()}</div>
							<h3 class="post-title">${tmptitle}</h3>
							</div>
					</a>`;
			update_i++;
		} catch(e) {
				console.error(e);
		}
		}
		if(update_i == 0) {
			data += `<div class="no-posts">No posts yet</div>`;
		}
		data += `</div>
		<div class="pagination">`;
		if(current_page > 1) {
			data += `<a href="/?p=${before_page}" class="page-btn prev">Previous</a>`;
		}
		if(update_i >= 12) {
			data += `<a href="/?p=${next_page}" class="page-btn next">Next</a>`;
		}
		data += `</div>`;
		title = default_title;
		intitle = default_title;
		title2 = default_title;
	} else {
		// 正确处理中文路径
		var uname = urls.pathname.substring(1);  // 移除开头的斜杠
		try {
			// 尝试对可能已经被编码的URL再次解码
			uname = decodeURIComponent(uname);
		} catch(e) {
			// 如果解码失败，保持原样
			console.error("URL decode failed:", e);
		}
		
		// 构建完整的文件路径
		var mdfile = "posts/" + uname + ".md";
		
		try {
		clist = cookie['list'];
		} catch(e) {
		var url = "https://raw.githubusercontent.com/" + github_base + "/main/list.json";
		const init = {
			method: "GET"
		};
		const response = await fetch(url, init);
		clist = await response.text();
		}
		
		if(clist != undefined) {
			try {
				var json = JSON.parse(clist);
				var found = false;
				for(var i in json) {
					// 正确处理文件名比较
					var tmpfilename = json[i].file
						.replace(/"/g, "")
						.replace(/^posts\//i, "")
						.replace(/\.md$/i, "");
					
					// 规范化比较字符串
					if(tmpfilename === uname) {
						title = json[i].title;
						intitle = title;
						ctime = json[i].time;
						found = true;
						break;
					}
				}
				
				if(!found) {
					// 如果在主列表中找不到，尝试在备用列表中查找
					var url = "https://raw.githubusercontent.com/" + github_base + "/main/list.json";
					const init = {
						method: "GET"
					};
					const response = await fetch(url, init);
					
					clist = await response.text();
					json = JSON.parse(clist);
					
					for(var i in json) {
						var tmpfilename = json[i].file
							.replace(/"/g, "")
							.replace(/^posts\//i, "")
							.replace(/\.md$/i, "");
						
						if(tmpfilename === uname) {
							title = json[i].title;
							intitle = title;
							ctime = json[i].time;
							found = true;
							break;
						}
					}
					
					if(found) {
					var Days = 30; 
					var exp = new Date(); 
					exp.setTime(exp.getTime() + Days*24*60*60*1000); 
					modifyHeader = {
							"Set-Cookie" : "list="+ encodeURIComponent(clist) + ";expires=" + exp.toGMTString()
					};
					}
				}
			} catch(e) {
				console.error("JSON parse error:", e);
			}
		}
		
		// 获取文章内容
		data += `</div>
				<p class="text-center${isunknown}"><small></small></p>
						<textarea id="textdata" style="display: none;">`;
		
		var url = "https://raw.githubusercontent.com/" + github_base + "/main/posts/" + encodeURIComponent(uname) + ".md";
		const init = {
			method: "GET"
		};
		const response = await fetch(url, init);
		
		if(response.status == 200) {
			var resptxt = await response.text();
			data += resptxt.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
			description = resptxt.substring(0, 128).replace(/"/ig, "").replace(/\n/g, " ");
			data += `</textarea>
					<hr>`;
		} else {
			data += `### 404 Not Found
<div class="error-message">
    <p>Sorry, the page you are looking for cannot be found. This might be due to:</p>
    <ul>
        <li>The article has been deleted</li>
        <li>The article title has been changed</li>
        <li>The link you entered is incorrect</li>
        <li>The website might be experiencing technical issues</li>
    </ul>
    
    <p>Suggestion:</p>
    <p>Please visit <a href="https://bh3gei.github.io">my homepage</a> and look for the content within the site</p>
    <div class="back-link">
        <a href="/" class="btn">Back to ${default_intitle} Homepage</a>
    </div>
</div>
					</textarea>`;
			title = '404 - Page Not Found';
			title2 = '';
			intitle = '';
			description = '';
			isunknown = " hidden";
		}
	}
	title2 = `${default_title}`;
	data += `</div>
				<div class="col-sm-3">
					<div style="padding: 16px;text-align: center;">
						<img src="${owner_logo}" style="max-width: 220px;width: 100%;border-radius: 50%;">
						<h3>${owner_name}</h3>
						<p class="text-CENTER">${owner_desc}
						</p>
						<hr>
						<div class="text-left">
							<h4>Homepage</h4>						
							<p><a href="https://bh3gei.github.io" target="_blank">🏠 Visit!</a></p>
							<h4>Projects</h4>						
							<p><a href="https://bh3gei.github.io/ProjectPage/" target="_blank">🗺️ Play!</a></p>
							<h4>GitHub</h4>						
							<p><a href="https://github.com/BH3GEI/" target="_blank">⌨️ Code!</a></p>
							<h4>LinkedIn</h4>						
							<p><a href="https://linkedin.com/in/yao-li2026" target="_blank">💼 Connect!</a></p>
							<h4>All Links</h4>						
							<p><a href="https://bh3gei.github.io/AllLinks/" target="_blank">🔗 Visit!</a></p>
				
						</div>
					</div>
				</div>
			</div>
			<div class="row">
				<div class="col-sm-12">
				<p>Powered by CloudFlare Workers | <a href="https://github.com/BH3GEI/blog" target="_blank">Github</a></p>
				<p>&copy; 2023 ${default_intitle}</p>
				<br><br>
				</div>
			</div>
		</div>
		<script src="${js_jquery}"></script>
		<script src="${js_bootstrap}" crossorigin="anonymous"></script>
		<script src="${js_instantclick}" data-no-instant></script>
		<script src="${js_showdown}" type="text/javascript"></script>
		<script src="${js_showdown_table}" type="text/javascript"></script>
		<script src="${js_highlight}"></script>
		<script src="${js_highlight_pack}"></script>
		<script src="https://comments.zerodream.net/comments.js?s=2"></script>
		<script type="text/javascript">
			var init = {
			site: "${site_domain}",
			cid: "posts${urls.pathname}.md"
			};
			hljs.initHighlightingOnLoad();
			var md = new showdown.Converter({extensions: ['table']});
			md.setOption('simplifiedAutoLink', true);
			md.setOption('simpleLineBreaks', true);
			md.setOption('openLinksInNewWindow', true);
			md.setOption('noHeaderId', true);
			window.onload = function() {
				try {
					$(".thread").html(md.makeHtml($("#textdata").val()));
					document.querySelectorAll('pre code').forEach(function(e) {
						hljs.highlightBlock(e);
					});
					CommentsInit(comments, init);
				} catch(e) {}
			}
		</script>
		<script data-no-instant>
			InstantClick.init();
			InstantClick.on('change', function() {
				try {
					$(".thread").html(md.makeHtml($("#textdata").val()));
					document.querySelectorAll('pre code').forEach(function(e) {
						hljs.highlightBlock(e);
					});
					CommentsInit(comments, init);
				} catch(e) {}
			});
		</script>
		<script>
		const canvas = document.getElementById('starry-background');
		const ctx = canvas.getContext('2d');

		// Set canvas size
		function resizeCanvas() {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
		}
		resizeCanvas();
		window.addEventListener('resize', resizeCanvas);

		// Star properties
		const stars = [];
		const numStars = 200;
		const starSpeed = 0.2;

		// Create stars
		for(let i = 0; i < numStars; i++) {
			stars.push({
				x: Math.random() * canvas.width,
				y: Math.random() * canvas.height,
				size: Math.random() * 2,
				speed: Math.random() * starSpeed + 0.1
			});
		}

		// Animation function
		function animate() {
			ctx.fillStyle = 'rgba(10, 11, 14, 0.1)';
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			
			stars.forEach(star => {
				ctx.fillStyle = 'rgba(226, 232, 240, 0.8)';
				ctx.beginPath();
				ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
				ctx.fill();
				
				// Move star
				star.y += star.speed;
				
				// Reset star position if it goes off screen
				if(star.y > canvas.height) {
					star.y = 0;
					star.x = Math.random() * canvas.width;
				}
			});
			
			requestAnimationFrame(animate);
		}

		animate();
		</script>
	</body>
</html>
	`;
	data = data.replace(/\{title\}/ig, title)
		.replace(/\{intitle\}/ig, intitle)
		.replace(/\{title\_2\}/ig, title2)
		.replace(/\{isunknown\}/ig, isunknown)
		.replace(/\{description\}/ig, description);
	return data;
}

async function generateSitemap() {
	const url = "https://raw.githubusercontent.com/" + github_base + "/main/list.json";
	const init = {
		method: "GET"
	};
	const response = await fetch(url, init);
	const json = JSON.parse(await response.text());

	let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
	<url>
		<loc>https://${site_domain}/</loc>
		<changefreq>daily</changefreq>
		<priority>1.0</priority>
	</url>`;

	for(const post of json) {
		const filename = post.file
			.replace(/"/g, "")
			.replace(/posts\//ig, "")
			.replace(/\.md/ig, "");
		
		xml += `
	<url>
		<loc>https://${site_domain}/${encodeURIComponent(filename)}</loc>
		<lastmod>${post.time.split(' ')[0]}</lastmod>
		<changefreq>weekly</changefreq>
		<priority>0.8</priority>
	</url>`;
	}

	xml += `
</urlset>`;

	return xml;
}

async function generateRSS() {
	const url = "https://raw.githubusercontent.com/" + github_base + "/main/list.json";
	const init = {
		method: "GET"
	};
	const response = await fetch(url, init);
	const json = JSON.parse(await response.text());

	let rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
	<channel>
		<title>${default_title}</title>
		<link>https://${site_domain}/</link>
		<description>${site_subtitle}</description>
		<language>zh-CN</language>
		<atom:link href="https://${site_domain}/rss.xml" rel="self" type="application/rss+xml" />
		<image>
			<url>${site_favicon}</url>
			<title>${default_title}</title>
			<link>https://${site_domain}/</link>
		</image>`;

	for(const post of json) {
		const filename = post.file
			.replace(/"/g, "")
			.replace(/posts\//ig, "")
			.replace(/\.md/ig, "");
		
		const postUrl = `https://${site_domain}/${encodeURIComponent(filename)}`;
		const postResponse = await fetch(`https://raw.githubusercontent.com/${github_base}/main/posts/${filename}.md`);
		let content = await postResponse.text();
		content = content.replace(/&/g, '&amp;')
					.replace(/</g, '&lt;')
					.replace(/>/g, '&gt;')
					.replace(/"/g, '&quot;')
					.replace(/'/g, '&apos;');

		rss += `
		<item>
			<title>${post.title}</title>
			<link>${postUrl}</link>
			<guid>${postUrl}</guid>
			<pubDate>${new Date(post.time).toUTCString()}</pubDate>
			<description><![CDATA[${content}]]></description>
		</item>`;
	}

	rss += `
	</channel>
</rss>`;

	return rss;
}

/**
 * Respond to the request
 * @param {Request} request
 */
async function handleRequest(request) {
	if(new URL(request.url).protocol != "https:") {
		var rhttps = new Response("Location to https", {status: 301});
		rhttps.headers.set("Location", request.url.replace("http://", "https://"));
		return rhttps;
	}

	const url = new URL(request.url);
	
	// Handle sitemap.xml request
	if(url.pathname === '/sitemap.xml') {
		const sitemap = await generateSitemap();
		const response = new Response(sitemap, {status: 200});
		response.headers.set('Content-Type', 'application/xml');
		return response;
	}

	// Handle RSS feed request
	if(url.pathname === '/rss.xml') {
		const rss = await generateRSS();
		const response = new Response(rss, {status: 200});
		response.headers.set('Content-Type', 'application/xml');
		return response;
	}

	// Handle robots.txt request
	if(url.pathname === '/robots.txt') {
		const response = await fetch('https://raw.githubusercontent.com/' + github_base + '/main/worker/robots.txt');
		const robotsTxt = await response.text();
		return new Response(robotsTxt, {
			headers: { 'Content-Type': 'text/plain' }
		});
	}

	cookieText = request.headers.get("cookie");
	var resp = new Response(await bloghandle(request), {status: 200});
	resp.headers.set("Content-Type", "text/html");
	if(modifyHeader != undefined) {
		for(var index in modifyHeader) {
		resp.headers.set(index, modifyHeader[index]);
		}
	}
	return resp;
}