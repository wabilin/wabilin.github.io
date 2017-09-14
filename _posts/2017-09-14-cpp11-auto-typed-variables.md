---
layout: post
title: Cpp11 auto-typed variables
tags: cpp
---

本篇搬移自舊部落格 (2013年8月)

型別推導在動態語言中是必然的，而傳統的靜態型別語言則多數要求事先宣告變數型別，
但最近的靜態型別語言也越來越盛行型別推導 如 Go. C#. Haskell等語言都支援靜態的型別推導。

現在C++ 也開始支援這美妙的功能了

## overview

```cpp
auto v = something;
// 我們在宣告變數 v 時,可以不自己指定 v 的型別，
// 而使用關鍵字auto，看 something 來決定的 v 型別
```

## introduction
型別推導並不是什麼艱澀難懂的概念，以動態語言 Python 為例，一個整數的變數會這樣寫：
```python
a = 0
```
因為 0 是整數，所以執行到這行的時候，a就會是一個整數變數

而在靜態型別的 C 和以前的C++中，所有變數都必須先宣告型別:
```cpp
int a = 0;
```

然而在靜態型別的語言中使用型別推導並非不可行的，以前大部分不支援應該是為了編譯的速度。
但隨著電腦效能越來越好，大家都想要程式寫得輕鬆，靜態型別的語言也開始支援了。

關於其他語言的做法，就留到文末來欣賞，現在直接來看看C++11怎麼玩:

```cpp
auto i = 1;
double pi = 3.14;
auto f = pi + 5;
```

首先 i 這個變數，因為等號右方的 1 是 int，所以 i 會是一個 int 變數，
而變數 f 因為是 pi(double) + 5(int) 的結果，所以必然是一個 double。
這些都是在編譯階段就可以確定的，所以使用 auto 變數並不會有像動態語言中，型別推導造成執行時其額外成本的問題。

另外一點不同的是，動態語言中變數的型別大多是可以改變的。
但在靜態語言中，就算使用 auto 這種方法，也是在宣告後就固定型別，
而且一定要給定初始值（不然怎麼推導=.=）。

```cpp

auto a = 3.14f; // OK, float
auto b(4);      // OK, int

auto c; // error
b = std::string("xd"); // error, b must be a int
```

不過看到這裡，可能會認為這個功能沒有什麼必要性
```cpp
auto a = 1;
int  b = 0;
```
在這裡實在沒有什麼理由懶得自己去判斷 a 的型別，像 b 這樣寫還可以少打一個字

然而在使用STL.各種library以及自訂型別的時候，這個功能就顯得十分有用了。
因為這些型別名稱往往很長，有些甚至你要確認他是什麼型別也很麻煩。

舉一個很常見的例子：

```cpp
#include <vector>

class LoveLive{
 // somethings..
 void foo() const;
};

int main() {
  using std::vector;
  vector<LoveLive> lives;
  for (vector<LoveLive>::const_iterator it = lives.cbegin();
       it < lives.cend() ;
       ++it) {
    it->foo();
  }
}
```

這是我之前最痛恨STL的其中一點----常常只是做很簡單的事情，卻因為各種落落長的名稱，
而寫成超長的一行，甚至得拆成醜醜的好幾行。

然而現在有了 auto 我可以這樣寫：
```cpp
for (auto it = lives.cbegin(); it < lives.cend() ; ++it) {
  it->foo();
}
```
少打了許多字，也不用怕忘記 iterator 怎麼拼 (當然這個常用應該不會忘，但有些比較少用的就要一直查了..)

 (註：以 for 迴圈來說，這個例子還有更簡潔的寫法，之後在他篇會介紹

就本例而言，可以感受到 auto 帶來的一點小便利，讓我們再看看沒有它的話我們會很痛苦的例子：
```cpp
// Code from: http://en.wikipedia.org/wiki/C%2B%2B11
#include <random>
#include <functional>

std::uniform_int_distribution<int> distribution(0, 99);
std::mt19937 engine; // Mersenne twister MT19937
auto generator = std::bind(distribution, engine);

// Generate a uniform integral variate between 0 and 99.
int random = generator();
```

這是在C++11中提供的一種產生亂數的新方式。
我們看到 generator 並未指定型別而使用了 auto 來做型別推導，
因為 std::bind 會把 distribution 和 engine 打包成某種可以被存在 std::function 的物件

雖然我們可以大概知道那是怎樣的形態，但絕對不會明確的想出來，
就算我們以人腦推出來了，也不會想花力氣打進去..

如果沒有 auto 可用，或是你很熱血的想把這玩意的型別打上去

好吧，嗯......
你會寫成這樣：
```cpp
std::_Bind
  <std::uniform_int_distribution<int>(
     std::mersenne_twister_engine<
       long unsigned int, 32ul, 624ul, 397ul,
       31ul, 2567483615ul, 11ul, 4294967295ul,
       7ul, 2636928640ul, 15ul, 4022730752ul,
       18ul, 1812433253ul
       >)> generator = std::bind(distribution, engine);
```

我相信沒有人可以這麼勤勞，無論是寫或看..

所以，auto的使用，不但可以減少打字時間，增近開發速度 (講難聽點就是偷懶)
在某些場合更是必要之手段

另外 auto 也可以配合關鍵 pointer 和 reference使用：
```cpp
int a = 0; // int
auto  b = a; // int
auto& r = a; // int&

auto  p1 = &a; // int*
auto* p2 = &a; // int*

auto c = a, *d = &a // OK
auto e = a, f = &a  // error
```
## comment
除了有必須使用的地方，必須把這招學起來以外。
也建議在其他適當場合使用 auto ，省力又簡潔。

不過也不宜濫用( 把各種簡單地型別也用成 auto )，會讓可讀性下降，
如果推導出來地型別和你預期的不一樣而產生bug也只能說是自作自受..

這應該算是一個實用價值很高的新功能。

另外 auto 這個關鍵字的其他使用場合，以及與他有點關係的 decltype 會在其他篇介紹

## chat
在其他靜態語言中，也有型別推導，
C# 可以有靜態和動態的型別推導，其中靜態型別推導的用法和本篇C++11的用法很相似，
不過C#使用的關鍵字是 "var"

Go語言有兩種寫法：
```go
var x, y, z int = 1, 2, 3
var a, b, c = true, false, "no!"
i := 0
```
其中 x, y, z 是由programmer 指定型別 int，
而 a, b, c 則是藉由型別推導分別得到 bool, bool, string 型別，
變數 i 則使用了 := 省略關鍵字 var，並推導得到型別 int

而 Haskell 的型別就更有趣了，不過在這裡講下去，篇幅大概就要比原本的主題還多了:P

有興趣的話請自行研究囉

## Reference
- http://www.open-std.org/jtc1/sc22/wg21/docs/papers/2006/n1984.pdf
- http://www.cprogramming.com/c++11/c++11-auto-decltype-return-value-after-function.html
- http://zh.wikipedia.org


## License
To the extent possible under law,
Ting Shu Lin has waived all copyright and related or neighboring rights to this work.
