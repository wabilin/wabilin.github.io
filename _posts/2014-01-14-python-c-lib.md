---
layout: post
title: "如何讓 Python 使用 C 的函式庫"
license: cc-by-sa
---
從開始寫 C 到現在三年了, Python 雖然比較晚碰但也寫了一些，
不過倒是從最近才開始認真研究這個技術 : 在 Python 中呼叫 C 所寫的函式。

雖然知道這招很久了, 但之前一直沒有用的契機 (畢竟寫純 Python 輕鬆得多)

而最近因為有一個 Python Project 無法達到需要的速度，
所以打算把這招拿出來用，也就順便筆記下來了。

( 其實方法有不少種, 本篇主要介紹的是使用 Python C API 的方法 )
<!-- more -->
### Hello World!

不免俗的還是來個 Hello, 不過這個 Hello 的技術知識與成就感應該比很多語言的還得多

(Python 的 `print "Hello World!"` // 這我會了又能幹啥 XD

因為要讓 Python 使用 C 寫的函式庫
所以我們要先來寫一個 C File :
```c
#include <Python.h>

static PyObject* hello(PyObject* self, PyObject* args) {
    printf("Hello! A C function called!\n");
    Py_RETURN_NONE;
}

static PyMethodDef HelloMethods[] = {
    {"hello", hello, METH_VARARGS, "A hello function."},
    {NULL, NULL, 0, NULL}
};

PyMODINIT_FUNC inithello(void) {
     (void) Py_InitModule("hello", HelloMethods);
}
```

先簡單的看一下這段程式碼的意義

首先我們 include 了 `Python.h`, 這是 Python C API 必要的標頭檔

```c
static PyObject* hello(PyObject* self, PyObject* args) {
    printf("Hello! A C function called!\n");
    Py_RETURN_NONE;
}
```
在這裡, 我們寫了一個叫做 hello 的函式
他接受兩個 `PyObject*` 作為參數, 並且回傳一個 `PyObject*`

他非常接近這樣的 Python method:
```py
def hello(self, arg1, arg2...) {
  print ("Hello!")
  return None
}
```
不過在 Python 中, 我們不必宣告出變數型別,
而在 C 裡面需要, 而他的型別則是 PyObject*
另外我們用一個 args 來存放零到多個參數

這就是在 C 中寫一個 Python method 的簡單樣貌

接著下一段:
```c
static PyMethodDef HelloMethods[] = {
    {"hello", hello, METH_VARARGS, "A hello function."},
    {NULL, NULL, 0, NULL}
};
```
我們必須告訴 pyhton, 在這個 module 中, 有那些 methods 可以用
而這個資訊被存放在 HelloMethods 這個陣列中, 陣列的每一個元素都是一個 method 的宣告,
這個宣告在 C 中的型別是一個 `struct (PyMethodDef)` , 以本例來說:

`{"hello", hello, METH_VARARGS, "A hello function."}`

第一項的 `"hello"` 是方法名稱 (method name)
第二項 `hello` 則是這個 method 的 C 實作函式
第三項的 `METH_VARARGS` 則是指示該如何解讀這個 method 的 flag, 不過我們先不管他
最後一項則是關於這個 method 的說明, 如同我們會寫在 python 中的 Documentation Strings

而 `{NULL, NULL, 0, NULL}` 則用以作為這個陣列的結尾標示

所以到這個部分我們已經完成了一個 method 在 C 中的實作,
並在一個變數中存入關於這個 module 的 methods 資訊

最後的部分則是這個 module 的初始化, 會把上面的東西放進來
不過先暫時不說明這部分

OK, 這個簡單的 C 檔案就這樣完成了

以下講解如何編譯並使用這個檔案, 每個作業系統方法小有差異, 此處以 Windows 為主。
理由是在 Linux 和 Mac OS 下本來就比較簡單, 而且這兩家的使用者平均來說自學能力比較強 不需要我贅言XD

如果你使用 Ubuntu :`sudo apt-get install python-dev`

Mac OS: 因為我還買不起所以不知道, 但相信一定不難

Windows:
首先你必須安裝 Python,

當然你也必須要有 C 的編譯器 (VC++ 或 MinGW)

而本篇會以 MinGW 為主

當這些必要的準備都好了之後, 就可以來產生我們要的函式庫。
在這裡還是有兩種方法:
1. 寫一個 setup.py 腳本來 build
1. 自己使用 C 編譯器來 build

先說第一種方法:

我們先寫一個 `setup.py`:
```py
from distutils.core import setup, Extension

module1 = Extension('hello', sources = ['hello.c'])

setup (name = 'PackageName',
       version = '1.0',
       description = 'This is a demo package',
       ext_modules = [module1])
```
接著利用這個檔案來 build:

Linux: `python setup.py build`

Windows + MinGW: `python setup.py build -cmingw32`

在這裡你可能會遇到的錯誤:

1)
```
‘python’ is not recognized as an internal or external command, operable program or batch file.
```

這代表你還沒有安裝好 Pyhton, 或是沒有將 Python 加入到 PATH 中, 請將 python 所在目錄加到 PATH

2)
```
error: unrecognized command line option ‘-mno-cygwin’
```

請參考 [stackoverflow](http://stackoverflow.com/questions/6034390/compiling-with-cython-and-mingw-produces-gcc-error-unrecognized-command-line-o/6035864#6035864) 上的解法, 間單的說就是去修改 `YourPythonDir\Lib\distutils` 中的 `cygwinccompiler.py`

而第二種方法也很簡單:
```
gcc -c hello.c -I/Python27/include
gcc -shared hello.o -L/Python27/libs -lpython27 -o hello.pyd
```
因為我安裝的 python 版本是2.7版, 所以在此是 Python27, 如果你裝的是2.5版 那就是 Python25
另外如果有更改安裝路徑的話也請自行修改指令, 假設你 python 裝在 `D:/Python27`
那第一行就改成 `gcc -c hello.c -ID:/Python27/include`

無論你用上面哪一種方法 你都可以得到一個 hello.pyd 的檔案

這時我們再來寫一個 python 程式來使用他, 請將這個 Python 程式放在和 `hello.pyd` 同一個資料夾

```py
import hello

hello.hello()
```

現在 hello 被我們作為一個 module 使用了!
我們呼叫 hello module 中的 hello method
他會輸出:
`Hello! A C function called!`

成功!

### Reference

- [Python C API](http://docs.python.org/2/c-api/)
- [wikibook: python programming](http://en.wikibooks.org/wiki/Python_Programming)
- [stackoverflow](http://stackoverflow.com/)
