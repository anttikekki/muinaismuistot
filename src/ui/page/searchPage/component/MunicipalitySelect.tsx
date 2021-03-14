import React, { useCallback, useEffect, useRef, useState } from "react"
import { useCombobox, useMultipleSelection } from "downshift"
import municipalities from "../../../../common/municipality.json"
import { useTranslation } from "react-i18next"
import { Language } from "../../../../common/types"

interface Municipality {
  nameFI: string
  nameSE: string
  regionNameFI: string
  regionNameSE: string
}

const itemToString = (item: Municipality | null, lang: string): string =>
  (item && (lang === Language.SV ? item.nameSE : item.nameFI)) || ""

export const MunicipalitySelect: React.FC = () => {
  const { t, i18n } = useTranslation()
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
        itemToString(item, i18n.language)
          .toLowerCase()
          .startsWith(inputValue.toLowerCase())
    )
  const {
    isOpen,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    getItemProps
  } = useCombobox({
    inputValue,
    selectedItem: null,
    itemToString: (item) => itemToString(item, i18n.language), // For accessibility features
    items: getFilteredItems(items),
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
                <a href="#">{itemToString(item, i18n.language)}</a>
              </li>
            ))}
        </ul>
      </div>

      <div>
        {selectedItems.map((selectedItem, index) => (
          <span
            className="label label-primary"
            key={`selected-item-${index}`}
            {...getSelectedItemProps({ selectedItem, index })}
          >
            {itemToString(selectedItem, i18n.language)}
            <span onClick={() => removeSelectedItem(selectedItem)}>
              &#10005;
            </span>
          </span>
        ))}
      </div>
    </div>
  )
}
