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
  expression: Expression = "normal",
  active = true,
  dressed = false,
): SceneCharacter => ({
  id: dressed ? "friend" : "friend-casual",
  name: "黃欣雯",
  position,
  expression,
  active,
});

const enchi = (expression: Expression = "normal", active = true): SceneCharacter => ({
  id: "him",
  name: "白恩棋",
  position: "right",
  expression,
  active,
});

const tianhe = (expression: Expression = "normal", active = true): SceneCharacter => ({
  id: "protagonist",
  name: "藍天和",
  position: "center",
  expression,
  active,
});

const c1 = (expression: Expression = "normal") => [hsinwen("center", expression)];
const c2 = (
  activeName: "黃欣雯" | "白恩棋",
  hsinwenExpression: Expression = "normal",
  enchiExpression: Expression = "normal",
) => [
  hsinwen("left", hsinwenExpression, activeName === "黃欣雯"),
  enchi(enchiExpression, activeName === "白恩棋"),
];
const c3 = (
  activeName: "黃欣雯" | "白恩棋" | "藍天和",
  hsinwenExpression: Expression = "normal",
  tianheExpression: Expression = "normal",
  enchiExpression: Expression = "normal",
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
        { text: "抵達了約定好的那間書店。", characters: [] },
        { text: "書店裡很安靜，店外的陽光灑落桌面。" },
        { text: "我在靠窗的位置坐下。心臟微微悸動，等著那許久不見的她。" },
        { text: "是她嗎？眼前突然出現那似曾相識的面孔。" },
        { text: "女孩轉過頭，那笑容依然明亮。那一瞬間，我像是回到小學教室。" },
        { speaker: "黃欣雯", text: "你來了。", characters: c1("normal") },
        { speaker: "主角", text: "欣雯。" },
        { speaker: "黃欣雯", text: "嗯，好久不見了。我還在想，你會不會認不出我。", characters: c1("normal") },
        { speaker: "主角", text: "妳很好認。眼睛、長髮，還有……妳喜歡穿黃色的洋裝。" },
        { speaker: "黃欣雯", text: "你還記得呀。", characters: c1("smile") },
        { text: "她笑了。那個笑容讓書店裡的燈變得更暖，像很多年前，她坐在我前面，回頭看我的那張笑臉。" },
      ],
      choices: [
        {
          label: "我也記得妳以前常常請我吃糖。",
          lines: [
            { speaker: "主角", text: "我也記得妳以前常常請我吃糖。我到現在，還很喜歡牛奶糖呢。" },
            { speaker: "黃欣雯", text: "真的嗎？早知道我應該帶來的，呵呵。", characters: c1("shy") },
            { text: "她的臉頰變得紅潤。過往的記憶，像糖果般甜得在胸口中擴散。" },
          ],
        },
        {
          label: "因為我以前很喜歡妳呀。",
          lines: [
            { speaker: "主角", text: "因為我以前很喜歡妳呀。" },
            { speaker: "黃欣雯", text: "……我知道。", characters: c1("shy") },
            { speaker: "主角", text: "真的？" },
            { speaker: "黃欣雯", text: "嗯。你以前常常偷坐我的座位。", characters: c1("shy") },
            { speaker: "主角", text: "有那麼明顯嗎？" },
            { speaker: "黃欣雯", text: "很明顯。可是那時候，我也還小，只覺得你蠻有趣的。", characters: c1("smile") },
            { speaker: "主角", text: "那現在呢？聽到這個，有什麼感覺？" },
            { text: "也許已經沒有了當年的感受，但在說出口的瞬間，我感受到了一種滿足。" },
            { text: "她低頭看著桌上隨手摺的黃色紙兔子。" },
            { speaker: "黃欣雯", text: "現在……現在我覺得，能再見到你很好。", characters: c1("stare") },
          ],
        },
      ],
    },
    {
      id: "ahan",
      lines: [
        { text: "我們稍微聊了一些彼此的近況，將我們錯過的時光補完。" },
        { text: "雖然還有很多想說的話，但說出口時都變得輕描淡寫。" },
        { speaker: "黃欣雯", text: "說起來，你以前和阿漢常常一起玩。", characters: c1("normal") },
        { speaker: "主角", text: "對啊，我有印象。" },
        { speaker: "黃欣雯", text: "他成績很好，老師常常叫他回答問題。你和他成為好朋友後，功課突然進步了很多，你們還一起參加比賽得了獎。", characters: c1("smile") },
        { speaker: "主角", text: "是啊……當時真的受到了他很多幫助。" },
        { speaker: "黃欣雯", text: "我以前……真的有點，崇拜他呢。", characters: c1("shy") },
        { speaker: "主角", text: "明明就是暗戀……我還記得妳的國語課本裡的小秘密。" },
        { speaker: "黃欣雯", text: "呵呵……被發現了呢。誰叫你每次都偷坐我的座位，真是太壞了！", characters: c1("smile") },
        { text: "黃欣雯笑著低下頭，壓了壓桌上紙兔子的耳朵。她的臉泛起了微微的紅暈。" },
      ],
      choices: [
        {
          label: "我還記得替他辦生日派對的那次……",
          lines: [
            { speaker: "主角", text: "我還記得替他辦生日派對的那次……" },
            { speaker: "黃欣雯", text: "我也記得，他甚至感動到哭了呢。他自從和你變成朋友後，變得開朗許多。", characters: c1("smile") },
            { speaker: "主角", text: "我記得我們吃完蛋糕後，還到他家後院去看附近活動的煙火。" },
            { speaker: "黃欣雯", text: "嗯。我記得，除了我們三個，還有一位同學也有來。", characters: c1("normal") },
            { speaker: "主角", text: "誰？" },
            { speaker: "黃欣雯", text: "綽號是[小白兔]的那位。", characters: c1("smile") },
            { text: "我努力在記憶中搜尋這位同學的名字，但還是想不起來。" },
          ],
        },
        {
          label: "妳有他的消息嗎？",
          lines: [
            { speaker: "主角", text: "妳有他的消息嗎？" },
            { speaker: "黃欣雯", text: "自從他回到美國後，就沒有人有他的消息了。上次同學會，甚至也沒什麼人記得他了。", characters: c1("think") },
            { speaker: "主角", text: "畢竟已經這麼多年了……那個時候，資訊也還沒有像現在一樣流通。" },
            { speaker: "黃欣雯", text: "對啊。不過，我記得我們有同學也去了美國發展，說不定能打聽到一點消息。", characters: c1("think") },
            { speaker: "主角", text: "對了，我記得有一本繪本，裡面的謎題風格跟阿漢以前和我們玩的有點像。" },
            { speaker: "黃欣雯", text: "嗯！我知道你說的，是《魔法拍檔》對吧？其實我也買了……", characters: c1("shy") },
            { speaker: "主角", text: "雖然覺得不太可能，但要是這本繪本真的是阿漢畫的就好了。我有很多話想跟他說。" },
            { text: "說到這，欣雯的雙眼閃著光芒。" },
            { speaker: "黃欣雯", text: "我也想找到他。如果可以，我們一起解開這個繪本的謎題吧！", characters: c1("stare") },
          ],
        },
      ],
    },
    {
      id: "ending",
      lines: [
        { text: "我和欣雯有了一場溫馨愉快的約會。" },
        { text: "時間過得很快，又到了不得不說再見的時刻。" },
        { speaker: "黃欣雯", text: "今天能這樣聊天，我很開心。", characters: c1("shy") },
        { speaker: "主角", text: "我也是。" },
        { speaker: "黃欣雯", text: "下次再約吧？也許，我們會找到更多同學一起開派對。", characters: c1("shy") },
        { speaker: "主角", text: "好啊！我很期待那天！" },
        { speaker: "黃欣雯", text: "我們約好了喔！下次見，老朋友！", characters: c1("stare") },
        { text: "她的眼神很溫柔，看起來像在懷念著什麼。" },
        { speaker: "主角", text: "約好了！下次見！" },
        { text: "她走了，雖然不確定下次見面的日期，但我仍然期待著這份終於恢復的聯繫。", characters: [] },
        { text: "書店恢復了寧靜，而我也慢慢走離。" },
        { text: "這場約會像是一場夢境，我從未想過還能再想起那些回憶。" },
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
        { text: "抵達了約定好的那間書店。", characters: [] },
        { text: "書店裡很安靜，店外的陽光灑落桌面。" },
        { text: "我在靠窗的位置坐下。心臟微微悸動，等著那許久不見的老友們。" },
        { text: "那一瞬間，我像是忽然回到小學教室。眼前的女孩轉過頭，那笑容依然明亮，而她身旁站著一個很高、很會笑的人。", characters: [hsinwen("left", "normal"), enchi("normal")] },
        { speaker: "黃欣雯", text: "這裡這裡！", characters: c2("黃欣雯", "smile", "normal") },
        { speaker: "主角", text: "欣雯！還有……" },
        { speaker: "白恩棋", text: "你真的來了，好久不見啦！", characters: c2("白恩棋") },
        { speaker: "主角", text: "白恩棋？" },
        { speaker: "白恩棋", text: "對，是我。現在比小時候高很多，值得掌聲鼓勵。", characters: c2("白恩棋", "normal", "smile") },
        { speaker: "黃欣雯", text: "恩棋現在在美國當美髮師。", characters: c2("黃欣雯", "smile", "normal") },
        { speaker: "白恩棋", text: "每天都在用剪刀拯救世界，還有用染髮劑施展魔法。", characters: c2("白恩棋") },
        { speaker: "主角", text: "……你以前，好像比較安靜。" },
        { speaker: "白恩棋", text: "對，很安靜，很矮，很愛畫畫，柔弱得像小白兔。但現在完全不一樣了！", characters: c2("白恩棋", "normal", "thumbup") },
        { text: "他說得輕快，像是把過去的回憶快轉。我記憶中的他已經徹底被眼前的他給覆蓋了。" },
      ],
      choices: [
        {
          label: "你現在也變太高了吧！",
          lines: [
            { speaker: "主角", text: "你現在也變太高了吧！" },
            { speaker: "白恩棋", text: "謝謝，我小時候欠下的身高，長大一次討回來。", characters: c2("白恩棋", "normal", "smile") },
            { speaker: "黃欣雯", text: "呵呵……恩棋以前排隊都站第一個。", characters: c2("黃欣雯", "smile", "smile") },
            { speaker: "白恩棋", text: "而且還常常被擋住。現在換我擋別人視線。", characters: c2("白恩棋", "smile", "humph") },
            { speaker: "主角", text: "……你話變很多。" },
            { speaker: "白恩棋", text: "以前有多小聲，現在就說多大聲。你呢？以前像小隊長一樣高調，現在怎麼變這麼拘謹？", characters: c2("白恩棋", "smile", "thumbup") },
          ],
        },
        {
          label: "你現在看起來像會幫明星剪頭髮的人。",
          lines: [
            { speaker: "主角", text: "你現在看起來像會幫明星剪頭髮的人。" },
            { speaker: "白恩棋", text: "謝謝，我決定把這句話寫進履歷。", characters: c2("白恩棋", "normal", "smile") },
            { speaker: "黃欣雯", text: "他真的很會剪，我看過照片。", characters: c2("黃欣雯", "smile", "smile") },
            { speaker: "白恩棋", text: "連欣雯老師都這麼說了，是不是要來光顧一下我的店？", characters: c2("白恩棋", "normal", "thumbup") },
            { speaker: "主角", text: "你以前就對頭髮有興趣嗎？我沒有印象……" },
            { speaker: "白恩棋", text: "以前是對顏色有興趣，彩色鉛筆、色紙、公仔、衣服。後來發現頭髮也可以很有特色。", characters: c2("白恩棋", "normal", "smile") },
            { speaker: "黃欣雯", text: "恩棋以前很會畫畫。一到美勞課，他整個人就特別有精神。", characters: c2("黃欣雯", "normal", "smile") },
            { speaker: "白恩棋", text: "結果因為畫了一個紅蘿蔔，綽號就變小白兔了。", characters: c2("白恩棋", "normal", "humph") },
          ],
        },
      ],
    },
    {
      id: "ahan-and-ending",
      lines: [
        { speaker: "白恩棋", text: "對了，你還記得阿漢嗎？", characters: c2("白恩棋") },
        { speaker: "主角", text: "阿漢……我記得啊。" },
        { speaker: "白恩棋", text: "跑一下就滿頭汗，可是每次打籃球都還是會來操場。我記得他那時候常常帶手帕邊擦汗邊跑步。", characters: c2("白恩棋") },
        { speaker: "黃欣雯", text: "我印象他功課很好，字也寫得漂亮，老師都很喜歡他。", characters: c2("黃欣雯", "shy", "normal") },
        { speaker: "白恩棋", text: "對，而且他家好像有很多書。那次生日，我們不是去過他家嗎？", characters: c2("白恩棋") },
        { speaker: "主角", text: "他的生日……" },
        { speaker: "黃欣雯", text: "嗯。我、你、恩棋，還有阿漢，我們一起去他家。", characters: c2("黃欣雯") },
        { speaker: "白恩棋", text: "我記得那天有蛋糕，我們大家還用很漂亮的茶杯喝紅茶。", characters: c2("白恩棋") },
        { text: "茶杯。這個詞像一枚小石子，落進心裡某個很深的地方。水面晃了一下，卻還沒有完全映出形狀。" },
        { speaker: "白恩棋", text: "說到阿漢……他不是在當年回到美國了嗎？然後就這樣跟大家失聯了……", characters: c2("白恩棋", "normal", "humph") },
        { speaker: "白恩棋", text: "我現在也在美國定居，搞不好會在街頭的某處見到他。如果看到他， 一定要揪他[一起來咖啡店聚餐]啊！", characters: c2("白恩棋", "normal", "smile") },
        { speaker: "黃欣雯", text: "如果有他的消息，一定要告訴我們。好希望我們能再一起聚聚！", characters: c2("黃欣雯", "smile", "smile") },
        { speaker: "主角", text: "同意！到時我們幾個一定要再揪一團！畢竟我們可是彩虹戰隊啊！" },
        { speaker: "白恩棋", text: "哈哈！沒錯沒錯！", characters: c2("白恩棋", "smile", "thumbup") },
        { speaker: "黃欣雯", text: "哈哈！你居然還記得這個！", characters: c2("黃欣雯", "smile", "thumbup") },
        { text: "我們沒有把所有事情都說完，可三個人的笑聲已經充滿了這趟相聚的旅程。時間過得很快，又到了分離的時刻。" },
        { speaker: "白恩棋", text: "老朋友……真的很高興能再見到你！別忘了我，好嗎？要記得揪我啊！", characters: c2("白恩棋") },
        { speaker: "黃欣雯", text: "我們大家下次再約，難得大家聚在一起，現在先來拍張照片吧。", characters: c2("黃欣雯", "stare", "normal") },
        { text: "我替大家拍了照，讓眼前的回憶與景象能好好保存。" },
        { speaker: "主角", text: "今天真的很開心！也許下次還會想起更多有趣的回憶。下次見……欣雯、恩棋，保重身體！" },
        { text: "在笑聲與溫馨之中，我們告別了彼此。", characters: [] },
        { text: "逐漸安靜下來的書店，仍迴盪著剛才熱鬧的話語，讓我感到暖意。" },
        { text: "但這場開心的聚會，總覺得……少了什麼。" },
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
        { speaker: "黃欣雯", text: "我現在回到小學當代課老師。有時候看著班上的孩子，會突然想起我們以前的樣子。", characters: c2("黃欣雯", "smile", "normal") },
        { speaker: "主角", text: "妳以前就很會照顧人。現在一定很受學生歡迎。" },
        { speaker: "黃欣雯", text: "我希望是這樣，至少他們看到我摺紙兔子當小獎品時，都還滿開心的。", characters: c2("黃欣雯", "stare", "normal") },
        { speaker: "白恩棋", text: "至於我，還是在美國用剪刀和彩色染劑努力生活。偶爾也會幫客人做很大膽的造型。", characters: c2("白恩棋", "smile", "thumbup") },
        { speaker: "主角", text: "感覺你們都走了很適合自己的路呢。" },
        { speaker: "白恩棋", text: "你呢？你以前可是班上的核心人物，我好想知道你這幾年過得如何，有沒有什麼有趣的冒險啊？", characters: c2("白恩棋", "smile", "thumbup") },
        { text: "我們除了聊近況，也談起以前的座位、留下的字跡，也說到那些下課後一起走過的走廊。三個人的笑聲，讓記憶裡的教室又有了聲音。" },
        { speaker: "白恩棋", text: "老朋友……真的很高興能再見到你！別忘了我，好嗎？要記得揪我啊！", characters: c2("白恩棋", "smile", "normal") },
        { speaker: "黃欣雯", text: "我們大家下次再約，難得大家聚在一起，現在先來拍張照片吧。", characters: c2("黃欣雯", "stare", "normal") },
        { text: "我替大家拍了照，讓眼前的回憶與景象能好好保存。" },
        { speaker: "主角", text: "今天真的很開心。下次見，欣雯、恩棋。你們都要保重！" },
        { text: "我們告別了彼此。原本熱鬧的書店又變得安靜。", characters: [] },
        { text: "但是，我的心沒有變得冷清，因為終於清楚記住了照片裡的人。" },
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
        { text: "黃欣雯坐在我對面，白恩棋坐在旁邊。桌上還有一本把我帶到這裡的謎題繪本。", characters: [hsinwen("left", "normal", true, true), enchi("normal")] },
        { text: "門被推開。那位我等了許久的人，站在夜色和燈光之間。" },
        { speaker: "藍天和", text: "好久不見。", characters: c3("藍天和", "normal", "sayhi", "normal") },
        { speaker: "主角", text: "阿和……" },
        { text: "我終於叫出他的名字，他的名字與記憶終於不再模糊。" },
        { text: "過去的點滴以及我一路走來的足跡，在此刻，都成為了一句哽在口中的心意。" },
        { speaker: "白恩棋", text: "好，我們四個人終於全員到齊！", characters: c3("白恩棋", "normal", "sayhi", "thumbup") },
        { speaker: "藍天和", text: "抱歉我來晚了。我飛機改時間，差點趕不上。", characters: c3("藍天和") },
        { speaker: "主角", text: "阿和……真的是你？多久……沒有你的消息啦！" },
        { speaker: "藍天和", text: "嗯，多虧了恩棋的安排。也感激你真的讀到了我的繪本，我們才終於能聯繫彼此……", characters: c3("藍天和") },
        { speaker: "白恩棋", text: "阿和現在可是我理髮店裡的常客！我和阿和居然住得超近，某天聊著聊著發現我們居然是小學同學，然後互相認不出來，快笑死了！", characters: c3("白恩棋", "normal", "normal", "smile") },
        { text: "阿和看向桌上滿滿字跡的謎題繪本。那些筆記全是我為了找他而留下的痕跡。" },
        { text: "他看向我，我發現他眼角帶著一絲濕潤。" },
        { speaker: "主角", text: "能再見到你，真是太好了。" },
        { speaker: "藍天和", text: "是呀。簡直像奇蹟一樣……這個世界這麼大，我們四個卻全都能在這裡相聚。", characters: c3("藍天和", "normal", "shy", "smile") },
        { text: "聽到這句，我的眼眶也感到溫熱。" },
        { speaker: "主角", text: "阿和……你畫了這本繪本，代表著，原來這些年你都沒有忘記我嗎？" },
        { speaker: "藍天和", text: "嗯。雖然我在台灣只待了短短的幾年，但我真的有了最棒的童年。多虧了你們……", characters: c3("藍天和", "normal", "shy", "normal") },
        { speaker: "白恩棋", text: "真是的！說什麼肉麻的話呢！", characters: c3("白恩棋", "normal", "shy", "smile") },
        { speaker: "黃欣雯", text: "阿和……真的很久不見了！感覺你變得很成熟沉穩了呢！", characters: c3("黃欣雯", "shy", "shy", "smile") },
        { text: "我們更新了彼此的近況，得知阿和快要取得醫師執照了，但仍然沒有放棄繪本創作。我再次為打破茶杯的事道歉，並送他一個新的杯子，他微笑著接受了。" },
        { text: "聊著聊著，阿和突然認真地看著我。" },
        { speaker: "藍天和", text: "我最好的朋友……你願不願意，和我一起創作呢？", characters: c3("藍天和") },
        { speaker: "主角", text: "嗯？我嗎？" },
        { speaker: "藍天和", text: "關於我們的友誼、我們的故事，正要有新的篇章，對吧？你願意和我一起記錄下這一切嗎？", characters: c3("藍天和", "normal", "hold", "normal") },
        { speaker: "藍天和", text: "如果你願意跟我一起，把它用圖像、色彩、故事、謎題記錄下來……瑞德與布魯成長後的故事，就會真正地展現在眾人眼前。", characters: c3("藍天和", "normal", "hold", "normal") },
        { text: "他的雙眼閃著光芒，是比淚光還更明亮的那種溫度。" },
        { speaker: "主角", text: "當然！你給我的這趟旅程，我已經牢記在心了，我也很樂意把它記錄下來！" },
        { speaker: "白恩棋", text: "如果要畫畫，也要算上我吧！", characters: c3("白恩棋", "normal", "normal", "humph") },
        { speaker: "黃欣雯", text: "如果可以，我也希望能用我的記憶力，幫忙讓故事更還原！", characters: c3("黃欣雯", "stare", "normal", "humph") },
        { speaker: "主角", text: "那我們四個一起合作！" },
        { text: "阿和笑了，就跟過去一樣靦腆。" },
        { speaker: "藍天和", text: "能有你們這些好朋友，我真的……很幸福！", characters: c3("藍天和", "stare", "shy", "smile") },
        { text: "他從包包裡拿出一個小音樂盒，上面有一個小小的投影設備。", characters: c3("藍天和", "stare", "box", "smile") },
        { speaker: "黃欣雯", text: "這個漂亮的盒子是什麼呢？", characters: c3("黃欣雯", "shy", "box", "smile") },
        { speaker: "藍天和", text: "這個音樂盒叫做 Dreaming Box，裡面放了我們以前的照片。", characters: c3("藍天和", "stare", "box", "smile") },
        { speaker: "白恩棋", text: "以前的舊照片？我要看我要看！", characters: c3("白恩棋", "stare", "box", "thumbup") },
        { speaker: "藍天和", text: "我們就一邊回顧，一邊發想下一部屬於我們四人的繪本，要有什麼樣的內容與謎題吧。", characters: c3("藍天和", "stare", "box", "smile") },
        { speaker: "主角", text: "嗯！讓我們大家一起，看看以前的自己吧！" },
        { text: "傍晚的咖啡店裡，在昏暗的橙色燈光下，我們看向那來自過去的回憶與影像。" },
        { text: "當那首曾經代表離別的畢業歌響起，我們卻已牽起彼此的手，走向名為未來的夢。" },
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
