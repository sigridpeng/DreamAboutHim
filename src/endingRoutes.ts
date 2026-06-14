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

const hsinwen: SceneCharacter = {
  id: "friend",
  name: "黃欣雯",
  position: "center",
  expression: "soft",
  active: true,
};

const hsinwenLeft: SceneCharacter = {
  ...hsinwen,
  position: "left",
};

const enchi: SceneCharacter = {
  id: "him",
  name: "白恩棋",
  position: "right",
  expression: "soft",
  active: true,
};

const tianhe: SceneCharacter = {
  id: "protagonist",
  name: "藍天和",
  position: "center",
  expression: "soft",
  active: true,
};

const withActive = (characters: SceneCharacter[], activeName?: string) =>
  characters.map((character) => ({
    ...character,
    active: !activeName || character.name === activeName,
  }));

const c1 = [hsinwen];
const c2 = [hsinwenLeft, enchi];
const c3 = [hsinwenLeft, tianhe, enchi];

export const endingRoutes: Record<RouteEnding, EndingRoute> = {
  "ending-1": {
    albumEnding: "ending-1",
    background: "bookstore",
    title: "糖紙裡的初戀",
    characters: c1,
    scenes: [
      {
        id: "opening",
        lines: [
          { text: "書店裡很安靜。窗外的傍晚一點一點沉下來，玻璃映著街燈，也映著我自己的臉。" },
          { text: "桌上放著一顆牛奶糖，旁邊是一隻黃色紙兔子。那一瞬間，我像是忽然回到小學教室。" },
          { speaker: "黃欣雯", text: "你來了。", characters: withActive(c1, "黃欣雯") },
          { speaker: "主角", text: "欣雯。" },
          { speaker: "黃欣雯", text: "嗯。你還記得我。", characters: withActive(c1, "黃欣雯") },
          { speaker: "主角", text: "看到妳的時候，好像就記起來了。妳很好認，眼睛，還有桌上的牛奶糖。" },
          { text: "她笑了。那個笑容讓書店裡的燈變得更暖，像很多年前，她坐在我前面回頭看我的那一瞬間。" },
        ],
        choices: [
          {
            label: "理性一點：我們以前真的很熟嗎？",
            lines: [
              { speaker: "主角", text: "我們以前真的很熟嗎？" },
              { speaker: "黃欣雯", text: "很熟。你坐我後面，常常拿筆戳我的椅背。可是你每次戳完，又會把橡皮擦借給我。", characters: withActive(c1, "黃欣雯") },
              { speaker: "黃欣雯", text: "我記得你第一次轉來班上的樣子。你一出現，教室就變得比較吵，可是也變得比較有趣。", characters: withActive(c1, "黃欣雯") },
            ],
          },
          {
            label: "熱情一點：我記得妳都偷偷請我吃糖！",
            lines: [
              { speaker: "主角", text: "我記得妳都偷偷請我吃糖！" },
              { speaker: "黃欣雯", text: "你終於承認了。我以前還以為你根本沒發現。你每次吃完，糖紙都塞得亂七八糟。", characters: withActive(c1, "黃欣雯") },
              { text: "她說「可愛」的時候，眼睛微微彎起來。那顆牛奶糖好像還沒入口，就已經開始甜了。" },
            ],
          },
          {
            label: "溫柔坦率：其實我以前很喜歡妳。",
            lines: [
              { speaker: "主角", text: "其實我以前很喜歡妳。" },
              { speaker: "黃欣雯", text: "……我有一點感覺。你每次要跟我說話，都會先假裝找東西。", characters: withActive(c1, "黃欣雯") },
              { speaker: "黃欣雯", text: "現在我覺得，能再見到你很好。", characters: withActive(c1, "黃欣雯") },
            ],
          },
          {
            label: "輕鬆玩笑：所以妳以前是在用牛奶糖收買我嗎？",
            lines: [
              { speaker: "主角", text: "所以妳以前是在用牛奶糖收買我嗎？" },
              { speaker: "黃欣雯", text: "如果是的話，有成功嗎？那我以前應該常常讓你的人生很甜。", characters: withActive(c1, "黃欣雯") },
              { text: "那句話輕輕落在桌面上，像糖紙被攤開時發出的聲音。" },
            ],
          },
        ],
      },
      {
        id: "paper-rabbit",
        lines: [
          { speaker: "主角", text: "這隻兔子，是妳摺的？" },
          { speaker: "黃欣雯", text: "嗯。我小時候很常摺。因為黃色很亮，放在課本裡，好像課本裡藏了一點太陽。", characters: withActive(c1, "黃欣雯") },
          { text: "她把紙兔子推到我面前。兔子的耳朵輕輕翹著，像還在聽我們說話。" },
        ],
        choices: [
          {
            label: "理性一點：妳以前也會送別人紙兔子嗎？",
            lines: [
              { speaker: "黃欣雯", text: "會。有時候同學哭了，我會摺一隻給他。現在當老師，也偶爾會摺給小朋友。", characters: withActive(c1, "黃欣雯") },
              { speaker: "主角", text: "很像妳。妳好像一直知道，怎麼把東西輕輕放到別人手裡。" },
            ],
          },
          {
            label: "熱情一點：我以前有沒有拿妳的兔子去玩？",
            lines: [
              { speaker: "黃欣雯", text: "有。你還讓牠參加跑步比賽，把牠放在鉛筆盒上，說那是牠的賽車。", characters: withActive(c1, "黃欣雯") },
              { speaker: "主角", text: "那牠今天也算衛冕成功。" },
            ],
          },
          {
            label: "溫柔坦率：妳一直都很會照顧人。",
            lines: [
              { speaker: "主角", text: "妳一直都很會照顧人。" },
              { speaker: "黃欣雯", text: "我只是比較容易注意到。誰今天沒說話，誰的鉛筆斷了，誰明明想加入大家卻站在旁邊。", characters: withActive(c1, "黃欣雯") },
            ],
          },
          {
            label: "輕鬆玩笑：這隻兔子現在算老同學嗎？",
            lines: [
              { speaker: "黃欣雯", text: "算吧。牠可能比我們記得更多。而且牠是我摺的，會站在我這邊。", characters: withActive(c1, "黃欣雯") },
            ],
          },
        ],
      },
      {
        id: "ahan",
        lines: [
          { speaker: "黃欣雯", text: "說起來，你以前和阿漢也很常混在一起。", characters: withActive(c1, "黃欣雯") },
          { speaker: "主角", text: "阿漢？" },
          { speaker: "黃欣雯", text: "嗯。就是那個跑一下就滿頭汗，卻還是會跟著大家一起跑的男生。", characters: withActive(c1, "黃欣雯") },
          { text: "那個綽號在我心裡輕輕晃了一下。像某段操場邊的夏天，還留在很遠的地方。" },
        ],
        choices: [
          {
            label: "理性一點：他以前坐在哪裡？",
            lines: [
              { speaker: "黃欣雯", text: "好像在比較前面的位置。他上課很安靜，可是老師一問問題，他通常答得出來。", characters: withActive(c1, "黃欣雯") },
            ],
          },
          {
            label: "熱情一點：我以前是不是常拉他去玩？",
            lines: [
              { speaker: "黃欣雯", text: "很常。你一下課就往外衝，有時候還會回頭叫他快點。你跑太遠，最後又自己折回來。", characters: withActive(c1, "黃欣雯") },
            ],
          },
          {
            label: "溫柔坦率：妳提到他時，我好像想起一點點了。",
            lines: [
              { speaker: "主角", text: "操場、汗，還有有人站在旁邊，很安靜地看著大家。" },
              { speaker: "黃欣雯", text: "那很像他。你們一個很會往前衝，一個很會把事情想清楚，卻常常在一起。", characters: withActive(c1, "黃欣雯") },
            ],
          },
          {
            label: "輕鬆玩笑：他是不是常常被我拖去做奇怪的事？",
            lines: [
              { speaker: "黃欣雯", text: "你還挺有自覺的。你以前很會發明遊戲規則，而且每次都說得像正式比賽。", characters: withActive(c1, "黃欣雯") },
            ],
          },
        ],
      },
      {
        id: "ending",
        lines: [
          { speaker: "黃欣雯", text: "今天能這樣聊天，我很開心。你以前真的很耀眼。", characters: withActive(c1, "黃欣雯") },
          { speaker: "黃欣雯", text: "我大部分時候坐在你前面。可是其實，我也常常在看你。", characters: withActive(c1, "黃欣雯") },
          { text: "書店外的街燈亮了。玻璃窗映出我們並肩坐著的影子，中間隔著一隻紙兔子、一顆牛奶糖，和一段沒有說完的童年。" },
          { speaker: "系統", text: "照片裡亮起第一個位置。黃色紙兔子靜靜躺在日記本最後一頁。" },
        ],
      },
    ],
    endingText: "我找回了坐在我前面的女孩。她記得牛奶糖，也記得我還沒學會好好說喜歡的年紀。",
    hint: "日記本裡的照片只亮起一個位置。還有一些聲音，仍藏在沒有翻開的地方。",
  },

  "ending-2": {
    albumEnding: "ending-2",
    background: "bookstore",
    title: "白色兔子與舊照片",
    characters: c2,
    scenes: [
      {
        id: "opening",
        lines: [
          { text: "這一次，桌上多了一隻白色紙兔子。兔子的耳朵很長，邊緣被彩色鉛筆描了一圈淡淡的藍。" },
          { speaker: "白恩棋", text: "你真的來了。我還以為你看到我會認不出來。", characters: withActive(c2, "白恩棋") },
          { speaker: "主角", text: "白恩棋？" },
          { speaker: "白恩棋", text: "答對。雖然本人現在比小時候高很多，值得掌聲鼓勵。", characters: withActive(c2, "白恩棋") },
          { speaker: "黃欣雯", text: "他現在在美國當美髮師。", characters: withActive(c2, "黃欣雯") },
          { speaker: "白恩棋", text: "每天都在用剪刀拯救世界。還有染髮劑。", characters: withActive(c2, "白恩棋") },
        ],
        choices: [
          {
            label: "理性一點：你怎麼會去美國？",
            lines: [
              { speaker: "白恩棋", text: "家裡後來搬過去。一開始很不習慣，英文也講得七零八落。畫畫救了我一點吧。", characters: withActive(c2, "白恩棋") },
              { speaker: "白恩棋", text: "我喜歡看一個人換了髮型之後，像終於認出自己。", characters: withActive(c2, "白恩棋") },
            ],
          },
          {
            label: "熱情一點：你現在也變太高了吧！",
            lines: [
              { speaker: "白恩棋", text: "謝謝，我小時候欠下的身高，長大一次討回來。以前排隊都站第一個，現在換我擋別人視線。", characters: withActive(c2, "白恩棋") },
            ],
          },
          {
            label: "溫柔坦率：我好像以前沒有好好注意過你。",
            lines: [
              { speaker: "白恩棋", text: "你有注意到啦。有人搶我鉛筆盒，你會直接衝過去搶回來。很粗魯，但很有效。", characters: withActive(c2, "白恩棋") },
              { speaker: "黃欣雯", text: "你以前就是這樣。很熱心，但很不會說好聽話。", characters: withActive(c2, "黃欣雯") },
            ],
          },
          {
            label: "輕鬆玩笑：你現在看起來像會幫明星剪頭髮的人。",
            lines: [
              { speaker: "白恩棋", text: "謝謝，我決定把這句話寫進履歷。以前是對顏色有興趣，後來發現頭髮也可以很有顏色。", characters: withActive(c2, "白恩棋") },
            ],
          },
        ],
      },
      {
        id: "colors",
        lines: [
          { speaker: "黃欣雯", text: "恩棋以前很會畫畫。美術課只要發色紙，他眼睛就會亮起來。", characters: withActive(c2, "黃欣雯") },
          { speaker: "白恩棋", text: "結果那時候大家只覺得我衣服太亮。亮橘色、亮綠色、很誇張的藍。", characters: withActive(c2, "白恩棋") },
        ],
        choices: [
          { label: "理性一點：你以前最喜歡畫什麼？", lines: [{ speaker: "白恩棋", text: "人物，還有動物。不過我畫的人都穿得很花，跳舞的人尤其漂亮，顏色會跟著動。", characters: withActive(c2, "白恩棋") }] },
          { label: "熱情一點：亮橘色聽起來超醒目。", lines: [{ speaker: "白恩棋", text: "醒目到老師點名不用看座位表。你現在說帥太晚了，不過我收下。", characters: withActive(c2, "白恩棋") }] },
          { label: "溫柔坦率：被笑的時候，應該很不好受吧。", lines: [{ speaker: "白恩棋", text: "有時候會。小學生笑人的時候很直接，連包裝都沒有。後來我長高了，聲音也變大了，但我還是喜歡鮮豔的東西。", characters: withActive(c2, "白恩棋") }] },
          { label: "輕鬆玩笑：所以你小時候是行走的彩色鉛筆盒？", lines: [{ speaker: "白恩棋", text: "非常精準。而且是二十四色，不是十二色。那叫美感秩序。", characters: withActive(c2, "白恩棋") }] },
        ],
      },
      {
        id: "ahan",
        lines: [
          { speaker: "白恩棋", text: "對了，你還記得阿漢嗎？跑一下就滿頭汗，可是每次都還是會來。", characters: withActive(c2, "白恩棋") },
          { speaker: "黃欣雯", text: "他功課很好，字也寫得漂亮。那次生日，我們不是去過他家嗎？", characters: withActive(c2, "黃欣雯") },
          { text: "杯子。這個詞像一枚小石子，落進心裡某個很深的地方，水面晃了一下，卻還沒有完全映出形狀。" },
        ],
        choices: [
          { label: "理性一點：那次生日，你們還記得哪些細節？", lines: [{ speaker: "黃欣雯", text: "他家客廳很大。我帶了紙兔子，恩棋帶了自己畫的卡片，你大概負責把氣氛弄得很吵。", characters: withActive(c2, "黃欣雯") }] },
          { label: "熱情一點：等等，我們小時候居然有去同學家慶生？", lines: [{ speaker: "白恩棋", text: "有，而且你那天超興奮。阿漢帶我們看他的書和玩具，他有一些很漂亮的繪本。", characters: withActive(c2, "白恩棋") }] },
          { label: "溫柔坦率：聽起來，那天對他很重要。", lines: [{ speaker: "黃欣雯", text: "應該很重要吧。他那天雖然有點緊張，可是一直笑，對喜歡的東西也很珍惜。", characters: withActive(c2, "黃欣雯") }] },
          { label: "輕鬆玩笑：所以那天到底誰吃最多蛋糕？", lines: [{ speaker: "白恩棋", text: "這題我可以作證，應該是你。小學生生日派對的最高榮譽，就是蛋糕被吃光。", characters: withActive(c2, "白恩棋") }] },
        ],
      },
      {
        id: "care",
        lines: [
          { speaker: "白恩棋", text: "我小時候其實滿常被你們照顧的。你和阿漢，欣雯也會。", characters: withActive(c2, "白恩棋") },
          { speaker: "黃欣雯", text: "恩棋以前很安靜。有些人會拿他的東西開玩笑。", characters: withActive(c2, "黃欣雯") },
        ],
        choices: [
          { label: "理性一點：阿漢會怎麼幫你？", lines: [{ speaker: "白恩棋", text: "他會把東西撿回來。不太罵人，也不太吵，就只是撿回來放到我桌上。可是很有用。", characters: withActive(c2, "白恩棋") }] },
          { label: "熱情一點：那我呢？我是不是直接衝出去？", lines: [{ speaker: "白恩棋", text: "你比較像球飛出去。直接把東西搶回來，再塞給我。小學生的溫柔，有時候長得很粗魯。", characters: withActive(c2, "白恩棋") }] },
          { label: "溫柔坦率：謝謝你還記得這些。", lines: [{ speaker: "白恩棋", text: "我記得啊。小時候被誰笑、被誰幫過，其實都會留下來。", characters: withActive(c2, "白恩棋") }] },
          { label: "輕鬆玩笑：所以我以前是熱血笨蛋型？", lines: [{ speaker: "白恩棋", text: "這是你自己說的，我沒有說。阿漢應該會說得比較委婉：他只是比較有行動力。", characters: withActive(c2, "白恩棋") }] },
        ],
      },
      {
        id: "ending",
        lines: [
          { speaker: "白恩棋", text: "今天這樣聊，感覺很多畫面都回來了。", characters: withActive(c2, "白恩棋") },
          { speaker: "黃欣雯", text: "像把舊照片一張一張擦乾淨。而且我們現在還坐在一起。", characters: withActive(c2, "黃欣雯") },
          { text: "桌上的黃色紙兔子和白色紙兔子靠在一起。窗外的夜色漸漸深了，三個人的笑聲讓那張舊照片多亮了一些。" },
          { speaker: "系統", text: "照片裡亮起三個位置。最旁邊仍有一張空位，椅背上像落著一點淡淡的藍。" },
        ],
      },
    ],
    endingText: "我找回了兩位老同學，也找回了一些下課後的聲音。舊照片還有幾處模糊，可燈已經亮起來了。",
    hint: "三個人的座位亮了起來。黃色紙兔子和白色紙兔子靠在一起。",
  },

  "ending-2-branch": {
    albumEnding: "ending-2",
    background: "bookstore",
    title: "白色兔子與舊照片",
    characters: c2,
    scenes: [],
    endingText: "我找回了兩位老同學，也找回了一些下課後的聲音。舊照片還有幾處模糊，可燈已經亮起來了。",
    hint: "三個人的座位亮了起來。黃色紙兔子和白色紙兔子靠在一起。",
  },

  "ending-3": {
    albumEnding: "ending-3",
    background: "cafe",
    title: "喊出你的名字",
    characters: c3,
    scenes: [
      {
        id: "opening",
        lines: [
          { text: "這一次，我終於想起來了。不是只有阿漢，不是只有那個跑一下就滿頭汗，卻還是會跟著大家一起跑的男孩。我想起他的名字。藍天和。" },
          { text: "咖啡店的門鈴響起時，我握緊了手中的繪本。桌上放著兩隻紙兔子，一黃一白，還有一本把我帶到這裡的謎題繪本。" },
          { speaker: "藍天和", text: "好久不見。", characters: withActive(c3, "藍天和") },
          { speaker: "主角", text: "藍天和。" },
          { speaker: "白恩棋", text: "好，四個人終於到齊。我先聲明，我只是負責牽線，不負責控制場面。", characters: withActive(c3, "白恩棋") },
          { speaker: "藍天和", text: "也剛好，那本書終於被你讀到了。", characters: withActive(c3, "藍天和") },
        ],
        choices: [
          { label: "理性一點：那本繪本，是你畫的嗎？", lines: [{ speaker: "藍天和", text: "嗯。我把一些線索藏在裡面。如果你還記得，就會走到這裡。它也許是一條路，可以從故事走回你身邊。", characters: withActive(c3, "藍天和") }] },
          { label: "熱情一點：你也太會藏了吧！害我差點找不到！", lines: [{ speaker: "藍天和", text: "抱歉。可是你以前也會跑回來等我，所以我才一直記得。", characters: withActive(c3, "藍天和") }] },
          { label: "溫柔坦率：我一直很想你。", lines: [{ speaker: "藍天和", text: "我也是。我沒有忘，只是一直不知道，要怎麼回到你面前。", characters: withActive(c3, "藍天和") }, { speaker: "白恩棋", text: "所以他畫了一整本繪本。很浪漫，也很麻煩。", characters: withActive(c3, "白恩棋") }] },
          { label: "輕鬆玩笑：你約人的方式也太繞了。", lines: [{ speaker: "白恩棋", text: "很藍天和。把一句好久不見做成大型解謎活動。", characters: withActive(c3, "白恩棋") }, { speaker: "藍天和", text: "我不知道你會不會回。", characters: withActive(c3, "藍天和") }] },
        ],
      },
      {
        id: "picture-book",
        lines: [
          { speaker: "主角", text: "你現在在念醫學？" },
          { speaker: "藍天和", text: "嗯。可是我以前說過想畫繪本，現在也想。", characters: withActive(c3, "藍天和") },
        ],
        choices: [
          { label: "理性一點：那你還會繼續畫嗎？", lines: [{ speaker: "藍天和", text: "會，只是很慢。我還在學，學著讓自己的故事被看見。", characters: withActive(c3, "藍天和") }] },
          { label: "熱情一點：醫學生還能畫出這種繪本，太誇張了吧。", lines: [{ speaker: "黃欣雯", text: "那本書很像你。安靜，可是仔細看會發現很多東西。", characters: withActive(c3, "黃欣雯") }] },
          { label: "溫柔坦率：我很高興你還把畫畫留著。", lines: [{ speaker: "藍天和", text: "畫畫的時候，我會想起以前。欣雯的紙兔子、恩棋的生日卡，我都有留著。", characters: withActive(c3, "藍天和") }, { speaker: "白恩棋", text: "完了，這句太重了。我今天髮型很完整，先不要讓我哭。", characters: withActive(c3, "白恩棋") }] },
          { label: "輕鬆玩笑：所以你白天救人，晚上出謎題？", lines: [{ speaker: "白恩棋", text: "他已經成功讓我們三個腦袋打結。下次請出簡單一點。", characters: withActive(c3, "白恩棋") }] },
        ],
      },
      {
        id: "cup",
        lines: [
          { speaker: "藍天和", text: "我帶了一樣東西。", characters: withActive(c3, "藍天和") },
          { text: "他從包包裡拿出一個小盒子。盒子裡是一個藍色杯子，杯身有裂痕，被仔細地修補過。" },
          { speaker: "主角", text: "那個杯子……" },
        ],
        choices: [
          { label: "理性一點：你一直留著它？", lines: [{ speaker: "藍天和", text: "嗯。搬去美國的時候也帶著。它讓我記得，我在台灣有很重要的朋友。", characters: withActive(c3, "藍天和") }] },
          { label: "熱情一點：你居然把它黏回去了？", lines: [{ speaker: "藍天和", text: "黏得很醜。可是那天之後，我以為再也見不到你了。", characters: withActive(c3, "藍天和") }] },
          { label: "溫柔坦率：對不起，我一直欠你這句話。", lines: [{ speaker: "主角", text: "我那時候推倒你，打破你的杯子。後來又沒來得及跟你道歉。" }, { speaker: "藍天和", text: "我等到了。現在說出口了。", characters: withActive(c3, "藍天和") }] },
          { label: "輕鬆玩笑：它看起來比我們幾個還會撐。", lines: [{ speaker: "白恩棋", text: "確實。小學同學會 MVP：藍色杯子。", characters: withActive(c3, "白恩棋") }, { speaker: "藍天和", text: "我修了很久。也許是因為我不想丟掉。", characters: withActive(c3, "藍天和") }] },
        ],
      },
      {
        id: "park",
        lines: [
          { speaker: "藍天和", text: "我也記得你受傷那天。", characters: withActive(c3, "藍天和") },
          { text: "那天的公園很熱。我從遊具上摔下來，手臂出了血。只有他先蹲下來，用發抖的手替我壓住傷口。" },
        ],
        choices: [
          { label: "理性一點：你那時候為什麼留下來？", lines: [{ speaker: "藍天和", text: "因為你在流血。我只是覺得，如果我也走了，你會很害怕。", characters: withActive(c3, "藍天和") }] },
          { label: "熱情一點：所以我們就是從那天變成朋友的？", lines: [{ speaker: "藍天和", text: "應該是。你每次都說體能訓練很公平，可是比作業可怕。", characters: withActive(c3, "藍天和") }] },
          { label: "溫柔坦率：謝謝你當年沒有丟下我。", lines: [{ speaker: "藍天和", text: "也謝謝你後來沒有丟下我。你開始等我跑完，開始把我拉進大家裡面。", characters: withActive(c3, "藍天和") }] },
          { label: "輕鬆玩笑：我那時候是不是嚇到臉都白了？", lines: [{ speaker: "藍天和", text: "很白。可是你後來還是很愛跑，這句很像你以前會說的話。", characters: withActive(c3, "藍天和") }] },
        ],
      },
      {
        id: "reunion",
        lines: [
          { speaker: "黃欣雯", text: "所以，這算小學同學會成功嗎？", characters: withActive(c3, "黃欣雯") },
          { speaker: "白恩棋", text: "當然成功。四個人到齊，還解開多年謎題，咖啡也沒有灑。", characters: withActive(c3, "白恩棋") },
          { speaker: "藍天和", text: "謝謝你們來。", characters: withActive(c3, "藍天和") },
        ],
        choices: [
          { label: "理性一點：直接開群組吧。", lines: [{ speaker: "白恩棋", text: "太好了，科技終於進場。群組名稱就叫紙兔子？", characters: withActive(c3, "白恩棋") }, { speaker: "黃欣雯", text: "我喜歡。", characters: withActive(c3, "黃欣雯") }] },
          { label: "熱情一點：直接約！我一定來！", lines: [{ speaker: "藍天和", text: "可是這次可以走慢一點。", characters: withActive(c3, "藍天和") }, { speaker: "主角", text: "可以。我會等你。" }] },
          { label: "溫柔坦率：只要是你們，我會想辦法來。", lines: [{ speaker: "藍天和", text: "我可以負責不再把邀請藏進謎題裡。", characters: withActive(c3, "藍天和") }, { speaker: "白恩棋", text: "這個進步很大。", characters: withActive(c3, "白恩棋") }] },
          { label: "輕鬆玩笑：至少先給提示，不要直接出題。", lines: [{ speaker: "藍天和", text: "下次我直接寫：要不要見面？", characters: withActive(c3, "藍天和") }, { speaker: "白恩棋", text: "恭喜，藍天和學會直球了。", characters: withActive(c3, "白恩棋") }] },
        ],
      },
      {
        id: "ending",
        lines: [
          { text: "藍天和把修補過的藍色杯子放在桌中央。黃欣雯把黃色紙兔子放在杯子旁邊。白恩棋在白色紙兔子的耳朵上畫了一點藍。" },
          { text: "最後，我們拍了一張照片。快門聲響起時，日記本裡那張空白照片終於顯影。四個位置都亮了。" },
          { speaker: "黃欣雯", text: "下次見面，我再帶紙兔子。", characters: withActive(c3, "黃欣雯") },
          { speaker: "白恩棋", text: "我帶美國伴手禮，還有免費髮型諮詢券一張。", characters: withActive(c3, "白恩棋") },
          { speaker: "藍天和", text: "我帶新的故事。出現就好。", characters: withActive(c3, "藍天和") },
          { speaker: "系統", text: "照片裡四個位置全部亮起。日記本最後一頁浮現四個名字：黃欣雯、白恩棋、藍天和，還有我自己。" },
        ],
      },
    ],
    endingText: "我終於不只記得綽號，也記得你真正的名字。那張空了很多年的座位，終於有人回來了。",
    hint: "原來有些重逢，需要先把名字想起來。",
  },
};

endingRoutes["ending-2-branch"].scenes = endingRoutes["ending-2"].scenes;
