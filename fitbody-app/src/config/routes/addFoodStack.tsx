import React from 'react'
import { createStackNavigator, StackNavigationOptions } from '@react-navigation/stack'
import { createMaterialTopTabNavigator, MaterialTopTabNavigationOptions } from '@react-navigation/material-top-tabs'
import { scale } from 'react-native-size-matters/extend'

// Pages
import RecentFoods from '../../screens/tabs/eating/RecentFoods'
import RecipeSearch from '../../screens/tabs/eating/RecipeSearch'
import RecommendedMealPlans from '../../screens/tabs/eating/RecommendedMealPlans'
import Favorites from '../../screens/tabs/eating/Favorites'

import globals from '../globals'
import {
  AddFoodStackParamList,
  AddFoodTabsStackParamList,
  AddIngredientsTabsStackParamList,
  AddIngredientStackParamList,
} from './routeTypes'

const FoodsTab = createMaterialTopTabNavigator<AddFoodTabsStackParamList>()
const IngredientsTab = createMaterialTopTabNavigator<AddIngredientsTabsStackParamList>()

const TabBarScreenOptions: MaterialTopTabNavigationOptions = {
  tabBarActiveTintColor: globals.styles.colors.colorPink,
  tabBarInactiveTintColor: globals.styles.colors.colorGrayDark,
  lazy: true,
  tabBarIndicatorStyle: { backgroundColor: globals.styles.colors.colorPink },
  tabBarLabelStyle: {
    marginHorizontal: 0,
    fontFamily: globals.fonts.primary.style.fontFamily,
    fontSize: scale(12),
    fontWeight: 'bold',
  },
  tabBarStyle: {
    backgroundColor: globals.styles.colors.colorWhite,
  },
  tabBarPressColor: globals.styles.colors.colorTransparent30Pink,
  swipeEnabled: false,
}

const AddFoodTabs = () => (
  <FoodsTab.Navigator
    initialRouteName="RecentFoods"
    backBehavior="initialRoute"
    initialLayout={{ width: globals.window.width }} // setting this helps improve rendering performance.
    screenOptions={TabBarScreenOptions}
    sceneContainerStyle={{ backgroundColor: globals.styles.colors.colorWhite }}>
    <FoodsTab.Screen name="RecentFoods" component={RecentFoods} options={{ title: 'SEARCH' }} />
    <FoodsTab.Screen name="RecipeSearch" component={RecipeSearch} options={{ title: 'RECIPES' }} />
    <FoodsTab.Screen name="RecommendedMealPlans" component={RecommendedMealPlans} options={{ title: 'MEAL PLANS' }} />
    <FoodsTab.Screen name="Favorites" component={Favorites} options={{ title: 'FAVORITES' }} />
  </FoodsTab.Navigator>
)

const AddIngredientsTabs = () => (
  <IngredientsTab.Navigator
    screenOptions={TabBarScreenOptions}
    initialRouteName="RecentFoods"
    backBehavior="initialRoute"
    initialLayout={{ width: globals.window.width }} // setting this helps improve rendering performance.
    sceneContainerStyle={{ backgroundColor: globals.styles.colors.colorWhite }}>
    <IngredientsTab.Screen name="RecentFoods" component={RecentFoods} options={{ title: 'SEARCH' }} />
    <IngredientsTab.Screen name="Favorites" component={Favorites} options={{ title: 'FAVORITES' }} />
  </IngredientsTab.Navigator>
)

const FoodsStack = createStackNavigator<AddFoodStackParamList>()
const IngredientsStack = createStackNavigator<AddIngredientStackParamList>()

const StackNavScreenOptions: StackNavigationOptions = {
  cardStyle: { backgroundColor: globals.styles.colors.colorWhite },
  headerShown: false,
  presentation: 'modal',
  headerShadowVisible: false,
}

export const AddFoodStack = () => (
  <FoodsStack.Navigator initialRouteName="AddFood" screenOptions={StackNavScreenOptions}>
    <FoodsStack.Screen name="AddFood" component={AddFoodTabs} />
  </FoodsStack.Navigator>
)

export const AddIngredientStack = () => (
  <IngredientsStack.Navigator initialRouteName="AddIngredient" screenOptions={StackNavScreenOptions}>
    <IngredientsStack.Screen name="AddIngredient" component={AddIngredientsTabs} />
  </IngredientsStack.Navigator>
)
