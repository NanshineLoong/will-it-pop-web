

# 这篇会火吗？

  

仅供娱乐~



## 规则

**10 题** 或 **100 题**，判断一篇笔记算不算「火文」，测测你是网感大神还是迟钝小白。

怎么算「火」：

- `喜欢 + 2 × 收藏 + 3 × 分享 > 1000`

## 数据

用 [xiaohongshu-cli](https://github.com/jackwener/xiaohongshu-cli) 爬了 100 条笔记，数据在 `[src/data/xhs_collection/final_notes.json](./src/data/xhs_collection/final_notes.json)`。

过滤条件：

- 博主粉丝数 ≤ 500
- 发布时间距今至少 7 天

## 本地运行

```bash
npm install
npm run dev
```

浏览器打开 `http://localhost:5173` 

## 贡献

项目仍在迭代，欢迎提 issue 和 PR～

## 许可证

本项目以 [GNU Affero General Public License v3.0](https://www.gnu.org/licenses/agpl-3.0.html)（AGPL-3.0）发布。