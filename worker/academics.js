// 缓存时间（4秒，用于开发测试）
const CACHE_TIME = 4

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  try {
    const url = new URL(request.url)
    const lang = url.searchParams.get('lang') || 'en'
    
    // 根据语言参数选择不同的markdown文件
    let markdownUrl = 'https://raw.githubusercontent.com/BH3GEI/Resume/main/academics.md'
    let titleName = 'Yao Li'
    if (lang === 'cn') {
      markdownUrl = 'https://raw.githubusercontent.com/BH3GEI/Resume/main/academics_cn.md'
      titleName = '李 尧'
    } else if (lang === 'jp') {
      markdownUrl = 'https://raw.githubusercontent.com/BH3GEI/Resume/main/academics_jp.md'
      titleName = 'リ・ヤオ'
    }

    // 从GitHub获取markdown内容
    const response = await fetch(markdownUrl)
    const markdown = await response.text()

    // HTML模板
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${titleName} - Academic Profile</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/github-markdown-css/github-markdown.min.css">
    <style>
        .markdown-body {
            box-sizing: border-box;
            min-width: 200px;
            max-width: 980px;
            margin: 0 auto;
            padding: 45px;
        }

        @media (max-width: 767px) {
            .markdown-body {
                padding: 15px;
            }
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #24292f;
            background-color: #ffffff;
        }

        a {
            color: #0969da;
            text-decoration: none;
        }

        a:hover {
            text-decoration: underline;
        }

        .header {
            border-bottom: 1px solid #d0d7de;
            margin-bottom: 2em;
            padding-bottom: 1em;
        }

        .header h1 {
            margin-bottom: 0.5em;
            font-size: 3em;
            font-weight: 800;
            line-height: 1.25;
            text-align: left;
            color: #000000;
            letter-spacing: -0.02em;
        }

        .header .nav {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5em;
            margin: 1em 0;
            font-size: 0.9em;
        }

        .header .nav-item {
            display: flex;
            align-items: center;
            gap: 0.5em;
        }

        .header .nav-item a {
            font-weight: 500;
            min-width: 50px;
        }

        .header .nav-description {
            color: #57606a;
        }

        .language-switcher {
            position: absolute;
            top: 20px;
            right: 20px;
            display: flex;
            gap: 10px;
        }

        .language-switcher button {
            padding: 5px 10px;
            border: 1px solid #d0d7de;
            border-radius: 4px;
            font-size: 14px;
            background: white;
            cursor: pointer;
        }

        .language-switcher button:hover {
            background-color: #f6f8fa;
        }

        .language-switcher button.active {
            background-color: #0969da;
            color: white;
            border-color: #0969da;
        }

        .markdown-body img {
            max-width: 100%;
            height: auto;
            display: block;
            margin: 1em auto;
        }
    </style>
</head>
<body>
    <div class="markdown-body">
        <div class="header">
            <div class="language-switcher">
                <button onclick="switchLanguage('en')" ${lang === 'en' ? 'class="active"' : ''}>English</button>
                <button onclick="switchLanguage('cn')" ${lang === 'cn' ? 'class="active"' : ''}>简体中文</button>
                <button onclick="switchLanguage('jp')" ${lang === 'jp' ? 'class="active"' : ''}>日本語</button>
            </div>
            <h1>${titleName}</h1>
            <div class="nav">
                <div class="nav-item">
                    <a href="https://bh3gei.github.io/">Home</a>
                    <span class="nav-description">Personal Website</span>
                </div>
                <div class="nav-item">
                    <a href="https://github.com/bh3gei">GitHub</a>
                    <span class="nav-description">View My Projects & Code</span>
                </div>
                <div class="nav-item">
                    <a href="mailto:scholar.liyao@gmail.com">Email</a>
                    <span class="nav-description">Contact: scholar.liyao@gmail.com</span>
                </div>
            </div>
        </div>
        <div id="content"></div>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
    <script>
        // 等待 marked 加载完成
        window.onload = function() {
            marked.setOptions({
                breaks: true,  // 支持 GitHub 风格的换行
                gfm: true,    // 启用 GitHub 风格的 Markdown
            });
            document.getElementById('content').innerHTML = marked.parse(\`${markdown}\`);
        }
        
        function switchLanguage(lang) {
            const url = new URL(window.location);
            url.searchParams.set('lang', lang);
            window.location.href = url.toString();
        }
    </script>
</body>
</html>`

    return new Response(html, {
      headers: {
        'Content-Type': 'text/html;charset=UTF-8',
        'Cache-Control': `public, max-age=${CACHE_TIME}`
      }
    })
  } catch (error) {
    console.error('Error:', error)
    return new Response('Error loading content: ' + error.message, { 
      status: 500,
      headers: {
        'Content-Type': 'text/plain;charset=UTF-8',
        'Cache-Control': `public, max-age=${CACHE_TIME}`
      }
    })
  }
}
