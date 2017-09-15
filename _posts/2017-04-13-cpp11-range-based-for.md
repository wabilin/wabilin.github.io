---
layout: post
title: C++11 Range-based for
tags: cpp
license: cc0
---
本篇搬移自舊部落格 (2013年4月)

使用過 Python, C# 等語言的 `for` (`foreach`) 之後，
我就肖想這個功能很久了，現在 C++11 終於也有了這種形式的 `for` 迴圈！

### overview
```cpp
int a[] = {4, 5, 6};
for (int e : a)
  printf("%d ", e);

/* output: 4 5 6 */
```
<!-- more -->
### introduction
又是一個我一直想很要的功能XD

在 Ruby, Python, C# 等語言中 用這種 range-based iteration 是方便而安全的作法，
而且這種概念其實並不算是新穎的奇招，至少在 Ada 和 Fortran 中也有相似的語法。

要說明它的好處，就先來批鬥一下 C/C++ 與其他 C-based Language 的 for 迴圈寫法有什麼缺點。
(* 包含個人主觀意見)

以一個簡單的陣列複製為例，在 C 中如果不想用 `memcpy` 之類的函式 通常會這樣做:

```c
#define SIZE 10

int a[SIZE] = {...};
int b[SIZE];
for (size_t i = 0; i < SIZE; ++i)
  b[i] = a[i];
```

這種語法有以下缺點:

#### 1. 觀感問題 (奇摸子問題)

`for` 通常使用在和範圍相關的迴圈上，
例如遍歷一個陣列，或是由最小值到最大值之類的的計算。

把 for 用在和範圍無關的迴圈上，通常不是件好事 例如:

```c
for (; something ;) { ... }
```
用 `while` 取代會有更清楚的語意。

但是用來做範圍相關迭代的 `for`, 本身卻沒有提供和範圍相關的限制與迭代方法，
而完全只是一個 `while` 的語法糖。
```c
for (a; b; c) { ... }
```
和
```c
a;
while (b) { ...; c;}
```
完全相等

也就是這個語言中就算完全沒有 `for`，能做的事情也不會減少。
雖然可讀性較佳，卻又有種多餘的感覺。

#### 2. 安全問題

因為語法本身沒有包含對範圍的限制 仰賴程式設計師自己的設計
常成為蟲蟲的溫床 如常見的新手錯誤

```c
int a[10];
for (int i = 0 ; i <= 10 ; ++i) {...}
```

除了新手以外的人 也難免偶爾會老馬按錯鍵 浪費一堆時間 Debug (連bebug都沒有就更慘了)


#### 3. 麻煩問題

你可以說上面的問題，完全只是低級的錯誤，因為有經驗的人通常會這樣寫:

```c
#define SIZE 10

for (size_t i = 0; i < SIZE; ++i) { ... }
```

當然我又會挑剔 使用 `#define` 所造成的問題, 所以改成:

```cpp
static const size_t SIZE = 10;
for (size_t i = 0; i < SIZE; ++i) { ... }
```

這樣寫是以前的好寫法 大部分的問題都解決了，
不過仍然存在一個問題: 第一行實在很長很麻煩！

程式設計師天性懶散。怕麻煩是天經地義的事情 :)

我們願意忍受麻煩A，通常是為了避免更嚴重的麻煩B。
如果可以兩者都扔掉，絕對不會想承受其中任何一個。

一開始也看過大概的用法了，現在來看一下其定義[1]吧:

```cpp
for ( for-range-declaration : expression ) statement
```

等同於

```cpp
{
  auto && __range = ( expression );
  for (auto __begin = begin-expr, __end = end-expr;
       __begin != __end; ++__begin ) {
    for-range-declaration = *__begin;
    statement
  }
}
```

其中 `expression`, `begin-expr` 和 `end-expr` 的型態為 `_RangeT`

如果 `_RangeT` 是陣列的話,
```
begin-expr = __range, end-expr = __range + __bound
```
否則
```
begin-expr = begin(__range), end-expr = end(__range),
```
在尋找符合的 `begin()`, `end()`時
也會看到 namespace std 中的 `std::begin()` 和 `std::end()`


(我翻譯的能力有限 要看明確的定義還是請翻一下原文

所以 range-based for 可以用的地方分為兩類:
1. 型態及長度明確之 C++ 陣列
1. 其他有提供迭代方法的類別

以下分別解釋:

型態及長度明確之 C++ 陣列:

大部分的時候 會感覺C++ 的陣列和指標用起來完全一樣
但實際上還是有差別的
而能夠使用 range-based for 的 只有真正最標準的 C++ 陣列 例如:

```cpp
const char str[] = "1234";
int ary[10];
MyType m_ary[] = {};

for (char c : str) { }   // OK
for (int e : ary) { }    // OK
for (auto m : m_ary) { } // OK
```

而以下我們很習慣把指標當成陣列的用法 卻是不能用 range-based for 的:

```cpp
void foo(int a1[], int* a2) {
  const char* str = "A pointer to C string";

  for (int a : a1) {}    // error
  for (int a : a2) {}    // error
  for (char c : str) {}  // error
}
```

因為指標型態並沒有記錄陣列大小，所以無法使用是理所當然的。
不過這種「大部分時間用起來一樣，卻有時候不一樣」的東西真的有點惱人。
而且 C++ 陣列因為相容 C 雖然有幫你記下大小，但並不確保相關的安全性。

因此我比較推薦在 C++ 中 盡量以 `std::vector` 或 `std::array` 取代傳統陣列，
除非你的編譯器對 `vector` 效能實作得非常差 (正常來說和陣列的效能差距應該是很小的)，
或是你對效能極度計較，不然多數時候沒有使用傳統陣列之必要。

別忘了
> Premature optimization is the root of all evil.

其他有提供迭代方法的類別:

依照上面提過的定義，如果要把 range-based for 用在某類別 T

最少要有: 產生 iterator 的 `begin(T)`. `end(T)` 以及該 iterator 的 `operator ++`(prefix ver.)
依照 C++ `<iterator>` 中定義的 `std::begin()` 和 `std:: end()` [2]
如果有定義 `T.begin()` 和 `T.end()` 的話也可行 (應該也是比較好的做法)


這包括了所有有實作 iteration 功能的 STL 類別, 如:

vector, array, string,  deque, list, forward_list,
map, unordered_map, set, unordered_set...


一個敷衍用的範例 (反正每個用法都差不多) :

```cpp
std::vector<int> v = {1, 2, 3, 4, 5};

for (int e : v)
  printf("%d", e);
```

相較於
```cpp
for (std::vector<int>::iterator it = v.begin(); it != v.end(); ++it)
  printf("%d", *it);
```

少打了很多字，真是開心 :)

此外你也可以自己設計相容的類別。
( 本來我想順便寫怎麼做 不過怕這篇會變太長 而且又不知道要拖到什麼時候了

另外這種 `for` 常常搭配 `auto` 一起使用, 這個關鍵字之前也介紹過了
結合兩者之後更朝懶人 C++ 邁進了一大步

```cpp
const vector<MySuperCoolType> cv = {};
vector<MySuperCoolType> vv = {};


for (auto e : cv)
  cout << e;

for (auto& e : vv)  // 如果要更改內容的話 可以用auto&
  e = MySuperCoolType();
```


### comment
我認為這是一個非常良好的改進。

多數該支援的標準函式庫也都支援了，用起來非常方便。

可以少打很多字 愉☆悅~


### chat
C++ 中本來也有一個叫 `for_each` 的函式，
不過做法比較接近 functional language 中常見的 map 函式。

用法大略如下:
```cpp
void foo(int& n) {
  n = n * 2;
}

int main(){
  vector<int> v = {0,1,2,3};
  for_each (v.begin(), v.end(), foo);

  for(int e : v)
    printf(" %d", e);
  // output: 0 2 4 6
}
```

通常是本來就已經有適合的函式可以用 才會用 for_each
不然的話要用它來取代 for 迴圈其實是件更麻煩的事情

### Reference
[1] http://www.open-std.org/JTC1/SC22/WG21/docs/papers/2009/n2930.html

[2] http://en.cppreference.com/w/cpp/iterator