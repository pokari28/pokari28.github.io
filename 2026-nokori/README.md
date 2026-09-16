# 2026年 残り金額

見込み・受注・不足額をその場で入力できる簡易Webアプリです。

## 公開URL

https://pokari28.github.io/2026-nokori/

## 使い方（iPhone / iPad）

1. Safari で上記URLを開く
2. 共有ボタン → **ホーム画面に追加**
3. アプリのように起動できる

## クラウド同期（Supabase）

1. https://supabase.com でプロジェクトを作る
2. SQL Editor で `supabase.sql` を実行する
3. Project Settings → API から Project URL と anon key をコピー
4. アプリ右上の「クラウド」に貼って「接続して同期」

anon / publishable key だけ使います。service_role は入れないでください。
URLを知っている人はデータを見られる設定です。社外には共有しないでください。
