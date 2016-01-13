require 'sinatra'

set :bind, '0.0.0.0'
set :port, 8080

before do
  cache_control :public, :must_revalidate, :max_age => 60
end

get '/' do
  erb :torrents
end
