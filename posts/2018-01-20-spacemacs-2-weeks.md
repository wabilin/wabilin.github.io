---
layout: post
title: Spacemacs - 人生最佳的編輯器體驗
tags: emacs, spacemacs
license: cc0
---
*這不是一篇信仰文，這是篇在編輯器的深淵中終於拉到一條繩子文。*

開始使用 [Spacemacs](http://spacemacs.org) 兩個星期，我可以說這是我用過最喜歡的文字編輯器。
他結合了編輯器大戰的兩巨頭 vim 與 emacs 的操作方式，在入門上卻「**親民**」許多。

如果曾經(或正在** vim 或 emacs 上遭受挫折，卻又嚮往他們的某些優點，不妨一試 Spacemacs 。

簡單說，他是一個：**裝了 vim 又裝了一堆超實用功能又全部設定得又完整又有邏輯的 emacs**

**使用 Spacemacs 你只需要會一些 vim 或 emacs 的基本操作，其他較進階的功能則無須特別記憶或設定。**

<!-- more -->

vim 和 emacs 我都有過些許的使用經驗。
「親民」實在很難當作二者的標榜，大多時候勸誘新手的說法是：「嘿，這個你熟悉了就會超強超快啦～」
（然後老手開始表演各種魔術般的飛快操作）

我可以理解熟悉了 vim (或 emacs) 之後那種愉快的操作感，讓老手們說出這樣的話是很合理的。
但跨不過門檻（大量快速鍵記憶、設定檔調教...）而中途放棄者還是大有人在。

身為一個 vim & emacs 菜鳥，我認為作為編輯器的效率是真的很棒，但還是有一些缺點（尤其是對新手）：
1. 設定調教略為麻煩
1. 太多快速鍵(特別在裝了大插件後)，又缺乏能系統性記憶的方式

我在用 vim 的第一天就有了一整頁的 `.vimrc` ，在三個月後又長了五倍大。雖然試圖努力精簡整理，但後來也是越長越肥。
而在裝了一些插件之後，把功能設到一些「自己覺得好按」的位置上之後，再下一個插件又要想該給哪些位置。

然而這些自己不斷長出來的設定，當初並沒有審慎的規劃設計，只是個人養成的(或抄來的)習慣而已。
到後來一些使用頻率次要的功能就容易忘記要按啥了。

至於 Spacemacs 呢? 很不可思議的，我使用到現在 **加過的設定不到10行。真正重要的只有兩行** 用起來已經比我調了許久的 vim 還要順手了。

### 小優點：混合式的操作模式

Spacemacs 對外掛功能的整合和富邏輯性的按鍵配置，本篇後面會詳細說明。

先提一個我覺得很棒的小優勢： **在 Spacemacs 可以混和 vim 和 emacs 的操作方式！**

雖然雙方陣營可能都認為己方才是真理，但我自己是覺得各有好用的地方，能混著用除了 *信仰不夠純正* 之外實在沒什麼壞處。
我從大部分的操作方式偏好 vim ，但有時候就會懷念起 emacs 的按法。

舉個最常見的操作：在 `insert mode` 中存檔，再回到 `insert mode` 繼續編輯。

- vim: `C-[ : w Enter i` (別忘了 `:` 實際上是 `Shift-;`)
- emacs: `C-x C-s`

emacs 的按法明顯輕鬆許多，所以我存檔的時候都會使用 emacs 的按法。另外常見的好處還有想在 `insert mode` 中移動游標又懶得回 `normal mode` ，我也是直接按 emacs 的快速鍵。


### 腦袋清楚了：這個按鍵配置真的很神

在 Spacemacs 中，所有次要（上下左右等等以外）的功能，都是由 `空白鍵` 這個 leader key 作為起點。（所以叫 spacemacs）

當然 leader key 不是 spacemacs 的發明，但把他把這之後的按鍵路徑配得非常有系統。絕大多數的按鍵操作會是這樣：

`Space` (開始) -> 分類 -> 功能

舉例來說
1. 如果我要打開專案(Project)中的檔案(File)，我就會按 `Space p f`
1. 如果我要打開專案(Project)的樹狀結構(Tree)，就會按 `Space p t`
1. 如果要查看 Git 的 Status，就是 `Space g s`
1. 如果要開啟 Git Blame 功能，就是 `Space g b`

這樣的按鍵規劃，讓人非常快速就可以上手，而且不容易忘記。

如果真的想不起來... 其實在按每個按鍵的時候下面都有提示可以偷看：
![SPC-p hint](./img/2018/01/emacs_2_weeks/1.webp)

如果這樣還找不到功能，也可以用 `Space ?` 或 `Space Space` 來搜尋

例如想要找 replace 功能:
![SPC-? hint](./img/2018/01/emacs_2_weeks/2.webp)

最糟狀況這樣都還找不到的話，也很容易 Google 得到。Spacemacs 的社群已經蠻大的了。


### 怕：會不會習慣的 vim 功能在 Spacemacs 沒有?

基本操作(hjkl / visual mode ...) 幾乎感覺不出來和 vim 的差別。

至於 vim 上面最實用最受歡迎的插件，大部分也都有對應的功能了。

舉我個人在 vim 上常使用的： FZF 、NERD Tree、YouCompleteMe、easymotion、fugitive 等等，
在 Spacemacs 上都有內建相似的功能，有些甚至更好用。

我目前在公司開發 Rails & React.js 就是使用 Spacemacs，基本上沒有什麼不便。
應該是花錢(RubyMine) 以外試過做棒的環境了。(其他編輯器的 vim mode 還是不夠順手)

想知道對程式語言的支援或其他功能也可以查看 [Layers](https://github.com/syl20bnr/spacemacs/tree/master/layers)，如果想要用 Emacs 收 Email 和 Slack 的話也行 :)

順帶一提，我以前最常用 Emacs 做的事情是玩貪食蛇XD

### 一些，真的只有一些設定和提醒

1. Spacemacs 可以在 console 中正常使用，不過視窗版本體驗又更棒更豐富。
1. vim 在按 w 時，一個 word 是包含底線的，這點和 emacs 的預設不同，可以加一行設定: `(add-hook 'prog-mode-hook #'(lambda () (modify-syntax-entry ?_ "w")))`
1. 如果系統沒有裝其他搜尋工具的話，會使用 `grep` 搜尋，速度有點慢，建議安裝一下 [ag](https://github.com/ggreer/the_silver_searcher)
1. 絕大部分的設定和套件安裝都是編輯 dotfile ，請按 `Space f e d` 打開設定。
1. 字型、配色也都可以按個人喜好設定，關於主題設定可以參考[這裡](https://emacs.stackexchange.com/questions/24958/how-install-a-custom-theme-to-spacemacs)
1. 可以在首頁更新所有 Package，別怕更新後壞掉，因為也可以直接在首頁還原(Rollback)上次的更新。
1. 如果是 VIM 使用者想上軌道，可以參考官方對 VIM USER 的入門文件 <http://spacemacs.org/doc/VIMUSERS.html>
1. 當你按錯鍵想取消，按 `Ctrl-g` 就對了

### 推薦的實用功能
1. [magit](https://github.com/magit/magit): 在安裝 git layer 後， `Space g` 開啟。我曾經試過許多 git 工具，這是少數真的可以讓人幾乎不用回到 console 下 git command 的。
1. 類似 easymotion: 按下 `Space j j` 搜尋字母快速跳躍、`Space j l` 快速跳行。
1. 分割視窗、在視窗間移動 `Space w`。 在 buffer(可以想成tab) 間移動 `Space b b`，快速切到上個 buffer `Space TAB` 。
1. 想要裝什麼功能，按 `Space f e d` 找 `dotspacemacs-configuration-layers` 就可以了。
