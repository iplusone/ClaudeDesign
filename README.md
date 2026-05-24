# ClaudeDesign

このディレクトリは、Claude Design を使った制作フロー、プロンプト、テンプレートを整理するためのプロジェクトルートです。

## Documentation

- [docs/README.md](/home/ishii/projects/ClaudeDesign/docs/README.md)
- [docs/workflows/10-minute-design-workflow.md](/home/ishii/projects/ClaudeDesign/docs/workflows/10-minute-design-workflow.md)
- [docs/workflows/claude-design-4-step-one-pager.md](/home/ishii/projects/ClaudeDesign/docs/workflows/claude-design-4-step-one-pager.md)
- [docs/workflows/claude-design-operations-guide.md](/home/ishii/projects/ClaudeDesign/docs/workflows/claude-design-operations-guide.md)
- [docs/workflows/structured-design-thinking-guide.md](/home/ishii/projects/ClaudeDesign/docs/workflows/structured-design-thinking-guide.md)
- [docs/workflows/design-system-compass-guide.md](/home/ishii/projects/ClaudeDesign/docs/workflows/design-system-compass-guide.md)
- [docs/prompts/design-system-prompt-examples.md](/home/ishii/projects/ClaudeDesign/docs/prompts/design-system-prompt-examples.md)
- [docs/templates/design-brief-template.md](/home/ishii/projects/ClaudeDesign/docs/templates/design-brief-template.md)
- [docs/templates/landing-page-skill-brief-template.md](/home/ishii/projects/ClaudeDesign/docs/templates/landing-page-skill-brief-template.md)
- [docs/templates/sales-deck-skill-brief-template.md](/home/ishii/projects/ClaudeDesign/docs/templates/sales-deck-skill-brief-template.md)
- [docs/templates/recruitment-page-skill-brief-template.md](/home/ishii/projects/ClaudeDesign/docs/templates/recruitment-page-skill-brief-template.md)
- [docs/proposals/strategic-ai-design-adoption-proposal.md](/home/ishii/projects/ClaudeDesign/docs/proposals/strategic-ai-design-adoption-proposal.md)
- [docs/proposals/token-efficiency-strategic-workflow.md](/home/ishii/projects/ClaudeDesign/docs/proposals/token-efficiency-strategic-workflow.md)
- [docs/presentations/claude-design-workflow-slide-deck-notes.md](/home/ishii/projects/ClaudeDesign/docs/presentations/claude-design-workflow-slide-deck-notes.md)
- [docs/projects/ai-engineer-training-lp-design-pack.md](/home/ishii/projects/ClaudeDesign/docs/projects/ai-engineer-training-lp-design-pack.md)

## Suggested Structure

```text
docs/
  projects/      案件ごとの実行用パック
  presentations/ スライド要約や発表ノート
  prompts/      Claude Design や関連ワークフローで使うプロンプト
  proposals/    導入提案書や意思決定向け文書
  templates/    再利用するテンプレート
  workflows/    制作手順や運用フロー
```

## このリポジトリの位置づけ

**ClaudeDesign はノウハウの保管庫であり、実案件の実装場所ではありません。**

| | ClaudeDesign（保管庫） | 個別プロジェクト |
|---|---|---|
| 目的 | ワークフロー・テンプレート・プロンプトを保管する | 実際の成果物を作る |
| Git 管理 | ドキュメントとして管理 | コードとして管理 |
| 寿命 | ずっと育てていく資産 | 案件ごとに独立して保守 |

### 実案件の進め方

```
ClaudeDesign/                   ← ここから参照するだけ
└── docs/
    ├── templates/              ← ブリーフをここからコピーして使う
    ├── prompts/                ← Design System プロンプトをここから取る
    └── projects/              ← 案件ごとのブリーフ・プロンプトを保管

~/projects/ai-engineer-lp/     ← 実装は個別プロジェクトとして作る
~/projects/construction-estimates/
~/projects/SoloReserve/
```

案件を始めるときは `docs/projects/` に設計パックを作り、実装は別ディレクトリに独立したプロジェクトを作る。

## Usage

1. `docs/templates/` のテンプレートで要件を整理する
2. `docs/prompts/` のプロンプトを調整する
3. `docs/workflows/` の手順で Claude Design に流し込む
4. 実装が必要な場合は、個別プロジェクトディレクトリを作って進める
