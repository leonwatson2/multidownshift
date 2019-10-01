import React, { FC } from 'react';
import logo from './logo.svg';
import './App.css';
import MultiDownshift from './Multidown'
import starWarsNames from './starwars-names'


type AppPropType = {

}
const items = starWarsNames().all.map((s: any) => ({ name: s.name, id: s.name.toLowerCase() }))

const buttonStyles = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  backgroundColor: 'transparent',
  border: '1px solid #ccc',
  cursor: 'pointer',
}
const App: FC<AppPropType> = () => {
  const itemToString = (item: { name: string }) => (item ? item.name : '')
  const handleChange = (selectedItems: string[]) => {
    console.log({ selectedItems })
  }
  console.log(items)
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        textAlign: 'center',
      }}
    >
      <MultiDownshift
        onChange={handleChange}
        itemToString={itemToString}
      >
        {({
          getToggleButtonProps,
          getRemoveButtonProps,
          isOpen,
          selectedItems,
          getItemProps,
          highlightedIndex,
        }: any) => (
            <div style={{ width: 500, margin: 'auto' }}>
              <button style={buttonStyles} {...getToggleButtonProps()} >
                <div style={{ display: 'flex', marginRight: 8 }}>
                  {selectedItems.length > 0
                    ? selectedItems.map((item: { name: string, id: string }) => (
                      <div
                        style={{ marginRight: 4, backgroundColor: "#ccc" }}
                        key={item.id}
                      >
                        {item.name}{' '}
                        <span {...getRemoveButtonProps({ item })}>x</span>
                      </div>
                    ))
                    : 'Select a value'}
                </div>
                <ArrowIcon isOpen={isOpen} />
              </button>
              {!isOpen ? null : (
                <div>
                  {items.map((item: { name: string, id: number }, index: number) => (
                    <div
                      key={item.id}
                      {...getItemProps({
                        item,
                        index,
                        isActive: highlightedIndex === index,
                        isSelected: selectedItems.includes(item),
                      })}
                    >
                      {item.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
      </MultiDownshift>
    </div>
  )
}
function ArrowIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <svg
      viewBox="0 0 20 20"
      preserveAspectRatio="none"
      width={16}
      fill="transparent"
      stroke="#979797"
      strokeWidth="1.1px"
      transform={isOpen ? 'rotate(180)' : undefined}
    >
      <path d="M1,6 L10,15 L19,6" />
    </svg>
  )
}

export default App;
