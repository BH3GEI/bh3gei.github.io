<template>
  <div class="blog-content">
    <div class="ad-container">
      <ins class="adsbygoogle"
           style="display:block"
           data-ad-client="ca-pub-9131146702581512"
           data-ad-slot="YOUR_AD_SLOT_ID"
           data-ad-format="auto"
           data-full-width-responsive="true"></ins>
    </div>
    <div v-if="loading" class="loading">
      <p>Loading...</p>
    </div>
    <div v-else>
      <div v-if="isHome" class="post-list">
        <h3>All Posts</h3>
        <div v-for="post in paginatedPosts" :key="post.file" class="post-item" @click="openPost(post)">
          <h4>{{ post.title }}</h4>
          <p class="post-time">{{ formatDate(post.time) }}</p>
        </div>
        <div class="pagination">
          <button v-if="currentPage > 1" @click="changePage(currentPage - 1)" class="btn btn-default">Previous</button>
          <span class="current-page">Current Page: {{ currentPage }}</span>
          <button v-if="hasNextPage" @click="changePage(currentPage + 1)" class="btn btn-default">Next</button>
        </div>
      </div>
      <div v-else class="post-content">
        <h2>{{ currentPost.title }}</h2>
        <div class="post-meta">
          <span>Published: {{ formatDate(currentPost.time) }}</span>
        </div>
        <div class="markdown-content" v-html="renderedContent"></div>
        <div class="post-footer">
          <button @click="backToHome" class="btn btn-default">Back to Posts</button>
          <a :href="currentPostUrl" target="_blank" class="btn btn-primary">Open in New Window</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed, nextTick } from 'vue'
import showdown from 'showdown'
import hljs from 'highlight.js'

const GITHUB_BASE = "BH3GEI/blog"
const POSTS_PER_PAGE = 12

export default {
  name: 'BlogContent',
  setup() {
    const loading = ref(true)
    const posts = ref([])
    const currentPage = ref(1)
    const currentPost = ref(null)
    const postContent = ref('')
    const isHome = ref(true)
    const renderedHtml = ref('')

    const converter = new showdown.Converter({
      simplifiedAutoLink: true,
      simpleLineBreaks: true,
      openLinksInNewWindow: true,
      noHeaderId: true,
      tables: true
    })

    const renderedContent = computed(() => renderedHtml.value)

    const updateRenderedContent = async () => {
      if (!postContent.value) {
        renderedHtml.value = ''
        return
      }
      renderedHtml.value = converter.makeHtml(postContent.value)
      await nextTick()
      document.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightBlock(block)
      })
    }

    const hasNextPage = computed(() => {
      return posts.value.length > currentPage.value * POSTS_PER_PAGE
    })

    const paginatedPosts = computed(() => {
      const start = (currentPage.value - 1) * POSTS_PER_PAGE
      const end = start + POSTS_PER_PAGE
      return posts.value.slice(start, end)
    })

    const currentPostUrl = computed(() => {
      if (!currentPost.value) return ''
      return `https://blog.stratosphericus.workers.dev/${encodeURIComponent(
        currentPost.value.file.replace(/posts\//g, '').replace(/\.md/g, '')
      )}`
    })

    const formatDate = (dateStr) => {
      try {
        return new Date(dateStr).toLocaleDateString()
      } catch (error) {
        return 'Invalid Date'
      }
    }

    const fetchPosts = async () => {
      try {
        const response = await fetch(`https://raw.githubusercontent.com/${GITHUB_BASE}/main/list.json`)
        const data = await response.json()
        // 按时间倒序排序
        posts.value = data.sort((a, b) => new Date(b.time) - new Date(a.time))
      } catch (error) {
        console.error('Error fetching posts:', error)
      } finally {
        loading.value = false
      }
    }

    const fetchPost = async (post) => {
      loading.value = true
      try {
        const response = await fetch(`https://raw.githubusercontent.com/${GITHUB_BASE}/main/${post.file}`)
        postContent.value = await response.text()
        await updateRenderedContent()
      } catch (error) {
        console.error('Error fetching post:', error)
        postContent.value = '# Error\nFailed to load article content.'
        await updateRenderedContent()
      } finally {
        loading.value = false
      }
    }

    const openPost = async (post) => {
      currentPost.value = post
      isHome.value = false
      await fetchPost(post)
    }

    const backToHome = () => {
      isHome.value = true
      currentPost.value = null
      postContent.value = ''
      renderedHtml.value = ''
    }

    const changePage = (page) => {
      currentPage.value = page
      window.scrollTo(0, 0)
    }

    onMounted(() => {
      fetchPosts()
    })

    return {
      loading,
      posts,
      currentPage,
      currentPost,
      isHome,
      hasNextPage,
      renderedContent,
      currentPostUrl,
      formatDate,
      openPost,
      backToHome,
      changePage,
      paginatedPosts
    }
  }
}
</script>

<style scoped>
.blog-content {
  height: 100%;
  overflow-y: auto;
  padding: 20px;
  color: var(--text-color);
  background-color: var(--window-bg);
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: var(--text-secondary);
}

.post-list {
  max-width: 800px;
  margin: 0 auto;
}

.post-list h3 {
  margin-bottom: 1.5em;
  font-size: 1.8em;
  color: var(--primary-color);
}

.post-item {
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid var(--border-color);
  background-color: var(--bg-secondary);
  backdrop-filter: blur(10px);
}

.post-item:hover {
  transform: translateY(-2px);
  border-color: var(--primary-color);
  box-shadow: 0 4px 20px var(--shadow-color);
}

.post-item h4 {
  font-size: 1.2em;
  margin-bottom: 8px;
  color: var(--text-primary);
}

.post-time {
  font-size: 0.9em;
  color: var(--text-secondary);
}

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 40px;
  padding: 20px 0;
}

.current-page {
  color: var(--text-secondary);
  font-size: 0.9em;
}

.post-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.post-content h2 {
  font-size: 2em;
  margin-bottom: 0.5em;
  color: var(--primary-color);
}

.post-meta {
  margin: 10px 0 30px;
  color: var(--text-secondary);
  font-size: 0.9em;
}

.markdown-content {
  line-height: 1.8;
  font-size: 1.1em;
}

.markdown-content :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 1.5em 0;
}

.markdown-content :deep(pre) {
  padding: 20px;
  margin: 1.5em 0;
  overflow: auto;
  border-radius: 12px;
  background-color: var(--code-bg);
  border: 1px solid var(--border-color);
}

.markdown-content :deep(code) {
  font-family: 'Fira Code', monospace;
  font-size: 0.9em;
  padding: 0.2em 0.4em;
  border-radius: 4px;
  background-color: var(--code-bg);
}

.markdown-content :deep(pre code) {
  padding: 0;
  background-color: transparent;
}

.markdown-content :deep(p) {
  margin: 1.5em 0;
  color: var(--text-primary);
}

.markdown-content :deep(h1),
.markdown-content :deep(h2),
.markdown-content :deep(h3),
.markdown-content :deep(h4),
.markdown-content :deep(h5),
.markdown-content :deep(h6) {
  margin: 2em 0 1em;
  color: var(--primary-color);
  line-height: 1.4;
}

.markdown-content :deep(a) {
  color: var(--primary-color);
  text-decoration: none;
  border-bottom: 1px dashed var(--primary-color);
  transition: all 0.3s ease;
}

.markdown-content :deep(a:hover) {
  border-bottom-style: solid;
}

.markdown-content :deep(blockquote) {
  margin: 1.5em 0;
  padding: 1em 1.5em;
  border-left: 4px solid var(--primary-color);
  background-color: var(--hover-bg);
  border-radius: 0 8px 8px 0;
}

.markdown-content :deep(blockquote p) {
  margin: 0;
  color: var(--text-secondary);
}

.post-footer {
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid var(--border-color);
  display: flex;
  gap: 15px;
}

.btn {
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.95em;
  font-weight: 500;
}

.btn-default {
  background-color: var(--button-bg);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.btn-primary {
  background-color: var(--primary-color);
  color: white;
  border: none;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px var(--shadow-color);
}

.btn-default:hover {
  border-color: var(--primary-color);
}

.btn-primary:hover {
  background-color: var(--primary-hover);
}
</style>
