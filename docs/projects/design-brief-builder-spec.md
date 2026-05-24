# Design Brief Builder — 設計仕様書

テンプレートを選ぶだけで、完成に近いサイトデザインを生成できる仕組みの設計ドキュメントです。

---

## 1. コンセプト

### 解決する問題

ClaudeDesign の4ステップワークフローは、Step 1〜3（デザインシステム・テンプレート・コピーの事前定義）に手間がかかる。  
この準備作業を省略して「Vibe Designing」で進めると、トークンを浪費し品質もブレる。

### 解決策

**テンプレートを選ぶだけで、Step 1〜3が完了している状態を作る。**

```
Before（現状）:
  頭の中でブリーフ → Claude Designで試行錯誤 → トークン浪費 → 品質ブレ

After（目標）:
  テンプレート選択 → 変えたいところだけ変更 → 1発生成 → 品質安定
```

---

## 2. ユーザーフロー

### メインフロー

```
① テンプレート選択
      ↓（そのまま生成可能）
② カスタマイズ（任意）
      ↓
③ 生成・出力
```

### フロー詳細

**① テンプレート選択**
- テンプレートカードの一覧を表示
- 各カードにプレビュー画像・用途説明を表示
- 「このテンプレートを使う」で次へ進む

**② カスタマイズ（任意）**
- **よく変える項目**（デフォルト展開）
  - サービス名
  - メインカラー（カラーピッカー）
  - ロゴ（ファイルアップロード）
  - メインキャッチコピー
- **詳細設定**（アコーディオンで折りたたみ）
  - 全コピー（セクションごと）
  - 全画像（Hero・Problems・Service・Curriculum）
  - デザインシステム（カラー全色・タイポグラフィ）
- 変更せずに「生成する」ボタンを押せば、テンプレートのデフォルト値で生成

**③ 生成・出力**
- LP（Next.js）へ即反映
- `design-brief.json` ダウンロード
- Claude Design 用プロンプト生成（コピーして貼るだけ）

---

## 3. 画面構成

### 3-1. テンプレート選択画面 `/builder`

```
┌─────────────────────────────────────────────────────────┐
│  Claude Design Builder                                  │
│  テンプレートを選んで、すぐに生成できます。             │
├──────────────┬──────────────┬──────────────┬────────────┤
│ エンジニア   │  SaaS LP     │  採用LP      │  コーポ    │
│ 育成LP       │              │              │  レートLP  │
│              │              │              │            │
│ [preview]    │ [preview]    │ [preview]    │ [preview]  │
│              │              │              │            │
│ 未経験者の   │ ソフトウェア │ 求人・採用   │ 会社紹介・ │
│ エンジニア   │ サービスの   │ 特化のLP     │ 信頼訴求   │
│ 育成特化     │ LP           │              │ LP         │
│              │              │              │            │
│ [選択する]   │ [選択する]   │ [選択する]   │ [選択する] │
└──────────────┴──────────────┴──────────────┴────────────┘
```

### 3-2. カスタマイズ画面 `/builder/[templateId]`

```
┌──────────────────────────────────────────────────────────┐
│  ← テンプレート選択へ    エンジニア育成LP               │
├──────────────────────────────────────────────────────────┤
│  ● よく変える項目                                        │
│                                                          │
│    サービス名         [AI Engineer Studio        ]       │
│    メインカラー       [●] #1951A5                        │
│    ロゴ               [+ アップロード]                   │
│    メインキャッチ     [迷わず学べる。実践まで届く。]     │
│                                                          │
│  ▼ 詳細設定（コピー・画像・デザインシステム）           │
│                                                          │
│                             [生成する →]                │
└──────────────────────────────────────────────────────────┘
```

### 3-3. 出力画面 `/builder/[templateId]/output`

```
┌──────────────────────────────────────────────────────────┐
│  生成完了                                                │
├──────────────────────────────────────────────────────────┤
│  ✓ LP反映済み   → localhost:3001 で確認                  │
│                                                          │
│  [design-brief.json をダウンロード]                      │
│  [Claude Design プロンプトをコピー]                      │
│  [もう一度編集する]                                      │
└──────────────────────────────────────────────────────────┘
```

---

## 4. テンプレート定義

### 初期テンプレート一覧

| ID | 名前 | 用途 | セクション構成 |
|---|---|---|---|
| `engineer-training` | エンジニア育成LP | 未経験者向け育成・教育サービス | Hero / Problems / Service / Curriculum / Process / FAQ / Contact |
| `saas` | SaaS LP | ソフトウェアサービス | Hero / Features / How it works / Pricing / FAQ / Contact |
| `recruitment` | 採用LP | 求人・採用特化 | Hero / Culture / Benefits / Team / Process / FAQ / Contact |
| `corporate` | コーポレートLP | 会社紹介・信頼訴求 | Hero / About / Service / Team / News / Contact |

### テンプレートデータ構造

各テンプレートは以下を持つ：

```json
{
  "id": "engineer-training",
  "name": "エンジニア育成LP",
  "description": "未経験者のエンジニア育成・教育サービス向け",
  "previewImage": "/templates/engineer-training.png",
  "defaults": {
    "brand": { ... },
    "colors": { ... },
    "images": { ... },
    "copy": { ... }
  }
}
```

---

## 5. データモデル（design-brief.json）

```json
{
  "meta": {
    "version": "1.0",
    "templateId": "engineer-training",
    "createdAt": "2026-05-24T00:00:00Z",
    "updatedAt": "2026-05-24T00:00:00Z"
  },
  "brand": {
    "name": "サービス名",
    "tagline": "キャッチコピー",
    "industry": "業種",
    "target": "ターゲット",
    "tones": ["信頼感", "先進性"],
    "avoidTones": "情報商材っぽさ",
    "siteUrl": ""
  },
  "colors": {
    "primary": "#1951A5",
    "secondary": "#2F73D9",
    "accent": "#458BF5",
    "heroBg": "#ecf3fe",
    "surface": "#ffffff",
    "text": "#333333",
    "muted": "#939394"
  },
  "images": {
    "logo": "",
    "favicon": "",
    "hero": "/images/hero-main.png",
    "problem1": "/images/problem-01.png",
    "problem2": "/images/problem-02.png",
    "problem3": "/images/problem-03.png",
    "serviceMain": "/images/service-ai.png",
    "curriculum": "/images/curriculum.png"
  },
  "copy": {
    "heroEyebrow": "",
    "heroHeadline": "",
    "heroSubheadline": "",
    "heroCtaPrimary": "",
    "heroCtaSecondary": "",
    "problemsHeading": "",
    "problemsSubheading": "",
    "problems": [
      { "no": "01", "title": "", "desc": "" },
      { "no": "02", "title": "", "desc": "" },
      { "no": "03", "title": "", "desc": "" }
    ],
    "serviceHeading": "",
    "serviceSubheading": "",
    "service": [
      { "tag": "Feature 01", "title": "", "desc": "", "points": "" },
      { "tag": "Feature 02", "title": "", "desc": "", "points": "" },
      { "tag": "Feature 03", "title": "", "desc": "", "points": "" }
    ],
    "curriculumHeading": "",
    "curriculumSubheading": "",
    "curriculum": [
      { "phase": "Phase 1", "title": "", "desc": "", "tags": "" },
      { "phase": "Phase 2", "title": "", "desc": "", "tags": "" },
      { "phase": "Phase 3", "title": "", "desc": "", "tags": "" },
      { "phase": "Phase 4", "title": "", "desc": "", "tags": "" }
    ],
    "faqHeading": "",
    "faq": [
      { "q": "", "a": "" }
    ],
    "ctaHeadline": "",
    "ctaDesc": "",
    "ctaPrimary": "",
    "ctaSecondary": "",
    "formspreeEndpoint": ""
  }
}
```

---

## 6. 出力物

### 6-1. LP直接反映

- `design-brief.json` を更新
- LP コンポーネントが JSON を読み込んで描画（Next.js hot reload）
- `globals.css` のカラー変数も自動更新

### 6-2. design-brief.json ダウンロード

- バージョン管理・別プロジェクトへの流用に使う

### 6-3. Claude Design プロンプト

以下を自動生成してコピーできる状態にする：

```
【デザインシステム定義】
ブランド名: {name}
ブランドトーン: {tones}
カラー — Primary: {primary} / Secondary: {secondary} / Accent: {accent}
...

【使用テンプレート】
{templateName}

【セクション別コピー】
Hero:
  見出し: {heroHeadline}
  サブ: {heroSubheadline}
  CTA: {heroCtaPrimary}

Problems:
  見出し: {problemsHeading}
  ...
```

---

## 7. 技術構成

### 配置

既存の `ai-engineer-lp` Next.js プロジェクト内に追加する。

```
frontend/src/app/
  builder/
    page.tsx                   ← テンプレート選択画面
    [templateId]/
      page.tsx                 ← カスタマイズ画面
      output/
        page.tsx               ← 出力画面
  api/
    design-brief/
      route.ts                 ← JSON 保存 API（GET/POST）
    upload-image/
      route.ts                 ← 画像アップロード API

frontend/src/
  config/
    design-brief.json          ← LP が読み込む設定ファイル
  templates/
    engineer-training.json     ← テンプレート定義
    saas.json
    recruitment.json
    corporate.json
```

### LP コンポーネントの変更

各コンポーネントが `design-brief.json` を読み込む形に変更する。

```
Hero.tsx → brief.copy.heroHeadline を表示
Problems.tsx → brief.copy.problems を表示
Service.tsx → brief.copy.service を表示
Curriculum.tsx → brief.copy.curriculum を表示
FAQ.tsx → brief.copy.faq を表示
Contact.tsx → brief.copy.formspreeEndpoint を使用
globals.css → brief.colors の値で CSS 変数を更新
```

### API

| エンドポイント | メソッド | 役割 |
|---|---|---|
| `/api/design-brief` | GET | 現在の `design-brief.json` を返す |
| `/api/design-brief` | POST | `design-brief.json` を保存 + `globals.css` のカラー変数を更新 |
| `/api/upload-image` | POST | 画像を `public/images/` に保存 |

---

## 8. 実装フェーズ

### Phase 1（最小構成）

- [ ] テンプレート選択画面
- [ ] カスタマイズ画面（よく変える項目のみ）
- [ ] `design-brief.json` 保存 API
- [ ] `engineer-training` テンプレートのデフォルト値定義
- [ ] LP コンポーネントを JSON 読み込みに更新

### Phase 2

- [ ] 詳細設定（全コピー・全画像）
- [ ] 画像アップロード API
- [ ] Claude Design プロンプト自動生成
- [ ] `globals.css` カラー変数の自動更新

### Phase 3

- [ ] テンプレート追加（SaaS / 採用 / コーポレート）
- [ ] テンプレートプレビュー画像
- [ ] `design-brief.json` の読み込み（前回の設定を復元）
