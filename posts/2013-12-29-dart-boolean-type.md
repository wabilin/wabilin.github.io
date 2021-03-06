---
layout: post
title: "Dart 語言設計上的問題: Boolean Type"
tags: dart, pl
license: cc0
---

[Dart](https://www.dartlang.org/) 是一個由 Google 開發，用來寫 web app 的程式語言。 做的基本上是現在通常用 JavaScript 來做的事情。 JavaScript 本身有很多設計上的缺陷，所以我也期待有一個這樣的新語言，能夠替代原本的 JavaScript，但是稍微看了一下，卻發現 Dart 本身也有些詭異的地方。

<!-- more -->

這篇來談一下 Dart 對於 Boolean 的設計問題。

我認為 Dart 對於布林值的型別轉換是很詭異的：

引自[Dart: Up and Running](https://www.dartlang.org/docs/dart-up-and-running/)
> When Dart expects a boolean value, only the value true is treated as true. All other values are treated as false. Unlike in JavaScript, values such as 1, “aString”, and someObject are all treated as false.

這對於來自 JavaScript 的 programmer 來說真的是非常詭異(不幸的是，Dart語言的對象應該大多是原本的JS使用者) 舉例來說：

```js
var name = 'Bob';
if (name) {
  print('You have a name!'); // Prints in JavaScript, not in Dart.
}
```

在 JavaScript 中，會被當成 `false` 看待的值有： `false`, `0`, `null`, `NaN`, `undefined`, `""`(空字串) 這樣的設計雖然不能說很完美，但至少有一定的邏輯可以理解。 但是 Dart 的邏輯，至少我就無法理解了： **為什麼一個不是空字串的字串會被轉換成 false?**

他們的說法是 **“所有 true 以外的東西都是 false”** ，看起來簡單明瞭，但是合理嗎?

比如說一個字串 `"true"`, 一個陣列`["Array"]`, 都是 false，我覺得很難說得通。 尤其是對於有大量接觸其他語言經驗的人，這看起來實在很詭異。

就列一下一些其他語言對 true/false 的看法(大多是從王垠的G+抄過來的:P)：
```
Smalltalk: True is an object which contains a method named ‘ifTrue’.
Lisp: True is everything except nil.
Scheme: True is everything except #f .
Python: True is everything except 0, empty list, None, or …
Ruby: True is everything except nil and false.
Lua: True is everything except false and nil.
Icon: True is executed successfully.
sh: Exit status 0 is true, and every other exit status is false.
```

```
C/C++: True is everything except 0.
Haskell: True is True.
ML: True is true.
Java: True is true.
C#: True is true.
Go: True is true.
```

敏銳的人應該已經知道這個表分隔的意義了。 很顯然的，Dart的作法是和下半部的大多語言一樣: **True is true.**

那問題在哪裡? 問題可大著了：表下半部列的都是 **static typing** 的語言 而且除了 C/C++ 以外，都是 **strong typing** 的

這些語言可以在 **編譯時期** 就檢查出所有變數的類型，而且其他型別 **不會** 被隱式轉換成布林型別

以 Java 為例:
```java
int i = 0;
if (i) {
  DoSomeThing();
}
```

這段程式就不會通過編譯，因為你不可以把一個整數當做布林值來用，你必須這樣寫:

```java
int i = 0;
if (i != 0) {
  DoSomeThing();
}
```

也就是說當你要把某些東西當作布林來用(放在 if/while.. 的條件裡)，你必須自己把他轉換成布林值。

這個想法我是贊同的，但 Dart 也想用這個概念的時候就很尷尬了，因為 Dart 本身不是一個純的靜態型別語言。 在 Dart 可以宣告靜態型別的變數，也可以(甚至是官方建議) 使用動態型別。

像這樣:

```js
int i = 0;
var b = true;
b = "A String";

if (i) { DoSomething(); }
if (b) { DoSomething(); }
```

第一個 `if(i)` 可以在執行前就被檢查出錯誤，就像 Java 那樣 但第二個 `if(b)` 只有在執行到的時候才能確定 `b` 的型別 (注意 Dart 的 `var` 意義和 JavaScript 的 `var` 比較接近，是宣告一個動態型別的變數， 而不是像 C#. Golang 的 `var` 或 C++11 的 `auto` 在編譯時期推導並綁定型別)

這讓 Dart 的作法非常尷尬，回到上面的例子：
```js
var name = 'Bob';
if (name) {
  print('You have a name!'); // Prints in JavaScript, not in Dart.
}
```
> in Dart running in production mode, the above doesn’t print at all because name is converted to false (because name != true). In Dart running in checked mode, the above code throws an exception because the name variable is not a bool.

意即，Dart 在 **checked mode** ， **執行到** 這段程式時會丟出例外，而在 production mode 則是把所有 `true` 以外的值都當成 `false`。

我的解釋是這樣：Dart 認為只有 Boolean 應該被當成 Boolean 來用(就像 Java 那樣)， **但是依賴的卻是非常不可靠的檢查機制。**

為什麼不可靠?
1. 這行程式很可能在測試時跑 100 回都不會被跑到
1. 許多 wep app 的開發者，不會做很嚴謹的測試

所以說，這玩意與其說是檢查機制，不如說是放個牌子在那裏，讓 Programmer 在學習語言的時候稍微記憶下， **盡量** 提醒自己在寫程式的時候，不要把 boolean 以外的東西拿去當 boolean 用

但又回來這個問題了：多數 Dart 使用者可能是從 JavaScript 那裡來的 (笑

回到根本，有三個問題：
1. Dart 提供的檢查機制太薄弱。現在有些工具甚至可以分析動態語言(如 Python. Ruby) 程式碼中的型別問題，但由於這些語言還有其他複雜的問題，很難 100% 的檢查出來。 但 Dart 作為一個 2011 年誕生的語言，如果在設計上多用點心思，其實很有可能做到同時使用動態型別和高強度的執行前型別檢查，而 Dart 至少目前沒有做到。

1. Dart 不是靜態型別語言。雖然我不是靜態型別的擁護者，但 Dart 語言裡許多機制，讓靜態型別顯得更適合他。靜態型別雖然還是有許多不如動態型別方便的地方，但多數人最討厭的麻煩: 冗長的型別宣告，其實根本不是靜態型別的問題。Dart 可以選擇成為一個輕巧靈活的靜態型別語言，但是 Google 把他設計成了一個混和了靜態型別和動態型別的四不像。

1. 既然無法拋下動態型別了，那請向其他成熟的動態型別語言借鑑 : Scheme. Python. Ruby...。當知道其他類型被當作布林使用是很難避免的時候，應該給予 **合理** 的轉換，至少我不認為非空非零的字串/數字/陣列被當成 false 是合理的。最少最少，應該考慮一下使用者(原JS programmers)的心情和習慣。
