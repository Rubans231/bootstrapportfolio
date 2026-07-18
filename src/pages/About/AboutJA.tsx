import { Link } from "react-router-dom";
import QuoteRotator from "../../components/QuoteRotator";
import pcSetup from "../../assets/PC_setup.jpg";

export default function AboutJA() {
  return (
    <>
      <header className="about-hero">
        <p className="about-eyebrow jp">自己紹介</p>
        <h1 className="jp">ナランダー・ルーバンス</h1>
        <p className="about-role jp">
          MLエンジニア・ターミナル愛好家・日本を目指して
        </p>
        <p className="about-lede jp">
          LLMをいじり回す一方で、漢字学習には正直かなり手を焼いています。それが今の自分を一番正確に表す一言です。以下、その詳しい話です。
        </p>
        <QuoteRotator />
      </header>

      <div className="about-section">
        <h2 className="jp">働き方</h2>
        <p className="jp">
          ダッシュボードより、ログファイルを信じるタイプです。普段使っているツールの多く——Rofi・mpv・yt-dlpを組み合わせたメディアクライアントや、FLAC音源と歌詞動画をフレーム単位で同期させるMPD↔MPVデーモンなど——は、既存のツールでは物足りず自分で作りました。手間はかかりましたが、そのデバッグ自体が楽しかったです。何かを作るときはいつも「なぜ動くのか」を理解したい性分で、Arch LinuxとHyprlandを使っているのも、美意識というよりその性分の表れだと思います。
        </p>
      </div>

      <div className="about-section">
        <h2 className="jp">GenAIとの付き合い方</h2>
        <p className="jp">
          画像・動画生成のパイプラインは2020年——Stable Diffusion 1.5の時代——から触っています。AUTOMATIC1111からComfyUIへ、EBSynth世代のスタイル転送からネイティブな時空間拡散モデルへ、そしてコンシューマー向けGPUに収まるLoRA学習まで、この分野の変遷をほぼ一通り経験してきました。論文を読んだというより、実際に手を動かしてパイプラインを機能させてきた時間の方が長いです。Virtual Try-Onや動画系のプロジェクトも、この延長線上にあります——詳しくは
          <Link to="/projects">プロジェクトページ</Link>
          をご覧ください。
        </p>
      </div>

      <div className="about-section">
        <h2 className="jp">日本へ向けて</h2>
        <p className="jp">
          日本で働くことは、口先だけの目標ではありません。JLPT N2を受験し、現在結果を待っているところです(2026年8〜9月頃発表予定)。正直に言うと、今は「N2取得に向けて勉強中」であり、結果が出るまでは「N2取得済み」とは言えません。これは急に始めたことでもなく、私のノートvaultには日本語学習用のノートが16本、機械学習やシステム系のノートと並んで存在しています。言葉だけでなく、実際に
          <Link to="/?focus=japanese">ナレッジベースのグラフ</Link>
          で確認していただけます。
        </p>
      </div>

      <div className="about-section">
        <h2 className="jp">オフの時間</h2>
        <dl className="offclock-grid">
          <div>
            <dt className="jp">よく聴く音楽</dt>
            <dd>Ado、ヨルシカ、Tuki. — 主にJ-POP</dd>
          </div>
          <div>
            <dt className="jp">最近のプレイ中</dt>
            <dd>Clair Obscur: Expedition 33</dd>
          </div>
          <div>
            <dt className="jp">積みゲー</dt>
            <dd>DMC、Detroit: Become Human、The Walking Dead (Telltale)</dd>
          </div>
        </dl>
        <p className="offclock-note jp">
          物語重視で雰囲気を大切にするゲームが好みです。デスクトップを端末フォントまで作り込む性分と、たぶん同じところから来ています。
        </p>
      </div>

      <div className="about-section">
        <h2 className="jp">デスク環境</h2>
        <figure className="about-photo">
          <img src={pcSetup} alt="このサイトを作った実際のデスクとマシン" />
          <figcaption className="jp">このサイトを作ったマシン</figcaption>
        </figure>
      </div>

      <div className="about-section about-contact">
        <h2 className="jp">連絡先</h2>
        <ul>
          <li>
            <a href="mailto:naranderrubans@gmail.com">naranderrubans@gmail.com</a>
          </li>
          <li>
            <a href="https://github.com/Rubans231" target="_blank" rel="noreferrer">
              github.com/Rubans231
            </a>
          </li>
          <li>
            <a href="https://linkedin.com/in/narander-rubans" target="_blank" rel="noreferrer">
              linkedin.com/in/narander-rubans
            </a>
          </li>
          <li>
            <a href="/resume/Narander-Rubans-Resume.pdf" target="_blank" rel="noreferrer">
              履歴書 (PDF)
            </a>
          </li>
        </ul>
      </div>
    </>
  );
}
