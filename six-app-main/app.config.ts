import { ConfigContext, ExpoConfig } from "expo/config";

const EAS_PROJECT_ID = "1b0f9bd1-5ad7-434c-9b1b-b811cc1ddb13";
const PROJECT_SLUG = "six";
const OWNER = "sixai";

export default ({ config }: ConfigContext): ExpoConfig => {

  return {
    ...config,
    name: "Six",
    slug: PROJECT_SLUG,
    version: "1.0.8",
    runtimeVersion: "1.0.8",
    orientation: "portrait",
    icon: "./src/assets/icons/ios-light.png",
    scheme: "six",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.sixai.six",
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false
      },
      icon: {
        light: "./src/assets/icons/ios-light.png"
      }
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./src/assets/icons/android-icon.png",
        backgroundColor: "#ffffff"
      },
      edgeToEdgeEnabled: true,
      package: "com.sixai.six",
      permissions: [
        "android.permission.READ_CONTACTS",
        "android.permission.WRITE_CONTACTS",
        "android.permission.INTERNET" 
      ]
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./src/assets/images/favicon.png"
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./src/assets/icons/splash-icon-dark.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff"
        }
      ],
      [
        "expo-font",
        {
          fonts: [
            "./src/assets/fonts/TimesNewRomanRegular.ttf"
          ],
          android: {
            fonts: [
              {
                fontFamily: "TimesNewRoman",
                fontDefinitions: [
                  {
                    path: "./src/assets/fonts/TimesNewRomanRegular.ttf",
                    weight: 400
                  }
                ]
              }
            ]
          }
        }
      ],
      [
        "expo-contacts",
        {
          contactsPermission: "Allow Six to access your contacts."
        }
      ],
      [
        "expo-build-properties",
        {
          ios: {
            deploymentTarget: "15.1"
          }
        }
      ],
      [
        "expo-image-picker",
        {
          photosPermission: "The app accesses your photos to let you share them with your friends."
        }
      ],
      "expo-web-browser"
    ],
    experiments: {
      typedRoutes: true
    },
    extra: {
      router: {},
      eas: {
        projectId: EAS_PROJECT_ID
      },
      // Environment variables - these come from EAS environment settings
      APP_ENV: process.env.APP_ENV,
      SUPABASE_URL: process.env.SUPABASE_URL,
      SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
      BACKEND_URL: process.env.BACKEND_URL,
    },
    owner: OWNER
  };
};