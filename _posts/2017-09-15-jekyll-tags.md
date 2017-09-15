---
layout: post
title: 幫 Jekyll Blog 加上 Tags 功能 (GitHub Pages 可用)
tags: jekyll
---

為了在 Jekyll Blog 上使用 tags 的功能，我花了些力氣研究。
雖然有現成的 plugin 可以用，但為了能讓 GitHub Pages 跑，那些 plugin 就不太可用了。

這篇是我目前找出來最為方便的方法。
<!-- more -->

首先在每個 post 的檔案上方，要用像這樣的方式加入 tag
```yaml
---
layout: post
title: 幫 Jekyll Blog 加上 Tags 功能
tags: jekyll
license: cc0
---
```

我在首頁加入這一段程式：
<script src="https://gist.github.com/wabilin/99589a0e71f15fd17a5699de97387ba4.js"></script>

這段程式會找出所有網站中使用過的 tag，並幫他做出一個到 `/tag_indices/tag-name`的連結。

`tag_indices` 是一個我自定資料夾路徑。我希望每個裡面 tag name 路徑都能列出與該 tag 相關的文章。

所以我先幫他們製作了應有的 layout
<script src="https://gist.github.com/wabilin/de1b5ab47d12e29c650ff12b8a870c40.js"></script>

這個 layout 會認該頁面的標題(`page.title`)，然後從全站的文章中找出文章 tag 名稱與本頁標題相同的文章。變成一串列表顯示出來。

但是 Jekyll 沒有聰明到自動幫我們從每篇文章的 tag 去產生出相應的 tag 目錄。

我查到某些資料做法是：手動新增。

也就是說，如果新增了一個含有 `example` tag 的文章，就要新增一個 `/tag_indices/example/index.md` 檔案，並加入內容：

```yaml
---
layout: tag_index
title: example
---
```
在 Jeklly 讀到這個檔案的時候，就會去找所有含有 `example` tag 的文章，生成目錄。

懶惰如我當然不可能每次加新標籤都去手動創一個檔案。所以我寫了下面這個很隨便的 ruby script 來幫我自動產生這些 tag 目錄：

```rb
# DO make sure ur post have tags attr, split tag names by space
require 'set'

def main()
  tag_set = collect_tags('./_posts/')
  puts "Your tags are: #{tag_set.to_a.to_s}"

  tag_root_path = './tag_indices/'
  create_tag_files(tag_set, tag_root_path)
end

def collect_tags(post_dir_path)
  tag_set = Set.new

  Dir.foreach(post_dir_path) do |post|
    next if post == '.' || post == '..' || post == '.gitkeep'
    file_path = post_dir_path + post
    puts file_path
    File.open(file_path, 'r') do |infile|
      while (line = infile.gets)
        if line.start_with?('tags:')
          puts line
          _, *tags = line.split(/\s/)
          tag_set.merge(tags)
        end
      end
    end
  end

  return tag_set
end

def create_tag_files(tags, tag_root_path)
  tags.each do |tag|
    tag_path = tag_root_path + tag
    if Dir.exist?(tag_path)
      puts "#{tag_path} exist. skip."
    else
      mkdir_ok = system('mkdir', '-p', tag_path)
      unless mkdir_ok
        puts "Failed when creating dir #{tag_path}"
        exit(1)
      end
      create_md_file(tag, "#{tag_path}/index.md")
    end
  end
end

def create_md_file(tag, path)
  File.open(path, 'w') do |file|
    file.puts('---')
    file.puts('layout: tag_index')
    file.puts("title: #{tag}")
    file.puts('---')
  end
end

main()
```

有需要的話可以直接拿去用，不過注意我這裡假定 tags 屬性都是些用空白分隔的單字。

 - 參考資料: http://vvv.tobiassjosten.net/jekyll/jekyll-tag-cloud/
