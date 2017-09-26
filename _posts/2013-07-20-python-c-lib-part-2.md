---
layout: post
title: "如何讓 Python 使用 C 的函式庫(Part 2)"
license: cc-by-sa
tags: python
---

在 Part1 中我們已經成功的寫一個 C 的函式 並讓 Python 程式去使用他

不過其中並沒有參數的傳遞和回傳 也就是我們最需要的部分還沒有完成 現在就來看看該怎麼做~

在這裡我們來寫一個費氏數列的函式做示範

```
f(0) = 0
f(1) = 1
f(n) = f(n-1) + f(n-2)
```

在 wikibooks 的教學中, 這也是第二個例子 我自己也習慣在 Hello World 之後測試費式數列, 感覺好像可以寫出費氏數列函式, 就可以做到很多事情

首先我們再寫一個 C 程式如下:
```c
// fib.c
#include <Python.h>

int _fib(int n) {
    if (n < 2)
        return n;
    else
        return _fib(n-1) + _fib(n-2);
}

static PyObject* fib(PyObject* self, PyObject* args) {
    int n;
    if (!PyArg_ParseTuple(args, "i", &n))
        return NULL;
    return Py_BuildValue("i", _fib(n));
}

static PyMethodDef FibMethods[] = {
    {"fib", fib, METH_VARARGS, "Calculate the Fibonacci numbers."},
    {NULL, NULL, 0, NULL}
};

PyMODINIT_FUNC initfib(void) {
    (void) Py_InitModule("fib", FibMethods);
}
```

首先看 `int _fib(int n)`, 這是求費氏數列的函式, 負責實際的求解運算。非常簡單的遞迴演算法, 就不多做說明了。

```c
static PyObject* fib(PyObject* self, PyObject* args) {
    int n;
    if (!PyArg_ParseTuple(args, "i", &n))
        return NULL;
    return Py_BuildValue("i", _fib(n));
}
```
這部分是本篇的重點, 他作為和 Python 的接口, 接受參數並回傳結果 這函式長得和之前的 hello 很像, 不同的地方是 我們不再忽略 `args`, 也不直接回傳 `None` 了

來看看如何獲得傳進來的參數: 關鍵就在於 `PyArg_ParseTuple()` 這個函式

* `args` => 存放參數的變數
* `"i"` => 讀入一個 integer
* `&n` => 把讀進來的那個整數, 存到 n 的位置 就這麼簡單!

如果我們要讀入一個字串呢?

```c
char str[128];
PyArg_ParseTuple(args, "s", str);
```

第一個參數是字串, 第二個參數是整數的話:
```c
char str[128];
int n;
PyArg_ParseTuple(args, "si", str, &n);
```
詳細的使用可以參考這份文件: http://docs.python.org/dev/c-api/arg.html

回傳結果呢?

```c
return Py_BuildValue("i", _fib(n));
```

因為我們必須回傳的是一個 `pythonObject*`, 而不能直接把一個 `int` 回傳 所以要先把 C 的整數轉換成包成 `pythonObject` 的整數, 而使用的就是 `Py_BuildValue` 這個函式 至於詳細的使用方法可以參考上面提過的那份文件, 在此我就只就範例來說明

`return Py_BuildValue(“i”, _fib(n));` 這行的意義就是: 我們把 `_fib(n)`的結果轉換為 `pythonObject` 之後回傳

現在完成了這份 fib.c, 請把他按照上一篇的說明編譯 然後就可以在 Python 中使用他了!

```python
# test_fib.py
import fib, time

def c_fib(n):
    return fib.fib(n)

def py_fib(n):
    if n < 2:
        return n
    return py_fib(n-1) + py_fib(n-2)

def test_fib():
    n = int(input('N: '))
    ts = time.clock()
    print 'computing with C: '
    print c_fib(n)
    print "%.2gs" % (time.clock() - ts)

    ts = time.clock()
    print 'computing with Python: '
    print py_fib(n)
    print "%.2gs" %(time.clock() - ts)


if __name__ == '__main__':
    test_fib()
```

在這份測試中, 我另外寫了一個 python 版本的求費氏數列的函式 用以比較速度

在我的電腦上測試的結果, 使用 C 的版本約比 Python 的版本快了 100 倍左右 可見這個做法對於解決效能瓶頸的障礙是會有幫助的!

### Reference
[Python C API wikibook: python programming stackoverflow](http://en.wikibooks.org/wiki/Python_Programming)
