import type { SceneCharacter } from "./types";

export type RouteEnding = "ending-1" | "ending-2" | "ending-2-branch" | "ending-3";

export interface EndingRouteLine {
  speaker?: string;
  text: string;
  characters?: SceneCharacter[];
}

export interface EndingRouteChoice {
  label: string;
  lines: EndingRouteLine[];
}

export interface EndingRouteScene {
  id: string;
  lines: EndingRouteLine[];
  choices?: EndingRouteChoice[];
}

export interface EndingRoute {
  albumEnding: string;
  background: "bookstore" | "cafe";
  title: string;
  characters: SceneCharacter[];
  scenes: EndingRouteScene[];
  endingText: string;
  hint: string;
}

type Expression = SceneCharacter["expression"];

const hsinwen = (
  position: "left" | "center",
  expression: Expression = "neutral",
  active = true,
  dressed = false,
): SceneCharacter => ({
  id: dressed ? "friend" : "friend-casual",
  name: "黃欣雯",
  position,
  expression,
  active,
});

const enchi = (expression: Expression = "neutral", active = true): SceneCharacter => ({
  id: "him",
  name: "白恩棋",
  position: "right",
  expression,
  active,
});

const tianhe = (expression: Expression = "neutral", active = true): SceneCharacter => ({
  id: "protagonist",
  name: "藍天和",
  position: "center",
  expression,
  active,
});

const c1 = (expression: Expression = "neutral") => [hsinwen("center", expression)];
const c2 = (
  activeName: "黃欣雯" | "白恩棋",
  hsinwenExpression: Expression = "neutral",
  enchiExpression: Expression = "neutral",
) => [
  hsinwen("left", hsinwenExpression, activeName === "黃欣雯"),
  enchi(enchiExpression, activeName === "白恩棋"),
];
const c3 = (
  activeName: "黃欣雯" | "白恩棋" | "藍天和",
  hsinwenExpression: Expression = "neutral",
  tianheExpression: Expression = "neutral",
  enchiExpression: Expression = "neutral",
) => [
  hsinwen("left", hsinwenExpression, activeName === "黃欣雯", true),
  tianhe(tianheExpression, activeName === "藍天和"),
  enchi(enchiExpression, activeName === "白恩棋"),
];

const ending1: EndingRoute = {
  albumEnding: "ending-1",
  background: "bookstore",
  title: "糖紙裡的初戀",
  characters: c1(),
  scenes: [
    {
      id: "opening",
      lines: [
        { text: "書店裡很安靜。", characters: [] },
        { text: "我在靠窗的位置坐下。心臟微微悸動，等著那許久不見的她。" },
        { text: "那一瞬間，我像是忽然回到小學教室。眼前的女孩轉過頭，那笑容依然明亮。" },
        { speaker: "黃欣雯", text: "你來了。", characters: c1("neutral") },
        { speaker: "主角", text: "欣雯。" },
        { speaker: "黃欣雯", text: "嗯，好久不見了。我還在想，你會不會認不出我。", characters: c1("neutral") },
        { speaker: "主角", text: "妳很好認。眼睛、長髮，還有……妳喜歡穿黃色的洋裝。" },
        { speaker: "黃欣雯", text: "你還記得呀。", characters: c1("soft") },
        { text: "她笑了。那個笑容讓書店裡的燈變得更暖，像很多年前，她坐在我前面，回頭看我的那一瞬間。" },
      ],
      choices: [
        {
          label: "我也記得妳以前常常請我吃糖。",
          lines: [
            { speaker: "主角", text: "我也記得妳以前常常請我吃糖。我到現在，還很喜歡牛奶糖呢。" },
            { speaker: "黃欣雯", text: "真的嗎？早知道我應該帶來的，呵呵。", characters: c1("sad") },
            { text: "她的臉頰變得紅潤。過往的記憶，像糖果般甜得在胸口中擴散。" },
          ],
        },
        {
          label: "因為我以前很喜歡妳呀。",
          lines: [
            { speaker: "主角", text: "因為我以前很喜歡妳呀。" },
            { speaker: "黃欣雯", text: "……我知道。", characters: c1("sad") },
            { speaker: "主角", text: "真的？" },
            { speaker: "黃欣雯", text: "嗯。你以前常常偷坐我的座位。", characters: c1("sad") },
            { speaker: "主角", text: "有那麼明顯嗎？" },
            { speaker: "黃欣雯", text: "很明顯。可是那時候，我也還小，只覺得你蠻有趣的。", characters: c1("neutral") },
            { speaker: "主角", text: "那現在呢？聽到這個，有什麼感覺？" },
            { text: "也許已經沒有了當年的感受，但在說出口的瞬間，我感受到了一種酸澀的滿足。她低頭看著桌上隨手摺的黃色紙兔子。" },
            { speaker: "黃欣雯", text: "現在……現在我覺得，能再見到你很好。", characters: c1("surprised") },
          ],
        },
      ],
    },
    {
      id: "ahan",
      lines: [
        { text: "我們稍微聊了一些彼此的近況，將我們錯過的時光補完。" },
        { speaker: "黃欣雯", text: "說起來，你以前和阿漢常常一起玩。", characters: c1("neutral") },
        { speaker: "主角", text: "對啊，我有印象。" },
        { speaker: "黃欣雯", text: "他成績很好，老師常常叫他回答問題。你和他成為好朋友後，功課突然進步了很多，你們還一起參加比賽得了獎。", characters: c1("soft") },
        { speaker: "主角", text: "是啊……當時真的受到了他很多幫助。" },
        { speaker: "黃欣雯", text: "我以前……真的有點，崇拜他呢。", characters: c1("sad") },
        { speaker: "主角", text: "明明就是暗戀……我還記得妳的國語課本裡的小秘密。" },
        { speaker: "黃欣雯", text: "呵呵……被發現了呢。誰叫你每次都偷坐我的座位，真是太壞了！", characters: c1("soft") },
        { text: "黃欣雯笑著低下頭，壓了壓桌上紙兔子的耳朵。" },
      ],
      choices: [
        {
          label: "我還記得替他辦生日派對的那次……",
          lines: [
            { speaker: "主角", text: "我還記得替他辦生日派對的那次……" },
            { speaker: "黃欣雯", text: "我也記得，他甚至感動到哭了呢。他自從和你變成朋友後，變得開朗許多。", characters: c1("soft") },
            { speaker: "主角", text: "我記得我們吃完蛋糕後，還到他家後院去看附近活動的煙火。" },
            { speaker: "黃欣雯", text: "嗯。我記得，除了我們三個，還有一位同學也有來。", characters: c1("neutral") },
            { speaker: "主角", text: "誰？" },
            { speaker: "黃欣雯", text: "綽號是小白兔的那位。", characters: c1("soft") },
            { text: "我努力在記憶中搜尋這位同學的名字，但還是想不起來。" },
          ],
        },
        {
          label: "妳有他的消息嗎？",
          lines: [
            { speaker: "主角", text: "妳有他的消息嗎？" },
            { speaker: "黃欣雯", text: "自從他回到美國後，就沒有人有他的消息了。上次同學會，甚至也沒什麼人記得他了。", characters: c1("neutral") },
            { speaker: "主角", text: "畢竟已經這麼多年了……那個時候，資訊也還沒有像現在一樣流通。" },
            { speaker: "黃欣雯", text: "對啊。不過，我記得我們有同學也去了美國發展，說不定能打聽到一點消息。", characters: c1("neutral") },
            { speaker: "主角", text: "對了，我記得有一本繪本，裡面的謎題風格跟阿漢以前和我們玩的有點像。" },
            { speaker: "黃欣雯", text: "嗯！我知道你說的，是《魔法拍檔》對吧？其實我也買了……", characters: c1("sad") },
            { speaker: "主角", text: "雖然覺得不太可能，但要是這本繪本真的是阿漢畫的就好了。我有很多話想跟他說。" },
            { text: "說到這，欣雯的雙眼閃著光芒。" },
            { speaker: "黃欣雯", text: "我也想找到他。如果可以，我們一起解開這個繪本的謎題吧！", characters: c1("surprised") },
          ],
        },
      ],
    },
    {
      id: "ending",
      lines: [
        { text: "我和欣雯有了一場溫馨愉快的約會。時間過得很快，又到了不得不說再見的時刻。" },
        { speaker: "黃欣雯", text: "今天能這樣聊天，我很開心。", characters: c1("sad") },
        { speaker: "主角", text: "我也是。" },
        { speaker: "黃欣雯", text: "下次再約吧？也許，我們會找到更多同學一起開派對。", characters: c1("sad") },
        { speaker: "主角", text: "好啊！我很期待那天！" },
        { speaker: "黃欣雯", text: "我們約好了喔！下次見，老朋友！", characters: c1("surprised") },
        { text: "她的眼神很溫柔，看起來像在懷念著什麼。" },
        { speaker: "主角", text: "約好了！下次見！" },
        { text: "她走了，雖然不確定下次見面的日期，但我仍然期待著這份終於恢復的聯繫。", characters: [] },
      ],
    },
  ],
  endingText: "我找回了坐在我前面的女孩。她記得牛奶糖，也記得我還沒學會好好說喜歡的年紀。",
  hint: "日記本裡的照片亮起第一個位置。還有一些聲音，仍藏在沒有翻開的地方。",
};

const ending2: EndingRoute = {
  albumEnding: "ending-2",
  background: "bookstore",
  title: "記憶的顏色",
  characters: c2("黃欣雯"),
  scenes: [
    {
      id: "opening",
      lines: [
        { text: "書店裡很安靜。", characters: [] },
        { text: "我在靠窗的位置坐下。心臟微微悸動，等著那許久不見的老友們。" },
        { text: "那一瞬間，我像是忽然回到小學教室。眼前的女孩轉過頭，那笑容依然明亮，而她身旁站著一個很高、很會笑的人。" },
        { speaker: "白恩棋", text: "你真的來了。我還以為你看到我會認不出來。", characters: c2("白恩棋") },
        { speaker: "主角", text: "白恩棋？" },
        { speaker: "白恩棋", text: "答對。本人現在比小時候高很多，值得掌聲鼓勵。", characters: c2("白恩棋") },
        { speaker: "黃欣雯", text: "他現在在美國當美髮師。", characters: c2("黃欣雯") },
        { speaker: "白恩棋", text: "每天都在用剪刀拯救世界，還有用染髮劑施展魔法。", characters: c2("白恩棋") },
        { speaker: "主角", text: "你以前好像很安靜。" },
        { speaker: "白恩棋", text: "很安靜，很矮，很愛畫畫，衣服還很鮮豔。簡單來說，很容易被記住，也很容易被笑。但現在完全不一樣了！", characters: c2("白恩棋", "neutral", "surprised") },
        { text: "他說得輕快，像是把回憶快轉。" },
      ],
      choices: [
        {
          label: "你現在也變太高了吧！",
          lines: [
            { speaker: "主角", text: "你現在也變太高了吧！" },
            { speaker: "白恩棋", text: "謝謝，我小時候欠下的身高，長大一次討回來。", characters: c2("白恩棋", "neutral", "soft") },
            { speaker: "黃欣雯", text: "你以前排隊都站第一個。", characters: c2("黃欣雯", "soft", "soft") },
            { speaker: "白恩棋", text: "而且還常常被擋住。現在換我擋別人視線。", characters: c2("白恩棋", "soft", "sad") },
            { speaker: "主角", text: "你講話也變很多。" },
            { speaker: "白恩棋", text: "以前太小聲，現在補回來。你呢？以前像小隊長一樣高調，現在怎麼變這麼謹慎？", characters: c2("白恩棋", "soft", "surprised") },
          ],
        },
        {
          label: "你現在看起來像會幫明星剪頭髮的人。",
          lines: [
            { speaker: "主角", text: "你現在看起來像會幫明星剪頭髮的人。" },
            { speaker: "白恩棋", text: "謝謝，我決定把這句話寫進履歷。", characters: c2("白恩棋", "neutral", "soft") },
            { speaker: "黃欣雯", text: "他真的很會剪，我看過照片。", characters: c2("黃欣雯", "neutral", "soft") },
            { speaker: "白恩棋", text: "連欣雯老師都這麼說了，是不是要來光顧一下我的店？", characters: c2("白恩棋", "neutral", "surprised") },
            { speaker: "主角", text: "那你以前就對頭髮有興趣嗎？" },
            { speaker: "白恩棋", text: "以前是對顏色有興趣，彩色鉛筆、色紙、公仔、衣服。後來發現頭髮也可以很有特色。", characters: c2("白恩棋", "neutral", "soft") },
            { speaker: "黃欣雯", text: "恩棋以前很會畫畫。一到美勞課，他整個人就特別有精神。", characters: c2("黃欣雯", "neutral", "soft") },
            { speaker: "白恩棋", text: "結果那時候大家只覺得我衣服太亮。", characters: c2("白恩棋", "neutral", "sad") },
          ],
        },
      ],
    },
    {
      id: "ahan-and-ending",
      lines: [
        { speaker: "白恩棋", text: "對了，你還記得阿漢嗎？", characters: c2("白恩棋") },
        { speaker: "主角", text: "阿漢……" },
        { speaker: "黃欣雯", text: "以前很常跟你在一起的那個。", characters: c2("黃欣雯") },
        { speaker: "白恩棋", text: "跑一下就滿頭汗，可是每次打籃球都還是會來。我記得他那時候常常帶手帕。", characters: c2("白恩棋") },
        { speaker: "黃欣雯", text: "他功課很好，字也寫得漂亮。", characters: c2("黃欣雯", "sad", "neutral") },
        { speaker: "白恩棋", text: "對，而且他家好像有很多書。那次生日，我們不是去過他家嗎？", characters: c2("白恩棋") },
        { speaker: "主角", text: "生日？" },
        { speaker: "黃欣雯", text: "嗯。我、你、恩棋，還有阿漢，我們一起去他家。", characters: c2("黃欣雯") },
        { speaker: "白恩棋", text: "我記得那天有蛋糕。我們用很漂亮的茶杯喝紅茶。", characters: c2("白恩棋") },
        { text: "茶杯。這個詞像一枚小石子，落進心裡某個很深的地方。水面晃了一下，卻還沒有完全映出形狀。" },
        { speaker: "白恩棋", text: "說到阿漢……他不是在當年回到美國了嗎？然後就這樣跟大家失聯了……", characters: c2("白恩棋", "neutral", "sad") },
        { speaker: "白恩棋", text: "我現在也在美國定居，搞不好會在街頭的某處見到他。", characters: c2("白恩棋", "neutral", "soft") },
        { speaker: "黃欣雯", text: "如果有他的消息，一定要告訴我們。好希望我們能再一起聚聚！", characters: c2("黃欣雯", "soft", "soft") },
        { speaker: "主角", text: "同意！到時我們幾個一定要再揪一團！畢竟我們可是彩虹戰隊啊！" },
        { speaker: "白恩棋", text: "哈哈！沒錯沒錯！", characters: c2("白恩棋", "soft", "surprised") },
        { speaker: "黃欣雯", text: "哈哈！你居然還記得這個！", characters: c2("黃欣雯", "soft", "surprised") },
        { text: "我們沒有把所有事情都說完，可三個人的笑聲已經充滿了這趟相聚的旅程。時間過得很快，又到了分離的時刻。" },
        { speaker: "白恩棋", text: "老朋友……真的很高興能再見到你！別忘了我，好嗎？", characters: c2("白恩棋") },
        { speaker: "黃欣雯", text: "我們大家下次再約，好嗎？我們現在要不要來拍張照呢？", characters: c2("黃欣雯", "surprised", "neutral") },
        { text: "我們三人擠在一起，在相片中留下了影像。" },
        { speaker: "主角", text: "今天真的很開心！也許下次還會想起更多有趣的回憶。下次見……欣雯、恩棋，保重身體！" },
        { text: "我們告別了彼此，在笑聲與溫馨之中。這次的相聚很熱鬧，卻總覺得……少了什麼。", characters: [] },
      ],
    },
  ],
  endingText: "我找回了兩位老同學，也找回了一些下課後的聲音。舊照片還有幾處模糊，但已能感覺到暖意。",
  hint: "三個人的座位有了輪廓。黃色紙兔子和白色紙兔子靠在一起。",
};

const ending2WithoutAhan: EndingRoute = {
  ...ending2,
  scenes: [
    ending2.scenes[0],
    {
      id: "three-person-ending",
      lines: [
        { text: "我們聊起彼此離開小學後的生活，也慢慢把那些空白的年份補了回來。" },
        { speaker: "黃欣雯", text: "我現在回到小學當代課老師。有時候看著班上的孩子，會突然想起我們以前的樣子。", characters: c2("黃欣雯", "soft", "neutral") },
        { speaker: "主角", text: "妳以前就很會照顧人。現在一定很受學生歡迎。" },
        { speaker: "黃欣雯", text: "希望是這樣。至少他們看到我摺紙兔子時，都還滿開心的。", characters: c2("黃欣雯", "surprised", "neutral") },
        { speaker: "白恩棋", text: "至於我，還是在美國用剪刀和彩色染劑努力生活。偶爾也會幫客人做很大膽的造型。", characters: c2("白恩棋", "soft", "surprised") },
        { speaker: "主角", text: "聽起來很像你。小時候最喜歡顏色的人，長大後還是在和顏色一起工作。" },
        { speaker: "白恩棋", text: "對吧？有些事情長大以後，反而變得更像自己了。", characters: c2("白恩棋", "soft", "soft") },
        { text: "我們談起以前的座位、鮮豔的衣服，也談起那些下課後一起走過的走廊。三個人的笑聲，讓記憶裡的教室又有了聲音。" },
        { speaker: "白恩棋", text: "老朋友……真的很高興能再見到你！別忘了我，好嗎？", characters: c2("白恩棋", "soft", "neutral") },
        { speaker: "黃欣雯", text: "我們大家下次再約，好嗎？現在先來拍張照片吧。", characters: c2("黃欣雯", "surprised", "neutral") },
        { text: "我們三人擠在一起，在相片中留下了影像。" },
        { speaker: "主角", text: "今天真的很開心。下次見，欣雯、恩棋。你們都要保重！" },
        { text: "我們告別了彼此。這一次，我清楚記住了照片裡的三個人。", characters: [] },
      ],
    },
  ],
  hint: "三個人的座位有了輪廓。這一次，照片裡沒有誰被叫錯名字。",
};

const ending3: EndingRoute = {
  albumEnding: "ending-3",
  background: "cafe",
  title: "喊出你的名字",
  characters: c3("藍天和"),
  scenes: [
    {
      id: "full-reunion",
      lines: [
        { text: "咖啡店的門鈴響起時，我握緊了手中的繪本。", characters: [] },
        { text: "黃欣雯坐在我對面，白恩棋坐在旁邊。桌上還有一本把我帶到這裡的謎題繪本。", characters: [hsinwen("left", "neutral", true, true), enchi()] },
        { text: "門被推開。他站在夜色和燈光之間。" },
        { speaker: "藍天和", text: "好久不見。", characters: c3("藍天和", "neutral", "soft", "neutral") },
        { speaker: "主角", text: "阿和……" },
        { text: "我終於叫出他的名字。他的名字與記憶不再模糊。" },
        { speaker: "白恩棋", text: "好，我們四個人終於全員到齊！", characters: c3("白恩棋", "neutral", "soft", "surprised") },
        { speaker: "藍天和", text: "抱歉我來晚了。我飛機改時間，差點趕不上。", characters: c3("藍天和") },
        { speaker: "主角", text: "你真的從美國回來？" },
        { speaker: "藍天和", text: "嗯，多虧了恩棋的安排。也感激你真的讀到了我的繪本……", characters: c3("藍天和") },
        { speaker: "白恩棋", text: "阿和現在可是我理髮店裡的常客！", characters: c3("白恩棋", "neutral", "neutral", "soft") },
        { text: "他看向桌上的謎題繪本。那些筆記全是我為了找他而留下的足跡。" },
        { speaker: "主角", text: "能再見到你，真是太好了。" },
        { speaker: "藍天和", text: "是呀。簡直像奇蹟一樣……這個世界這麼大，我們四個卻全都能在這裡相聚。", characters: c3("藍天和", "neutral", "sad", "soft") },
        { text: "我的眼眶感到溫熱。" },
        { speaker: "主角", text: "阿和……原來這些年你都沒有忘記我嗎？" },
        { speaker: "藍天和", text: "嗯。雖然我在台灣只待了短短的幾年，但我真的有了最棒的童年。多虧了你們……", characters: c3("藍天和", "neutral", "sad", "neutral") },
        { speaker: "白恩棋", text: "真是的！說什麼肉麻的話呢！", characters: c3("白恩棋", "neutral", "sad", "soft") },
        { speaker: "黃欣雯", text: "阿和……真的很久不見了！感覺你變得很成熟沉穩了呢！", characters: c3("黃欣雯", "sad", "sad", "soft") },
        { text: "我們更新了彼此的近況，得知阿和快要取得醫師執照了，但仍然沒有放棄繪本創作。我再次為打破茶杯的事道歉，並送他一個新的杯子，他微笑著接受了。" },
        { text: "聊著聊著，阿和突然認真地看著我。" },
        { speaker: "藍天和", text: "我最好的朋友……你願不願意，和我一起創作呢？", characters: c3("藍天和") },
        { speaker: "主角", text: "嗯？我嗎？" },
        { speaker: "藍天和", text: "關於我們的友誼、我們的故事，正要有新的篇章，對吧？你願意和我一起記錄下這一切嗎？", characters: c3("藍天和", "neutral", "surprised", "neutral") },
        { speaker: "藍天和", text: "如果你願意跟我一起，把它用圖像、色彩、故事、謎題記錄下來……瑞德與布魯成長後的故事，就會真正地展現在眾人眼前。", characters: c3("藍天和", "neutral", "surprised", "neutral") },
        { speaker: "主角", text: "當然！你給我的這趟旅程，我已經牢記在心了！" },
        { speaker: "白恩棋", text: "如果要畫畫，也要算上我吧！", characters: c3("白恩棋", "neutral", "soft", "sad") },
        { speaker: "黃欣雯", text: "如果可以，我也希望能用我的記憶力，幫忙讓故事更還原！", characters: c3("黃欣雯", "surprised", "soft", "sad") },
        { speaker: "主角", text: "好啊！那我們四個一起合作！" },
        { speaker: "藍天和", text: "能有你們這些好朋友，我真的……很幸福！", characters: c3("藍天和", "surprised", "sad", "soft") },
        { text: "阿和從包包裡拿出一個小音樂盒，上面有一個小小的投影設備。" },
        { speaker: "藍天和", text: "這個音樂盒叫做 Dreaming Box，裡面放了我們以前的照片。我們就一邊回顧，一邊發想下一部屬於我們四人的繪本，要有什麼樣的內容與謎題吧。", characters: c3("藍天和", "surprised", "soft", "soft") },
        { text: "片尾影片、工作人員名單與片尾曲將在後續版本補上。" },
      ],
    },
  ],
  endingText: "我終於不只記得綽號，也記得你真正的名字。那張空了很多年的座位，終於有人回來了。",
  hint: "四個人的座位終於坐滿。屬於他們的新故事，正要開始。",
};

export const endingRoutes: Record<RouteEnding, EndingRoute> = {
  "ending-1": ending1,
  "ending-2": ending2WithoutAhan,
  "ending-2-branch": ending2,
  "ending-3": ending3,
};
