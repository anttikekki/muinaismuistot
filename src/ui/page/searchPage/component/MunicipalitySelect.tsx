import React, { useCallback, useEffect, useRef, useState } from "react"
import { useCombobox, useMultipleSelection } from "downshift"
import municipalities from "../../../../common/municipality.json"

interface Municipality {
  nameFI: string
  nameSE: string
  regionNameFI: string
  regionNameSE: string
}

export const MunicipalitySelect: React.FC = () => {
  const items = municipalities as Array<Municipality>
  const [inputValue, setInputValue] = useState<string | undefined>("")
  const {
    getSelectedItemProps,
    getDropdownProps,
    addSelectedItem,
    removeSelectedItem,
    selectedItems
  } = useMultipleSelection<Municipality>()
  const getFilteredItems = (items: Array<Municipality>): Array<Municipality> =>
    items.filter(
      (item) =>
        selectedItems.indexOf(item) < 0 &&
        inputValue &&
        item.nameFI.toLowerCase().startsWith(inputValue.toLowerCase())
    )
  const {
    isOpen,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    getItemProps,
    selectItem
  } = useCombobox({
    inputValue,
    selectedItem: null,
    items: getFilteredItems(items),
    stateReducer: (state, actionAndChanges) => {
      const { changes, type } = actionAndChanges
      switch (type) {
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
          return {
            ...changes,
            isOpen: true // keep the menu open after selection.
          }
      }
      return changes
    },
    onStateChange: ({ inputValue, type, selectedItem }) => {
      switch (type) {
        case useCombobox.stateChangeTypes.InputChange:
          setInputValue(inputValue)
          break
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
        case useCombobox.stateChangeTypes.InputBlur:
          if (selectedItem) {
            setInputValue("")
            addSelectedItem(selectedItem)
          }
          break
        default:
          break
      }
    }
  })

  return (
    <div className="form-group">
      <label htmlFor="municipalityDropdown">Kunta</label>
      <div className="dropdown">
        <div {...getComboboxProps()}>
          <input
            id="municipalityDropdown"
            class="form-control dropdown-toggle"
            {...getInputProps(getDropdownProps({ preventKeyAction: isOpen }))}
          />
        </div>
        <ul
          className={`dropdown-menu ${isOpen ? "show" : ""}`}
          style={{ width: "100%" }}
          {...getMenuProps()}
        >
          {isOpen &&
            getFilteredItems(items).map((item, index) => (
              <li
                key={`${item.nameFI}${index}`}
                {...getItemProps({ item, index })}
              >
                <a href="#">{item.nameFI}</a>
              </li>
            ))}
        </ul>
      </div>

      <div>
        {selectedItems.map((selectedItem, index) => (
          <span
            key={`selected-item-${index}`}
            {...getSelectedItemProps({ selectedItem, index })}
          >
            {selectedItem.nameFI}
            <span onClick={() => removeSelectedItem(selectedItem)}>
              &#10005;
            </span>
          </span>
        ))}
      </div>
    </div>
  )
}
