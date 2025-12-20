# User-Specific Notification Channel Example
#
# Push notifications to specific users with read/unread tracking

# app/channels/notification_channel.rb
class NotificationChannel < ApplicationCable::Channel
  def subscribed
    # Stream notifications for current user only
    stream_for current_user
  end

  def mark_as_read(data)
    notification = current_user.notifications.find_by(id: data['id'])
    return unless notification

    notification.update(read_at: Time.current)

    # Broadcast updated count to user
    NotificationChannel.broadcast_to(
      current_user,
      {
        type: 'count_updated',
        unread_count: current_user.notifications.unread.count
      }
    )
  end

  def mark_all_as_read
    current_user.notifications.unread.update_all(read_at: Time.current)

    NotificationChannel.broadcast_to(
      current_user,
      {
        type: 'all_read',
        unread_count: 0
      }
    )
  end
end

# Broadcasting from anywhere in the app
class NotificationService
  def self.notify(user, message, link = nil)
    notification = user.notifications.create!(
      message: message,
      link: link
    )

    # Broadcast to user's channel
    NotificationChannel.broadcast_to(
      user,
      {
        type: 'new_notification',
        html: render_notification(notification),
        unread_count: user.notifications.unread.count
      }
    )
  end

  private

  def self.render_notification(notification)
    ApplicationController.render(
      partial: 'notifications/notification',
      locals: { notification: notification }
    )
  end
end

# Usage:
# NotificationService.notify(user, "New comment on your post", post_path(post))
