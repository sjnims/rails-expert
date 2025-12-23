# Test Types in Rails: Complete Guide

## The Testing Pyramid

Rails provides multiple test types, each serving a specific purpose:

```text
        /\
       /  \      System Tests (slow, few)
      /----\
     /      \    Integration Tests
    /--------\
   /          \  Controller Tests
  /------------\
 /              \ Model Tests (fast, many)
/----------------\
```

Write many fast unit tests, fewer slow browser tests.

## Model Tests

Model tests verify business logic in isolation. They're the fastest tests and form
the foundation of your test suite.

### What They Test

- Validations and constraints
- Associations and relationships
- Scopes and queries
- Instance and class methods
- Callbacks and state changes
- Custom business logic

### Characteristics

- **Speed**: Fastest (milliseconds per test)
- **Isolation**: Test one model at a time
- **Coverage**: Should be highest percentage
- **Database**: Minimal database interaction

### Example Pattern

```ruby
# test/models/order_test.rb
class OrderTest < ActiveSupport::TestCase
  test "requires customer" do
    order = Order.new(total: 50)
    assert_not order.valid?
    assert_includes order.errors[:customer], "must exist"
  end

  test "calculates tax" do
    order = Order.new(subtotal: 100, tax_rate: 0.08)
    assert_equal 8.0, order.tax_amount
  end

  test "pending scope returns unpaid orders" do
    paid = orders(:paid)
    unpaid = orders(:pending)

    results = Order.pending
    assert_includes results, unpaid
    assert_not_includes results, paid
  end
end
```

### When to Use

- Testing any business logic
- Validating data constraints
- Testing calculations and transformations
- Verifying associations work correctly
- Testing scopes return correct records

## Controller Tests

Controller tests verify HTTP request handling. In modern Rails, these are actually
integration tests using `ActionDispatch::IntegrationTest`.

### What They Test

- HTTP response codes
- Redirects and rendering
- Flash messages
- Parameter handling
- Authentication and authorization
- Content-type responses

### Characteristics

- **Speed**: Fast (tens of milliseconds)
- **Scope**: Single controller action
- **Database**: Uses fixtures
- **JavaScript**: Not executed

### Example Pattern

```ruby
# test/controllers/articles_controller_test.rb
class ArticlesControllerTest < ActionDispatch::IntegrationTest
  test "index returns success" do
    get articles_url
    assert_response :success
  end

  test "create redirects after save" do
    assert_difference("Article.count") do
      post articles_url, params: {
        article: { title: "New", body: "Content" }
      }
    end
    assert_redirected_to article_path(Article.last)
  end

  test "unauthorized user cannot delete" do
    article = articles(:published)
    delete article_url(article)
    assert_redirected_to login_path
  end

  test "renders JSON for API requests" do
    get articles_url, as: :json
    assert_response :success
    assert_equal "application/json", response.content_type
  end
end
```

### When to Use

- Testing response codes and redirects
- Verifying authentication requirements
- Testing parameter validation
- Checking flash messages
- Testing API responses

## Integration Tests

Integration tests verify multi-step workflows that span multiple controllers
and actions.

### What They Test

- User journeys across pages
- Session and cookie persistence
- Multi-step forms
- Data consistency across requests
- Workflow completion

### Characteristics

- **Speed**: Moderate (hundreds of milliseconds)
- **Scope**: Multiple controllers and actions
- **State**: Persists across requests
- **JavaScript**: Not executed

### Example Pattern

```ruby
# test/integration/user_registration_test.rb
class UserRegistrationTest < ActionDispatch::IntegrationTest
  test "complete registration flow" do
    # Visit registration page
    get new_user_registration_url
    assert_response :success

    # Submit registration
    post user_registration_url, params: {
      user: {
        email: "new@example.com",
        password: "secure123",
        password_confirmation: "secure123"
      }
    }
    assert_redirected_to welcome_path
    follow_redirect!

    # Verify logged in
    assert_select "nav", text: /new@example\.com/

    # Access protected resource
    get dashboard_url
    assert_response :success
  end

  test "registration fails with invalid data" do
    post user_registration_url, params: {
      user: { email: "invalid" }
    }
    assert_response :unprocessable_entity
    assert_select ".error", text: /Email.*invalid/
  end
end
```

### When to Use

- Testing complete user workflows
- Verifying session persistence
- Testing multi-step processes
- Checking data consistency across requests
- Testing redirect chains

## System Tests

System tests run in a real browser and can test JavaScript interactions.
They're the slowest but most comprehensive tests.

### What They Test

- Full user experience
- JavaScript functionality
- Browser-specific behavior
- Visual rendering
- Accessibility
- Real-world scenarios

### Characteristics

- **Speed**: Slowest (seconds per test)
- **Browser**: Real browser via Selenium
- **JavaScript**: Fully executed
- **Visual**: Can verify visual elements

### Example Pattern

```ruby
# test/system/shopping_cart_test.rb
class ShoppingCartTest < ApplicationSystemTestCase
  test "add item to cart with quantity" do
    visit products_path

    within "#product_#{products(:widget).id}" do
      select "2", from: "Quantity"
      click_on "Add to Cart"
    end

    # JavaScript updates cart count
    assert_selector "#cart-count", text: "2"

    # Navigate to cart
    click_on "View Cart"
    assert_current_path cart_path

    # Verify cart contents
    assert_selector ".cart-item", count: 1
    assert_text "Quantity: 2"
  end

  test "applies coupon code" do
    add_product_to_cart(products(:widget))
    visit cart_path

    # Enter coupon
    fill_in "Coupon code", with: "SAVE20"
    click_on "Apply"

    # Ajax updates discount
    assert_text "Discount: -$20.00"
    assert_selector ".savings", text: "You saved $20"
  end

  test "checkout requires login" do
    add_product_to_cart(products(:widget))
    visit cart_path
    click_on "Checkout"

    # Redirected to login
    assert_current_path login_path
    assert_text "Please log in to continue"
  end
end
```

### When to Use

- Testing JavaScript interactions
- Verifying visual behavior
- Testing critical user paths
- Debugging integration issues
- Accessibility testing

## Mailer Tests

Mailer tests verify email content and delivery without actually sending emails.

### Example Pattern

```ruby
# test/mailers/notification_mailer_test.rb
class NotificationMailerTest < ActionMailer::TestCase
  test "sends welcome email" do
    user = users(:new_user)
    email = NotificationMailer.welcome(user)

    assert_emails 1 do
      email.deliver_now
    end

    assert_equal [user.email], email.to
    assert_equal "Welcome to Our App", email.subject
    assert_match /Hello #{user.name}/, email.body.encoded
  end
end
```

### When to Use

- Verifying email recipients
- Testing email subject and body content
- Checking attachments
- Testing email scheduling

## Job Tests

Job tests verify background job behavior without executing asynchronously.

### Example Pattern

```ruby
# test/jobs/cleanup_job_test.rb
class CleanupJobTest < ActiveJob::TestCase
  test "deletes expired records" do
    expired = create(:session, expires_at: 1.day.ago)
    valid = create(:session, expires_at: 1.day.from_now)

    CleanupJob.perform_now

    assert_raises(ActiveRecord::RecordNotFound) { expired.reload }
    assert_nothing_raised { valid.reload }
  end

  test "enqueues correctly" do
    assert_enqueued_with(job: CleanupJob, queue: "maintenance") do
      CleanupJob.perform_later
    end
  end
end
```

### When to Use

- Testing job execution logic
- Verifying job queueing
- Testing job arguments
- Checking job scheduling

## Choosing the Right Test Type

### Decision Matrix

| Scenario | Test Type |
|----------|-----------|
| Validation logic | Model |
| Calculation method | Model |
| Association behavior | Model |
| Response code check | Controller |
| Redirect verification | Controller |
| Auth requirement | Controller |
| Multi-page workflow | Integration |
| Session persistence | Integration |
| JavaScript interaction | System |
| Visual verification | System |
| Email content | Mailer |
| Background processing | Job |

### Test Distribution Guidelines

Aim for this approximate distribution:

| Test Type | Percentage | Reason |
|-----------|------------|--------|
| Model | 50-60% | Fast, test business logic |
| Controller | 20-30% | Verify request handling |
| Integration | 10-15% | Test complete workflows |
| System | 5-10% | Critical paths only |

### Common Mistakes

**Over-relying on system tests**:

```ruby
# Bad: Testing validation in system test
test "shows error for blank name" do
  visit new_product_path
  click_on "Create"
  assert_text "Name can't be blank"  # Slow!
end

# Good: Test in model test
test "requires name" do
  product = Product.new
  assert_not product.valid?
  assert_includes product.errors[:name], "can't be blank"
end
```

**Under-testing edge cases**:

```ruby
# Test the happy path AND edge cases
test "handles nil gracefully" do
  product = Product.new(discount: nil)
  assert_equal product.price, product.final_price
end
```

**Duplicating tests across types**:

Don't test the same behavior in model, controller, and system tests.
Test each behavior at the most appropriate level.

## Running Tests by Type

```bash
# All tests
rails test

# Model tests only
rails test test/models

# Controller tests only
rails test test/controllers

# Integration tests only
rails test test/integration

# System tests only
rails test test/system

# Specific file
rails test test/models/user_test.rb

# Specific test by line
rails test test/models/user_test.rb:42
```

## Performance Tips

1. **Parallelize**: `parallelize(workers: :number_of_processors)`
2. **Use fixtures** over factories for speed
3. **Minimize system tests**: They're 100x slower than model tests
4. **Run fast tests first**: Get quick feedback
5. **Profile slow tests**: `rails test --profile`

```ruby
# test/test_helper.rb
class ActiveSupport::TestCase
  parallelize(workers: :number_of_processors)
  fixtures :all
end
```

Master test types and you'll write the right test for every situation.
