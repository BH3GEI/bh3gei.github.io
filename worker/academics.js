// 缓存时间（4秒，用于开发测试）
const CACHE_TIME = 4

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  try {
    // 从GitHub获取markdown内容
    const response = await fetch('https://raw.githubusercontent.com/BH3GEI/Resume/main/academics.md')
    const markdown = await response.text()

    // HTML模板
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Yao Li - Academic Profile</title>
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
            text-align: center;
            margin-bottom: 2em;
        }

        .header h1 {
            margin-bottom: 0.5em;
        }

        .header .nav {
            margin-bottom: 2em;
        }

        .header .nav a {
            margin: 0 1em;
        }
    </style>
</head>
<body>
    <div class="markdown-body">
        <div class="header">
            <h1>Yao Li</h1>
            <div class="nav">
                <a href="/">Home</a>
                <a href="https://github.com/bh3gei">GitHub</a>
                <a href="mailto:scholar.liyao@gmail.com">Email</a>
            </div>
        </div>
        <div id="content"></div>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
    <script>
        document.getElementById('content').innerHTML = marked.parse(\`${markdown}\`);
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
    return new Response('Error loading content', { 
      status: 500,
      headers: {
        'Content-Type': 'text/plain;charset=UTF-8',
        'Cache-Control': `public, max-age=${CACHE_TIME}`
      }
    })
  }
}
