module Fastlane
  module Actions
    module SharedValues
      PUSH_TO_EXPO_CUSTOM_VALUE = :PUSH_TO_EXPO_CUSTOM_VALUE
    end

    class PushToExpoAction < Action
      def self.run(params)
        # fastlane will take care of reading in the parameter and fetching the environment variable:
        UI.message "Parameter Build Number: #{params[:build_num]}"

        # sh "expo push --release-channel=fitbody_dev_shared"
        exec("expo publish --release-channel=production_" + params[:build_num])

        # Actions.lane_context[SharedValues::PUSH_TO_EXPO_CUSTOM_VALUE] = "my_val"
      end

      #####################################################
      # @!group Documentation
      #####################################################

      def self.description
        "A short description with <= 80 characters of what this action does"
      end

      def self.details
        # Optional:
        # this is your chance to provide a more detailed description of this action
        "You can use this action to do cool things..."
      end

      def self.available_options
        # Define all options your action supports.

        # Below a few examples
        [
          FastlaneCore::ConfigItem.new(key: :build_num,
                                       env_name: "FL_PUSH_TO_EXPO_BUILD_NUM", # The name of the environment variable
                                       description: "Build number used to create release channels", # a short description of this parameter
                                       verify_block: proc do |value|
                                          UI.user_error!("No build number for PushToExpoAction given, pass using `build_num: '<num>'`") unless (value and not value.empty?)
                                          # UI.user_error!("Couldn't find file at path '#{value}'") unless File.exist?(value)
                                       end),
          # FastlaneCore::ConfigItem.new(key: :api_token,
          #                              env_name: "FL_PUSH_TO_EXPO_API_TOKEN", # The name of the environment variable
          #                              description: "API Token for PushToExpoAction", # a short description of this parameter
          #                              verify_block: proc do |value|
          #                                 UI.user_error!("No API token for PushToExpoAction given, pass using `api_token: 'token'`") unless (value and not value.empty?)
          #                                 # UI.user_error!("Couldn't find file at path '#{value}'") unless File.exist?(value)
          #                              end),
          # FastlaneCore::ConfigItem.new(key: :development,
          #                              env_name: "FL_PUSH_TO_EXPO_DEVELOPMENT",
          #                              description: "Create a development certificate instead of a distribution one",
          #                              is_string: false, # true: verifies the input is a string, false: every kind of value
          #                              default_value: false) # the default value if the user didn't provide one
        ]
      end

      def self.output
        # Define the shared values you are going to provide
        # Example
        [
          ['PUSH_TO_EXPO_CUSTOM_VALUE', 'A description of what this value contains']
        ]
      end

      def self.return_value
        # If your method provides a return value, you can describe here what it does
      end

      def self.authors
        # So no one will ever forget your contribution to fastlane :) You are awesome btw!
        ["Your GitHub/Twitter Name"]
      end

      def self.is_supported?(platform)
        # you can do things like
        #
        true
        #
        #  platform == :ios
        #
        #  [:ios, :mac].include?(platform)
        #

        # platform == :ios
      end
    end
  end
end
