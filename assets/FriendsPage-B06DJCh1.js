import{i as e,t}from"./react-DB-4Zxce.js";import{C as n,y as r}from"./index-DqxuqrYR.js";var i=e(t(),1),a=n(),o=[{name:`Sonetto`,url:`https://wqxzqhqq.github.io/blog/`,desc:`一个软件我觉得数学能力很MAN的人吖！`,tag:`Supported Old Friend`},{name:`Yauntyours`,url:`https://yauntyours.cn/`,desc:`一个佬朋友的博客丫，有思考和实力的见证啊`,tag:`Friend`,avatar:`https://yauntyours.cn/app/assets/avatar.png`}];function s({name:e,avatar:t}){let[n,r]=(0,i.useState)(!1);return!t||n?(0,a.jsx)(`div`,{className:`w-12 h-12 rounded-lg bg-[var(--color-fluent-accent-light)]
        flex items-center justify-center text-base font-bold text-[var(--color-fluent-accent)]
        transition-transform duration-[var(--duration-fluent-short)]
        group-hover:scale-105`,children:e[0]}):(0,a.jsx)(`img`,{src:t,alt:``,loading:`lazy`,referrerPolicy:`no-referrer`,onError:()=>r(!0),className:`w-12 h-12 rounded-lg object-cover
        border border-[var(--color-fluent-border)]
        transition-transform duration-[var(--duration-fluent-short)]
        group-hover:scale-105`})}function c(){return(0,a.jsxs)(`div`,{className:`max-w-[640px] mx-auto`,children:[(0,a.jsxs)(`div`,{className:`mb-10`,children:[(0,a.jsx)(`h1`,{className:`!text-2xl !font-bold !tracking-tight !m-0 !text-[var(--color-fluent-text-primary)]`,children:`友链`}),(0,a.jsx)(`p`,{className:`text-sm text-[var(--color-fluent-text-tertiary)] mt-2 leading-relaxed`,children:`这里记录着我欣赏的博主和朋友们，欢迎交换友链。`})]}),(0,a.jsx)(`div`,{className:`grid gap-3`,children:o.map((e,t)=>(0,a.jsxs)(`a`,{href:e.url,target:`_blank`,rel:`noopener noreferrer`,className:`group relative flex items-center gap-4 p-4 rounded-xl no-underline
              bg-[var(--color-fluent-surface)]
              border border-[var(--color-fluent-border)]
              shadow-fluent-2
              transition-all duration-[var(--duration-fluent-short)]
              hover:shadow-fluent-4 hover:border-[var(--color-fluent-accent)]
              animate-fluent-slide-up ${r.noise}`,style:{animationDelay:`${t*60}ms`},children:[(0,a.jsxs)(`div`,{className:`relative flex-shrink-0`,children:[(0,a.jsx)(s,{name:e.name,avatar:e.avatar}),e.tag===`Me`&&(0,a.jsx)(`div`,{className:`absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[var(--color-fluent-accent)]
                  border-2 border-[var(--color-fluent-surface)]`})]}),(0,a.jsxs)(`div`,{className:`flex flex-col min-w-0 flex-1`,children:[(0,a.jsxs)(`div`,{className:`flex items-center gap-2`,children:[(0,a.jsx)(`span`,{className:`text-sm font-semibold text-[var(--color-fluent-text-primary)]
                  transition-colors duration-[var(--duration-fluent-short)]
                  group-hover:text-[var(--color-fluent-accent)]`,children:e.name}),e.tag&&(0,a.jsx)(`span`,{className:`px-2 py-0.5 text-[0.65rem] font-medium
                    text-[var(--color-fluent-accent)] bg-[var(--color-fluent-accent-light)]
                    rounded-md`,children:e.tag})]}),e.desc&&(0,a.jsx)(`span`,{className:`text-xs text-[var(--color-fluent-text-tertiary)] truncate mt-1`,children:e.desc})]}),(0,a.jsx)(`svg`,{className:`w-4 h-4 text-[var(--color-fluent-text-tertiary)] flex-shrink-0
                transition-all duration-[var(--duration-fluent-short)]
                group-hover:text-[var(--color-fluent-accent)] group-hover:translate-x-0.5`,fill:`none`,stroke:`currentColor`,viewBox:`0 0 24 24`,strokeWidth:2,children:(0,a.jsx)(`path`,{strokeLinecap:`round`,strokeLinejoin:`round`,d:`M9 5l7 7-7 7`})})]},e.url))}),(0,a.jsx)(`div`,{className:`mt-10 pt-8 border-t border-[var(--color-fluent-border)] text-center`,children:(0,a.jsxs)(`p`,{className:`text-sm text-[var(--color-fluent-text-tertiary)]`,children:[`欢迎交换友链，请通过`,` `,(0,a.jsx)(`a`,{href:`https://github.com/hibays`,target:`_blank`,rel:`noopener noreferrer`,className:`text-[var(--color-fluent-accent)] no-underline
              hover:underline transition-all duration-200`,children:`GitHub Issues`}),` `,`联系。`]})})]})}export{c as default};