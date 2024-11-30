# Personal Homepage

My personal homepage built with Vue.js, featuring a modern macOS-style interface.

## External Links & Resources

### Profile Information
All profile information and social links are managed in `src/components/Profile/Profile.vue`

#### Current Links
- Avatar: `https://avatars.githubusercontent.com/u/58540850?v=4`
- About (Gist): `https://gist.github.com/BH3GEI/98c155ccc3435ff79d34e63085c745a0#file-academics-md`
- GitHub: `https://github.com/bh3gei`
- LinkedIn: `https://linkedin.com/in/yao-li2026`
- Telegram: `https://t.me/yao_luv_cs`
- Email: `scholar.liyao@gmail.com`

### About
Academic information is managed in `https://github.com/BH3GEI/Resume/blob/main/academics.md`


### Resume
Resume files are available in three languages. The selection modal is managed in `src/components/Modal/ResumeChoiceModal.vue`

#### Resume Files
- English Version: `https://github.com/BH3GEI/Resume/blob/main/Resume.pdf`
- Japanese Version (日本語): `https://github.com/BH3GEI/Resume/blob/main/Resume_JP.pdf`
- Chinese Version (简体中文): `https://github.com/BH3GEI/Resume/blob/main/Resume_CN.pdf`
- Resume README: `https://raw.githubusercontent.com/BH3GEI/Resume/main/README.md`

To update resume files:
1. Update the PDF files in the GitHub repository: `https://github.com/BH3GEI/Resume`
2. The changes will be automatically reflected on the website

### Blog Content
Blog is available at: `https://blog.stratosphericus.workers.dev`

To update blog content:
1. Access the blog through `https://github.com/BH3GEI/blog`
2. Use the content management system to make updates
3. Changes will be reflected automatically through the workers.dev platform

## Content Update Guide

### Updating Profile Information
To update personal information and social links:
1. Open `src/components/Profile/Profile.vue`
2. Locate the relevant section in the template
3. Update the corresponding URLs or content
4. Test locally before deploying

## Development Setup
```
npm install
```

### Development
```
npm run serve
```

### Production Build
```
npm run build
```

### Linting
```
npm run lint
```

## Deployment
Use the deploy script to deploy to GitHub Pages:
```
sh deploy.sh
```

### Configuration
See [Vue CLI Configuration Reference](https://cli.vuejs.org/config/).
