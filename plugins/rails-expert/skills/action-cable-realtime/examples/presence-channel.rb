# Presence/Online Status Channel Example
#
# Track user online status with automatic cleanup

# app/channels/appearance_channel.rb
class AppearanceChannel < ApplicationCable::Channel
  def subscribed
    stream_from "appearances"
    appear("online")
  end

  def unsubscribed
    appear("offline")
  end

  def appear(status = "online")
    current_user.update(
      online_status: status,
      last_seen_at: Time.current
    )

    broadcast_appearance(status)
  end

  def away
    appear("away")
  end

  private

  def broadcast_appearance(status)
    ActionCable.server.broadcast("appearances", {
      user_id: current_user.id,
      username: current_user.name,
      avatar_url: current_user.avatar_url,
      status: status,
      last_seen: current_user.last_seen_at.to_i
    })
  end
end

# Periodic cleanup of stale online statuses
class CleanupOnlineStatusJob < ApplicationJob
  def perform
    User.where(online_status: "online")
        .where("last_seen_at < ?", 10.minutes.ago)
        .update_all(online_status: "offline")
  end
end
