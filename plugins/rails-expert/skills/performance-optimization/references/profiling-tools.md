# Rails Profiling Tools: Complete Guide

## Why Profile?

Profiling reveals where your application spends time and memory. Without profiling, performance work is guesswork. With profiling, you optimize what matters.

## Development Profiling

### Rack Mini Profiler

In-page performance widget for development.

#### Setup

```ruby
# Gemfile
gem 'rack-mini-profiler'

# For memory profiling support
gem 'memory_profiler'

# For flamegraph support
gem 'stackprof'
```

```bash
bundle install
```

The badge appears in the top-left corner automatically.

#### Configuration

```ruby
# config/initializers/rack_mini_profiler.rb
if Rails.env.development?
  Rack::MiniProfiler.config.position = 'bottom-right'
  Rack::MiniProfiler.config.start_hidden = false

  # Show SQL queries inline
  Rack::MiniProfiler.config.enable_advanced_debugging_tools = true

  # Memory profiling (requires memory_profiler gem)
  Rack::MiniProfiler.config.enable_hotwire_turbo_drive_support = true
end
```

#### Reading the Badge

The badge shows total request time. Click to expand:

- **SQL** - Total database time and query count
- **Render** - View rendering time
- **GC** - Garbage collection time

Red numbers indicate problems. SQL over 50% suggests missing indexes or N+1s.

#### Keyboard Shortcuts

- `Alt+P` - Toggle profiler visibility
- `Alt+L` - Show last request (for redirects)

#### Flamegraphs

Append `?pp=flamegraph` to any URL:

```text
http://localhost:3000/products?pp=flamegraph
```

Wide bars indicate slow methods. Deep stacks suggest abstraction overhead.

#### Production Usage

```ruby
# config/initializers/rack_mini_profiler.rb
Rack::MiniProfiler.config.authorization_mode = :allow_authorized

# In ApplicationController
def authorize_mini_profiler
  Rack::MiniProfiler.authorize_request if current_user&.admin?
end
```

### Bullet (N+1 Detection)

Detects N+1 queries and unused eager loading.

#### Setup

```ruby
# Gemfile
gem 'bullet', group: :development
```

```ruby
# config/environments/development.rb
config.after_initialize do
  Bullet.enable = true
  Bullet.alert = true          # JavaScript alert
  Bullet.bullet_logger = true  # log/bullet.log
  Bullet.console = true        # Browser console
  Bullet.rails_logger = true   # Rails log
  Bullet.add_footer = true     # Page footer
end
```

#### Notification Channels

```ruby
# All notification options
Bullet.alert = true              # JavaScript popup
Bullet.bullet_logger = true      # log/bullet.log
Bullet.console = true            # Browser console
Bullet.rails_logger = true       # Rails log
Bullet.add_footer = true         # HTML footer
Bullet.slack = {                 # Slack webhook
  webhook_url: ENV['SLACK_URL'],
  channel: '#performance'
}
Bullet.honeybadger = true        # Honeybadger
Bullet.sentry = true             # Sentry
```

#### Allowlisting

```ruby
# Ignore specific associations
Bullet.add_safelist type: :n_plus_one_query,
                    class_name: "User",
                    association: :avatar

# Ignore all for a model
Bullet.add_safelist type: :unused_eager_loading,
                    class_name: "Post"
```

#### CI Integration

```ruby
# spec/rails_helper.rb
if Bullet.enable?
  config.before(:each) do
    Bullet.start_request
  end

  config.after(:each) do
    Bullet.perform_out_of_channel_notifications if Bullet.notification?
    Bullet.end_request
  end

  config.after(:each) do |example|
    if Bullet.notification?
      example.set_exception(StandardError.new(Bullet.warnings_text))
    end
  end
end
```

Tests fail on N+1 queries.

### Memory Profiler

Tracks object allocations to find memory bloat.

#### Basic Usage

```ruby
require 'memory_profiler'

report = MemoryProfiler.report do
  # Code to profile
  User.all.map(&:full_name)
end

report.pretty_print
```

#### Output

```text
Total allocated: 1.2 MB (15,000 objects)
Total retained: 0 B (0 objects)

allocated memory by gem
-----------------------------------
  600.0 KB  activesupport
  400.0 KB  activerecord
  200.0 KB  app/models/user.rb

allocated objects by class
-----------------------------------
  5000  String
  3000  Array
  2000  Hash
```

**Allocated**: Objects created during profiling
**Retained**: Objects still in memory after profiling

#### Finding Memory Leaks

```ruby
# Profile with retained objects focus
report = MemoryProfiler.report(allow_files: 'app/') do
  100.times { process_batch }
end

report.pretty_print(retained_strings: 50)
```

High retained counts indicate potential leaks.

#### Integration with Rack Mini Profiler

```text
http://localhost:3000/products?pp=profile-memory
```

Shows allocations per request directly in browser.

### Derailed Benchmarks

Memory analysis for the entire application.

#### Setup

```ruby
# Gemfile
gem 'derailed_benchmarks', group: :development
```

#### Bundle Memory Analysis

```bash
# Memory used by each gem
bundle exec derailed bundle:mem

# Output:
# TOP: 70.5 MB
#   rails: 30.2 MB
#     activerecord: 15.1 MB
#     actionpack: 10.5 MB
#   bootsnap: 5.0 MB
```

Large gems warrant evaluation. Do you need all of Rails?

#### Memory Leak Detection

```bash
# Run app and track memory growth
bundle exec derailed exec perf:mem_over_time

# Check for monotonic growth - indicates leaks
```

#### Request Memory Profiling

```bash
# Set test endpoint
export PATH_TO_HIT=/products

# Profile memory per request
bundle exec derailed exec perf:objects
```

#### Comparing Branches

```bash
# Baseline
git checkout main
bundle exec derailed exec perf:mem > main_mem.txt

# Feature branch
git checkout feature/new-approach
bundle exec derailed exec perf:mem > feature_mem.txt

# Compare
diff main_mem.txt feature_mem.txt
```

### Benchmark IPS

Micro-benchmarking for comparing implementations.

#### Basic Comparison

```ruby
require 'benchmark/ips'

Benchmark.ips do |x|
  x.report("map") { [1, 2, 3].map { |n| n * 2 } }
  x.report("each") do
    result = []
    [1, 2, 3].each { |n| result << n * 2 }
    result
  end

  x.compare!
end
```

#### Output

```text
map:   5000000.0 i/s
each:  3500000.0 i/s - 1.43x slower
```

#### Warming

```ruby
Benchmark.ips do |x|
  x.warmup = 2  # Warm up for 2 seconds
  x.time = 5    # Benchmark for 5 seconds

  x.report("find") { User.find(1) }
  x.report("find_by") { User.find_by(id: 1) }

  x.compare!
end
```

Warming eliminates JIT compilation noise.

#### Hold Feature

Compare across code changes:

```ruby
Benchmark.ips do |x|
  x.report("original") { original_method }
  x.compare!
  x.hold!("benchmark_results.json")
end

# Modify code, run again
Benchmark.ips do |x|
  x.report("optimized") { optimized_method }
  x.compare!
  x.hold!("benchmark_results.json")
end
```

### Stackprof

CPU profiling with flamegraph generation.

#### Basic Usage

```ruby
require 'stackprof'

StackProf.run(mode: :cpu, out: 'tmp/stackprof.dump') do
  # Code to profile
  1000.times { User.all.to_a }
end
```

#### Modes

```ruby
# CPU time (default)
StackProf.run(mode: :cpu, interval: 1000) { ... }

# Wall clock time (includes I/O wait)
StackProf.run(mode: :wall) { ... }

# Object allocations
StackProf.run(mode: :object) { ... }
```

#### Viewing Results

```bash
# Text report
stackprof tmp/stackprof.dump --text

# Flamegraph HTML
stackprof tmp/stackprof.dump --d3-flamegraph > flamegraph.html
open flamegraph.html
```

#### Rails Middleware

```ruby
# config/initializers/stackprof.rb
if Rails.env.development?
  require 'stackprof'

  Rails.application.middleware.insert_before 0, StackProf::Middleware,
    enabled: true,
    mode: :cpu,
    save_every: 5
end
```

Profiles are saved to `tmp/` every 5 requests.

## Production APM

### Scout APM

Ruby-focused application monitoring.

#### Setup

```ruby
# Gemfile
gem 'scout_apm'
```

```yaml
# config/scout_apm.yml
common: &defaults
  key: "<%= ENV['SCOUT_KEY'] %>"
  monitor: true

production:
  <<: *defaults

development:
  <<: *defaults
  dev_trace: true  # Local trace viewer
```

#### Features

- Endpoint performance breakdown
- N+1 query detection
- Memory bloat analysis
- Background job monitoring
- GitHub integration for deploy tracking

#### Custom Instrumentation

```ruby
class OrderProcessor
  def process
    Scout::Transaction.instrument("OrderProcessor", "process") do
      # Code to instrument
    end
  end
end
```

### Skylight

Rails-optimized performance monitoring.

#### Setup

```ruby
# Gemfile
gem 'skylight'
```

```bash
bundle exec skylight setup <token>
```

#### Features

- Request aggregation (groups similar requests)
- True percentiles (P50, P95, P99)
- Detailed query analysis
- Problem detection alerts
- Deploy tracking

#### Ignoring Endpoints

```ruby
# config/application.rb
config.skylight.ignored_endpoints = [
  'HealthController#show',
  'SidekiqWeb'
]
```

### New Relic

Full-stack observability platform.

#### Setup

```ruby
# Gemfile
gem 'newrelic_rpm'
```

```yaml
# config/newrelic.yml
common: &defaults
  license_key: <%= ENV['NEW_RELIC_LICENSE_KEY'] %>
  app_name: MyApp

production:
  <<: *defaults
```

#### Features

- Distributed tracing
- Error tracking
- Infrastructure monitoring
- Synthetic monitoring
- Custom dashboards

#### Custom Instrumentation

```ruby
class ExternalService
  include ::NewRelic::Agent::MethodTracer

  def fetch_data
    # ...
  end
  add_method_tracer :fetch_data, 'Custom/ExternalService/fetch_data'
end
```

### APM Comparison

| Feature | Scout | Skylight | New Relic |
|---------|-------|----------|-----------|
| Price | $$ | $$ | $$$ |
| Ruby focus | High | High | Medium |
| Setup ease | Easy | Easiest | Medium |
| N+1 detection | Yes | Yes | Limited |
| Memory profiling | Yes | No | Yes |
| Infrastructure | No | No | Yes |
| Free tier | Yes | Yes | Yes |

Scout and Skylight excel for Rails-specific insights. New Relic offers broader infrastructure visibility.

## Rails Built-in Tools

### ActiveSupport Notifications

Subscribe to Rails events for custom instrumentation.

#### SQL Queries

```ruby
ActiveSupport::Notifications.subscribe('sql.active_record') do |event|
  if event.duration > 100  # ms
    Rails.logger.warn "Slow query (#{event.duration.round}ms): #{event.payload[:sql]}"
  end
end
```

#### Controller Actions

```ruby
ActiveSupport::Notifications.subscribe('process_action.action_controller') do |event|
  Rails.logger.info({
    controller: event.payload[:controller],
    action: event.payload[:action],
    duration: event.duration,
    db_time: event.payload[:db_runtime],
    view_time: event.payload[:view_runtime]
  }.to_json)
end
```

#### Custom Events

```ruby
# Instrument
ActiveSupport::Notifications.instrument('process.order', order_id: 123) do
  process_order
end

# Subscribe
ActiveSupport::Notifications.subscribe('process.order') do |event|
  StatsD.timing('orders.process', event.duration)
end
```

### Request Logging

#### Lograge

Structured request logging:

```ruby
# Gemfile
gem 'lograge'

# config/environments/production.rb
config.lograge.enabled = true
config.lograge.formatter = Lograge::Formatters::Json.new
config.lograge.custom_payload do |controller|
  {
    user_id: controller.current_user&.id
  }
end
```

Output:

```json
{"method":"GET","path":"/products","status":200,"duration":45.2,"view":30.1,"db":10.5,"user_id":123}
```

### Database Query Logging

#### Verbose Logging

```ruby
# config/environments/development.rb
config.active_record.verbose_query_logs = true
```

Shows source location for each query:

```text
User Load (0.5ms) SELECT * FROM users
  ↳ app/controllers/users_controller.rb:15:in `index'
```

#### Query Log Tags

```ruby
# config/application.rb
config.active_record.query_log_tags_enabled = true
config.active_record.query_log_tags = [
  :controller,
  :action,
  :job,
  { request_id: ->(context) { context[:request_id] } }
]
```

SQL comments show context:

```sql
SELECT * FROM users /*controller:users,action:index*/
```

## Profiling Workflow

### Development

1. **Enable Rack Mini Profiler** - Always-on visibility
2. **Run Bullet** - Catch N+1 queries early
3. **Profile slow features** with Memory Profiler
4. **Benchmark alternatives** with benchmark-ips

### Before Deploy

1. **Run derailed bundle:mem** - Check gem memory impact
2. **Profile critical paths** with StackProf
3. **Load test** with realistic data volumes

### Production

1. **Use APM** - Continuous monitoring
2. **Set alerts** on P95 response times
3. **Review weekly** - Look for degradation trends
4. **Profile on-demand** via Rack Mini Profiler (admins only)

## Best Practices

1. **Profile before optimizing** - Measure, don't guess
2. **Use production data volumes** in development profiling
3. **Profile the full request** not just the code you suspect
4. **Track trends** - Single measurements mislead
5. **Automate checks** - Bullet in CI catches regressions
6. **Profile memory separately** from CPU
7. **Warm up before benchmarking** - Cold starts skew results
8. **Compare branches** not just absolute numbers
9. **Set performance budgets** - P95 under 200ms
10. **Document findings** - Share what you learned
