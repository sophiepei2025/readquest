# Direction 1: Neo-Brutalism (The Verge / Gumroad / Arcade)
html_content = """<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ReadQuest - 读书不是打卡，来比一场！</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800;900&family=Space+Grotesk:wght@600;700;900&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #FFFDF0;
      --black: #121212;
      --yellow: #FFE500;
      --purple: #7C3AED;
      --green: #00E599;
      --pink: #FF3366;
      --blue: #2563EB;
      --border: 3px solid var(--black);
      --shadow: 4px 4px 0px var(--black);
      --shadow-lg: 8px 8px 0px var(--black);
      --shadow-sm: 2px 2px 0px var(--black);
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: var(--bg);
      color: var(--black);
      font-family: 'Space Grotesk', -apple-system, sans-serif;
      line-height: 1.4;
      overflow-x: hidden;
      background-image: radial-gradient(var(--black) 1px, transparent 1px);
      background-size: 24px 24px;
    }
    
    /* Top Banner Ticker */
    .ticker-wrap {
      background: var(--black);
      color: var(--yellow);
      padding: 8px 0;
      font-weight: 800;
      font-size: 14px;
      letter-spacing: 1px;
      overflow: hidden;
      white-space: nowrap;
      border-bottom: var(--border);
    }
    .ticker {
      display: inline-block;
      animation: marquee 25s linear infinite;
    }
    @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }

    /* Nav */
    nav {
      max-width: 1280px;
      margin: 16px auto;
      padding: 12px 24px;
      background: #fff;
      border: var(--border);
      box-shadow: var(--shadow);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .logo-box {
      display: flex;
      align-items: center;
      gap: 12px;
      text-decoration: none;
      color: var(--black);
    }
    .logo-badge {
      background: var(--pink);
      color: #fff;
      font-weight: 900;
      padding: 6px 12px;
      border: var(--border);
      box-shadow: var(--shadow-sm);
      font-size: 20px;
      transform: rotate(-3deg);
    }
    .logo-text { font-size: 24px; font-weight: 900; letter-spacing: -0.5px; }
    .nav-links { display: flex; gap: 20px; align-items: center; }
    .nav-link {
      font-weight: 700;
      text-decoration: none;
      color: var(--black);
      padding: 6px 12px;
      border: 2px solid transparent;
      transition: all 0.15s;
    }
    .nav-link:hover { border: var(--border); background: var(--yellow); box-shadow: var(--shadow-sm); }
    .btn-nav {
      background: var(--green);
      border: var(--border);
      box-shadow: var(--shadow-sm);
      padding: 8px 16px;
      font-weight: 800;
      cursor: pointer;
      text-decoration: none;
      color: var(--black);
    }
    .btn-nav:hover { transform: translate(-2px, -2px); box-shadow: var(--shadow); }

    /* Hero */
    .hero-section {
      max-width: 1280px;
      margin: 40px auto;
      padding: 0 24px;
      display: grid;
      grid-template-columns: 1.15fr 0.85fr;
      gap: 36px;
      align-items: center;
    }
    .hero-tag {
      display: inline-block;
      background: var(--yellow);
      border: var(--border);
      box-shadow: var(--shadow-sm);
      padding: 6px 14px;
      font-weight: 900;
      font-size: 14px;
      margin-bottom: 16px;
      transform: rotate(-1deg);
    }
    .hero-title {
      font-size: 58px;
      font-weight: 900;
      line-height: 1.08;
      letter-spacing: -1.5px;
      margin-bottom: 20px;
    }
    .hero-title span.hl-pink { background: var(--pink); color: #fff; padding: 2px 8px; border: 3px solid var(--black); box-shadow: var(--shadow-sm); display: inline-block; }
    .hero-title span.hl-green { background: var(--green); padding: 2px 8px; border: 3px solid var(--black); box-shadow: var(--shadow-sm); display: inline-block; }
    .hero-desc {
      font-size: 18px;
      font-weight: 600;
      color: #333;
      margin-bottom: 28px;
      max-width: 560px;
    }

    /* Kahoot-like PIN Box */
    .pin-card {
      background: #fff;
      border: var(--border);
      box-shadow: var(--shadow-lg);
      padding: 24px;
      margin-bottom: 24px;
      position: relative;
    }
    .pin-label {
      font-size: 14px;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .pin-input-group {
      display: flex;
      gap: 12px;
    }
    .pin-input {
      flex: 1;
      border: var(--border);
      padding: 14px 18px;
      font-size: 22px;
      font-weight: 900;
      font-family: monospace;
      letter-spacing: 4px;
      background: #F4F4F5;
      outline: none;
    }
    .pin-input:focus { background: #fff; border-color: var(--purple); }
    .btn-join {
      background: var(--pink);
      color: #fff;
      border: var(--border);
      box-shadow: var(--shadow);
      padding: 14px 28px;
      font-size: 18px;
      font-weight: 900;
      cursor: pointer;
      transition: all 0.1s;
      white-space: nowrap;
    }
    .btn-join:hover {
      transform: translate(-2px, -2px);
      box-shadow: 6px 6px 0px var(--black);
      background: #ff1a53;
    }
    .btn-join:active {
      transform: translate(2px, 2px);
      box-shadow: 2px 2px 0px var(--black);
    }

    /* Mascot Card */
    .hero-mascot-box {
      background: var(--yellow);
      border: var(--border);
      box-shadow: var(--shadow-lg);
      padding: 28px;
      position: relative;
      overflow: hidden;
    }
    .mascot-badge {
      position: absolute;
      top: 16px;
      right: 16px;
      background: var(--black);
      color: #fff;
      font-weight: 800;
      font-size: 12px;
      padding: 4px 10px;
      border-radius: 4px;
    }
    .mascot-avatar-wrap {
      display: flex;
      justify-content: center;
      margin: 16px 0;
    }
    .streak-alert {
      background: #fff;
      border: var(--border);
      box-shadow: var(--shadow-sm);
      padding: 12px 16px;
      margin-top: 16px;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .streak-flame { font-size: 32px; animation: bounce 1s infinite alternate; }
    @keyframes bounce { from { transform: translateY(0); } to { transform: translateY(-6px); } }

    /* Parent Section */
    .section-parent {
      background: #fff;
      border-top: var(--border);
      border-bottom: var(--border);
      padding: 70px 24px;
      margin-top: 60px;
    }
    .container { max-width: 1280px; margin: 0 auto; }
    .section-head {
      margin-bottom: 40px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      flex-wrap: wrap;
      gap: 20px;
    }
    .section-tag {
      background: var(--blue);
      color: #fff;
      padding: 4px 12px;
      font-weight: 800;
      border: var(--border);
      box-shadow: var(--shadow-sm);
      display: inline-block;
      margin-bottom: 12px;
    }
    .section-title {
      font-size: 40px;
      font-weight: 900;
      letter-spacing: -1px;
      line-height: 1.15;
    }
    .parent-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 36px;
      align-items: center;
    }
    .parent-card {
      background: var(--bg);
      border: var(--border);
      box-shadow: var(--shadow);
      padding: 30px;
    }
    .parent-feature-list {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-top: 24px;
    }
    .parent-feature-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      font-size: 16px;
      font-weight: 700;
    }
    .feature-icon-box {
      background: var(--black);
      color: var(--yellow);
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 900;
      border: 2px solid var(--black);
      flex-shrink: 0;
    }
    .screenshot-frame {
      border: var(--border);
      box-shadow: var(--shadow-lg);
      background: #000;
      overflow: hidden;
    }
    .screenshot-frame img {
      width: 100%;
      height: auto;
      display: block;
    }

    /* Challenge Room & Leaderboard */
    .section-challenge {
      padding: 80px 24px;
    }
    .challenge-grid {
      display: grid;
      grid-template-columns: 0.9fr 1.1fr;
      gap: 40px;
    }
    .podium-box {
      background: #fff;
      border: var(--border);
      box-shadow: var(--shadow-lg);
      padding: 30px;
    }
    .podium-visual {
      display: flex;
      align-items: flex-end;
      justify-content: center;
      gap: 16px;
      margin: 30px 0 20px 0;
      height: 260px;
    }
    .podium-col {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100px;
    }
    .podium-avatar {
      width: 54px;
      height: 54px;
      border: var(--border);
      box-shadow: var(--shadow-sm);
      border-radius: 50%;
      background: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 26px;
      margin-bottom: 8px;
      position: relative;
    }
    .podium-col.first .podium-avatar { width: 68px; height: 68px; font-size: 34px; border-width: 4px; }
    .podium-crown { position: absolute; top: -18px; font-size: 22px; }
    .podium-name { font-weight: 900; font-size: 14px; margin-bottom: 4px; }
    .podium-score { font-weight: 800; font-size: 13px; color: #666; margin-bottom: 6px; }
    .podium-pillar {
      width: 100%;
      border: var(--border);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 900;
      font-size: 32px;
    }
    .podium-col.second .podium-pillar { height: 130px; background: #E2E8F0; color: #475569; }
    .podium-col.first .podium-pillar { height: 180px; background: var(--yellow); color: var(--black); }
    .podium-col.third .podium-pillar { height: 95px; background: #FED7AA; color: #9A3412; }

    .leaderboard-list {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .lb-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 16px;
      background: var(--bg);
      border: 2px solid var(--black);
      box-shadow: var(--shadow-sm);
    }
    .lb-left { display: flex; align-items: center; gap: 12px; }
    .lb-rank { font-weight: 900; width: 28px; font-size: 16px; }
    .lb-user { font-weight: 800; font-size: 15px; }
    .lb-badge-prog {
      background: var(--green);
      border: 2px solid var(--black);
      font-size: 12px;
      font-weight: 900;
      padding: 2px 8px;
    }
    .lb-pts { font-weight: 900; font-size: 16px; }

    /* Books & Pricing */
    .section-books {
      background: var(--black);
      color: #fff;
      padding: 70px 24px;
      border-top: var(--border);
    }
    .book-cards {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
      margin-top: 36px;
    }
    .book-item {
      background: #1E1E24;
      border: 3px solid #fff;
      box-shadow: 6px 6px 0px var(--yellow);
      padding: 16px;
      transition: transform 0.15s;
    }
    .book-item:hover { transform: translate(-3px, -3px); }
    .book-thumb { width: 100%; height: 180px; object-fit: cover; border: 2px solid #fff; margin-bottom: 12px; }
    .book-title { font-size: 18px; font-weight: 900; margin-bottom: 6px; color: var(--yellow); }
    .book-desc { font-size: 13px; color: #ccc; }

    /* Pricing & FAQ */
    .section-faq {
      padding: 70px 24px;
      max-width: 1000px;
      margin: 0 auto;
    }
    .faq-card {
      border: var(--border);
      box-shadow: var(--shadow);
      background: #fff;
      padding: 20px;
      margin-bottom: 16px;
    }
    .faq-q { font-size: 18px; font-weight: 900; margin-bottom: 8px; }
    .faq-a { font-size: 15px; color: #444; font-weight: 600; }
    .disclaimer-box {
      margin-top: 40px;
      padding: 16px 20px;
      background: var(--yellow);
      border: var(--border);
      box-shadow: var(--shadow);
      font-size: 13px;
      font-weight: 800;
      color: var(--black);
    }
    
    footer {
      border-top: var(--border);
      background: #fff;
      padding: 30px 24px;
      text-align: center;
      font-weight: 800;
    }
  </style>
</head>
<body>

  <div class="ticker-wrap">
    <div class="ticker">
      ⚡ 本周全国初中读书挑战赛进行中！当前榜首：Simon (940分) ⚡ 拒绝虚假打卡，用答题证明你真的读懂了！ ⚡ 错题归纳 + 班级PK ⚡ 本周全国初中读书挑战赛进行中！
    </div>
  </div>

  <nav>
    <a href="#" class="logo-box">
      <div class="logo-badge">RQ</div>
      <div class="logo-text">ReadQuest.</div>
    </a>
    <div class="nav-links">
      <a href="#arena" class="nav-link">🎮 挑战大厅</a>
      <a href="#parent" class="nav-link">👨‍👩‍👧 家长学情</a>
      <a href="#ranking" class="nav-link">🏆 本周天梯榜</a>
      <a href="#books" class="nav-link">📚 经典书库</a>
      <a href="/login" class="btn-nav">立即登录</a>
    </div>
  </nav>

  <!-- Hero -->
  <section class="hero-section" id="arena">
    <div class="hero-left">
      <div class="hero-tag">🔥 专为初中生设计的竞技化读书挑战</div>
      <h1 class="hero-title">
        加入一场读书挑战，<br>
        <span class="hl-pink">证明你真的读懂了！</span>
      </h1>
      <p class="hero-desc">
        谁说读完书只能写 800 字应付式读后感？进入专属 Challenge Room，用答题正确率与速度硬碰硬，登顶每周全校领奖台！
      </p>

      <!-- Kahoot style PIN Input -->
      <div class="pin-card">
        <div class="pin-label">
          <span>⚡ 入场仪式 · 输入 6 位挑战房间 PIN 码</span>
        </div>
        <div class="pin-input-group">
          <input type="text" class="pin-input" placeholder="849 203" maxlength="6" value="792401">
          <button class="btn-join" onclick="alert('即将加入房间 [792401]：初二科学概念极速PK！')">🚀 立即入场</button>
        </div>
      </div>

      <div style="display: flex; gap: 16px; align-items: center; font-weight: 800; font-size: 14px;">
        <span>🎯 已有 12,400+ 名初中生参与挑战</span>
        <span>•</span>
        <span>📖 原创精选检测题 3,800+ 题</span>
      </div>
    </div>

    <!-- Mascot & Streak -->
    <div class="hero-mascot-box">
      <div class="mascot-badge">吉祥物 · 书小霸 BOOKY</div>
      <div class="mascot-avatar-wrap">
        <!-- SVG Mascot: Book with glasses and gaming headset -->
        <svg width="220" height="200" viewBox="0 0 220 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <!-- Book Body -->
          <rect x="40" y="30" width="140" height="150" rx="16" fill="#FF3366" stroke="#121212" stroke-width="4"/>
          <!-- Inner Pages -->
          <path d="M50 40H170V170H50V40Z" fill="#FFFDF0" stroke="#121212" stroke-width="3"/>
          <line x1="110" y1="40" x2="110" y2="170" stroke="#121212" stroke-width="3" stroke-dasharray="4 4"/>
          <!-- Glasses -->
          <circle cx="85" cy="95" r="22" fill="#00E599" stroke="#121212" stroke-width="4"/>
          <circle cx="135" cy="95" r="22" fill="#00E599" stroke="#121212" stroke-width="4"/>
          <line x1="107" y1="95" x2="113" y2="95" stroke="#121212" stroke-width="5"/>
          <!-- Eyes inside glasses -->
          <circle cx="88" cy="93" r="7" fill="#121212"/>
          <circle cx="138" cy="93" r="7" fill="#121212"/>
          <circle cx="91" cy="90" r="2.5" fill="#FFF"/>
          <circle cx="141" cy="90" r="2.5" fill="#FFF"/>
          <!-- Smile -->
          <path d="M98 126C105 136 115 136 122 126" stroke="#121212" stroke-width="4" stroke-linecap="round"/>
          <!-- Gaming Headset -->
          <path d="M30 95C30 45 60 18 110 18C160 18 190 45 190 95" stroke="#121212" stroke-width="6" fill="none"/>
          <rect x="22" y="80" width="18" height="36" rx="6" fill="#7C3AED" stroke="#121212" stroke-width="3"/>
          <rect x="180" y="80" width="18" height="36" rx="6" fill="#7C3AED" stroke="#121212" stroke-width="3"/>
          <!-- Feather pen / antenna -->
          <path d="M110 18V5M105 5H115" stroke="#121212" stroke-width="3" stroke-linecap="round"/>
        </svg>
      </div>

      <div class="streak-alert">
        <div class="streak-flame">🔥</div>
        <div>
          <div style="font-weight: 900; font-size: 16px;">连续打卡 5 天！</div>
          <div style="font-size: 13px; font-weight: 700; color: #555;">今天不完成一次单元测验，连胜火焰就要熄灭了哦！</div>
        </div>
      </div>
    </div>
  </section>

  <!-- Parent Value Section -->
  <section class="section-parent" id="parent">
    <div class="container">
      <div class="section-head">
        <div>
          <div class="section-tag">给家长的理性答复</div>
          <h2 class="section-title">
            每本书都配有原创检测题，<br>
            孩子读完不是打卡就算，而是真正证明学会了。
          </h2>
        </div>
        <div style="max-width: 440px; font-weight: 600; color: #555; font-size: 15px;">
          许多孩子看书如走马观花，家长无法检验吸收度。ReadQuest 针对每章节自主研发 7 类核心概念辨析题，自动生成错题本与知识点掌握雷达。
        </div>
      </div>

      <div class="parent-grid">
        <div class="parent-card">
          <h3 style="font-size: 24px; font-weight: 900; margin-bottom: 16px;">📊 数字化精准学情追踪</h3>
          <p style="font-size: 15px; color: #444; font-weight: 600;">
            拒绝含糊的"看了两小时"。孩子答题结束瞬间，错题考点即刻分类归档，直击逻辑漏洞。
          </p>
          <ul class="parent-feature-list">
            <li class="parent-feature-item">
              <div class="feature-icon-box">✓</div>
              <div><b>原创检测题库</b>：每章深度定制，杜绝网上死记硬背搜答案。</div>
            </li>
            <li class="parent-feature-item">
              <div class="feature-icon-box">✓</div>
              <div><b>薄弱考点自动标记</b>：如"受力平衡"、"细胞呼吸与光合作用辨析"。</div>
            </li>
            <li class="parent-feature-item">
              <div class="feature-icon-box">✓</div>
              <div><b>家校协同房间</b>：家长/老师可一键开房，设置本周必读书目并监控完成进度。</div>
            </li>
          </ul>
        </div>
        <div class="screenshot-frame">
          <img src="assets/mvp_home_tab_parent.png" alt="家长学情看板真实截图">
        </div>
      </div>
    </div>
  </section>

  <!-- Challenge Room & Leaderboard -->
  <section class="section-challenge" id="ranking">
    <div class="container">
      <div class="section-head">
        <div>
          <div class="hero-tag" style="background: var(--green);">每周日24:00 重置积分</div>
          <h2 class="section-title">
            Challenge Room 班级竞技房<br>
            登顶本周领奖台！
          </h2>
        </div>
        <div style="max-width: 460px; font-weight: 700; color: #444;">
          <b>全新 MVP 积分规则：</b><br>
          <code>本周积分 = Σ(每次测验正确率 × 题量权重)</code><br>
          既奖励多做，更奖励做对！周周有翻盘机会，杜绝排名靠后丧失斗志。
        </div>
      </div>

      <div class="challenge-grid">
        <!-- Podium -->
        <div class="podium-box">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: var(--border); padding-bottom: 12px;">
            <div style="font-weight: 900; font-size: 18px;">🏆 本周总榜前三甲</div>
            <div style="font-size: 12px; font-weight: 800; background: var(--pink); color: #fff; padding: 2px 8px; border: 2px solid var(--black);">实时更新</div>
          </div>

          <div class="podium-visual">
            <!-- 2nd -->
            <div class="podium-col second">
              <div class="podium-avatar">🥈</div>
              <div class="podium-name">Alex.K</div>
              <div class="podium-score">880 pts</div>
              <div class="podium-pillar">2</div>
            </div>
            <!-- 1st -->
            <div class="podium-col first">
              <div class="podium-avatar">
                <span class="podium-crown">👑</span>
                🥇
              </div>
              <div class="podium-name">Simon.Z</div>
              <div class="podium-score">940 pts</div>
              <div class="podium-pillar">1</div>
            </div>
            <!-- 3rd -->
            <div class="podium-col third">
              <div class="podium-avatar">🥉</div>
              <div class="podium-name">Emily.L</div>
              <div class="podium-score">810 pts</div>
              <div class="podium-pillar">3</div>
            </div>
          </div>

          <div style="text-align: center; font-size: 13px; font-weight: 800; color: #666;">
            🥇 前 3 名获得赛季黄金徽章 + 虚拟自习室自选皮肤
          </div>
        </div>

        <!-- Dynamic Feedback List -->
        <div style="background: #fff; border: var(--border); box-shadow: var(--shadow-lg); padding: 24px;">
          <div style="font-weight: 900; font-size: 18px; margin-bottom: 16px; display: flex; justify-content: space-between;">
            <span>全班成员动态 (第 4~10 名)</span>
            <span style="font-size: 13px; color: var(--purple); cursor: pointer;">查看完整天梯 →</span>
          </div>

          <ul class="leaderboard-list">
            <li class="lb-row">
              <div class="lb-left">
                <span class="lb-rank">04</span>
                <span class="lb-user">Leo Huang</span>
                <span class="lb-badge-prog">较上周 +140 分</span>
              </div>
              <span class="lb-pts">760 pts</span>
            </li>
            <li class="lb-row" style="background: #FFF0F5;">
              <div class="lb-left">
                <span class="lb-rank">05</span>
                <span class="lb-user">Jessica M.</span>
                <span class="lb-badge-prog" style="background: var(--yellow);">🔥 本周进步之星</span>
              </div>
              <span class="lb-pts">710 pts</span>
            </li>
            <li class="lb-row">
              <div class="lb-left">
                <span class="lb-rank">06</span>
                <span class="lb-user">David Chen</span>
                <span class="lb-badge-prog">较上周 +80 分</span>
              </div>
              <span class="lb-pts">690 pts</span>
            </li>
            <li class="lb-row">
              <div class="lb-left">
                <span class="lb-rank">07</span>
                <span class="lb-user">Sophie Taylor</span>
                <span class="lb-badge-prog">较上周 +45 分</span>
              </div>
              <span class="lb-pts">650 pts</span>
            </li>
            <li class="lb-row">
              <div class="lb-left">
                <span class="lb-rank">15</span>
                <span class="lb-user">Lucas (你当前的排位)</span>
                <span class="lb-badge-prog" style="background: var(--pink); color: #fff;">较上周 +120 分 🚀</span>
              </div>
              <span class="lb-pts">480 pts</span>
            </li>
          </ul>

          <div style="margin-top: 20px; font-size: 13px; font-weight: 700; color: #555; background: var(--bg); padding: 10px; border: 2px dashed var(--black);">
            💡 <b>Duolingo 励志反馈机制</b>：即便排在第 15 名，你也能自豪看到自己本周狂涨 120 分！每一分努力都被所有人见证。
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Books Section -->
  <section class="section-books" id="books">
    <div class="container">
      <div class="section-tag" style="background: var(--pink);">学科+通识精选题库</div>
      <h2 style="font-size: 38px; font-weight: 900; margin-bottom: 12px;">覆盖全球初中生都在读的经典书目</h2>
      <p style="color: #bbb; max-width: 600px; font-size: 16px;">
        从美国初中生人手一本的“大胖本”(Big Fat Notebook)系列到经典文学名著，每本书配齐概念题库。
      </p>

      <div class="book-cards">
        <div class="book-item">
          <img src="assets/multibook_science.png" class="book-thumb" alt="Science">
          <div class="book-title">📗 Science 科学综合</div>
          <div class="book-desc">涵盖物理、化学、地球科学、生物 49 个单元全套测验题。</div>
        </div>
        <div class="book-item">
          <img src="assets/multibook_biology.png" class="book-thumb" alt="Biology">
          <div class="book-title">🧬 Biology 生物学</div>
          <div class="book-desc">细胞结构、遗传规律与人体系统，图解综合探究题。</div>
        </div>
        <div class="book-item">
          <img src="assets/multibook_chemistry.png" class="book-thumb" alt="Chemistry">
          <div class="book-title">🧪 Chemistry 化学</div>
          <div class="book-desc">原子周期律、化学方程式配平与摩尔计算基础。</div>
        </div>
        <div class="book-item">
          <img src="assets/multibook_math.png" class="book-thumb" alt="Math">
          <div class="book-title">📐 Math 初中数学</div>
          <div class="book-desc">有理数、几何比例与一次方程组的变式挑战。</div>
        </div>
      </div>
    </div>
  </section>

  <!-- FAQ & Disclaimer -->
  <section class="section-faq">
    <h2 style="font-size: 34px; font-weight: 900; margin-bottom: 24px; text-align: center;">常见问题与版权声明</h2>
    
    <div class="faq-card">
      <div class="faq-q">Q: ReadQuest 的题目是怎么出的？可以用来直接抄作业吗？</div>
      <div class="faq-a">A: 绝对不能。所有题目均为教研团队基于原书核心知识点独立原创的概念辨析与思维题，旨在检测学生是否具备迁移运用能力，网上无现成答案。</div>
    </div>

    <div class="faq-card">
      <div class="faq-q">Q: 家长如何知道孩子是真的在看书还是乱猜选项？</div>
      <div class="faq-a">A: 我们的评分规则是“正确率 × 题量权重”，乱猜会导致单题得分归零。同时家长看板会清晰展示单题答题耗时与错题诊断报告。</div>
    </div>

    <div class="disclaimer-box">
      ⚖️ <b>版权与法律免责声明：</b> ReadQuest 平台所涉及的全部配套检测题均为独立教研团队原创编写，仅用于辅助学生阅读理解与自测学习，与原书出版机构、作者及相关版权方无任何附属或商业合作关系。
    </div>
  </section>

  <footer>
    <p>© 2026 ReadQuest (ReadQuiz). 为激发下一代青少年的真实求知欲而生。</p>
  </footer>

</body>
</html>
"""

with open("readquest/design-demos/direction-1-roulette-neobrutalism.html", "w", encoding="utf-8") as f:
    f.write(html_content)
print("Direction 1 built.")
