---
layout: post
title: "[Ruby] Yield 筆記"
tags: ruby
license: cc-by-sa
---

關於 `yield` 這個關鍵字，我剛學 Ruby 的時候逃避了。

現在重看一次，發現其實不是什麼太困難的東西。

簡單說， 就是一個執行之後使用者自訂 block 的語法。
<!-- more -->
用一個例子把做法記起來最快：

```rb
def foo
  val = 1
  yield val
end

foo { |x| puts x }
# => 1
```

可以發現在 `yield` 的部分把 block 掛進去了。
事實上這兩種寫法意義是差不多的：

```rb
def foo
  val = 1
  yield val
end

def foo2(&block)
  val = 2
  block.call(val)
end

foo { |x| puts x }
foo2 { |x| puts x }

# => 1
# => 2
```

我個人更喜歡 `foo2` 那樣明確的寫法，一目瞭然，新手老手都看得懂。

然而參與 Ruby 相關專案，一定還是得了解 `yield` 該如何使用，畢竟很多 Ruby 人偏好看起來簡短的做法。

了解怎麼用 `yield` 和 block 以後，也就可以了解一些 Ruby 慣用做法的製造方式了。

例如最常用的 `each` 方法，現在也可以試著自己寫一個：

```rb
class MyArray
  def initialize(src_ary)
    @ary = src_ary.clone
  end

  def each
    @ary.each do |x|
      yield x
    end
  end
end

my_array = MyArray.new([1, 2, 3])
my_array.each { |ele| puts 2 * ele }

# => 2
# => 4
# => 6
```

簡單吧 :)