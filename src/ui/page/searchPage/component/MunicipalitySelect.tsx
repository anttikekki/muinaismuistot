import React, { useCallback, useEffect, useRef, useState } from "react"
import { useCombobox, useMultipleSelection } from "downshift"
import municipalities from "../../../../common/municipality.json"

interface Municipality {
    nameFI: string,
    nameSE: string,
    regionNameFI: string,
    regionNameSE: string
}

export const MunicipalitySelect: React.FC = () => {
    const items = municipalities as Array<Municipality>
    const [inputValue, setInputValue] = useState('')
  const {
    getSelectedItemProps,
    getDropdownProps,
    addSelectedItem,
    removeSelectedItem,
    selectedItems,
  } = useMultipleSelection({initialSelectedItems: [items[0], items[1]]})
  const getFilteredItems = (items: Array<Municipality>): Array<Municipality> =>
    items.filter(
      item =>
        selectedItems.indexOf(item) < 0 &&
        item.nameFI.toLowerCase().startsWith(inputValue.toLowerCase()),
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
        selectItem,
      } = useCombobox({
        inputValue,
        items: getFilteredItems(items),
        onStateChange: ({inputValue, type, selectedItem}) => {console.log(inputValue, type, selectItem)},
      })

      return (
        <div>
          <label {...getLabelProps()}>Choose some elements:</label>
          <div>
            {selectedItems.map((selectedItem, index) => (
              <span
                key={`selected-item-${index}`}
                {...getSelectedItemProps({selectedItem, index})}
              >
                {selectedItem}
                <span
                  onClick={() => removeSelectedItem(selectedItem)}
                >
                  &#10005;
                </span>
              </span>
            ))}
            <div {...getComboboxProps()}>
              <input
                {...getInputProps(getDropdownProps({preventKeyAction: isOpen}))}
              />
              <button {...getToggleButtonProps()} aria-label={'toggle menu'}>
                &#8595;
              </button>
            </div>
          </div>
          <ul {...getMenuProps()}>
            {isOpen &&
              getFilteredItems(items).map((item, index) => (
                <li
                  style={
                    highlightedIndex === index ? {backgroundColor: '#bde4ff'} : {}
                  }
                  key={`${item}${index}`}
                  {...getItemProps({item, index})}
                >
                  {item}
                </li>
              ))}
          </ul>
        </div>
      )
}