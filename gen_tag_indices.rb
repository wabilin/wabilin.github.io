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
