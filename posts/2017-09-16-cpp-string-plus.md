---
layout: post
title: C++ 掃雷記：字串加上整數?
license: cc0
tags: cpp

---

本篇來自一年多前維護專案時看到的一段程式碼：

```cpp
for (int i = 0; i < count; i++) {
  MyObject obj;
  obj.set_unique_name(name + i);
  objs.push_back(obj);
}
```
<!-- more -->

假如 `name` 是 `"John"`，我們預期這會產生名稱分別為 `John1`, `John2`, `John3`...的物件。

做為同時會寫 JavaScript 等語言的人，在 trace 這段程式的時候，第一時間真的不覺得有什麼不對。

畢竟他看起來很自然。就語法來說， `std::string` 定義了 `operator+(int)` 也不是什麼太奇怪的事。

**事實上並沒有。**

如果你這麼做是會噴 error 的：
```cpp
string s = "string";
s + 1;

// error: invalid operands to binary expression ('string' (aka 'basic_string<char,
//      char_traits<char>, allocator<char> >') and 'int')
```

很奇妙的，原例中的那段程式碼卻沒有 error，甚至沒有 warning。

於是我又跑回去看。
```cpp
char* name = "John";
```

哇！沒想到在這個情境還有人使用 `char*` 而非 `std::string`呀！

於是程式的行為也會變得很有趣，對 C 語言指標有所了解的應該會知道，程式跑起來大概會變這樣：
```cpp
name + 0; //=> John
name + 1; //=> ohn
name + 2; //=> hn
```

這無疑是個可笑的 bug。當這段程式出現在一個考題中，相信大部分的人都可以發現其錯誤之處。
但當他是一段專案中的程式碼，卻很可能不被注意到。

所以我特別當成一段趣事記錄下來。下次再看到有人對字串做加法請多加注意。然後拜託非必要別在 C++ 中使用 `char*` 哇。
