import React, { FC, useState, useEffect, useRef } from 'react'
import Downshift, { ControllerStateAndHelpers, StateChangeOptions, DownshiftState } from 'downshift'
import { any, string } from 'prop-types'

interface MultiDownshiftPropTypes {
    children: any;
    onSelect?(item: string[], cb: any): any;
    onChange?(item: string[], cb: any): void;
    itemToString?(item: any): string;
}
type selectItemType = { selectedItems: string[] }

export const MultiDownshift: FC<MultiDownshiftPropTypes> =
    ({ children, ...props }: MultiDownshiftPropTypes) => {
        const [state, changeState] = useState<selectItemType>({ selectedItems: [] })
        const downshiftRef = useRef<any>()
        useEffect(() => {
            if (props.onSelect) {
                props.onSelect(
                    state.selectedItems,
                    getStateAndHelpers(downshiftRef.current),
                )
            }
            if (props.onChange) {
                props.onChange(
                    state.selectedItems,
                    getStateAndHelpers(downshiftRef.current),
                )
            }
        }, [state])
        const changeDownshiftReference = (downshift: ControllerStateAndHelpers<any>) => {
            downshiftRef.current = downshift
        }
        const stateReducer = (_: DownshiftState<any>, changes: StateChangeOptions<any>) => {
            switch (changes.type) {
                case Downshift.stateChangeTypes.clickItem:
                    return {
                        ...changes, isOpen: true,
                    }
                default:
                    return changes
            }
        }

        const handleSelection = (selectedItem: string, downshift: ControllerStateAndHelpers<any>) => {
            if (state.selectedItems.includes(selectedItem)) {
                removeItem(selectedItem)
            } else {
                addSelectedItem(selectedItem)
            }
        }

        const removeItem = (item: string) => {
            changeState(({ selectedItems }: selectItemType) => {
                return {
                    selectedItems: selectedItems.filter(i => i !== item),
                }
            })
        }
        const addSelectedItem = (item: string) => {
            changeState(
                ({ selectedItems }: selectItemType) => ({
                    selectedItems: [...selectedItems, item],
                })
            )
        }

        const getRemoveButtonProps = ({ onClick, item, ...props }: { onClick(e: React.SyntheticEvent): void, item: string }) => {
            return {
                onClick: (e: React.SyntheticEvent) => {
                    // TODO: use something like downshift's composeEventHandlers utility instead
                    onClick && onClick(e)
                    e.stopPropagation()
                    removeItem(item)
                },
                ...props,
            }
        }

        const getStateAndHelpers = (downshift: ControllerStateAndHelpers<any>) => {
            const { selectedItems } = state
            return {
                getRemoveButtonProps,
                selectedItems,
                ...downshift,
            }
        }
        // TODO: compose together props (rather than overwriting them) like downshift does
        return (
            <Downshift
                {...props}
                stateReducer={stateReducer}
                onChange={handleSelection}
                selectedItem={null}
            >
                {downshift => {
                    changeDownshiftReference(downshift)
                    return children(getStateAndHelpers(downshift))
                }}
            </Downshift>
        )
    }

export default MultiDownshift
