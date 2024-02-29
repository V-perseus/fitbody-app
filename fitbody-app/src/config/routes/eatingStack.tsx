import React, { createContext } from 'react'
import { Text, TextStyle } from 'react-native'
import { createStackNavigator, StackNavigationOptions } from '@react-navigation/stack'

// Pages
import MealPlan from '../../screens/tabs/eating/MealPlan'
import Recipe from '../../screens/tabs/eating/Recipe'
import IndividualRecipe from '../../screens/tabs/eating/IndividualRecipe'
import GroceryList from '../../screens/tabs/eating/GroceryList'
import BarcodeScan from '../../screens/tabs/eating/BarcodeScan'
import FoodMacros from '../../screens/tabs/eating/FoodMacros'
import EasyAdd from '../../screens/tabs/eating/EasyAdd'
import Filter from '../../screens/tabs/eating/Filter'
import MealsetDetails from '../../screens/tabs/eating/MealsetDetails'

import { AddFoodStack, AddIngredientStack } from './addFoodStack'

import { ButtonRound } from '../../components/Buttons/ButtonRound'
import { HeaderButton } from '../../components/Buttons/HeaderButton'
import globals from '../globals'
import { AddFoodStackOptionsProps, EatingStackParamList } from './routeTypes'

const addFoodStackNavOptions = ({ navigation, route }: AddFoodStackOptionsProps): StackNavigationOptions => ({
  presentation: 'card',
  headerTitle: () => <Text style={globals.header.headerTitleStyle as TextStyle}>FOOD</Text>,
  headerLeft: () => <HeaderButton onPress={() => navigation.goBack()} />,
  headerRight: () => (
    <ButtonRound
      style={{
        height: 24,
        borderWidth: 1,
        borderRadius: 24,
        backgroundColor: globals.styles.colors.colorWhite,
        marginRight: 24,
        borderColor: globals.styles.colors.colorBlack,
      }}
      pressedOpacity={0.5}
      onPress={() => navigation.navigate('EasyAdd', { ingredientsOnly: route.params?.key === 'ingredientsearch' })}
      text="EASY ADD"
      textStyle={{
        fontFamily: globals.fonts.primary.boldStyle.fontFamily,
        fontSize: 10,
        color: globals.styles.colors.colorBlack,
      }}
    />
  ),
  headerShadowVisible: false,
})

const Stack = createStackNavigator<EatingStackParamList>()

const eatingTabNavigatorOptions: StackNavigationOptions = {
  cardStyle: { backgroundColor: 'white' },
  headerTitleAlign: 'center',
}

export const EatingStack = () => {
  return (
    <Stack.Navigator initialRouteName="MealPlan" screenOptions={eatingTabNavigatorOptions}>
      <Stack.Screen name="MealPlan" component={MealPlan} />
      <Stack.Screen name="Recipe" component={Recipe} options={Recipe.navigationOptions} />
      <Stack.Screen name="FoodMacros" component={FoodMacros} />
      <Stack.Screen name="BarcodeScan" component={BarcodeScan} />
      <Stack.Screen name="GroceryList" component={GroceryList} options={{ headerShown: false }} />
      <Stack.Screen name="EasyAdd" component={EasyAdd} />
      <Stack.Screen name="Filter" component={Filter} />
      <Stack.Screen name="MealsetDetails" component={MealsetDetails} />
      <Stack.Screen name="IndividualRecipe" component={IndividualRecipe} />
      <Stack.Screen name="Food" component={AddFoodStack} options={addFoodStackNavOptions} />
      <Stack.Screen name="Ingredient" component={AddIngredientStack} options={addFoodStackNavOptions} />
    </Stack.Navigator>
  )
}
