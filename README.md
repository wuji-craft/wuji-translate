# 无机翻译 / Wuji Translate

让翻译更自然，没有机器味。

无机翻译是一个正在开发中的开源浏览器翻译扩展，基于 WXT、Vue 3 和 TypeScript，采用 Manifest V3。

> 项目处于早期开发阶段。目前仅完成工程基础和界面多语言功能，尚未接入翻译服务，不具备网页翻译能力，也未发布可供日常使用的版本。

## 当前功能

- 基础扩展弹窗。
- 英文、简体中文界面。
- 默认跟随浏览器语言，也可手动切换并保存偏好。
- 集中管理语言资源，便于后续增加语言。

## 技术栈

| 类别 | 技术 | 当前版本 |
| --- | --- | --- |
| 扩展框架 | WXT | 0.21.5 |
| 界面 | Vue | 3.5.44 |
| 开发语言 | TypeScript | 5.9.3 |
| 构建工具 | Vite，由 WXT 驱动 | 8.3.5 |
| 界面多语言 | Vue I18n | 11.4.16 |
| 配置存储 | WXT Storage / 浏览器扩展本地存储 | 随 WXT 集成 |

完整依赖及锁定版本见 `package.json` 和 `package-lock.json`。

## 本地运行

### 环境要求

- Node.js 22.18.0，见 `.nvmrc`。
- npm，当前使用 10.9.3。
- Chrome 浏览器。

在项目根目录安装依赖并启动开发模式：

```bash
npm ci
npm run dev
```

WXT 会启动开发环境，并尝试打开已加载扩展的浏览器窗口。开发期间保持命令运行，修改源码后可查看更新。

### 检查与构建

```bash
# 类型检查
npm run compile

# 构建 Chrome Manifest V3 扩展
npm run build

# 生成发布压缩包
npm run zip
```

构建结果位于 `.output/chrome-mv3/`。如需手动加载，在 Chrome 扩展管理页开启“开发者模式”，选择“加载已解压的扩展程序”，然后选择该目录。

## 代码结构

```text
entrypoints/
  background.ts       # 后台入口，当前为空实现
  popup/              # 弹窗界面与入口
    App.vue
    main.ts
    style.css
    index.html
i18n/
  index.ts            # 语言注册、初始化与偏好保存
public/
  _locales/           # 中英文文案，供界面和扩展元信息共用
  icon/               # 扩展图标
wxt.config.ts         # WXT 与 Manifest 配置
```

阅读代码可从 `entrypoints/popup/main.ts` 开始：该入口初始化多语言并挂载界面；`App.vue` 提供基础界面和语言选择；`i18n/index.ts` 负责语言匹配与偏好保存。

## 多语言

语言资源统一维护在 `public/_locales/<locale>/messages.json` 中，当前包含 `en` 和 `zh_CN`。界面通过 Vue I18n 使用这些文案，扩展名称和描述使用浏览器原生 i18n。

新增语言时，添加对应资源，并在 `i18n/index.ts` 注册，保持各语言的消息键一致。业务组件不应写死用户可见文案或添加中英文条件分支。

手动切换只影响扩展自身界面。浏览器扩展管理页中的名称、描述和工具栏标题仍跟随浏览器语言。界面语言也不等同于后续网页翻译功能的源语言或目标语言。

## 参与贡献

欢迎通过 [Issues](https://github.com/wuji-craft/wuji-translate/issues) 反馈问题、讨论需求，或提交 Pull Request。

提交问题时，请说明浏览器版本、复现步骤、预期行为和实际结果。涉及新功能或较大改动时，建议先讨论实现范围。提交代码前请运行类型检查与构建；涉及多语言时，请同时检查文案键一致性、语言切换与偏好保存。

请勿在问题、截图或代码中包含访问令牌、翻译服务密钥及其他私人信息。

## 许可证

Copyright (C) 2026 wuji-craft

本项目采用 [GNU General Public License v3.0](LICENSE)，SPDX 标识为 `GPL-3.0-only`。

允许使用、修改和商业使用。分发本项目或受其约束的修改版时，须遵守 GPL-3.0 的源码提供、许可声明等要求；具体以许可证全文为准。第三方依赖和素材遵循各自的许可证。
