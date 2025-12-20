# Live Feed Updates Example
#
# Push new posts to followers' feeds in real-time

# app/channels/feed_channel.rb
class FeedChannel < ApplicationCable::Channel
  def subscribed
    stream_for current_user
  end

  def viewed(data)
    # Mark item as viewed
    FeedItem.find(data['id']).mark_viewed_by(current_user)
  end
end

# Broadcasting new feed items
class Post < ApplicationRecord
  after_create_commit :broadcast_to_followers

  private

  def broadcast_to_followers
    user.followers.find_each do |follower|
      FeedChannel.broadcast_to(
        follower,
        {
          type: 'new_post',
          html: ApplicationController.render(
            partial: 'posts/feed_item',
            locals: { post: self }
          )
        }
      )
    end
  end
end
