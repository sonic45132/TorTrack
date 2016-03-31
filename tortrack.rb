require 'bundler/setup'
require 'sinatra'
require 'transmission_api'


set :bind, '0.0.0.0'
set :port, 8080

transmission_api_client =
  TransmissionApi::Client.new(
    :url => "http://127.0.0.1:9091/transmission/rpc",
    :debug_mode => true
  )

get '/' do
  erb :list
end

get '/torrents' do 
  @torrents = transmission_api_client.all
  erb :torrents, :layout => false
end

get '/torrent/:id/*' do
  case params['splat'].first
  when 'resume'
    if params['id'].to_i == 0 
      transmission_api_client.resume_all()
    else
      transmission_api_client.resume(params['id'].to_i)
      "Resumed #{params['id']}"
    end
  when 'pause'
    if params['id'].to_i == 0 
      transmission_api_client.pause_all()
    else
      transmission_api_client.pause(params['id'].to_i)
      "Paused #{params['id']}"
    end
  when 'remove'
    transmission_api_client.remove(params['id'].to_i)
    "Removed #{params['id']}"
  when 'delete'
    transmission_api_client.destroy(params['id'].to_i)
    "Deleted #{params['id']}"
  when 'info'
    @torrent = transmission_api_client.find(params['id'].to_i)
    erb :info, :layout => false
  else
    halt 404
  end
end

post '/torrent/create' do
  torrent = transmission_api_client.create(params['url'])
  "Created torrent id:#{torrent['id']}"
end