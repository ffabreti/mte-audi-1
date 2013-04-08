require 'test_helper'

class InicialControllerTest < ActionController::TestCase
  test "should get index" do
    get :audit
    assert_response :success
  end

end
