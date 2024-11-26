<template>
  <div class="blog-content">
    <div v-if="loading" class="loading">
      <p>Loading...</p>
    </div>
    <div v-else>
      <div v-if="isHome" class="post-list">
        <h3>所有文章</h3>
        <div v-for="post in posts" :key="post.file" class="post-item" @click="openPost(post)">
          <h4>{{ post.title }}</h4>
          <p class="post-time">{{ formatDate(post.time) }}</p>
        </div>
        <div class="pagination">
          <button v-if="currentPage > 1" @click="changePage(currentPage - 1)" class="btn btn-default">上一页</button>
          <span class="current-page">当前在第 {{ currentPage }} 页</span>
          <button v-if="hasNextPage" @click="changePage(currentPage + 1)" class="btn btn-default">下一页</button>
        </div>
      </div>
      <div v-else class="post-content">
        <h2>{{ currentPost.title }}</h2>
        <div class="post-meta">
          <span>发布时间：{{ formatDate(currentPost.time) }}</span>
        </div>
        <div class="markdown-content" v-html="renderedContent"></div>
        <div class="post-footer">
          <button @click="backToHome" class="btn btn-default">返回文章列表</button>
          <a :href="currentPostUrl" target="_blank" class="btn btn-primary">在新窗口打开</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
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

    const converter = new showdown.Converter({
      extensions: ['table'],
      simplifiedAutoLink: true,
      simpleLineBreaks: true,
      openLinksInNewWindow: true,
      noHeaderId: true
    })

    const renderedContent = computed(() => {
      if (!postContent.value) return ''
      const html = converter.makeHtml(postContent.value)
      // 在下一个 tick 中高亮代码
      setTimeout(() => {
        document.querySelectorAll('pre code').forEach((block) => {
          hljs.highlightBlock(block)
        })
      }, 0)
      return html
    })

    const hasNextPage = computed(() => {
      return posts.value.length > currentPage.value * POSTS_PER_PAGE
    })

    const currentPostUrl = computed(() => {
      if (!currentPost.value) return ''
      return `https://blog.stratosphericus.workers.dev/${encodeURIComponent(
        currentPost.value.file.replace(/posts\//g, '').replace(/\.md/g, '')
      )}`
    })

    const formatDate = (timestamp) => {
      return new Date(timestamp * 1000).toLocaleDateString()
    }

    const fetchPosts = async () => {
      try {
        const response = await fetch(`https://raw.githubusercontent.com/${GITHUB_BASE}/main/list.json`)
        const data = await response.json()
        posts.value = data
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
      } catch (error) {
        console.error('Error fetching post:', error)
        postContent.value = '# Error\n无法加载文章内容。'
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
      changePage
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
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}

.post-list {
  max-width: 800px;
  margin: 0 auto;
}

.post-item {
  padding: 15px;
  margin-bottom: 15px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid var(--border-color);
}

.post-item:hover {
  transform: translateX(5px);
  border-color: var(--primary-color);
}

.post-time {
  font-size: 0.9em;
  color: var(--secondary-text-color);
}

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 30px;
}

.current-page {
  color: var(--secondary-text-color);
}

.post-content {
  max-width: 800px;
  margin: 0 auto;
}

.post-meta {
  margin: 10px 0 20px;
  color: var(--secondary-text-color);
}

.markdown-content {
  line-height: 1.6;
}

.markdown-content :deep(img) {
  max-width: 100%;
  height: auto;
}

.markdown-content :deep(pre) {
  padding: 16px;
  overflow: auto;
  border-radius: 8px;
  background-color: var(--code-bg);
}

.post-footer {
  margin-top: 30px;
  display: flex;
  gap: 10px;
}

.btn {
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-default {
  background-color: var(--button-bg);
  color: var(--text-color);
  border: 1px solid var(--border-color);
}

.btn-primary {
  background-color: var(--primary-color);
  color: white;
  border: none;
}

.btn:hover {
  opacity: 0.8;
}
</style>
