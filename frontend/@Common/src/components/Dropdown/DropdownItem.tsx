import { TextWithIcon } from '@Components/Text/TextWithIcon'
import { DropDownItem } from './types'

type Props = {
  item: DropDownItem
}

export const DropdownItemContent = ({ item }: Props) => {
  if (item.customRender) {
    return item.customRender
  }

  return (
    <TextWithIcon icon={item.icon}>
      <div className="py-1">
        <p className="text-left">{item.label}</p>
        {item.desc && <p className="text-xs text-gray-400">{item.desc}</p>}
      </div>
    </TextWithIcon>
  )
}
