# Live Dashboard Channel Example (Admin Only)
#
# Real-time admin dashboard with periodic stats updates

# app/channels/dashboard_channel.rb
class DashboardChannel < ApplicationCable::Channel
  def subscribed
    reject unless current_user.admin?

    stream_from "admin_dashboard"
  end

  def refresh
    # Manual refresh requested
    DashboardUpdateJob.perform_now
  end
end

# Background job to update dashboard
class DashboardUpdateJob < ApplicationJob
  queue_as :default

  def perform
    stats = {
      revenue_today: Order.today.sum(:total),
      orders_today: Order.today.count,
      new_users_today: User.where('created_at > ?', Date.today).count,
      active_users: User.where(online_status: "online").count
    }

    ActionCable.server.broadcast("admin_dashboard", {
      type: 'stats_update',
      stats: stats,
      html: render_dashboard(stats)
    })
  end

  private

  def render_dashboard(stats)
    ApplicationController.render(
      partial: 'dashboard/stats',
      locals: { stats: stats }
    )
  end
end

# Recurring job (with solid_queue)
# config/recurring.yml
# dashboard_update:
#   class: DashboardUpdateJob
#   schedule: "*/5 * * * *"  # Every 5 minutes
