import { DropDown, DropDownItem, UserAccount } from '@Common/components'
import { memo } from 'react'
import { redirect } from 'react-router-dom'

type Props = {
  myProfilePath?: string
  otherMenuElements?: DropDownItem[]
}

export const MyProfilMenu = memo(({ myProfilePath = '/app/my-profile', otherMenuElements = [] }: Props) => {
  const items: DropDownItem[] = [
    {
      label: 'My profile',
      onClick: () => redirect(myProfilePath),
    },
    ...otherMenuElements,
  ]

  return <DropDown button={<UserAccount />} items={items} stayOpenOnClick={false} />
})
