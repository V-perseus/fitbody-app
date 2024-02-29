import React from 'react'
import { act, cleanup, fireEvent, render, waitFor } from '@testing-library/react-native'
import renderer from 'react-test-renderer'

import DiaryListItem from '../../../../src/screens/tabs/eating/MealPlan/DiaryListItem'
import { RecipeType } from '../../../../src/data/meal_plan/types'
import api from '../../../../src/services/api'

jest.mock('../../../../src/services/api')

describe('DiaryListItem', () => {
  afterEach(() => {
    cleanup()
  })

  let component = null
  beforeEach(async () => {
    // this is called in the initial useEffect
    await api.eating.ingredientDetails.mockResolvedValue({ id: 1, serving_qty: 2, serving_unit: 'cups', name: 'test_ingredient_name' })

    component = (props) => (
      <DiaryListItem
        recipeEdit={true}
        item={{
          id: 1,
          type: props.type || RecipeType.recipe,
          key: 'key',
          disableRightSwipe: false,
          base_ingredient_id: 2,
          nix_food_name: 'nix_food_name',
          meal_time_slot_id: 1,
          serving_qty: 1,
          serving_unit: 'cups',
          serving_weight_grams: 100,
          calories: 200,
          protein: 300,
          name: 'recipe name',
          thumb_img_url: 'test_url',
        }}
        favorites={[{ type: RecipeType.recipe, name: 'recipe name' }]}
        singleEditMode={props.singleEditMode || true}
        onSave={props.onSave}
        onToggleSelect={(items, selectionActive, toggleAll = false) => {}}
        selected={[]}
        editMode={props.editMode || true}
        // date={moment().format('YYYY-MM-DD')}
        slot={{ id: 1 }}
        // handlePress={data.item.type === 'recipe' ? (id) => openRecipe(mealPlan.meal_set.id, id) : addFood}
        handlePress={() => {}}
        ingredientPress={() => {}}
        showMacros={true}
      />
    )
  })
  it('renders snapshot correctly', () => {
    const tree = renderer.create(component({ onSave: jest.fn })).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('should render recipe item details', async () => {
    const onSave = jest.fn()
    const { queryByText, queryByTestId } = render(component({ onSave }))
    await act(async () => {
      expect(queryByText(/recipe name/gi)).not.toBeNull()
      expect(queryByTestId('recipe_img')).not.toBeNull()
      expect(queryByText(/FIT BODY RECIPE/gi)).not.toBeNull()
      expect(queryByTestId('recipe_img')).toHaveProp('source', { uri: 'test_url' })
      expect(queryByTestId('edit_recipe_btn')).not.toBeNull()
      await waitFor(() => queryByTestId('favorite_recipe_btn'))
      expect(queryByTestId('favorite_recipe_btn')).not.toBeNull()
    })
  })

  it('should render easy add item details', async () => {
    const onSave = jest.fn()
    const { queryByText, queryByTestId } = render(component({ onSave, type: RecipeType.easy_add_recipe }))
    await act(async () => {
      expect(queryByText(/recipe name/gi)).not.toBeNull()
      expect(queryByText(/EASY ADD/gi)).not.toBeNull()
      expect(queryByText(/200/gi)).not.toBeNull()
      expect(queryByTestId('edit_easy_add_btn')).not.toBeNull()
    })
  })

  it('should render default item details', async () => {
    const onSave = jest.fn()
    const { queryByText, queryByTestId, queryAllByText } = render(component({ onSave, type: RecipeType.ingredient }))
    await act(async () => {
      expect(queryByText(/recipe name/gi)).not.toBeNull()
      expect(queryByText(/Serving Size:/gi)).not.toBeNull()
      expect(queryAllByText(/cup/gi)).toHaveLength(2)
      expect(queryByText(/Number of Servings:/gi)).not.toBeNull()
      expect(queryByTestId('edit_default_edit_btn')).not.toBeNull()
      expect(queryByText('SAVE')).not.toBeNull()
    })
  })

  it('should render/call save button', async () => {
    const onSave = jest.fn()

    const { queryByText } = render(component({ onSave, type: RecipeType.ingredient }))

    await act(async () => {
      await api.eating.updateDiaryIngredient.mockResolvedValueOnce({ id: 1, serving_qty: 3 })

      expect(queryByText('SAVE')).not.toBeNull()
      await fireEvent.press(queryByText('SAVE'))
      expect(onSave).toHaveBeenCalled()
    })
  })
})
